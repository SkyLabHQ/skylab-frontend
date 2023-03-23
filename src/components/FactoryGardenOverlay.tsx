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
import React, { FC, useEffect, useRef } from "react";
import styled from "@emotion/styled";

import CloseIcon from "../assets/close.svg";
import Opensea from "../assets/opensea.svg";
import Factory1 from "../assets/factory-1.svg";
import Factory2 from "../assets/factory-2.svg";
import Factory3 from "../assets/factory-3.svg";
import Factory4 from "../assets/factory-4.svg";
import Factory5 from "../assets/factory-5.svg";
import Factory6 from "../assets/factory-6.svg";
import Factory7 from "../assets/factory-7.svg";
import Factory8 from "../assets/factory-8.svg";
import GardenFront from "../assets/garden-front.png";
import { Cave } from "./Cave";

export type FactoryGardenOverlayProps = {
    level: number | undefined;
    onOverlayClose: () => void;
    toCave?: boolean;
};

const Overlay = styled(Box)`
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(7.5px);
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
    & {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    scroll-snap-type: y mandatory;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 900;
`;

const CloseButton = styled(Box)`
    width: 32px;
    height: 32px;
`;

const FACTORY_IMAGES = [
    Factory1,
    Factory2,
    Factory3,
    Factory4,
    Factory5,
    Factory6,
    Factory7,
    Factory8,
];

export const FactoryGardenOverlay: FC<FactoryGardenOverlayProps> = ({
    onOverlayClose,
    level,
    toCave,
}) => {
    const overlayRef = useRef<HTMLDivElement>();

    useEffect(() => {
        if (toCave) {
            setTimeout(() => {
                overlayRef.current?.scrollTo({
                    top: 2000,
                });
            }, 0);
        }
    }, [toCave]);

    const onMint = () => {
        window.open("https://opensea.io");
    };

    const onBack = () => {
        onOverlayClose();
    };

    if (!level) {
        return null;
    }

    return (
        <Portal>
            <Overlay pos="relative" ref={overlayRef as any}>
                <Box
                    w="100%"
                    h="100vh"
                    minH="900px"
                    pos="relative"
                    scrollSnapAlign="start"
                >
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
                        Factory
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
                    <Img
                        src={FACTORY_IMAGES[level - 1]}
                        maxH="54vh"
                        maxW="34vw"
                        pos="absolute"
                        top="26vh"
                        left="8vw"
                    />

                    <VStack
                        pos="absolute"
                        top="36vh"
                        left="40vw"
                        spacing="12vh"
                    >
                        <HStack
                            alignItems="flex-start"
                            justifyContent="space-between"
                            w="60vw"
                        >
                            <HStack spacing="16px">
                                <Box
                                    borderBottom="6px dashed #FFFFFF"
                                    w="7vw"
                                />
                                <Text
                                    fontFamily="Orbitron"
                                    fontWeight="500"
                                    fontSize="40px"
                                >
                                    Amount
                                </Text>
                            </HStack>
                            <HStack spacing="24px" w="27vw">
                                <Text fontFamily="Quantico" fontSize="24px">
                                    Total in Market:{" "}
                                    <Text
                                        color="#13FFDA"
                                        display="inline-block"
                                        textDecoration="underline"
                                    >
                                        6
                                    </Text>
                                </Text>
                            </HStack>
                        </HStack>
                        <HStack
                            alignItems="center"
                            justifyContent="space-between"
                            w="60vw"
                        >
                            <HStack spacing="16px">
                                <Box
                                    borderBottom="6px dashed #FFFFFF"
                                    w="7vw"
                                />
                                <Text
                                    fontFamily="Orbitron"
                                    fontWeight="500"
                                    fontSize="40px"
                                >
                                    Production
                                </Text>
                            </HStack>
                            <HStack spacing="24px" w="27vw">
                                <Text fontFamily="Quantico" fontSize="24px">
                                    Fuel Production Rate:{" "}
                                    <Text
                                        color="#13FFDA"
                                        display="inline-block"
                                        textDecoration="underline"
                                    >
                                        124 / day
                                    </Text>
                                </Text>
                            </HStack>
                        </HStack>
                    </VStack>
                    <Img
                        src={GardenFront}
                        w="100vw"
                        h="38vh"
                        pos="absolute"
                        left="0"
                        bottom="0"
                        pointerEvents="none"
                    />
                    <Button
                        colorScheme="white"
                        bg="white"
                        w="18vw"
                        h="9vh"
                        borderRadius="15px"
                        borderWidth="4px"
                        fontSize="48px"
                        pos="absolute"
                        right="5vw"
                        bottom="4vh"
                        onClick={onMint}
                        display="flex"
                        justifyContent="center"
                    >
                        <Img src={Opensea} w="56px" h="56px" mr="8px" />{" "}
                        Purchase
                    </Button>
                </Box>
                <Cave onBack={onBack} />
            </Overlay>
        </Portal>
    );
};
