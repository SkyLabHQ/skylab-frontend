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

import CloseIcon from "../assets/close.svg";
import Fuel from "../assets/fuel.svg";
import Shield from "../assets/shield.svg";
import Factory1 from "../assets/factory-garden-1.svg";
import Factory2 from "../assets/factory-garden-2.svg";
import Factory3 from "../assets/factory-garden-3.svg";
import Factory4 from "../assets/factory-garden-4.svg";
import Factory5 from "../assets/factory-garden-5.svg";
import Factory6 from "../assets/factory-garden-6.svg";
import Factory7 from "../assets/factory-7.svg";
import Factory8 from "../assets/factory-8.svg";

export type FactoryGardenOverlayProps = {
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
}) => {
    if (!level) {
        return null;
    }

    return (
        <Portal>
            <Overlay pos="relative">
                <HStack pos="relative" top="16vh" spacing="20px">
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
                    left="14vw"
                />

                <VStack pos="absolute" top="34vh" left="40vw" spacing="14vh">
                    <HStack
                        alignItems="flex-start"
                        justifyContent="space-between"
                        w="51vw"
                    >
                        <HStack spacing="16px">
                            <Box borderBottom="6px dashed #FFFFFF" w="7vw" />
                            <Text
                                fontFamily="Orbitron"
                                fontWeight="500"
                                fontSize="40px"
                            >
                                Security
                            </Text>
                        </HStack>
                        <HStack spacing="24px" w="25vw">
                            <Img src={Shield} w="6vw" />
                            <VStack spacing="16px" alignItems="start">
                                <Text fontFamily="Quantico" fontSize="24px">
                                    # Of Shields in Use:{" "}
                                    <Text
                                        color="#13FFDA"
                                        display="inline-block"
                                        textDecoration="underline"
                                    >
                                        127
                                    </Text>
                                </Text>
                                <Text fontFamily="Quantico" fontSize="24px">
                                    Total Shields in Bag:{" "}
                                    <Text
                                        color="#13FFDA"
                                        display="inline-block"
                                        textDecoration="underline"
                                    >
                                        241
                                    </Text>
                                </Text>
                                <HStack spacing="8px">
                                    <Text fontFamily="Quantico" fontSize="24px">
                                        Add Shields:
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
                                    <Button
                                        variant="outline"
                                        colorScheme="teal"
                                    >
                                        Confirm
                                    </Button>
                                </HStack>
                            </VStack>
                        </HStack>
                    </HStack>
                    <HStack
                        alignItems="flex-start"
                        justifyContent="space-between"
                        w="51vw"
                    >
                        <HStack spacing="16px">
                            <Box borderBottom="6px dashed #FFFFFF" w="7vw" />
                            <Text
                                fontFamily="Orbitron"
                                fontWeight="500"
                                fontSize="40px"
                            >
                                Production
                            </Text>
                        </HStack>
                        <HStack spacing="24px" w="25vw">
                            <Img src={Fuel} w="6vw" />
                            <VStack spacing="16px" alignItems="start">
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
                                <HStack spacing="8px">
                                    <Text fontFamily="Quantico" fontSize="24px">
                                        Fuel Produced:{" "}
                                        <Text
                                            color="#13FFDA"
                                            display="inline-block"
                                            textDecoration="underline"
                                        >
                                            34
                                        </Text>
                                    </Text>
                                    <Button
                                        variant="outline"
                                        colorScheme="teal"
                                    >
                                        Harvest
                                    </Button>
                                </HStack>
                            </VStack>
                        </HStack>
                    </HStack>
                </VStack>
            </Overlay>
        </Portal>
    );
};
