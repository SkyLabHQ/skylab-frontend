import { Box, Img, Text } from "@chakra-ui/react";
import React, { FC, ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GameBackground from "../assets/game-background.png";
import GameFooter from "../assets/game-footer.png";
import DistanceInfo from "../assets/distance.png";
import CloseIcon from "../assets/distance-close.svg";

import { useKnobVisibility } from "../contexts/KnobVisibilityContext";

const Footer: FC<{ onQuit: () => void }> = ({ onQuit }) => {
    return (
        <Box userSelect="none">
            <Img
                pos="absolute"
                left="0"
                bottom="0"
                src={GameFooter}
                h="63vh"
                w="100vw"
                pointerEvents="none"
            />
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="40px"
                left="1vw"
                bottom="2vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onQuit}
            >
                Quit
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="30vw"
                minWidth="480px"
                fontSize="48px"
                left="35vw"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                Distance Info
            </Text>
        </Box>
    );
};

const Distance = (): ReactElement => {
    const { setIsKnobVisible } = useKnobVisibility();
    const navigate = useNavigate();

    const onQuit = () => {
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
                    onQuit();
                    break;
                case "c":
                    onQuit();
                    break;
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
            bgImage={GameBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            <Footer onQuit={onQuit} />
            <Img
                pos="absolute"
                left="2.5vw"
                top="6vh"
                src={DistanceInfo}
                h="70vh"
                w="95vw"
                pointerEvents="none"
            />
            <Img
                src={CloseIcon}
                width="43px"
                height="43px"
                right={"2.5vw"}
                top="79vh"
                pos="absolute"
                cursor={"pointer"}
                onClick={onQuit}
            ></Img>
        </Box>
    );
};

export default Distance;
