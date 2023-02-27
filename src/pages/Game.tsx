import React, {
    ReactElement,
    useEffect,
    useState,
    createContext,
    useContext,
} from "react";

import { Collide } from "../components/Collide";
import { GameLoading } from "../components/GameLoading";
import { GameContent, MapInfo } from "../components/GameContent";
import { Presetting } from "../components/GameContent/presetting";
import { Driving } from "../components/GameContent/driving";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import { GridPosition } from "../components/GameContent/map";

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
                    fuelLoad: 1,
                    batteryLoad: 1,
                });
            }
        }
    }
    return map;
};

const initialMap = initMap();

const mapPath: GridPosition[] = [];

const GameContext = createContext<{
    map: MapInfo[][];
    onNext: () => void;
    mapPath: GridPosition[];
}>({
    map: initialMap,
    onNext: () => ({}),
    mapPath,
});

export const useGameContext = () => useContext(GameContext);

const Game = (): ReactElement => {
    const [step, setStep] = useState(0);
    const { setIsKnobVisible } = useKnobVisibility();

    const STEPS = [
        <Collide />,
        <GameLoading />,
        <GameContent />,
        <Presetting />,
        <Driving />,
    ];

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    });

    return (
        <GameContext.Provider
            value={{
                map: initialMap,
                onNext: () => setStep((val) => val + 1),
                mapPath,
            }}
        >
            {STEPS[step] ?? <Collide />}
        </GameContext.Provider>
    );
};

export default Game;
