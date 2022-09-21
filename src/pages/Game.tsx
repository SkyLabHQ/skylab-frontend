import React, { ReactElement, useState } from "react";

import { Collide } from "../components/Collide";
import { GameLoading } from "../components/GameLoading";
import { GameContent } from "../components/GameContent";

const Game = (): ReactElement => {
    const [steps, setSteps] = useState(0);

    const onNext = () => {
        setSteps((step) => step + 1);
    };

    switch (steps) {
        case 0:
            return <Collide onNext={onNext} />;
        case 1:
            return <GameLoading onNext={onNext} />;
        case 2:
            return <GameContent onNext={onNext} />;
        default:
            return <Collide onNext={onNext} />;
    }
};

export default Game;
