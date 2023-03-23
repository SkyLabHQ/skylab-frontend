import { VStack, Box, Img, HStack, Button, Text } from "@chakra-ui/react";
import React, { FC } from "react";

import Opensea from "../../assets/opensea.svg";
import AviationStory from "../../assets/aviation-story.svg";
import AviationMint from "../../assets/aviation-mint.svg";
import AviationCollide from "../../assets/aviation-collide.svg";
import Aviation1 from "../../assets/aviation-1.svg";
import Aviation1Pilot from "../../assets/aviation-1-pilot.svg";
import { AviationInfo } from ".";

type Props = {
    level: number;
    selectedAviation: AviationInfo[];
    setSelectedAviation: (selectedAviation: AviationInfo[]) => void;
};

const onMint = () => {
    window.open("https://opensea.io");
};

export const Level1ActionBoard: FC<Props> = ({ selectedAviation }) => {
    return (
        <VStack w="24vw" h="100%" spacing="32px">
            <Box w="100%">
                <Img src={AviationStory} w="100%" />
                <HStack
                    bg="rgba(0, 0, 0, 0.3)"
                    border="5px solid #FFF761"
                    backdropFilter="blur(5px)"
                    borderRadius="20px"
                    h="26vh"
                    w="100%"
                    mt="24px"
                    padding="16px"
                >
                    <VStack
                        flexBasis="49.5%"
                        pos="relative"
                        h="100%"
                        justifyContent="center"
                    >
                        <Text
                            fontFamily="Orbitron"
                            fontSize="36px"
                            color="white"
                            pos="absolute"
                            left="0"
                            top="0"
                        >
                            X3
                        </Text>
                        <Img src={Aviation1} maxH="22vh" />
                    </VStack>
                    <Box
                        h="100%"
                        flexBasis="1%"
                        backgroundColor="rgba(255, 245, 48, 0.6)"
                    />
                    <VStack
                        flexBasis="49.5%"
                        pos="relative"
                        h="100%"
                        justifyContent="center"
                    >
                        <Text
                            fontFamily="Orbitron"
                            fontSize="36px"
                            color="white"
                            pos="absolute"
                            left="0"
                            top="0"
                        >
                            X9
                        </Text>
                        <Img src={Aviation1Pilot} maxH="22vh" />
                    </VStack>
                </HStack>
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
                <Img src={Opensea} w="50px" h="50px" mr="8px" /> OpenSea
            </Button>
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
                    <Text fontFamily="Orbitron" fontSize="36px" color="#FFF761">
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
                    <Text fontFamily="Orbitron" fontSize="36px" color="#13FFDA">
                        Collide
                    </Text>
                </VStack>
            </HStack>
        </VStack>
    );
};

export const ActionBoard: FC<Props> = ({ level, selectedAviation }) => {
    return (
        <VStack w="24vw" h="100%" spacing="32px">
            <Box w="100%">
                <Text fontFamily="Orbitron" fontSize="40px" color="#FFF761">
                    Level {level}
                </Text>
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
                    <Img src={selectedAviation[0]?.img} maxH="22vh" />
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
                <Img src={Opensea} w="50px" h="50px" mr="8px" /> OpenSea
            </Button>
            <HStack spacing="16px" w="100%">
                <VStack
                    spacing="12px"
                    h="15vh"
                    padding="10px 0"
                    bg="rgba(36, 87, 98, 0.25)"
                    border="5px dashed #FFFFFF"
                    borderRadius="10px"
                    cursor="pointer"
                    flexBasis={"100%"}
                    justifyContent="flex-end"
                    alignItems="center"
                >
                    <Img maxW="80%" src={AviationCollide} />
                    <Text fontFamily="Orbitron" fontSize="36px" color="#13FFDA">
                        Collide
                    </Text>
                </VStack>
            </HStack>
        </VStack>
    );
};
