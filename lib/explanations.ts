
import { Lightbulb, MessageCircleMore, Code, BookOpen, Sparkles, Globe, Music, Zap, Terminal, Heart, Anchor, Feather } from 'lucide-react';

export interface Explanation {
  category: string;
  icon: any;
  text: string;
}

// Map string names from JSON to actual React Components
export const ICON_MAP: Record<string, any> = {
    'Lightbulb': Lightbulb,
    'MessageCircleMore': MessageCircleMore,
    'Code': Code,
    'BookOpen': BookOpen,
    'Sparkles': Sparkles,
    'Globe': Globe,
    'Music': Music,
    'Zap': Zap,
    'Terminal': Terminal,
    'Heart': Heart,
    'Anchor': Anchor,
    'Feather': Feather
};

export const getIcon = (name: string) => {
    return ICON_MAP[name] || Lightbulb;
};

// Fallback for "World in a Jar" since no JSON URL was provided
export const WORLD_IN_A_JAR_FALLBACK: Record<string, Explanation[]> = {
    "Close my fist, round the base of the rocket": [{ "category": "Theoretical", icon: Code, "text": "Holding volatile potential in absolute control." }],
    "hands froze, must stay out they pockets": [{ "category": "Theoretical", icon: Code, "text": "Conflict between internal paralysis and external threat." }],
    "Twist wrists demand space, like a sprocket": [{ "category": "Theoretical", icon: Code, "text": "Aggressive carving of intellectual room to create." }],
    "My flows list pace, dem ah add to the docket": [{ "category": "Relational", icon: MessageCircleMore, "text": "Paranoid interpretation of attention as prosecution." }],
    "No space in the world for a star": [{ "category": "Theoretical", icon: Code, "text": "Justification for necessary and superior creative isolation." }],
    "Plans unfurl for your girl in the bar": [{ "category": "Relational", icon: MessageCircleMore, "text": "Suspicious and resentful view of partner out in the world." }],
    "Defaced, depearled, and disgraced by a scar": [{ "category": "Relational", icon: MessageCircleMore, "text": "Judgmental assessment of partner damaged by the world." }],
    "She’ll Hurl at the swirl of your whirl in a jar": [{ "category": "Relational", icon: MessageCircleMore, "text": "Dismissal of partner's inability to withstand his intensity." }],
    "Gon far to impress for the words in ya war": [{ "category": "Theoretical", icon: Code, "text": "Obsessive work to perfect words used as weapons." }],
    "Lawn after lawn look compressed like a rar": [{ "category": "Theoretical", icon: Code, "text": "Suburbs appearing as low-resolution compressed files." }],
    "Sink as you think through distress thick tar": [{ "category": "Relational", icon: MessageCircleMore, "text": "Mutual drowning in a toxic emotional state." }],
    "Ya girl want a mink but the dress too shart": [{ "category": "Relational", icon: MessageCircleMore, "text": "Belittling contempt cutting down perceived perfectionism." }],
    "Squeaks of ya sneaks tryna ball full court": [{ "category": "Theoretical", icon: Code, "text": "Sound of trying to achieve greatness with inadequate tools." }],
    "Speaks of the sneaks tryna stall your fort": [{ "category": "Theoretical", icon: Code, "text": "Reinterpreting sounds as evidence of sabotage." }],
    "Nights for the weak haul the days too short": [{ "category": "Relational", icon: MessageCircleMore, "text": "Insomnia poisoning shared days together." }],
    "Heights of the peak call your plays too sport": [{ "category": "Relational", icon: MessageCircleMore, "text": "Reaching the peak of relationship feels pre-written." }],
    "Where’s my guitar I wrote the verse too short": [{ "category": "Relational", icon: MessageCircleMore, "text": "Acknowledging his influence as a destructive force." }],
    "No stars in the world worth the space,": [{ "category": "Theoretical", icon: Code, "text": "Total rejection of external validation." }],
    "voids in dark pearls, an unearthed grace": [{ "category": "Theoretical", icon: Code, "text": "Finding beauty in flawed/imperfect 'voids'." }],
    "Your girl talk in bars? She’s a mirror, not face": [{ "category": "Relational", icon: MessageCircleMore, "text": "Critique of partner losing authentic self in public." }],
    "Mans the weight of the world, no terror misplaced": [{ "category": "Theoretical", icon: Code, "text": "Shouldering the immense psychological burden of vision." }],
    "Defaced by the chase, curls and dolls go erased": [{ "category": "Theme", icon: Globe, "text": "Pursuit of ambition erasing innocence." }],
    "She’s hurled through the swirl of a dominant gaze": [{ "category": "Relational", icon: MessageCircleMore, "text": "Partner as passive object in his controlling perspective." }],
    "Brawn after fawn, uncliped the grass isn’t grazed": [{ "category": "Relational", icon: MessageCircleMore, "text": "His force dominating her gentler nature." }],
    "Sink as you think, through the tar of disdain": [{ "category": "Relational", icon: MessageCircleMore, "text": "Shared introspection curdled into mutual disdain." }],
    "Your girl wants a mink, so the grind’s gonna stain": [{ "category": "Relational", icon: MessageCircleMore, "text": "Her dreams as a threat to his artistic purity." }],
    "Squeaks of your sneaks, half court full rain": [{ "category": "Relational", icon: MessageCircleMore, "text": "Struggle as a couple pictured as a failing effort." }],
    "Speaks of the weak, the laughs report strain": [{ "category": "Relational", icon: MessageCircleMore, "text": "Clarity identifying weakness behind partner's facade." }],
    "Nights for the sleepless, the days feel deranged": [{ "category": "Imagery", icon: Sparkles, "text": "Shared burnout making life in the jar insane." }],
    "Heights of the peak mist, climb’s preordained": [{ "category": "Theoretical", icon: Code, "text": "Path to success as fatalistic and pre-written." }],
    "Doors still a jar, it’s a curse in the pained": [{ "category": "Wordplay", icon: Lightbulb, "text": "Door as a trap that is painfully permanently half-open." }],
    "Where’s my guitar? My hearse for the gained": [{ "category": "Conclusion", icon: Lightbulb, "text": "Art as the funeral vehicle for all they gained together." }]
};
