
import { WordData, DeepAnalysis } from '../types';

// Utility to normalize strings for fuzzy matching (ignores punctuation/case)
export const normalizeLine = (str: string) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
};

// PUBLIC PARSER: Hydrate lyrics
export function parseLyricJson(rawData: any): { stanzas: string[][], wordMap: WordData[] } {
    const stanzas: string[][] = [];
    const wordMap: WordData[] = [];

    if (rawData && rawData.sections) {
        rawData.sections.forEach((section: any) => {
            const currentStanza: string[] = [];
            if (section.lines) {
                section.lines.forEach((line: any) => {
                    // Safe access to line.text
                    const lineText = (typeof line.text === 'string') ? line.text : String(line.text || "");
                    currentStanza.push(lineText);
                    
                    if (line.words) {
                        line.words.forEach((w: any) => {
                            wordMap.push({
                                lyric: w.text || "",
                                timeMs: (w.start || 0) * 1000 
                            });
                        });
                    } else {
                        // Fallback if no word timing
                        const words = lineText.split(' ');
                        words.forEach((w: string, i: number) => {
                             wordMap.push({ lyric: w, timeMs: i * 500 });
                        });
                    }
                });
            }
            if (currentStanza.length > 0) {
                stanzas.push(currentStanza);
            }
        });
    }
    return { stanzas, wordMap };
}

// PUBLIC PARSER: Hydrate Analysis (Deep & Legacy Support)
export function parseExplanationJson(rawData: any): DeepAnalysis {
    if (!rawData) {
        return { isDeep: false, nodes: [] };
    }

    // 1. CHECK FOR NEW "DEEP" FORMAT
    if (rawData.lyrical_breakdown) {
        return {
            isDeep: true,
            meta: rawData.song_metadata,
            gan: {
                generator: rawData.gan_analysis_synthesis?.generator_perspective || "",
                discriminator: rawData.gan_analysis_synthesis?.discriminator_perspective || "",
                truth: rawData.gan_analysis_synthesis?.latent_truth || ""
            },
            nodes: rawData.lyrical_breakdown.map((item: any) => {
                const deepContext = item.semantic_layers?.deep_context || {};
                const deepItems = Object.entries(deepContext).map(([k, v]) => {
                    // Ensure text is a string
                    const val = (typeof v === 'string') ? v : JSON.stringify(v);
                    return {
                        category: k.replace(/_/g, ' ').toUpperCase(),
                        text: val
                    };
                });

                return {
                    lyric: item.lines,
                    surface: item.semantic_layers?.surface_meaning || "",
                    deep: deepItems,
                    rhymes: item.rhyme_data
                };
            })
        };
    }

    // 2. FALLBACK TO LEGACY FORMAT (Convert to Deep Structure)
    // Legacy format: { "Line": [{ category: "", text: "", icon: "" }] }
    const nodes = Object.keys(rawData).map(key => {
        const entries = rawData[key];
        const surface = entries.find((e: any) => e.category === 'Surface' || e.category === 'Meaning')?.text || "";
        const deep = entries.filter((e: any) => e.category !== 'Surface' && e.category !== 'Meaning').map((e: any) => ({
            category: e.category.toUpperCase(),
            text: e.text
        }));

        return {
            lyric: key,
            surface,
            deep
        };
    });

    return {
        isDeep: false, // Flag as legacy so UI can adapt if needed
        nodes
    };
}
