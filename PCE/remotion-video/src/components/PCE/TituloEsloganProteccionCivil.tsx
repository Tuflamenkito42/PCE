import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import data from '../../data/pce-data.json';

export const TituloEslogan = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 20], [0, 1]);

    // Animation for title
    const titleY = spring({
        frame: frame - 10,
        fps,
        from: 50,
        to: 0,
        config: { damping: 12 }
    });

    return (
        <AbsoluteFill className="bg-pce-primary flex flex-col items-center justify-center text-white overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#723233] to-[#4a1f1f]"></div>

            <div style={{ opacity, transform: `translateY(${titleY}px)` }} className="flex flex-col items-center z-10 relative px-8 text-center">
                <h1 className="text-7xl font-cinzel font-bold mb-8 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
                    {data.partyName.toUpperCase()}
                </h1>

                <div className="flex items-center gap-6 mb-10 opacity-90">
                    <div className="h-0.5 w-24 bg-gradient-to-r from-transparent to-pce-gold"></div>
                    <div className="w-4 h-4 bg-pce-gold rotate-45 shadow-lg"></div>
                    <div className="h-0.5 w-24 bg-gradient-to-l from-transparent to-pce-gold"></div>
                </div>

                <h2 className="text-4xl font-light font-cinzel tracking-[0.25em] text-pce-gold uppercase drop-shadow-md">
                    {data.slogan}
                </h2>
            </div>
        </AbsoluteFill>
    );
};
