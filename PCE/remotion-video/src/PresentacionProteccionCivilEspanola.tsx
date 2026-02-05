import { AbsoluteFill, Sequence } from 'remotion';
import { LogoIntro } from './components/PCE/LogoIntroProteccionCivil';
import { PuntosPrograma } from './components/PCE/PuntosProgramaProteccionCivil';
import { Outro } from './components/PCE/OutroProteccionCivil';
import { WebSimulation } from './components/PCE/WebSimulation';

export const PresentacionProteccionCivilEspanola = () => {
    return (
        <AbsoluteFill className="bg-white">
            <Sequence from={0} durationInFrames={90}>
                <LogoIntro />
            </Sequence>
            <Sequence from={90} durationInFrames={100}>
                <WebSimulation />
            </Sequence>
            <Sequence from={180} durationInFrames={420}> {/** Starts right after WebSimulation ends (90+90=180 approx) **/}
                <PuntosPrograma />
            </Sequence>
            <Sequence from={600} durationInFrames={150}>
                <Outro />
            </Sequence>
        </AbsoluteFill>
    );
};
