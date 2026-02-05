import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import data from '../../data/pce-data.json';

export const Outro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animations
    const opacity = interpolate(frame, [0, 30], [0, 1]);
    const scale = interpolate(frame, [0, 100], [0.95, 1]);

    // Logo entrance
    const logoScale = spring({
        frame: frame - 10,
        fps,
        from: 0.5,
        to: 1,
        config: { damping: 12 }
    });

    return (
        <AbsoluteFill className="bg-pce-primary flex items-center justify-center text-white overflow-hidden">
            {/* Seamless Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05]">
                <div className="flex flex-wrap justify-center content-center gap-12 transform -rotate-12 scale-150 -translate-x-20 -translate-y-20 w-[150%] h-[150%]">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <div key={i} className="w-32 h-32 flex items-center justify-center">
                            <Img src={staticFile("logo.png")} className="w-full h-auto grayscale brightness-200" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#723233] via-transparent to-[#5E2C2C] opacity-90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#723233]/50 to-[#4A2222]/80"></div>

            <div style={{ opacity, transform: `scale(${scale})` }} className="relative z-10 flex flex-col items-center">

                {/* Logo matching Intro Style (Circular Badge) */}
                <div className="bg-pce-secondary rounded-full p-8 mb-10 shadow-[0_0_50px_rgba(185,175,176,0.3)] flex items-center justify-center w-80 h-80 transform hover:scale-105 transition-transform duration-700 border-4 border-[#d4b06a]/30 relative group">
                    {/* Inner shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <Img
                        src={staticFile(data.logoPath)}
                        style={{ transform: `scale(${logoScale})` }}
                        className="w-56 h-auto drop-shadow-xl relative z-10"
                    />
                </div>

                <h2 className="text-6xl font-cinzel font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-[#E0E0E0] drop-shadow-lg tracking-widest text-center">
                    {data.partyName.toUpperCase()}
                </h2>

                <div className="flex items-center justify-center gap-6 mb-12 opacity-80">
                    <div className="h-0.5 w-32 bg-gradient-to-r from-transparent to-pce-gold"></div>
                    <div className="text-pce-gold text-2xl font-cinzel italic tracking-widest">{data.slogan}</div>
                    <div className="h-0.5 w-32 bg-gradient-to-l from-transparent to-pce-gold"></div>
                </div>

                {/* Premium CTA Button - Enhanced */}
                <div className="group cursor-pointer relative transform hover:-translate-y-1 transition-transform duration-300">
                    {/* Glow behind */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-pce-gold via-white to-pce-gold rounded-full blur-md opacity-40 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

                    <div className="relative px-16 py-6 bg-[#B9AFB0] ring-1 ring-[#D4B06A] rounded-full font-cinzel font-black text-2xl tracking-[0.2em] text-pce-primary shadow-2xl flex items-center gap-4 overflow-hidden">
                        {/* Shine animation */}
                        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:animate-[shine_1s_infinite]"></div>

                        <span>{data.cta.toUpperCase()}</span>
                        <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Footer / Socials (Mock) */}
            <div className="absolute bottom-12 flex items-center gap-8 opacity-60">
                {['twitter', 'instagram', 'youtube'].map((social, i) => (
                    <div key={social} className="w-3 h-3 rounded-full bg-pce-gold/50 animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
                ))}
                <span className="text-pce-gold/50 text-xs font-cinzel tracking-widest">PCE OFICIAL 2026</span>
            </div>

        </AbsoluteFill>
    );
};
