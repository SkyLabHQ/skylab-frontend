import React, {
    ReactElement,
    useEffect,
    useState,
    createContext,
    useContext,
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
import axios from "axios";
import { MapStart } from "@/components/GameContent/mapstart";
import { useDisclosure } from "@chakra-ui/react";
import FleeModal from "./FleeModal";
import GameLose from "@/components/GameContent/gameLose";
import GameWin from "@/components/GameContent/gameWin";

const GameContext = createContext<{
    state: number;
    myInfo: Info;
    opInfo: Info;
    gameFuel: number;
    gameBattery: number;
    map: MapInfo[][];
    level: number | undefined;
    onNext: (nextStep?: number) => void;
    mapPath: GridPosition[];
    tokenId: number;
    onMapChange: (map: MapInfo[][]) => void;
    onMapPathChange: (mapPath: GridPosition[]) => void;
    onGameTank: (gameFuel: number, gameBattery: number) => void;
    onUserAndOpInfo: (myInfo: any, opInfo: any) => void;
    onOpen: () => void;
}>(null);

export const useGameContext = () => useContext(GameContext);
export interface Info {
    address: string;
    tokenId: number;
    fuel: number;
    battery: number;
}

const Game = (): ReactElement => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const [tokenId, setTokenId] = useState<number>(Number(params.tokenId));
    const [step, setStep] = useState(0);
    const [gameState, setGameState] = useState(0);

    const [map, setMap] = useState([]);

    const [myInfo, setMyInfo] = useState<Info>({
        tokenId: tokenId,
        address: "",
        fuel: 0,
        battery: 0,
    });

    const [opInfo, setOpInfo] = useState<Info>({
        tokenId: 0,
        address: "",
        fuel: 0,
        battery: 0,
    });
    const [gameLevel, setGameLevel] = useState(0); //游戏等级
    const [gameFuel, setGameFuel] = useState(0); //游戏里的汽油
    const [gameBattery, setGameBattery] = useState(0); //游戏里的电池

    const [mapPath, setMapPath] = useState<GridPosition[]>([]);

    const { setIsKnobVisible } = useKnobVisibility();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabBaseContract = useSkylabBaseContract();

    const STEPS = [
        <GameLoading />,
        <GameContent />,
        <MapStart />,
        <Presetting />,
        <Driving />,
        <GameResult />,
        <GameWin />,
        <GameLose />,
    ];

    const onNext = async (nextStep?: number) => {
        if (nextStep) {
            setStep(nextStep);
        } else {
            setStep((val) => val + 1);
        }
    };

    const handleMapPathChange = (mapPath: GridPosition[]) => {
        setMapPath(mapPath);
    };

    // 获取等级
    const handleGetGameLevel = async () => {
        const gameLevel = await skylabBaseContract._aviationLevels(tokenId);
        setGameLevel(gameLevel.toNumber());
    };

    const handleMapChange = (map: MapInfo[][]) => {
        setMap(map);
    };

    const handleGameResource = (gameFuel: number, gameBattery: number) => {
        setGameFuel(gameFuel);
        setGameBattery(gameBattery);
    };
    const handleUserAndOpInfo = (myInfo: Info, opInfo: Info) => {
        setMyInfo(myInfo);
        setOpInfo(opInfo);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.tokenId) {
            navigate(`/spendresource?tokenId=${tokenId}`);
        }
    }, []);

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        handleGetGameLevel();
    }, [skylabGameFlightRaceContract, tokenId]);

    return (
        <GameContext.Provider
            value={{
                state: gameState,
                onOpen,
                opInfo,
                myInfo,
                gameFuel,
                gameBattery,
                map,
                onNext,
                mapPath: mapPath,
                level: gameLevel,
                tokenId,
                onMapChange: handleMapChange,
                onMapPathChange: handleMapPathChange,
                onGameTank: handleGameResource,
                onUserAndOpInfo: handleUserAndOpInfo,
            }}
        >
            <>
                {STEPS[step]}
                <FleeModal onClose={onClose} isOpen={isOpen}></FleeModal>
            </>
        </GameContext.Provider>
    );
};

export default Game;
