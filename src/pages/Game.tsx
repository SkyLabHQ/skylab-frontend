import React, {
    ReactElement,
    useEffect,
    useState,
    createContext,
    useContext,
    useRef,
} from "react";
import qs from "query-string";
import { GameLoading } from "../components/GameLoading";
import { GameContent, MapInfo } from "../components/GameContent";
import { Presetting } from "../components/GameContent/presetting";
import { Driving } from "../components/GameContent/driving";
import { GameResult } from "../components/GameContent/result";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import { GridPosition } from "../components/GameContent/map";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
} from "../hooks/useContract";

import { useLocation, useNavigate } from "react-router-dom";
import { MapStart } from "@/components/GameContent/mapstart";
import { useDisclosure, useToast } from "@chakra-ui/react";
import FleeModal from "./FleeModal";
import GameLose from "@/components/GameContent/result/lose";
import GameWin from "@/components/GameContent/result/win";
import ResultPending from "@/components/GameContent/resultPending";
import useGameState from "@/hooks/useGameState";
import { handleError } from "@/utils/error";
import SkyToast from "@/components/Toast";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";

const GameContext = createContext<{
    map_params: number[][][];
    state: number;
    myInfo: Info;
    opInfo: Info;
    map: MapInfo[][];
    level: number | undefined;
    onNext: (nextStep?: number) => void;
    mapPath: GridPosition[];
    tokenId: number;
    onMapChange: (map: MapInfo[][]) => void;
    onMapPathChange: (mapPath: GridPosition[]) => void;
    onOpen: () => void;
    onMapParams: (map: [][][]) => void;
}>(null);

export const useGameContext = () => useContext(GameContext);
export interface Info {
    address: string;
    tokenId: number;
    fuel: number;
    battery: number;
    level: number;
}

