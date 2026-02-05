import { Composition } from 'remotion';
import { Scene1, Scene2, Scene3, Scene4 } from './scenes';
import { AbsoluteFill, Sequence } from 'remotion';
import './style.css';

const MainVideo = () => {
    return (
        <AbsoluteFill className="bg-black">
            <Sequence from={0} durationInFrames={150}>
                <Scene1 />
            </Sequence>
            <Sequence from={150} durationInFrames={210}>
                <Scene2 />
            </Sequence>
            <Sequence from={360} durationInFrames={240}>
                <Scene3 />
            </Sequence>
            <Sequence from={600} durationInFrames={300}>
                <Scene4 />
            </Sequence>
        </AbsoluteFill>
    );
};

import { PresentacionProteccionCivilEspanola } from './PresentacionProteccionCivilEspanola';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="PresentacionProteccionCivilEspanola"
                component={PresentacionProteccionCivilEspanola}
                durationInFrames={750}
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="PromoVideo"
                component={MainVideo}
                durationInFrames={900}
                fps={30}
                width={1920}
                height={1080}
            />
        </>
    );
};
