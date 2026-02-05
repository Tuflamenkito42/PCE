import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence, Img, staticFile } from 'remotion';
import './style.css';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const opacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    return <div style={{ opacity }}>{children}</div>;
};

export const Scene1 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = interpolate(frame, [0, 150], [1, 1.1]);
    const opacity = interpolate(frame, [0, 30], [0, 1]);

    return (
        <AbsoluteFill className="bg-gradient-to-br from-burgundy to-burgundy-light flex items-center justify-center text-white">
            <div style={{ transform: `scale(${scale})`, opacity }} className="text-center flex flex-col items-center">
                <Img src={staticFile("logo.png")} className="w-48 h-auto mb-6 drop-shadow-2xl" />
                <h1 className="text-6xl font-cinzel font-bold mb-4 text-white drop-shadow-lg">AFILIACIÓN PCE</h1>
                <div className="h-1 w-32 bg-gold mx-auto mb-6"></div>
                <p className="text-2xl font-light tracking-widest uppercase">Tu compromiso, modernizado</p>
            </div>
        </AbsoluteFill>
    );
};

export const Scene2 = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Scanning animation
    const scanPos = interpolate(frame % 90, [0, 45, 90], [0, 100, 0]);

    return (
        <AbsoluteFill className="bg-gray-900 flex items-center justify-center text-white">
            <div className="relative w-96 h-64 bg-gray-800 rounded-xl border border-gray-600 p-6 shadow-2xl overflow-hidden">
                {/* Mock ID Card Content */}
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-600 rounded w-full mt-4"></div>
                    </div>
                </div>

                {/* Scanner Line */}
                <div
                    style={{ top: `${scanPos}%` }}
                    className="absolute left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                ></div>

                <div className="absolute bottom-4 right-4 text-green-400 font-mono text-xs flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    VERIFICADO
                </div>
            </div>

            <div className="absolute bottom-10 w-full text-center">
                <h2 className="text-3xl font-bold mb-2">Verificación Biométrica & OCR</h2>
                <p className="text-gray-400">Seguridad de última generación</p>
            </div>
        </AbsoluteFill>
    );
};

export const Scene3 = () => {
    const frame = useCurrentFrame();

    // Cursor animation
    const cursorX = interpolate(frame, [20, 50], [100, 300], { extrapolateRight: 'clamp' });
    const cursorY = interpolate(frame, [20, 50], [100, 150], { extrapolateRight: 'clamp' });
    const click = frame > 50 ? 0.9 : 1;

    return (
        <AbsoluteFill className="bg-white flex flex-col items-center justify-center text-gray-800">
            <h2 className="text-4xl font-cinzel text-burgundy mb-12">Elige tu Cuota</h2>

            <div className="flex gap-6 z-10">
                {[5, 10, 20].map((amount, i) => (
                    <div key={amount} className={`p-8 border-2 rounded-xl text-center transform transition-all ${i === 1 && frame > 50 ? 'border-burgundy bg-burgundy/5 scale-105 shadow-xl' : 'border-gray-200'}`}>
                        <div className="text-3xl font-bold mb-2">{amount}€</div>
                        <div className="text-sm text-gray-500">Mensual</div>
                        {i === 1 && frame > 60 && (
                            <div className="mt-2 text-burgundy font-bold flex items-center justify-center gap-1">
                                🔒 Seguro
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Cursor Mock */}
            <div style={{ transform: `translate(${cursorX}px, ${cursorY}px) scale(${click})` }} className="absolute top-0 left-0 pointer-events-none">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 3.5V19.5L9.5 15.5H16.5L5.5 3.5Z" fill="black" stroke="white" strokeWidth="2" />
                </svg>
            </div>

            <div className="absolute bottom-12 text-2xl font-bold text-gray-600">
                Pagos Seguros vía Stripe
            </div>
        </AbsoluteFill>
    );
};

export const Scene4 = () => {
    const frame = useCurrentFrame();

    const scale = spring({
        frame,
        fps: 30,
        config: { damping: 10 }
    });

    return (
        <AbsoluteFill className="bg-burgundy text-white flex flex-col items-center justify-center">
            <div style={{ transform: `scale(${scale})` }} className="bg-white rounded-full p-8 mb-8">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#5E2C2C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <FadeIn delay={10}>
                <h2 className="text-5xl font-cinzel font-bold mb-4">Únete en segundos</h2>
                <div className="text-2xl text-gold text-center">
                    <p>pce.es/afiliacion</p>
                </div>
            </FadeIn>
        </AbsoluteFill>
    );
};
