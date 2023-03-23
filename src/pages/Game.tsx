import React, {
    ReactElement,
    useEffect,
    useState,
    createContext,
    useContext,
    useRef,
} from "react";
import { Contract } from "ethers";

import { Collide } from "../components/Collide";
import { GameLoading } from "../components/GameLoading";
import { GameContent, MapInfo } from "../components/GameContent";
import { Presetting } from "../components/GameContent/presetting";
import { Driving } from "../components/GameContent/driving";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import { GridPosition } from "../components/GameContent/map";
import { getRecordFromLocalStorage } from "../components/GameContent/utils";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import { useContract } from "../hooks/useContract";

import abi from "../assets/abi.json";
import input from "../assets/input.json";

const initMap = () => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            if (i === 7 && j === 7) {
                map[i].push({
                    role: "end",
                });
            } else if (i === 14 && j === 0) {
                map[i].push({
                    role: "start",
                    fuelLoad: 1,
                    batteryLoad: 1,
                });
            } else if (i === 0 && j === 14) {
                map[i].push({
                    role: "opponent_start",
                });
            } else {
                map[i].push({
                    role: "normal",
                    airDrag: Math.floor(Math.random() * 4) + 1,
                    turbulence: Math.floor(Math.random() * 4) + 1,
                    fuelLoad: 0,
                    batteryLoad: 0,
                });
            }
        }
    }
    return map;
};

const initialMap = initMap();

const GameContext = createContext<{
    map: MapInfo[][];
    onNext: () => void;
    mapPath: GridPosition[];
}>({
    map: initialMap,
    onNext: () => ({}),
    mapPath: [],
});

export const useGameContext = () => useContext(GameContext);

// todo: token id
export const tokenId = 3;

const Game = (): ReactElement => {
    const [step, setStep] = useState(0);
    const [map, setMap] = useState(initialMap);
    const mapPath = useRef<GridPosition[]>([]);
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const contract = useContract();

    const mint = async () => {
        const res = await contract?.publicMint(account);
    };

    const STEPS = [
        <Collide />,
        <GameLoading />,
        <GameContent />,
        <Presetting />,
        <Driving />,
    ];

    const onNext = async () => {
        if (step === 1) {
            // todo: init map
            const map = await contract?.getMap(tokenId);
            console.log("mapId:", map, parseInt(map?.value?._hex, 16));
        }
        if (step === STEPS.length - 1) {
            localStorage.removeItem("game-map");
            localStorage.removeItem("game-step");
        }
        setStep((val) => val + 1);
        localStorage.setItem("game-step", (step + 1).toString());
    };

    useEffect(() => {
        setIsKnobVisible(false);
        const stepFromStorage = localStorage.getItem("game-step");
        const mapFromStorage = getRecordFromLocalStorage("game-map");
        if (stepFromStorage) {
            setStep(parseInt(stepFromStorage, 10));
            if (mapFromStorage) {
                setMap(mapFromStorage.map);
                mapPath.current = mapFromStorage.mapPath;
            }
        } else {
            localStorage.removeItem("game-map");
        }
        // mint();
        return () => setIsKnobVisible(true);
    }, []);

    return (
        <GameContext.Provider
            value={{
                map,
                onNext,
                mapPath: mapPath.current,
            }}
        >
            {STEPS[step] ?? <Collide />}
        </GameContext.Provider>
    );
};

export default Game;
