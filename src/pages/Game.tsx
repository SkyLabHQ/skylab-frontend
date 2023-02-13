import React, { ReactElement, useEffect, useState } from "react";

import { Collide } from "../components/Collide";
import { GameLoading } from "../components/GameLoading";
import { GameContent, MapInfo } from "../components/GameContent";
import { Presetting } from "../components/GameContent/presetting";
import { Driving } from "../components/GameContent/driving";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";

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
                });
            }
        }
    }
    return map;
};

const initialMap = initMap();

const Game = (): ReactElement => {
    const [steps, setSteps] = useState(0);
    const { setIsKnobVisible } = useKnobVisibility();

    const onNext = () => {
        setSteps((step) => step + 1);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    });

    switch (steps) {
        case 0:
            return <Collide onNext={onNext} />;
        case 1:
            return <GameLoading onNext={onNext} />;
        case 2:
            return <GameContent onNext={onNext} map={initialMap} />;
        case 3:
            return <Presetting onNext={onNext} map={initialMap} />;
        case 4:
            return <Driving onNext={onNext} map={initialMap} />;
        default:
            return <Collide onNext={onNext} />;
    }
};

export default Game;
