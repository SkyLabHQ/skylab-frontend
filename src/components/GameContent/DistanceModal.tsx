import { Box, Img, Modal, Text } from "@chakra-ui/react";
import React, { FC, ReactElement, useEffect } from "react";

import GameBackground from "@/assets/game-background.png";
import GameFooter from "@/assets/game-footer.png";
import DistanceInfo from "@/assets/distance.png";
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
                Distance Info
            </Text>
        </Box>
    );
};

const DistanceModal = ({
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
                    onClick={onClose}
                ></Img>
            </Box>
        </Modal>
    );
};

export default DistanceModal;
