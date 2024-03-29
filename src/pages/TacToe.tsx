import { Box } from "@chakra-ui/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import "@reactour/popover/dist/index.css"; // arrow css
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { getTestflightSigner, useTacToeSigner } from "@/hooks/useSigner";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiMercuryBaseContract,
} from "@/hooks/useMultiContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import { useBlockNumber } from "@/contexts/BlockNumber";
import ResultPage from "@/components/TacToe/ResultPage";
import TacToePage, { GameState } from "@/components/TacToe";
import Match from "@/components/TacToe/Match";
import SettlementPage from "@/components/TacToe/SettlementPage";
import LevelInfo from "@/components/TacToe/LevelInfo";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import CrossIcon from "@/components/TacToe/assets/x.svg";
import YellowCircle from "@/components/TacToe/assets/yellow-circle.svg";
import YellowCross from "@/components/TacToe/assets/yellow-x.svg";
import BotX from "@/components/TacToe/assets/bot-x.svg";
import YellowBotX from "@/components/TacToe/assets/yellow-bot-x.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    skylabTestFlightAddress,
    skylabTournamentAddress,
} from "@/hooks/useContract";
import BttHelmet from "@/components/Helmet/BttHelmet";
import { ZERO_DATA } from "@/skyConstants";
import { PilotInfo, usePilotInfo } from "@/hooks/usePilotInfo";
import { getSCWallet } from "@/hooks/useSCWallet";
import { TESTFLIGHT_CHAINID } from "@/utils/web3Utils";
import { useBttFactoryRetry } from "@/hooks/useRetryContract";

export enum UserMarkType {
    Empty = -1,
    Square = 0,
    Circle = 1,
    Cross = 2,
    YellowCircle = 3,
    YellowCross = 4,
    BotX = 5,
    YellowBotX = 6,
}

export const UserMarkIcon = {
    Circle: CircleIcon,
    Cross: CrossIcon,
    YellowCircle: YellowCircle,
    YellowCross: YellowCross,
    BotX: BotX,
    YellowBotX: YellowBotX,
};

export const initBoard = () => {
    return Array(9)
        .fill("")
        .map(() => ({
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Empty,
            opMark: UserMarkType.Empty,
        }));
};

// plane related info
export interface Info {
    burner: string;
    address: string;
    level: number;
    point: number;
    img: string;
    mark: UserMarkType;
    isBot?: boolean;
}

export interface BoardItem {
    mark: UserMarkType;
    myValue: number;
    opValue: number;
    myMark: UserMarkType;
    opMark: UserMarkType;
    showAnimate?: boolean;
}

// user state in game
export interface GameInfo {
    balance: number;
    gameState: number;
    timeout: number;
    message: number;
    emote: number;
}

export interface MyNewInfo {
    level: number;
    point: number;
    img?: string;
}

export enum GameType {
    Unkown,
    HumanWithHuman,
    HumanWithBot,
}

const GameContext = createContext<{
    realChainId: number;
    istest: boolean;
    gameType: GameType;
    list: BoardItem[];
    tokenId: number;
    myNewInfo: MyNewInfo;
    myInfo: Info;
    opInfo: Info;
    myGameInfo: GameInfo;
    opGameInfo: GameInfo;
    bidTacToeGameAddress: string;
    myActivePilot: PilotInfo;
    opActivePilot: PilotInfo;
    mileages: {
        winMileage: number;
        loseMileage: number;
    };
    points: {
        winPoint: number;
        losePoint: number;
    };
    onStep: (step: number) => void;
    onList: (list: BoardItem[]) => void;
}>(null);
export const useGameContext = () => useContext(GameContext);

