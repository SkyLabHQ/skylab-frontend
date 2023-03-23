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

    const onSkip = () => {
        navigate("/game");
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "Escape":
                    onSkip();
                    break;
                case "ArrowLeft":
                    onBack();
                    break;
                case "ArrowRight":
                    onOk();
                    break;
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [step]);

    return (
        <TutorialStep
            onOk={onOk}
            onBack={onBack}
            onSkip={onSkip}
            config={config}
        />
    );
};

export default Tutorial;
