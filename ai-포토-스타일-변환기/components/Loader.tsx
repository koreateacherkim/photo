
import React from 'react';
import { StyleOption } from '../types';

interface LoaderProps {
    style: StyleOption | null;
}

export const Loader: React.FC<LoaderProps> = ({ style }) => {
    const messages = [
        "AI가 창의력을 발휘하고 있어요...",
        "멋진 스타일을 적용하는 중입니다...",
        "픽셀을 완벽하게 다듬고 있어요...",
        "거의 다 됐습니다, 잠시만 기다려주세요!",
    ];

    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const gradientClass = style ? style.className : 'from-sky-500 to-indigo-500';

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-lg">
            <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin border-slate-400`}></div>
            {style && (
                <div className="mt-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
                    <span className={`bg-clip-text bg-gradient-to-br ${gradientClass}`}>{style.name}</span>
                    <span> 스타일로 변환 중...</span>
                </div>
            )}
            <p className="mt-4 text-slate-300 text-center">{message}</p>
        </div>
    );
};
