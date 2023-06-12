import { Box, HStack, Img } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import Background from "../assets/tournament-background.png";
import { Tournament } from "../components/Tournament";
import MercuryBg from "../components/Tournament/assets/mercury-bg.png";
import BPlanet from "../components/Tournament/assets/bPlanet.png";

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
import { useSkylabBaseContract } from "@/hooks/useContract";
import { Petrol } from "@/components/Tournament/Petrol";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import Flight from "@/components/Tournament/Flight";

export interface PlaneInfo {
    tokenId: number;
    level: number;
}

const Mercury = (): ReactElement => {
    const { search } = useLocation();
    const { setIsKnobVisible } = useKnobVisibility();
    const skylabBaseContract = useSkylabBaseContract();
    const { account } = useActiveWeb3React();
    const [step, setStep] = useState(0);
    const [planeList, setPlaneList] = useState<PlaneInfo[]>([]);
    const [currentImg, setCurrentImg] = useState(0);
    const [bigger, setBigger] = useState(false);

    const handleNextStep = (nextStep?: number) => {
        setStep(nextStep);
    };

    const handleGetPlaneBalance = async () => {
        const balance = await skylabBaseContract.balanceOf(account);
        const p = new Array(balance.toNumber()).fill("").map((item, index) => {
            return skylabBaseContract.tokenOfOwnerByIndex(account, index);
        });
        const planeTokenIds = await Promise.all(p);
        const p1 = planeTokenIds.map((tokenId) => {
            return skylabBaseContract._aviationLevels(tokenId);
        });
        const levels = await Promise.all(p1);
        setPlaneList(
            planeTokenIds.map((item, index) => {
                return {
                    tokenId: item.toNumber(),
                    level: levels[index].toNumber(),
                };
            }),
        );
    };

    const handleCurrentImg = (index: number) => {
        setCurrentImg(index);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        if (!skylabBaseContract || !account) {
            return;
        }
        handleGetPlaneBalance();
    }, [skylabBaseContract, account]);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.step) {
            return;
        }
        setStep(Number(params.step));
    }, []);

    return (
        <Box
            w="100vw"
            h="100vh"
            pos="relative"
            backgroundImage={`url(${BPlanet}),url(${MercuryBg})`}
            backgroundPosition="40% center,center center"
            backgroundSize={bigger ? "70%,cover" : "45%,cover"}
            backgroundRepeat={"no-repeat,no-repeat"}
            overflow="hidden"
            fontFamily="Orbitron"
            transition="all 0.2s ease-in-out"
        >
            <Box
                w="100vw"
                h="100vh"
                bg={step === 0 ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.4)"}
            >
                <Box zIndex={9}>
                    {step === 0 && <Tournament onNextRound={handleNextStep} />}
                    {step === 1 && (
                        <ConnectWalletRound onNextRound={handleNextStep} />
                    )}
                    {step === 2 && planeList.length === 0 && (
                        <RequestAccessRound
                            onNextRound={handleNextStep}
                            onPlaneBalance={handleGetPlaneBalance}
                        />
                    )}
                    {step === 2 && planeList.length !== 0 && (
                        <MissionRound
                            currentImg={currentImg}
                            planeList={planeList}
                            onBigger={(status: boolean) => {
                                setBigger(status);
                            }}
                            onNextRound={handleNextStep}
                            onCurrentImg={handleCurrentImg}
                        />
                    )}
                    {step === 6 && planeList.length !== 0 && (
                        <Petrol
                            currentImg={currentImg}
                            planeList={planeList}
                            onNextRound={handleNextStep}
                        ></Petrol>
                    )}
                    {step === 7 && <Flight></Flight>}
                    {step === 3 && <SubmitRound onNextRound={handleNextStep} />}
                    {step === 4 && (
                        <ConfirmedRound onNextRound={handleNextStep} />
                    )}
                </Box>

                {[0, 4].includes(step) && <BgImgD show={true}></BgImgD>}
                <Box pos="absolute" bottom={0} left="5vw">
                    <HStack>
                        <Img width="35px" src={Logo}></Img>
                        <Img width="35px" src={Discord}></Img>
                        <Img width="35px" src={Tw}></Img>
                        <Img width="35px" src={Telegram}></Img>
                    </HStack>
                </Box>
            </Box>
        </Box>
    );
};

export default Mercury;