const TacToe = () => {
    const { chainId, account } = useActiveWeb3React();
    const bttFactoryRetryTest = useBttFactoryRetry(true);
    const bttFactoryRetry = useBttFactoryRetry(false);
    const [gameType, setGameType] = useState<GameType>(GameType.Unkown);
    const [mileages, setMileages] = useState<{
        winMileage: number;
        loseMileage: number;
    }>({
        winMileage: 0,
        loseMileage: 0,
    });

    const [points, setPoints] = useState<{
        winPoint: number;
        losePoint: number;
    }>({
        winPoint: 0,
        losePoint: 0,
    });

    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight === "true";
    const { setIsKnobVisible } = useKnobVisibility();
    const [tokenId, setTokenId] = useState<number>(0);
    const [myNewInfo, setMyNewInfo] = useState<MyNewInfo>(null); // if game over update my info
    const realChainId = istest ? TESTFLIGHT_CHAINID : chainId;
    const multiProvider = useMultiProvider(realChainId);
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        point: 0,
        img: "",
        mark: UserMarkType.Empty,
    });
    const [opInfo, seOpInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        point: 0,
        img: "",
        mark: UserMarkType.Empty,
    });
    const { activePilot: myActivePilot } = usePilotInfo(account);

    const { activePilot: opActivePilot } = usePilotInfo(opInfo.address);

    const [myGameInfo, setMyGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: GameState.Unknown,
        timeout: 0,
        message: 0,
        emote: 0,
    });
    const [opGameInfo, setOpGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: GameState.Unknown,
        timeout: 0,
        message: 0,
        emote: 0,
    });
    const { blockNumber } = useBlockNumber();
    const multiMercuryBaseContract = useMultiMercuryBaseContract(realChainId);
    const [bidTacToeGameAddress, setBidTacToeGameAddress] =
        useState<string>(null);
    const [step, setStep] = useState(0);
    const [tacToeBurner] = useTacToeSigner(tokenId);

    const [list, setList] = useState<BoardItem[]>(initBoard()); // init board
    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract(realChainId);

    const handleStep = (step: number) => {
        setStep(step);
    };

    // get my and op info
    const handleGetGameInfo = async () => {
        try {
            const testflightSinger = getTestflightSigner(realChainId);
            const { sCWAddress } = await getSCWallet(
                testflightSinger.privateKey,
            );

            const operateAddress = istest ? sCWAddress : tacToeBurner.address;
            const [bidTacToeGameAddress, defaultGameQueue] =
                await multiProvider.all([
                    multiSkylabBidTacToeFactoryContract.gamePerPlayer(
                        operateAddress,
                    ),
                    multiSkylabBidTacToeFactoryContract.defaultGameQueue(
                        istest
                            ? skylabTestFlightAddress[TESTFLIGHT_CHAINID]
                            : skylabTournamentAddress[realChainId],
                    ),
                ]);

            console.log("Game Address", bidTacToeGameAddress);
            console.log("DefaultGameQueue", defaultGameQueue);
            console.log("sCWAddress", sCWAddress);

            if (bidTacToeGameAddress === ZERO_DATA) {
                if (operateAddress !== defaultGameQueue) {
                    navigate("/btt/mode");
                    return;
                }

                const [account, level, mtadata, point] =
                    await multiProvider.all([
                        multiMercuryBaseContract.ownerOf(tokenId),
                        multiMercuryBaseContract.aviationLevels(tokenId),
                        multiMercuryBaseContract.tokenURI(tokenId),
                        multiMercuryBaseContract.aviationPoints(tokenId),
                    ]);

                setMyInfo({
                    burner: operateAddress,
                    address: account,
                    level: level.toNumber(),
                    point: point.toNumber(),
                    img: getMetadataImg(mtadata),
                    mark: null,
                });
            } else {
                setBidTacToeGameAddress(bidTacToeGameAddress);
            }
        } catch (e: any) {
            console.log(e);
            if (e.code === "CALL_EXCEPTION") {
                navigate("/activities", { replace: true });
            }
        }
    };

    const handleChangeList = (list: any) => {
        setList(list);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        if (
            !blockNumber ||
            !tokenId ||
            !tacToeBurner ||
            bidTacToeGameAddress ||
            !multiSkylabBidTacToeFactoryContract ||
            !multiProvider
        ) {
            return;
        }
        handleGetGameInfo();
    }, [
        multiProvider,
        blockNumber,
        tokenId,
        tacToeBurner,
        multiMercuryBaseContract,
    ]);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (tokenId === 0) {
            setTokenId(params.tokenId);
        } else if (!params.tokenId) {
            navigate(`/activities`);
        } else if (tokenId != params.tokenId) {
            navigate(`/activities`);
        }
    }, [search, tokenId]);

    useEffect(() => {
        if (!myInfo.address || !opInfo.address) {
            return;
        }
        setTimeout(() => {
            handleStep(1);
        }, 1000);
    }, [myInfo, opInfo]);

    useEffect(() => {
        if (istest) {
            return;
        }

        if (myInfo.address) {
            if (myInfo.address !== account) {
                navigate("/activities");
                return;
            }
        }
    }, [myInfo, account]);

    return (
        <>
            <BttHelmet></BttHelmet>
            <Box
                sx={{
                    background: "#303030",
                }}
            >
                <GameContext.Provider
                    value={{
                        realChainId,
                        gameType,
                        istest,
                        myActivePilot,
                        opActivePilot,
                        myInfo,
                        opInfo,
                        myNewInfo,
                        tokenId,
                        myGameInfo,
                        opGameInfo,
                        list,
                        bidTacToeGameAddress,
                        mileages,
                        points,
                        onStep: handleStep,
                        onList: handleChangeList,
                    }}
                >
                    <Box>
                        {step === 0 && (
                            <Match
                                onGameType={(type: GameType) => {
                                    setGameType(type);
                                }}
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
                                onChangeMileage={(winMileage, loseMileage) => {
                                    setMileages({
                                        winMileage,
                                        loseMileage,
                                    });
                                }}
                                onChangePoint={(winPoint, losePoint) => {
                                    setPoints({
                                        winPoint,
                                        losePoint,
                                    });
                                }}
                            ></Match>
                        )}
                        {step === 1 && <LevelInfo></LevelInfo>}
                        {step === 2 && (
                            <TacToePage
                                onChangeGame={(position, info) => {
                                    if (position === "my") {
                                        setMyGameInfo(info);
                                        return;
                                    }
                                    if (position === "op") {
                                        setOpGameInfo(info);
                                        return;
                                    }
                                }}
                                onChangeNewInfo={(info: MyNewInfo) => {
                                    setMyNewInfo(info);
                                }}
                            ></TacToePage>
                        )}
                        {step === 3 && <ResultPage></ResultPage>}
                        {step === 4 && <SettlementPage></SettlementPage>}
                    </Box>
                </GameContext.Provider>
            </Box>
        </>
    );
};

export default TacToe;
