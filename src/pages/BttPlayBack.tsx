import BttHelmet from "@/components/Helmet/BttHelmet";
import BttPlayBackPage from "@/components/BttPlayBack";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import React, { useEffect } from "react";

const BttPlayBack = () => {
    const { setIsKnobVisible } = useKnobVisibility();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return (
        <>
            <BttHelmet></BttHelmet>
            <BttPlayBackPage></BttPlayBackPage>
        </>
    );
};

export default BttPlayBack;
