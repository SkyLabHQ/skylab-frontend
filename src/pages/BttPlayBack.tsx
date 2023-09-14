import BttPlayBackPage from "@/components/BttPlayBack";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BttPlayBack = () => {
    const navigate = useNavigate();

    const { setIsKnobVisible } = useKnobVisibility();

    const handleToPlayBack = (gameAddress: string) => {
        navigate(`/tactoe/playback?gameAddress=${gameAddress}`);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return <BttPlayBackPage></BttPlayBackPage>;
};

export default BttPlayBack;
