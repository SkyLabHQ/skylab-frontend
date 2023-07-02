import React, { useEffect } from "react";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import Resource from "../components/Resource/Index";

const SpendResource = () => {
    const { setIsKnobVisible } = useKnobVisibility();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return <Resource></Resource>;
};

export default SpendResource;
