import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import data from '../../data/pce-data.json';

const PromiseCard = ({ title, desc, index }: { title: string, desc: string, index: number }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const delay = index * 5; // Faster stagger for grid

    // Animate entry (scale up + fade in)
    const scale = spring({
        frame: frame - delay,
        fps,
        from: 0.8,
        to: 1,
        config: { damping: 15 }
    });

    const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <div
            style={{
                transform: `scale(${scale})`,
                opacity
            }}
            className="bg-gradient-to-br from-[#5E2C2C] to-[#4A2222] p-8 rounded shadow-xl border border-[#B9AFB0]/20 relative overflow-hidden flex flex-col items-center text-center h-56 justify-center group hover:scale-[1.02] transition-transform duration-300"
        >
            {/* Background watermark */}
            <div className="absolute -bottom-6 -right-4 text-8xl font-black text-black/20 font-cinzel transform -rotate-12 select-none">
                PCE
            </div>

            <h3 className="text-[#B9AFB0] font-cinzel font-bold text-xl mb-3 pb-3 border-b border-[#B9AFB0]/30 w-full uppercase tracking-wider relative z-10">
                {title}
            </h3>

            <p className="text-white text-sm leading-relaxed font-sans relative z-10 font-normal">
                {desc}
            </p>
        </div>
    );
};

export const PuntosPrograma = () => {
    const frame = useCurrentFrame();

    // Subtle background movement
    const bgY = interpolate(frame, [0, 400], [0, -50]);

    // Header Links matching WebSimulation
    const navLinks = ["INICIO", "ACTUALIDAD", "ÚNETE", "PROGRAMA", "VOTACIONES", "CONTACTO", "TRANSPARENCIA"];

    return (
        <AbsoluteFill className="bg-pce-primary">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                <div className="flex flex-wrap justify-center content-center gap-12 transform -rotate-12 scale-150 -translate-x-20 -translate-y-20 w-[150%] h-[150%]">
                    {Array.from({ length: 80 }).map((_, i) => (
                        <div key={i} className="w-32 h-32 flex items-center justify-center">
                            <Img src={staticFile("logo.png")} className="w-full h-auto grayscale brightness-200" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Real Site Header - Fixed at top */}
            <div className="bg-[#B9AFB0] py-4 px-12 flex items-center justify-between border-b border-[#d4b06a]/30 relative z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <Img src={staticFile("logo.png")} className="w-12 h-auto" />
                    <div className="flex flex-col">
                        <span className="text-pce-primary font-cinzel font-bold text-lg leading-none">PROTECCIÓN CIVIL</span>
                        <span className="text-pce-primary font-cinzel font-bold text-lg leading-none">ESPAÑOLA</span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex gap-4">
                        {navLinks.map(link => (
                            <span key={link} className={`text-[10px] font-bold cursor-pointer tracking-wider ${link === 'PROGRAMA' ? 'text-pce-primary border-b-2 border-pce-primary' : 'text-gray-700 hover:text-pce-primary'}`}>
                                {link}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-pce-primary text-white text-[10px] px-3 py-1.5 font-bold rounded-sm">DONA</div>
                        <div className="bg-black text-white text-[10px] px-3 py-1.5 font-bold rounded-sm border border-white/20">AFÍLIATE</div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 w-full flex-1 flex flex-col items-center pt-8 px-10">
                {/* Page Title */}
                <div className="text-center mb-8">
                    <h2 className="text-5xl font-bold text-white font-cinzel tracking-widest uppercase drop-shadow-sm">
                        Programa Electoral
                    </h2>
                    <div className="h-1 w-24 bg-pce-gold mx-auto mt-2"></div>
                </div>

                {/* Grid - Made Cards Bigger */}
                <div className="grid grid-cols-3 gap-6 w-full max-w-[1600px]">
                    {data.programPoints.map((point, index) => {
                        const [title, desc] = point.split(': ');
                        return (
                            <PromiseCard key={index} title={title} desc={desc} index={index} />
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};
