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

const initMap = (mapInfo: any) => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            if (i === 7 && j === 7) {
                map[i].push({
                    role: "end",
                });
            } else {
                map[i].push({
                    role: "normal",
                    distance: mapInfo[i][j][0],
                    fuelScaler: mapInfo[i][j][1],
                    batteryScaler: mapInfo[i][j][2],
                    fuelLoad: 0,
                    batteryLoad: 0,
                });
            }
        }
    }
    return map;
};

const GameContext = createContext<{
    map: MapInfo[][];
    level: number | undefined;
    onNext: (nextStep?: number) => void;
    mapPath: GridPosition[];
    tokenId: number;
    onMapChange: (map: MapInfo[][]) => void;
    onMapPathChange: (mapPath: GridPosition[]) => void;
}>({
    map: [],
    level: undefined,
    onNext: () => ({}),
    mapPath: [],
    tokenId: null,
    onMapChange: () => ({}),
    onMapPathChange: () => ({}),
});

export const useGameContext = () => useContext(GameContext);

const Game = (): ReactElement => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const [tokenId, setTokenId] = useState<number>(null);
    const [step, setStep] = useState(0);
    const [map, setMap] = useState([]);
    const [gameLevel, setGameLevel] = useState(0);
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
    ];

    const handleGetMap = async () => {
        const res = await skylabGameFlightRaceContract.getMap(tokenId);
        await res.wait();
        handleGetGameState();
    };

    const handleGetMapId = async () => {
        try {
            const mapId = await skylabGameFlightRaceContract.mapId(tokenId);
            const f = (mapId.toNumber() / 10).toFixed(0);
            const res = await axios.get(
                `https://red-elegant-wasp-428.mypinata.cloud/ipfs/Qmaf7vhNyd7VudLPy2Xbx2K6waQdydj8KnExU2SdqNMogp/batch_fullmap_${f}.json`,
            );
            const map = res.data[mapId];
            const initialMap = initMap(map.map_params);
            setMap(initialMap);
        } catch (error) {
            console.log(error);
        }
    };

    const onNext = async (nextStep?: number) => {
        if (step === 2) {
            // todo: init map
            // const map = await contract?.getMap(tokenId);
            // console.log("mapId:", map, parseInt(map?.value?._hex, 16));
        } else if (step === 3) {
        } else if (step === 4) {
        } else if (step === 5) {
        }

        if (nextStep) {
            setStep(nextStep);
        } else {
            setStep((val) => val + 1);
        }
    };

    const handleMapPathChange = (mapPath: GridPosition[]) => {
        setMapPath(mapPath);
    };

    // 获取游戏状态
    const handleGetGameState = async () => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        const stateString = state.toString();
        const gameLevel = await skylabBaseContract._aviationLevels(tokenId);
        setGameLevel(gameLevel.toNumber());
        if (stateString === "0") {
            navigate(`/spendresource?tokenId=${tokenId}`);
        } else if (stateString === "1") {
            setStep(0);
        } else if (stateString === "2") {
            await handleGetMap();
            await handleGetMapId();
            setStep(1);
        }
    };

    const handleMapChange = (map: MapInfo[][]) => {
        setMap(map);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        try {
            const params = qs.parse(search) as any;
            setTokenId(Number(params.tokenId));
        } catch (error) {
            navigate(`/spendresource?tokenId=${tokenId}`);
        }
    }, []);

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        handleGetGameState();
    }, [skylabGameFlightRaceContract, tokenId]);

    return (
        <GameContext.Provider
            value={{
                map,
                onNext,
                mapPath: mapPath,
                level: gameLevel,
                tokenId,
                onMapChange: handleMapChange,
                onMapPathChange: handleMapPathChange,
            }}
        >
            {STEPS[step] ?? <GameLoading />}
        </GameContext.Provider>
    );
};

export default Game;
