import {
    Box,
    Text,
    HStack,
    Img,
    Portal,
    VStack,
    Input,
    Button,
} from "@chakra-ui/react";
import React, { FC } from "react";
import styled from "@emotion/styled";

import CloseIcon from "../../assets/close.svg";
import Opensea from "../../assets/opensea.svg";
import Aviation1 from "../../assets/aviation-1.svg";
import Aviation2 from "../../assets/aviation-2.svg";
import Aviation3 from "../../assets/aviation-3.svg";
import Aviation4 from "../../assets/aviation-4.svg";
import Aviation5 from "../../assets/aviation-5.svg";
import Aviation6 from "../../assets/aviation-6.svg";
import Aviation7 from "../../assets/aviation-7.svg";
import AviationStory from "../../assets/aviation-story.svg";
import AviationMint from "../../assets/aviation-mint.svg";
import AviationCollide from "../../assets/aviation-collide.svg";
import { AviationBoard } from "./AviationBoard";
import { PilotBoard } from "./PilotBoard";

export type AviationGardenOverlayProps = {
    level: number | undefined;
    onOverlayClose: () => void;
};

const Overlay = styled(Box)`
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(7.5px);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 900;
`;

const CloseButton = styled(Box)`
    width: 32px;
    height: 32px;
`;

const AVIATION_IMAGES = [
    Aviation1,
    Aviation2,
    Aviation3,
    Aviation4,
    Aviation5,
    Aviation6,
    Aviation7,
];

const tempInput = (
    <HStack spacing="8px">
        <Text fontFamily="Quantico" fontSize="24px">
            Load Fuel
        </Text>
        <Box pos="relative">
            <Input
                variant="unstyled"
                borderRadius="none"
                w="3vw"
                fontSize="32px"
                textAlign="center"
            />
            <Box
                pos="absolute"
                left="0"
                bottom="0"
                w="3vw"
                h="2vh"
                bg="linear-gradient(180deg, rgba(19, 255, 218, 0) 51.56%, #13FFDA 100%)"
                pointerEvents="none"
            />
        </Box>
        <Button variant="outline" colorScheme="teal">
            Confirm
        </Button>
    </HStack>
);

export const AviationGardenOverlay: FC<AviationGardenOverlayProps> = ({
    onOverlayClose,
    level,
}) => {
    if (!level) {
        return null;
    }

    const isLevel1 = level === 1;

    const onMint = () => {
        window.open("https://opensea.io");
    };

    return (
        <Portal>
            <Overlay pos="relative">
                <Text
                    fontFamily="Orbitron"
                    fontWeight="700"
                    fontSize="48px"
                    color="#FFF761"
                    pos="relative"
                    top="6vh"
                    left="40px"
                    w="fit-content"
                >
                    Aviation
                </Text>
                <HStack pos="relative" top="6vh" spacing="20px">
                    <Box border="1px solid #FFFFFF" flex="1" />
                    <CloseButton
                        onClick={onOverlayClose}
                        bgImage={CloseIcon}
                        top="0"
                        cursor="pointer"
                    />
                    <Box border="1px solid #FFFFFF" w="2vw" />
                </HStack>
                <HStack
                    spacing="30px"
                    h="68vh"
                    w="90vw"
                    top="10vh"
                    pos="relative"
                    left="5vw"
                >
                    <Box flex="1" h="100%">
                        <AviationBoard level={level} />
                    </Box>
                    {isLevel1 ? (
                        <Box w="22vw" h="100%">
                            <PilotBoard />
                        </Box>
                    ) : null}
                    <VStack
                        w="24vw"
                        h="100%"
                        spacing={isLevel1 ? "32px" : "100px"}
                    >
                        <Box>
                            <Img src={AviationStory} w="100%" />
                            <Box
                                bg="rgba(0, 0, 0, 0.3)"
                                border="5px solid #FFF761"
                                backdropFilter="blur(5px)"
                                borderRadius="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                h="26vh"
                                w="100%"
                                mt="24px"
                            >
                                <Img
                                    src={AVIATION_IMAGES[level - 1]}
                                    maxH="22vh"
                                />
                            </Box>
                        </Box>
                        <Button
                            colorScheme="white"
                            bg="white"
                            w="100%"
                            h="initial"
                            borderRadius="15px"
                            paddingTop="4px"
                            paddingBottom="4px"
                            fontSize="32px"
                            onClick={onMint}
                        >
                            <Img src={Opensea} w="50px" h="50px" mr="8px" />{" "}
                            OpenSea
                        </Button>
                        {isLevel1 ? (
                            <HStack spacing="16px" w="100%">
                                <VStack
                                    spacing="4px"
                                    h="15vh"
                                    padding="10px 0"
                                    bg="rgba(100, 51, 51, 0.25)"
                                    border="5px dashed #FFF761"
                                    borderRadius="10px"
                                    cursor="pointer"
                                    flexBasis="50%"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                >
                                    <Img maxW="80%" src={AviationMint} />
                                    <Text
                                        fontFamily="Orbitron"
                                        fontSize="36px"
                                        color="#FFF761"
                                    >
                                        Mint
                                    </Text>
                                </VStack>
                                <VStack
                                    spacing="12px"
                                    h="15vh"
                                    padding="10px 0"
                                    bg="rgba(36, 87, 98, 0.25)"
                                    border="5px dashed #FFFFFF"
                                    borderRadius="10px"
                                    cursor="pointer"
                                    flexBasis="50%"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                >
                                    <Img maxW="80%" src={AviationCollide} />
                                    <Text
                                        fontFamily="Orbitron"
                                        fontSize="36px"
                                        color="#13FFDA"
                                    >
                                        Collide
                                    </Text>
                                </VStack>
                            </HStack>
                        ) : null}
                    </VStack>
                </HStack>
            </Overlay>
        </Portal>
    );
};