const Game = (): ReactElement => {
    const stateTimer = useRef(null);
    const { account } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const [tokenId, setTokenId] = useState<number>(Number(params.tokenId));
    const [step, setStep] = useState(0);
    const [gameState, setGameState] = useState(0);
    const getGameState = useGameState();

    const [map, setMap] = useState([]);

    const [myInfo, setMyInfo] = useState<Info>({
        address: "",
        tokenId: 0,
        fuel: 0,
        battery: 0,
        level: 0,
    });

    const [opInfo, setOpInfo] = useState<Info>({
        address: "",
        tokenId: 0,
        fuel: 0,
        battery: 0,
        level: 0,
    });
    const [gameLevel, setGameLevel] = useState(0); //游戏等级
    const [isInit, setIsInit] = useState(false); //是否初始化

    const [mapPath, setMapPath] = useState<GridPosition[]>([]);
    const [map_params, setMap_params] = useState<number[][][]>([]);

    const { setIsKnobVisible } = useKnobVisibility();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabBaseContract = useSkylabBaseContract();

    const onNext = async (nextStep?: number) => {
        if (nextStep) {
            setStep(nextStep);
        } else {
            setStep((val) => val + 1);
        }
    };

    // 设置路径
    const handleMapPathChange = (mapPath: GridPosition[]) => {
        setMapPath(mapPath);
    };

    // 获取等级
    const handleGetGameLevel = async () => {
        const gameLevel = await skylabBaseContract._aviationLevels(tokenId);
        setGameLevel(gameLevel.toNumber());
    };

    // 设置地图
    const handleMapChange = (map: MapInfo[][]) => {
        setMap(map);
    };

    // 获取我的信息
    const getMyInfo = async () => {
        try {
            const [myTank, myAccount, myLevel] = await Promise.all([
                skylabGameFlightRaceContract.gameTank(tokenId),
                skylabBaseContract.ownerOf(tokenId),
                skylabBaseContract._aviationLevels(tokenId),
            ]);
            setMyInfo({
                tokenId: tokenId,
                address: account,
                fuel: myTank.fuel.toNumber(),
                battery: myTank.battery.toNumber(),
                level: myLevel.toNumber(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    // 获取对手信息
    const getOpponentInfo = async (opTokenId: number) => {
        try {
            const [opTank, opAccount, opLevel] = await Promise.all([
                skylabGameFlightRaceContract.gameTank(opTokenId),
                skylabBaseContract.ownerOf(opTokenId),
                skylabBaseContract._aviationLevels(opTokenId),
            ]);
            setOpInfo({
                tokenId: opTokenId,
                address: opAccount,
                fuel: opTank.fuel.toNumber(),
                battery: opTank.battery.toNumber(),
                level: opLevel.toNumber(),
            });
        } catch (error) {
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
            setOpInfo({
                tokenId: opTokenId,
                address: "",
                fuel: 0,
                battery: 0,
                level: 0,
            });
        }
    };

    // 更新飞机等级
    const handleUpdateLevel = async () => {
        const [myLevel, opLevel] = await Promise.all([
            skylabBaseContract._aviationLevels(myInfo.tokenId),
            skylabBaseContract._aviationLevels(opInfo.tokenId),
        ]);
        setMyInfo({
            ...myInfo,
            level: myLevel.toNumber(),
        });

        setOpInfo({
            ...opInfo,
            level: opLevel.toNumber(),
        });
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.tokenId) {
            navigate(`/mercury`);
        }
    }, []);

    // 定时获取游戏状态
    useEffect(() => {
        stateTimer.current = setInterval(async () => {
            const gameState = await getGameState(tokenId);
            if (gameState === 0) {
                clearInterval(stateTimer.current);
                navigate(`/spendresource?tokenId=${tokenId}`);
                return;
            }
            setGameState(gameState);
            if (opInfo.tokenId !== 0) {
                return;
            }
            const opTokenId =
                await skylabGameFlightRaceContract.matchedAviationIDs(tokenId);
            // 已经匹配到对手
            if (opTokenId.toNumber() !== 0) {
                getOpponentInfo(opTokenId.toNumber());
            }
        }, 3000);

        return () => {
            stateTimer.current && clearInterval(stateTimer.current);
        };
    }, [gameState]);

    useEffect(() => {
        // 如果未初始化
        if (!isInit) {
            return;
        }
        let nextStep = 0;
        if (gameState === 1) {
            nextStep = 1;
        }
        // 用户已经参加游戏 已经获取地图 开始游戏
        else if (gameState === 2) {
            nextStep = 1;
        }
        // 3是游戏已经commitPath 等待revealPath
        else if (gameState === 3 || gameState === 4) {
            nextStep = 6;
        }
        // 5是游戏胜利
        else if (gameState === 5) {
            nextStep = 5;
            stateTimer.current && clearInterval(stateTimer.current);
        }
        // 6是游戏失败
        else if (gameState === 6) {
            nextStep = 7;
            stateTimer.current && clearInterval(stateTimer.current);
        }
        // 7是游戏投降 失败
        else if (gameState === 7) {
            nextStep = 7;
            stateTimer.current && clearInterval(stateTimer.current);
        }
        setTimeout(() => {
            onNext(nextStep);
        }, 1000);
    }, [gameState, isInit]);

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        handleGetGameLevel();
    }, [skylabGameFlightRaceContract, tokenId]);

    useEffect(() => {
        if (
            !skylabBaseContract ||
            !skylabGameFlightRaceContract ||
            !account ||
            !tokenId
        ) {
            return;
        }
        getMyInfo();
    }, [skylabBaseContract, skylabGameFlightRaceContract, account, tokenId]);

    return (
        <GameContext.Provider
            value={{
                map_params: map_params,
                state: gameState,
                onOpen,
                opInfo,
                myInfo,
                map,
                onNext,
                mapPath: mapPath,
                level: gameLevel,
                tokenId,
                onMapChange: handleMapChange,
                onMapPathChange: handleMapPathChange,
                onMapParams: setMap_params,
            }}
        >
            <>
                {step === 0 && (
                    <GameLoading
                        onInit={() => {
                            setIsInit(true);
                        }}
                    />
                )}
                {step === 1 && <GameContent />}
                {step === 2 && <MapStart />}
                {step === 3 && <Presetting />}
                {step === 4 && <Driving />}
                {step === 5 && <GameResult />}
                {step === 6 && (
                    <ResultPending onUpdateLevel={handleUpdateLevel} />
                )}
                {step === 7 && <GameLose />}
                {step === 8 && <GameWin />}
                <FleeModal onClose={onClose} isOpen={isOpen}></FleeModal>
            </>
        </GameContext.Provider>
    );
};

export default Game;
