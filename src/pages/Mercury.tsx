import { Box, HStack, Img } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import Background from "../assets/tournament-background.png";
import { Tournament } from "../components/Tournament";
import MercuryBg from "../components/Tournament/assets/mercury-bg.png";
import Logo from "../assets/logo.svg";
import Discord from "../assets/discord.svg";
import Tw from "../assets/tw.svg";
import Telegram from "../components/Tournament/assets/telegram.svg";
import ConnectWalletRound from "../components/Tournament/ConnectWalletRound";
import SubmitRound from "../components/Tournament/SubmitRound";
import ConfirmedRound from "../components/Tournament/ConfirmedRound";
import MissionRound from "../components/Tournament/MissionRound";
import RequestAccessRound from "../components/Tournament/RequestAccessRound";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import BgImgD from "../components/Tournament/BgImgD";

const Mercury = (): ReactElement => {
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const [step, setStep] = useState(0);
    const [planeNumber, setPlaneNumber] = useState(0);

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    const Bg = useMemo(() => {
        if (step <= 5) {
            return Background;
        }
        if (step <= 7) {
            return MercuryBg;
        }
    }, [step]);

    const handleNextStep = (flag = true) => {
        const banStep = flag ? [] : [1, 2, 3, 4];
        if (banStep.includes(step)) {
            return;
        }
        if (step === 0) {
            if (!!account) {
                setStep(2);
            } else {
                setStep(1);
            }
            return;
        }
        if (!account) {
            return;
        }
        setStep(step + 1);
    };

    return (
        <Box
            w="100vw"
            h="100vh"
            pos="relative"
            bg={`url(${Bg})`}
            backgroundPosition="center center"
            backgroundSize="cover"
            overflow="hidden"
            fontFamily="Orbitron"
        >
            <Box zIndex={9}>
                {step === 0 && <Tournament onNextRound={handleNextStep} />}
                {step === 1 && <ConnectWalletRound />}
                {step === 2 && planeNumber === 0 && (
                    <RequestAccessRound onNextRound={handleNextStep} />
                )}
                {step === 2 && planeNumber !== 0 && (
                    <MissionRound onNextRound={handleNextStep} />
                )}
                {step === 3 && <SubmitRound onNextRound={handleNextStep} />}
                {step === 4 && <ConfirmedRound onNextRound={handleNextStep} />}
            </Box>

            <BgImgD></BgImgD>
            <Box pos="absolute" bottom={0} left="5vw">
                <HStack>
                    <Img width="35px" src={Logo}></Img>
                    <Img width="35px" src={Discord}></Img>
                    <Img width="35px" src={Tw}></Img>
                    <Img width="35px" src={Telegram}></Img>
                </HStack>
            </Box>
        </Box>
    );
};

export default Mercury;
