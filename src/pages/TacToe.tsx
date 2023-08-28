import { Box, Image, Text } from "@chakra-ui/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import TacTocTutorial from "@/components/TacToc/TacTocTutorial";
import TacTocPage from "@/components/TacToc";
import { TourProvider } from "@reactour/tour";
import { doArrow, tourConfig } from "@/components/TacToc/config";
import "@reactour/popover/dist/index.css"; // arrow css
import ContentComponent from "@/components/TacToc/TourComponent";
import Match from "@/components/TacToc/Match";
import ToolBar from "@/components/TacToc/Toolbar";
import { useLocalSigner } from "@/hooks/useContract";
import {
    useBidTacToeFactoryRetry,
    useBidTacToeGameRetry,
} from "@/hooks/useRetryContract";
import { useNavigate } from "react-router-dom";
import {
    useMultiProvider,
    useMultiSkylabTestFlightContract,
    useMultiSkylabGameFlightRaceContract,
} from "@/hooks/useMutilContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import { useBlockNumber } from "@/contexts/BlockNumber";

export interface Info {
    burner: string;
    address: string;
    level: number;
    img: string;
}

const GameContext = createContext<{
    myInfo: Info;
    opInfo: Info;
    bidTacToeGameAddress: string;
    onStep: (step: number) => void;
}>(null);
export const useGameContext = () => useContext(GameContext);

const TacToc = () => {
    const navigate = useNavigate();
    const multiSkylabTestFlightContract = useMultiSkylabTestFlightContract();
    const multiSkylabGameFlightRaceContract =
        useMultiSkylabGameFlightRaceContract();
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const [showTutorial, setShowTutorial] = useState(false);
    const [player1, setPlayer1] = useState<string>("");
    const [player2, setPlayer2] = useState<string>("");

    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        img: "",
    });
    const [opInfo, seOpInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        img: "",
    });

    const [bidTacToeGameAddress, setBidTacToeGameAddress] =
        useState<string>("");
    const [step, setStep] = useState(0);
    const { tacToeGameRetryCall, tacToeGameRetryWrite } =
        useBidTacToeGameRetry(bidTacToeGameAddress);

    const burner = useLocalSigner();
    const { tacToeFactoryRetryCall, tacToeRetryWrite } =
        useBidTacToeFactoryRetry();

    const handleStep = (step: number) => {
        setStep(step);
    };

    const handleGetGameAddress = async () => {
        const bidTacToeGameAddress = await tacToeFactoryRetryCall(
            "gamePerPlayer",
            [burner.address],
        );

        if (
            bidTacToeGameAddress ===
            "0x0000000000000000000000000000000000000000"
        ) {
            navigate(`/tactoe`);
            return;
        }

        setBidTacToeGameAddress(bidTacToeGameAddress);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        if (!tacToeFactoryRetryCall) return;
        handleGetGameAddress();
    }, [burner, tacToeFactoryRetryCall]);

    return (
        <Box
            sx={{
                background: "#303030",
            }}
        >
            <TourProvider
                onClickMask={() => {}}
                steps={tourConfig}
                padding={{
                    mask: 5,
                    popover: 35,
                }}
                beforeClose={() => {
                    setShowTutorial(false);
                }}
                ContentComponent={ContentComponent}
                styles={{
                    maskWrapper: (base) => ({
                        ...base,
                    }),
                    popover: (base: any, state: any) => {
                        return {
                            ...base,
                            boxShadow: "none",
                            borderRadius: "16px",
                            ...doArrow(
                                state.position,
                                state.verticalAlign,
                                state.horizontalAlign,
                            ),
                        };
                    },
                    highlightedArea: (base: any, props: any) => ({
                        ...base,
                        display: "block",
                        stroke: "#FDDC2D",
                        strokeWidth: 4,
                        strokeDasharray: "8,4",
                        padding: 0,
                        rx: 10,
                    }),
                }}
            >
                {showTutorial && <TacTocTutorial></TacTocTutorial>}
                <GameContext.Provider
                    value={{
                        myInfo,
                        opInfo,

                        bidTacToeGameAddress,
                        onStep: handleStep,
                    }}
                >
                    <Box>
                        {step === 0 && (
                            <Match
                                onChangeInfo={(position, info) => {
                                    if (position === "my") {
                                        setMyInfo(info);
                                        return;
                                    }
                                    if (position === "op") {
                                        seOpInfo(info);
                                        return;
                                    }
                                }}
                            ></Match>
                        )}
                        {step === 1 && <TacTocPage></TacTocPage>}
                    </Box>
                    <ToolBar
                        onShowTutorial={(show) => {
                            setShowTutorial(show);
                        }}
                    ></ToolBar>
                </GameContext.Provider>
            </TourProvider>
        </Box>
    );
};

export default TacToc;
