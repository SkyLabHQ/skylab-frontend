import React, { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import { configs } from "../components/TutorialStep/config";
import { TutorialStep } from "../components/TutorialStep";

const Tutorial = (): ReactElement => {
    const [step, setStep] = useState(0);
    const { setIsKnobVisible } = useKnobVisibility();
    const navigate = useNavigate();

    const config = configs[step];

    const onOk = () => {
        if (step >= configs.length - 1) {
            navigate("/game");
        }
        setStep((val) => val + 1);
    };

    const onBack = () => {
        if (step <= 0) {
            navigate("/game");
        }
        setStep((val) => val - 1);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    });

    return <TutorialStep onOk={onOk} onBack={onBack} config={config} />;
};

export default Tutorial;
