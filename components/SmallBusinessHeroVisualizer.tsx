
import React, { useEffect, useRef } from 'react';

export const SmallBusinessHeroVisualizer: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Use WebGL 2 for tanh support and better performance
        const gl = canvas.getContext('webgl2');
        if (!gl) {
            console.error("WebGL2 not supported");
            return;
        }

        const vsSource = `#version 300 es
            in vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        // Transpiled "Code Golf" Shader
        const fsSource = `#version 300 es
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.3; // Tuned speed
                
                vec3 x = vec3(9.0, 0.0, 0.0); // x.x+=9.
                vec3 c = vec3(0.0);
                vec3 p = vec3(0.0);
                vec4 o = vec4(0.0);
                float z = 0.0;
                
                // UV Setup with Pan & Zoom
                // Normalize coordinates (-1 to 1 based on height)
                vec2 uv = (gl_FragCoord.xy * 2.0 - r.xy) / r.y;
                
                // ADJUSTMENT: Right Justify (Shift camera left by subtracting X)
                uv.x -= 0.9; 
                
                // ADJUSTMENT: Zoom In (Scale UVs down)
                uv *= 0.65;

                // Ray Direction
                vec3 rd = normalize(vec3(uv, -1.0));
                
                // Raymarching Loop (i++ < 5e1)
                for(float i=0.0; i<50.0; i+=1.0) {
                    
                    p = z * rd;
                    c = p;
                    
                    float f = 0.3;
                    p.y *= f;
                    
                    // Fractal Distortion Loop (f++ < 5.)
                    for(int j=0; j<5; j++) {
                        f += 1.0;
                        p += cos(p.yzx * f + i + z + x * t) / f;
                    }
                    
                    // Accumulation & Update
                    p = mix(c, p, 0.3);
                    
                    // Distance Estimate
                    // .2*(abs(p.z+p.x+16.+tanh(p.y)/.1)+sin(p.x-p.z+t+t)+1.)
                    float d = 0.2 * (abs(p.z + p.x + 16.0 + tanh(p.y)/0.1) + sin(p.x - p.z + t*2.0) + 1.0);
                    
                    f = d; 
                    z += f;
                    
                    // Color Accumulation
                    // o+=(cos(p.x*.2+f+vec4(6,1,2,0))+2.)/f/z
                    o += (cos(p.x * 0.2 + f + vec4(6,1,2,0)) + 2.0) / f / z;
                }
                
                // Tone Mapping
                o = tanh(o / 30.0);
                
                // Output
                fragColor = vec4(o.rgb, 1.0);
            }
        `;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.warn(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, "time");
        const resLoc = gl.getUniformLocation(program, "resolution");

        let startTime = Date.now();
        let frameId: number;

        const render = () => {
            if (!canvas || !container) return;
            
            const dpr = window.devicePixelRatio || 1;
            const w = container.clientWidth;
            const h = container.clientHeight;
            
            if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            frameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(frameId);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[#020202]">
            <canvas ref={canvasRef} className="block w-full h-full opacity-60 mix-blend-screen" />
        </div>
    );
};
