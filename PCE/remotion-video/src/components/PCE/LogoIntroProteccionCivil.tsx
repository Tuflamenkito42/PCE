import { AbsoluteFill, useCurrentFrame, interpolate, Img, staticFile, useVideoConfig, spring } from 'remotion';
import data from '../../data/pce-data.json';

export const LogoIntro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(frame, [0, 30], [0, 1]);
    const scale = interpolate(frame, [0, 90], [0.8, 1]);

    // Logo ring animation
    const ringScale = spring({
        frame: frame - 15,
        fps,
        from: 0,
        to: 1,
        config: { damping: 10 }
    });

    const rotate = interpolate(frame, [0, 300], [0, 30]);

    return (
        <AbsoluteFill className="bg-pce-primary flex items-center justify-center overflow-hidden">
            {/* Background Pattern - Animated */}
            <div className="absolute inset-0 opacity-[0.05]">
                <div style={{ transform: `rotate(${rotate}deg) scale(1.5)` }} className="flex flex-wrap justify-center content-center gap-12 w-[150%] h-[150%] origin-center">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <div key={i} className="w-32 h-32 flex items-center justify-center">
                            <Img src={staticFile("logo.png")} className="w-full h-auto grayscale brightness-200" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#723233] via-transparent to-[#4A2222] opacity-90"></div>

            <div style={{ opacity, transform: `scale(${scale})` }} className="flex flex-col items-center relative z-10">
                {/* Logo Container with animations */}
                <div className="relative mb-8">
                    {/* Expanding Ring */}
                    <div
                        style={{ transform: `scale(${ringScale})` }}
                        className="absolute inset-0 rounded-full border-4 border-pce-gold opacity-50 blur-sm"
                    ></div>

                    <div className="bg-[#B9AFB0] rounded-full p-8 shadow-[0_0_60px_rgba(114,50,51,0.6)] flex items-center justify-center w-80 h-80 relative z-10 border-4 border-[#d4b06a]/50">
                        {/* Shine Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent opacity-50"></div>

                        <Img
                            src={staticFile(data.logoPath)}
                            className="w-56 h-auto drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Text Appearing */}
                <div style={{ opacity: interpolate(frame, [20, 50], [0, 1]) }}>
                    <h1 className="text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E0E0E0] tracking-widest text-center drop-shadow-lg mb-2">
                        {data.partyName.toUpperCase()}
                    </h1>
                    <p className="text-pce-gold font-cinzel text-xl tracking-[0.3em] text-center opacity-80">
                        {data.slogan}
                    </p>
                </div>
            </div>
        </AbsoluteFill>
    );
};
