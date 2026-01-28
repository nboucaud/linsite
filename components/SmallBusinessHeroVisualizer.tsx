
import React, { useEffect, useRef } from 'react';

const SmallBusinessHeroVisualizerComponent: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const gl = canvas.getContext('webgl2', { alpha: false });
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

        const fsSource = `#version 300 es
            precision highp float;
            uniform vec2 resolution;
            uniform float time;
            out vec4 fragColor;

            void main() {
                vec2 r = resolution;
                float t = time * 0.3; 
                
                vec3 x = vec3(9.0, 0.0, 0.0);
                vec3 c = vec3(0.0);
                vec3 p = vec3(0.0);
                vec4 o = vec4(0.0);
                float z = 0.0;
                
                // UV Setup with Pan & Zoom
                vec2 uv = (gl_FragCoord.xy * 2.0 - r.xy) / r.y;
                uv.x -= 0.9; 
                uv *= 0.65;

                vec3 rd = normalize(vec3(uv, -1.0));
                
                // Reduced Raymarching Loop for performance (50 -> 30)
                for(float i=0.0; i<30.0; i+=1.0) {
                    
                    p = z * rd;
                    c = p;
                    
                    float f = 0.3;
                    p.y *= f;
                    
                    // Reduced Fractal Loop (5 -> 4)
                    for(int j=0; j<4; j++) {
                        f += 1.0;
                        p += cos(p.yzx * f + i + z + x * t) / f;
                    }
                    
                    p = mix(c, p, 0.3);
                    float d = 0.2 * (abs(p.z + p.x + 16.0 + tanh(p.y)/0.1) + sin(p.x - p.z + t*2.0) + 1.0);
                    f = d; 
                    z += f;
                    o += (cos(p.x * 0.2 + f + vec4(6,1,2,0)) + 2.0) / f / z;
                }
                
                o = tanh(o / 30.0);
                fragColor = vec4(o.rgb, 1.0);
            }
        `;

        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
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
        let lastTime = 0;
        const TARGET_FPS = 60;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;

        const render = (timestamp: number) => {
            frameId = requestAnimationFrame(render);

            const deltaTime = timestamp - lastTime;
            if (deltaTime < FRAME_INTERVAL) return;
            lastTime = timestamp - (deltaTime % FRAME_INTERVAL);

            if (!canvas || !container) return;
            
            // OPTIMIZATION: Force 1:1 pixel ratio regardless of device density
            const dpr = 1; 
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
        };

        frameId = requestAnimationFrame(render);

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

export const SmallBusinessHeroVisualizer = React.memo(SmallBusinessHeroVisualizerComponent);
