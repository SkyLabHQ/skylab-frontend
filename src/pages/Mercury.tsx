import { Box, Text, Image, keyframes } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import { Leaderboard } from "../components/Tournament";
import MercuryBg from "../components/Tournament/assets/mercury-bg.png";
import BlueBg from "../components/Tournament/assets/blue-bg.png";
import { Contract, Provider } from "ethers-multicall";
import ConnectWalletRound from "../components/Tournament/ConnectWalletRound";
import MissionRound from "../components/Tournament/MissionRound";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import BgImgD from "../components/Tournament/BgImgD";
import { skylabTournamentAddress } from "@/hooks/useContract";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import { ethers } from "ethers";
import { DEAFAULT_CHAINID, RPC_URLS } from "@/utils/web3Utils";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import { TourProvider } from "@reactour/tour";
import IndicatorIcon from "../components/Tournament/assets/indicator.svg";

const steps = [
    {
        selector: ".first-step",
        content: "Choose Plane",
    },
    {
        selector: ".second-step",
        content: "Choose Game",
    },
];

export interface PlaneInfo {
    tokenId: number;
    level: number;
    img: string;
    round: number;
    state: number;
}

const move = keyframes`
    0%, 50%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(25px);
    }
    75% {
        transform: translateX(-25px);
    }
`;

function ContentComponent(props: any) {
    const isLastStep = props.currentStep === props.steps.length - 1;
    const content = props.steps[props.currentStep].content;
    return (
        <div
            style={{
                background: "transparent",
                color: "#fff",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                fontWeight: "600",
            }}
        >
            <Image
                src={IndicatorIcon}
                sx={{ marginBottom: "10px" }}
                animation={`${move} 1.5s linear infinite`}
            ></Image>
            {/* Check if the step.content is a function or a string */}
            {typeof content === "function"
                ? content({ ...props, someOtherStuff: "Custom Text" })
                : content}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <Text
                    sx={{
                        fontSize: "16px",
                        color: "#c2c2c2",
                        fontWeight: "600",
                    }}
                >
                    ({props.currentStep + 1}/{props.steps.length})
                </Text>
                <button
                    style={{
                        background: "#ffffff99",
                        color: "#4a4a4a",
                        width: "59px",
                        height: "27px",
                        fontSize: "20px",
                        fontWeight: "600",
                        marginLeft: "10px",
                        borderRadius: "8px",
                    }}
                    onClick={() => {
                        if (isLastStep) {
                            props.setIsOpen(false);
                        } else {
                            props.setCurrentStep((s: any) => s + 1);
                        }
                    }}
                >
                    OK
                </button>
            </Box>
        </div>
    );
}

const Activities = (): ReactElement => {
    const { search } = useLocation();
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const [step, setStep] = useState(0);
    const [currentRound, setCurrentRound] = useState(-1);

    const handleNextStep = (nextStep?: number) => {
        setStep(nextStep);
    };

    const handleGetRound = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
            RPC_URLS[DEAFAULT_CHAINID][0],
        );
        const ethcallProvider = new Provider(provider);
        await ethcallProvider.init();
        const skylabTestFlightContract = new Contract(
            skylabTournamentAddress[DEAFAULT_CHAINID],
            SKYLABTOURNAMENT_ABI,
        );
        const [round] = await ethcallProvider.all([
            skylabTestFlightContract._currentRound(),
        ]);
        setCurrentRound(
            round.toNumber() >= 3 ? round.toNumber() - 1 : round.toNumber(),
        );
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.step) {
            return;
        }
        setStep(Number(params.step));
    }, []);

    useEffect(() => {
        if (step === 2 && !account) {
            setStep(1);
        }
    }, [step, account]);

    useEffect(() => {
        handleGetRound();
    }, []);

    return (
        <Box
            w="100vw"
            h="100vh"
            pos="relative"
            backgroundImage={`url(${MercuryBg}), url(${BlueBg})`}
            backgroundPosition="center center, 0 0"
            backgroundSize={"cover, cover"}
            backgroundRepeat={"no-repeat, no-repeat"}
            overflow="hidden"
            fontFamily="Orbitron"
        >
            <Box w="100vw" h="100vh">
                <Box zIndex={9}>
                    {step === 0 && (
                        <Leaderboard
                            currentRound={currentRound}
                            onNextRound={handleNextStep}
                        />
                    )}
                    {step === 1 && (
                        <ConnectWalletRound onNextRound={handleNextStep} />
                    )}

                    {step === 2 && (
                        <TourProvider
                            onClickMask={() => {}}
                            position={"right"}
                            steps={steps}
                            ContentComponent={ContentComponent}
                            styles={{
                                maskWrapper: (base) => ({
                                    ...base,
                                    color: "transparent",
                                }),
                                popover: (base) => ({
                                    ...base,
                                    background: "transparent",
                                    boxShadow: "none",
                                }),
                            }}
                        >
                            <MissionRound
                                currentRound={currentRound}
                                onBack={() => {
                                    setStep(0);
                                }}
                            />
                        </TourProvider>
                    )}
                </Box>

                {step === 0 && <BgImgD show={true}></BgImgD>}
            </Box>
        </Box>
    );
};

export default Activities;
