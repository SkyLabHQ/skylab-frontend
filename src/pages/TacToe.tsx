import { Box } from "@chakra-ui/react";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import "@reactour/popover/dist/index.css"; // arrow css
import { useBidTacToeFactoryRetry } from "@/hooks/useRetryContract";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { useTacToeSigner } from "@/hooks/useSigner";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiSkylabTestFlightContract,
} from "@/hooks/useMutilContract";
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

export enum UserMarkType {
    Empty = -1,
    Square = 0,
    Circle = 1,
    Cross = 2,
    YellowCircle = 3,
    YellowCross = 4,
}

export const UserMarkIcon = {
    Circle: CircleIcon,
    Cross: CrossIcon,
    YellowCircle: YellowCircle,
    YellowCross: YellowCross,
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
}

export interface BoardItem {
    mark: UserMarkType;
    myValue: number;
    opValue: number;
    myMark: UserMarkType;
    opMark: UserMarkType;
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
}

const GameContext = createContext<{
    list: BoardItem[];
    tokenId: number;
    myNewInfo: MyNewInfo;
    myInfo: Info;
    opInfo: Info;
    myGameInfo: GameInfo;
    opGameInfo: GameInfo;
    bidTacToeGameAddress: string;
    onStep: (step: number) => void;
    onList: (list: BoardItem[]) => void;
}>(null);
export const useGameContext = () => useContext(GameContext);

const TacToe = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;
    const { setIsKnobVisible } = useKnobVisibility();
    const [tokenId, setTokenId] = useState<number>(0);
    const [myNewInfo, setMyNewInfo] = useState<MyNewInfo>(null); // if game over update my info

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
    const ethcallProvider = useMultiProvider();
    const multiSkylabTestFlightContract = useMultiSkylabTestFlightContract();
    const [bidTacToeGameAddress, setBidTacToeGameAddress] =
        useState<string>(null);
    const [step, setStep] = useState(0);
    const [tacToeBurner] = useTacToeSigner(tokenId);
    const [list, setList] = useState<BoardItem[]>(initBoard()); // init board
    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract();
    const { tacToeFactoryRetryCall } = useBidTacToeFactoryRetry(tokenId);

    const handleStep = (step: number) => {
        setStep(step);
    };

    // get my and op info
    const handleGetGameInfo = async () => {
        try {
            const [
                bidTacToeGameAddress,
                defaultGameQueue,
                account,
                level,
                mtadata,
                point,
            ] = await ethcallProvider.all([
                multiSkylabBidTacToeFactoryContract.gamePerPlayer(
                    tacToeBurner.address,
                ),
                multiSkylabBidTacToeFactoryContract.defaultGameQueue(),
                multiSkylabTestFlightContract.ownerOf(tokenId),
                multiSkylabTestFlightContract._aviationLevels(tokenId),
                multiSkylabTestFlightContract.tokenURI(tokenId),
                multiSkylabTestFlightContract._aviationPoints(tokenId),
            ]);

            if (
                bidTacToeGameAddress ===
                "0x0000000000000000000000000000000000000000"
            ) {
                if (tacToeBurner.address !== defaultGameQueue) {
                    const url = istest
                        ? `/tactoe/mode?tokenId=${tokenId}&testflight=true`
                        : `/tactoe/mode?tokenId=${tokenId}`;
                    navigate(url);
                    return;
                }

                setMyInfo({
                    burner: tacToeBurner.address,
                    address: account,
                    level: level.toNumber(),
                    point: point.toNumber(),
                    img: getMetadataImg(mtadata),
                    mark: null,
                });
            } else {
                setBidTacToeGameAddress(bidTacToeGameAddress);
            }
        } catch (e) {
            navigate("/activities", { replace: true });
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
            !tacToeFactoryRetryCall ||
            !tokenId ||
            !tacToeBurner ||
            bidTacToeGameAddress
        ) {
            return;
        }
        handleGetGameInfo();
    }, [blockNumber, tacToeFactoryRetryCall, tokenId, tacToeBurner]);

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

    return (
        <Box
            sx={{
                background: "#303030",
            }}
        >
            <GameContext.Provider
                value={{
                    myInfo,
                    opInfo,
                    myNewInfo,
                    tokenId,
                    myGameInfo,
                    opGameInfo,
                    list,
                    bidTacToeGameAddress,
                    onStep: handleStep,
                    onList: handleChangeList,
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
    );
};

export default TacToe;
