import { Box, Img, Text } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CollideBackground from "../assets/collide.png";
import TutorialIcon from "../assets/icon-tutorial.svg";
import { useGameContext } from "../pages/Game";

type Props = {};

export const Collide: FC<Props> = ({}) => {
    const navigate = useNavigate();
    const { onNext, level } = useGameContext();

    const redirectToTutorial = () => navigate("/tutorial");

    const onQuit = () => {
        navigate("/garden");
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "t") {
                redirectToTutorial();
            }
            if (key === "Esc") {
                onQuit();
            }
            if (key === "Enter" && event.shiftKey) {
                onNext();
            }
        };

        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);

    return (
        <Box
            pos="relative"
            bgImage={CollideBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
        >
            <Box
                pos="absolute"
                left="24px"
                top="24px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                cursor="pointer"
                onClick={redirectToTutorial}
            >
                <Img src={TutorialIcon} w="60px" />
            </Box>
            <Text
                textAlign="center"
                pos="absolute"
                width="13vw"
                minWidth="100px"
                fontSize="40px"
                left="0.5vw"
                bottom="2vh"
                color="#BEBEC0"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onQuit}
            >
                Quit
            </Text>
            {level ? (
                <Text
                    textAlign="center"
                    pos="absolute"
                    width="12vw"
                    minWidth="100px"
                    fontSize="48px"
                    left="44vw"
                    bottom="4vh"
                    color="#FFFFFF"
                    fontFamily="Orbitron"
                    fontWeight="400"
                    onClick={onQuit}
                >
                    Level {level}
                </Text>
            ) : null}
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="1vw"
                bottom="2vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onNext}
            >
                Next
            </Text>
        </Box>
    );
};
