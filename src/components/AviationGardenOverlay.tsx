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
import Diamond from "../assets/diamond.svg";
import Aviation1 from "../assets/aviation-1.svg";
import Aviation2 from "../assets/aviation-2.svg";
import Aviation3 from "../assets/aviation-3.svg";
import Aviation4 from "../assets/aviation-4.svg";
import Aviation5 from "../assets/aviation-5.svg";
import Aviation6 from "../assets/aviation-6.svg";
import Aviation7 from "../assets/aviation-7.svg";

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

export const AviationGardenOverlay: FC<AviationGardenOverlayProps> = ({
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
                    src={AVIATION_IMAGES[level - 1]}
                    h="37vh"
                    pos="absolute"
                    top="28vh"
                    right="60vw"
                />
                <Box pos="absolute" top="22vh" left="44vw">
                    <Text
                        fontFamily="Orbitron"
                        fontWeight="500"
                        fontSize="40px"
                        mb="32px"
                    >
                        The story
                    </Text>
                    <Text
                        fontFamily="Quantico"
                        fontSize="24px"
                        mb="24px"
                        maxW="45vw"
                    >
                        dewijbebewibibecbecbebceicbiscbnjinjkcbjskdbcsjkbsbfksdjfbjsdbfjsdbfefebfuebhsdbfbdsbfbchbjeksbckjbdsjkcbsjbbeskcbsjbcjsjcosjncjnjdewijbebewibibecbecbebceicbiscbnjinjkcbjskdbcsjkbsbfksdjfbjsdbfjsdbfefebfuebhsdbfbdsbfbchbjeksbckjbdsjkcbsjbbeskcbsjbcjsjcosjncjnj
                    </Text>
                    <Text
                        fontFamily="Orbitron"
                        fontWeight="500"
                        fontSize="40px"
                        mb="32px"
                    >
                        Load
                    </Text>
                    <HStack spacing="40px">
                        <Img src={Fuel} />
                        <VStack spacing="10px" alignItems="start">
                            <Text fontFamily="Quantico" fontSize="24px">
                                You Have{" "}
                                <Text color="#13FFDA" display="inline-block">
                                    188
                                </Text>{" "}
                                Fuel
                            </Text>
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
                            <Text fontFamily="Quantico" fontSize="18px">
                                Only 10 Fuel Can Be Added
                            </Text>
                        </VStack>
                    </HStack>
                    <HStack spacing="40px">
                        <Img src={Diamond} />
                        <VStack spacing="10px" alignItems="start">
                            <Text fontFamily="Quantico" fontSize="24px">
                                You Have{" "}
                                <Text color="#13FFDA" display="inline-block">
                                    320
                                </Text>{" "}
                                Battery
                            </Text>
                            <HStack spacing="8px">
                                <Text fontFamily="Quantico" fontSize="24px">
                                    Load Battery
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
                            <Text fontFamily="Quantico" fontSize="18px">
                                Only 29 Battery Can Be Added
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
                <Button
                    variant="outline"
                    w="13vw"
                    h="9vh"
                    borderRadius="15px"
                    borderWidth="4px"
                    fontSize="48px"
                    pos="absolute"
                    right="5vw"
                    bottom="4vh"
                >
                    Collide
                </Button>
            </Overlay>
        </Portal>
    );
};
