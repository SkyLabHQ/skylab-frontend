import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import { Box, Img, Modal, Text } from "@chakra-ui/react";
import React, { FC, ReactElement, useEffect, useState } from "react";

import GameBackground from "@/assets/game-background.png";
import GameFooter from "@/assets/game-footer.png";
import { TutorialStep } from "../TutorialStep";
import { useNavigate } from "react-router-dom";
import { configs } from "../TutorialStep/config";

const TutorialModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}): ReactElement => {
    const [step, setStep] = useState(0);

    const config = configs[step];

    const onOk = () => {
        if (step >= configs.length - 1) {
            onClose();
        }
        setStep((val) => val + 1);
    };

    const onBack = () => {
        if (step <= 0) {
            onClose();
        }
        setStep((val) => val - 1);
    };

    const onSkip = () => {
        onClose();
    };

    useEffect(() => {
        const gameStepFromStorage = localStorage.getItem("game-step");
        if (gameStepFromStorage) {
            switch (gameStepFromStorage) {
                case "3":
                    setStep(
                        configs.findIndex(
                            (config) => config.section === "presetting",
                        ),
                    );
                    break;
                case "4":
                    setStep(
                        configs.findIndex(
                            (config) => config.section === "driving",
                        ),
                    );
                    break;
                default:
                    setStep(
                        configs.findIndex(
                            (config) => config.section === "confirm",
                        ),
                    );
            }
        }
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
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <Box>
                <TutorialStep
                    onOk={onOk}
                    onBack={onBack}
                    onSkip={onSkip}
                    config={config}
                />
            </Box>
        </Modal>
    );
};

export default TutorialModal;
