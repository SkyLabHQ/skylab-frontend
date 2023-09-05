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
import { useBidTacToeFactoryRetry } from "@/hooks/useRetryContract";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { useTacToeSigner } from "@/hooks/useSigner";
import {
    useMultiProvider,
    useMultiSkylabTestFlightContract,
} from "@/hooks/useMutilContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import { useBlockNumber } from "@/contexts/BlockNumber";

export enum UserMarkType {
    Empty = -1,
    Square = 0,
    Circle = 1,
    Cross = 2,
    YellowCircle = 3,
    YellowCross = 4,
}
export interface Info {
    burner: string;
    address: string;
    level: number;
    img: string;
    mark: UserMarkType;
}

const GameContext = createContext<{
    tokenId: number;
    myInfo: Info;
    opInfo: Info;
    bidTacToeGameAddress: string;
    onStep: (step: number) => void;
}>(null);
export const useGameContext = () => useContext(GameContext);

const TacToc = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const [showTutorial, setShowTutorial] = useState(false);
    const [tokenId, setTokenId] = useState<number>(0);
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        img: "",
        mark: null,
    });
    const [opInfo, seOpInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        img: "",
        mark: null,
    });
    const { blockNumber } = useBlockNumber();
    const ethcallProvider = useMultiProvider();
    const multiSkylabTestFlightContract = useMultiSkylabTestFlightContract();
    const [bidTacToeGameAddress, setBidTacToeGameAddress] =
        useState<string>(null);
    const [step, setStep] = useState(0);
    const [tacToeBurner] = useTacToeSigner(tokenId);

    const { tacToeFactoryRetryCall } = useBidTacToeFactoryRetry(tokenId);

    const handleStep = (step: number) => {
        setStep(step);
    };

    const handleGetGameAddress = async () => {
        const bidTacToeGameAddress = await tacToeFactoryRetryCall(
            "gamePerPlayer",
            [tacToeBurner.address],
        );
        if (
            bidTacToeGameAddress ===
            "0x0000000000000000000000000000000000000000"
        ) {
            const defaultGameQueue = await tacToeFactoryRetryCall(
                "defaultGameQueue",
            );

            if (tacToeBurner.address !== defaultGameQueue) {
                const url = istest
                    ? `/tactoe/mode?tokenId=${tokenId}&testflight=true`
                    : `/tactoe/mode?tokenId=${tokenId}`;
                navigate(url);
                return;
            }

            await ethcallProvider.init();
            const [account, level, mtadata] = await ethcallProvider.all([
                multiSkylabTestFlightContract.ownerOf(tokenId),
                multiSkylabTestFlightContract._aviationLevels(tokenId),
                multiSkylabTestFlightContract.tokenURI(tokenId),
            ]);
            setMyInfo({
                burner: tacToeBurner.address,
                address: account,
                level: level.toNumber(),
                img: getMetadataImg(mtadata),
                mark: null,
            });
        } else {
            setBidTacToeGameAddress(bidTacToeGameAddress);
        }
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        if (
            !blockNumber ||
            !tacToeFactoryRetryCall ||
            !tokenId ||
            !tacToeBurner ||
            bidTacToeGameAddress
        )
            return;
        handleGetGameAddress();
    }, [blockNumber, tacToeFactoryRetryCall, tokenId, tacToeBurner]);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (tokenId === 0) {
            setTokenId(params.tokenId);
        } else if (!params.tokenId) {
            navigate(`/trailblazer`);
        } else if (tokenId != params.tokenId) {
            navigate(`/trailblazer`);
        }
    }, [search, tokenId]);

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
                        tokenId,
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
