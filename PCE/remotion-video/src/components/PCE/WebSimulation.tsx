import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from 'remotion';
import data from '../../data/pce-data.json';

export const WebSimulation = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Cursor animation
    // Move to "VER PROGRAMA COMPLETO" button on the left side - Centered
    const cursorX = interpolate(frame, [20, 50], [1200, 310], { extrapolateRight: 'clamp' });
    const cursorY = interpolate(frame, [20, 50], [800, 710], { extrapolateRight: 'clamp' });

    // Click happens at frame 60
    const click = frame > 60 && frame < 70 ? 0.9 : 1;
    const isClicked = frame > 60;

    // Zoom in effect on click to transition to next scene
    // Delayed to frame 75 so the click is clearly visible first
    const scale = interpolate(frame, [75, 100], [1, 3], { extrapolateLeft: 'clamp' });
    const opacity = interpolate(frame, [85, 100], [1, 0], { extrapolateLeft: 'clamp' });

    // Header Links
    const navLinks = ["INICIO", "ACTUALIDAD", "ÚNETE", "PROGRAMA", "VOTACIONES", "CONTACTO", "TRANSPARENCIA"];

    return (
        <AbsoluteFill className="bg-[#e0e0e0] flex items-center justify-center">
            <div
                style={{ transform: `scale(${scale})`, opacity }}
                className="w-[90%] h-[90%] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col relative"
            >
                {/* Browser Address Bar */}
                <div className="h-8 bg-[#f0f0f0] border-b border-gray-300 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="flex-1 ml-4 bg-white h-6 rounded text-[10px] flex items-center px-2 text-gray-500 font-sans">
                        pce.es
                    </div>
                </div>

                {/* Real Site Header */}
                <div className="bg-[#EBE3E3] py-4 px-12 flex items-center justify-between border-b border-[#d4b06a]/30">
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
                                <span key={link} className="text-[10px] font-bold text-gray-700 hover:text-pce-primary cursor-pointer tracking-wider">
                                    {link}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-pce-primary text-white text-[10px] px-3 py-1.5 font-bold rounded-sm">DONA</div>
                            <div className="bg-black text-white text-[10px] px-3 py-1.5 font-bold rounded-sm">AFÍLIATE</div>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="relative flex-1 bg-pce-primary overflow-hidden flex items-center">
                    {/* Background Pattern/Overlay */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}></div>

                    <div className="relative z-10 px-24 w-full flex items-center justify-between">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl text-white font-cinzel font-bold mb-4 leading-tight">
                                PROTEGIENDO <br /> LO QUE IMPORTA
                            </h1>
                            <p className="text-white/80 text-lg font-light mb-8 max-w-lg">
                                Un proyecto comprometido con la seguridad, el bienestar y la protección de la ciudadanía.
                            </p>

                            {/* The Button */}
                            <div className={`
                                inline-block px-8 py-3 border-2 border-pce-secondary text-pce-secondary font-bold text-sm tracking-widest uppercase transition-transform
                                ${isClicked ? 'transform scale-95 bg-pce-secondary text-pce-primary' : ''}
                             `}>
                                VER PROGRAMA COMPLETO
                            </div>
                        </div>

                        {/* Right side visual (Logo watermark) */}
                        <div className="opacity-20 transform translate-x-12">
                            <Img src={staticFile("logo.png")} className="w-96 h-auto grayscale invert" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cursor */}
            <div
                style={{
                    transform: `translate(${cursorX}px, ${cursorY}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 100
                }}
            >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
                    <path d="M5.5 3.5V19.5L9.5 15.5H16.5L5.5 3.5Z" fill="black" stroke="white" strokeWidth="2" />
                </svg>
            </div>
        </AbsoluteFill>
    );
};
