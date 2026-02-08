import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        grecaptcha: any;
    }
}

interface RecaptchaProps {
    onChange: (token: string | null) => void;
    theme?: 'light' | 'dark';
}

export const Recaptcha: React.FC<RecaptchaProps> = ({ onChange, theme = 'dark' }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    useEffect(() => {
        const loadCaptcha = () => {
            if (window.grecaptcha && window.grecaptcha.render && divRef.current) {
                // If content exists, it might have been rendered already or by strict mode double-mount
                if (divRef.current.innerHTML !== '') return;

                try {
                    // GOOGLE TEST KEY - Replace with your production Site Key
                    const siteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; 

                    widgetIdRef.current = window.grecaptcha.render(divRef.current, {
                        'sitekey': siteKey,
                        'theme': theme,
                        'callback': (response: string) => onChange(response),
                        'expired-callback': () => onChange(null)
                    });
                } catch (e) {
                    console.error("Recaptcha render error:", e);
                }
            } else {
                // Retry if script hasn't loaded yet
                setTimeout(loadCaptcha, 100);
            }
        };

        loadCaptcha();
    }, [theme, onChange]);

    return <div ref={divRef} className="my-4 flex justify-start min-h-[78px]" />;
};