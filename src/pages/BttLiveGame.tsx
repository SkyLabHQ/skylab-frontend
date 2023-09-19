import BttPlayBackPage from "@/components/BttPlayBack";
import BttLiveGamePage from "@/components/TacToe/BttLiveGamePage";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import React, { useEffect } from "react";

const BttLiveGame = () => {
    const { setIsKnobVisible } = useKnobVisibility();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return <BttLiveGamePage></BttLiveGamePage>;
};

export default BttLiveGame;
