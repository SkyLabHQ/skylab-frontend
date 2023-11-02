import { Box } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";
import { Leaderboard } from "../components/Tournament";
import MercuryBg from "../components/Tournament/assets/mercury-bg.png";
import BlueBg from "../components/Tournament/assets/blue-bg.png";
import { Contract } from "ethers-multicall";
import ConnectWalletRound from "../components/Tournament/ConnectWalletRound";
import MissionRound from "../components/Tournament/MissionRound";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import BgImgD from "../components/Tournament/BgImgD";
import { skylabTournamentAddress } from "@/hooks/useContract";
import { useLocation } from "react-router-dom";
import qs from "query-string";
import { ChainId } from "@/utils/web3Utils";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import PilotDetail from "@/components/Tournament/PilotDetail";
import PilotLeaderboard from "@/components/Tournament/PilotLeaderboard";
import { useMultiProvider } from "@/hooks/useMultiContract";
import CurrentPilot from "@/components/Tournament/CurrentPilot";
import BabyMerc from "@/components/Tournament/BabyMerc";
import TournamentHelmet from "@/components/Helmet/TournamentHelmet";

export interface PlaneInfo {
    tokenId: number;
    level: number;
    img: string;
    round: number;
    state: boolean;
}

export const tournamentChainId = ChainId.MUMBAI;

const Activities = (): ReactElement => {
    const { search } = useLocation();
    const { account } = useActiveWeb3React();
    const [step, setStep] = useState<number | string>(0);
    const [currentRound, setCurrentRound] = useState(-1);
    const ethcallProvider = useMultiProvider(tournamentChainId);

    const handleNextStep = (nextStep?: number | string) => {
        setStep(nextStep);
    };

    const handleGetRound = async () => {
        const tournamentContract = new Contract(
            skylabTournamentAddress[tournamentChainId],
            SKYLABTOURNAMENT_ABI,
        );

        const [round] = await ethcallProvider.all([
            tournamentContract._currentRound(),
        ]);

        setCurrentRound(round.toNumber());
    };

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.step) {
            return;
        }
        setStep(params.step);
    }, []);

    useEffect(() => {
        if (step === 2 && !account) {
            setStep(1);
        }
    }, [step, account]);

    useEffect(() => {
        if (!ethcallProvider) return;
        handleGetRound();
    }, [ethcallProvider]);

    return (
        <>
            <TournamentHelmet></TournamentHelmet>
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
                        {step == 0 && (
                            <Leaderboard
                                currentRound={currentRound}
                                onNextRound={handleNextStep}
                            />
                        )}
                        {step == 1 && (
                            <ConnectWalletRound onNextRound={handleNextStep} />
                        )}

                        {step == 2 && (
                            <MissionRound
                                currentRound={currentRound}
                                onBack={() => {
                                    setStep(0);
                                }}
                                onNextRound={handleNextStep}
                            />
                        )}

                        {step === "pilotDetail" && <PilotDetail></PilotDetail>}
                        {step === "pilotLeaderboard" && (
                            <PilotLeaderboard></PilotLeaderboard>
                        )}
                        {step === "currentPilot" && (
                            <CurrentPilot
                                onNextRound={handleNextStep}
                            ></CurrentPilot>
                        )}
                        {step === "babyMerc" && (
                            <BabyMerc onNextRound={handleNextStep}></BabyMerc>
                        )}
                    </Box>

                    {step === 0 && <BgImgD show={true}></BgImgD>}
                </Box>
            </Box>
        </>
    );
};

export default Activities;
