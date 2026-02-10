
import React, { useState } from 'react';

interface RecaptchaProps {
    onChange: (token: string | null) => void;
    theme?: 'light' | 'dark';
}

export const Recaptcha: React.FC<RecaptchaProps> = ({ onChange, theme = 'dark' }) => {
    const [state, setState] = useState<'idle' | 'working' | 'solved'>('idle');

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (state !== 'idle') return;
        
        setState('working');
        
        // Simulate network verification delay (1.5s - 2.5s)
        const delay = 1500 + Math.random() * 1000;
        
        setTimeout(() => {
            setState('solved');
            onChange("mock_token_verified_" + Date.now());
        }, delay);
    };

    const isDark = theme === 'dark';

    return (
        <div 
            className={`
                relative w-[304px] h-[78px] rounded-[3px] border shadow-[0_0_4px_1px_rgba(0,0,0,0.08)] 
                flex items-center justify-between px-3 select-none transition-colors my-4
                ${isDark ? 'bg-[#222] border-[#525252]' : 'bg-[#f9f9f9] border-[#d3d3d3]'}
            `}
        >
            {/* Checkbox Area */}
            <div className="flex items-center h-full">
                <div 
                    onClick={handleClick}
                    className={`
                        w-[28px] h-[28px] border-[2px] rounded-[2px] mr-3 bg-white relative flex items-center justify-center cursor-pointer transition-all
                        ${isDark ? 'border-[#c1c1c1] hover:border-[#fff]' : 'border-[#c1c1c1] hover:border-[#b2b2b2]'}
                    `}
                >
                    {/* Loading Spinner */}
                    {state === 'working' && (
                        <div 
                            className="absolute inset-0 m-auto w-[20px] h-[20px] rounded-full border-[2px] border-t-[#4285f4] border-r-[#4285f4] border-b-[#e5e5e5] border-l-[#e5e5e5] animate-spin" 
                        />
                    )}

                    {/* Verified Checkmark */}
                    {state === 'solved' && (
                        <svg 
                            className="w-[36px] h-[36px] text-[#0f9d58] absolute -top-[6px] -left-[6px] animate-in zoom-in duration-200" 
                            viewBox="0 0 46 46"
                        >
                            <path 
                                fill="currentColor" 
                                d="M20.924 34.336L9.588 23l-3.21 3.21 14.546 14.546L43.924 17.754 40.714 14.544z" 
                            />
                        </svg>
                    )}
                </div>
                
                <span className={`text-[14px] font-medium font-sans ${isDark ? 'text-[#fff]' : 'text-[#000]'}`}>
                    I'm not a robot
                </span>
            </div>

            {/* Logo Area */}
            <div className="flex flex-col items-center justify-center h-full py-2 pl-2">
                <img 
                    src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                    alt="reCAPTCHA logo" 
                    className="w-[32px] h-[32px] opacity-100 mb-1" 
                />
                <div className={`text-[10px] leading-tight text-center ${isDark ? 'text-[#9b9b9b]' : 'text-[#555]'}`}>reCAPTCHA</div>
                <div className={`text-[8px] leading-tight text-center ${isDark ? 'text-[#9b9b9b]' : 'text-[#555]'}`}>
                    <a href="#" className="hover:underline">Privacy</a> - <a href="#" className="hover:underline">Terms</a>
                </div>
            </div>
        </div>
    );
};
