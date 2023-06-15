import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import { Box, Img, Modal, Text } from "@chakra-ui/react";
import React, { FC, ReactElement, useEffect } from "react";

import GameBackground from "@/assets/game-background.png";
import GameFooter from "@/assets/game-footer.png";
import KeyboardControl from "@/assets/keyboard.png";
import CloseIcon from "@/assets/distance-close.svg";

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
                Keyboard Control
            </Text>
        </Box>
    );
};

const KeyboardModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}): ReactElement => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <Box
                pos={"absolute"}
                left={0}
                top={0}
                zIndex={1000}
                bgImage={GameBackground}
                bgRepeat="no-repeat"
                height="100vh"
                w={"100vw"}
                bgSize="100% 100%"
                overflow="hidden"
            >
                <Footer onQuit={onClose} />
                <Box
                    pos="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    top="6vh"
                    h="70vh"
                    w="90vw"
                >
                    <Img src={KeyboardControl} w="100%" />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Img
                            onClick={onClose}
                            src={CloseIcon}
                            sx={{
                                cursor: "pointer",
                            }}
                            width="50px"
                            marginTop={"1.5vh"}
                            cursor="pointer"
                        ></Img>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default KeyboardModal;
