import BttHelmet from "@/components/Helmet/BttHelmet";
import BttLiveGamePage from "@/components/TacToe/BttLiveGamePage";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import React, { useEffect } from "react";

const BttLiveGame = () => {
    const { setIsKnobVisible } = useKnobVisibility();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return (
        <>
            <BttHelmet></BttHelmet>
            <BttLiveGamePage></BttLiveGamePage>
        </>
    );
};

export default BttLiveGame;
