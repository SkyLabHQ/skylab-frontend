import { Box, HStack, Img, VStack, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

import WorkshopBg from "../../assets/cave-workshop.png";
import WorkshopTitle from "../../assets/cave-workshop-title.svg";
import Clear from "../../assets/cave-clear.svg";
import Confirm from "../../assets/cave-confirm.svg";
import ArrowDown from "../../assets/cave-arrow-down.svg";
import { Factory, config } from ".";

type Props = {
    selectedFactory: Factory[];
    onClear: () => void;
};

export const Workshop: FC<Props> = ({ onClear, selectedFactory }) => {
    const [nextLevelFactory, setNextLevelFactory] = useState<Factory>();

    const onConfirm = () => {
        if (selectedFactory.length !== 2) {
            return;
        }
        const level = selectedFactory[0].level;
        const factoryInfo = config.find((factory) => factory.level === level);
        const nextLevelFactoryInfo = config.find(
            (factory) => factory.level - 1 === level,
        );
        factoryInfo!.number -= 2;
        nextLevelFactoryInfo!.number += 1;
        setNextLevelFactory(undefined);
        onClear();
    };

    useEffect(() => {
        if (selectedFactory.length !== 2) {
            setNextLevelFactory(undefined);
            return;
        }
        const nextLevelFactoryInfo = config.find(
            (factory) => factory.level - 1 === selectedFactory[0].level,
        );
        setNextLevelFactory(nextLevelFactoryInfo);
    }, [selectedFactory]);

    return (
        <Box
            bgImg={WorkshopBg}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            w="40vw"
            h="77vh"
            ml="10vw"
            pos="relative"
            overflow="hidden"
            padding="72px 100px"
        >
            <Img src={WorkshopTitle} ml="28px" />
            <HStack spacing="24px">
                <VStack spacing="0" w="340px">
                    <HStack spacing="24px">
                        <Box
                            bg="#B5A6A3"
                            border="3px solid #F4F4F4"
                            boxShadow="inset 0px 4px 8px rgba(0, 0, 0, 0.45)"
                            borderRadius="10px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="120px"
                            h="120px"
                        >
                            {selectedFactory[0] ? (
                                <Img
                                    src={selectedFactory[0].img}
                                    maxW="110px"
                                    maxH="110px"
                                />
                            ) : null}
                        </Box>
                        <Text
                            fontFamily="Orbitron"
                            fontSize="96px"
                            color="#A06456"
                        >
                            +
                        </Text>
                        <Box
                            bg="#B5A6A3"
                            border="3px solid #F4F4F4"
                            boxShadow="inset 0px 4px 8px rgba(0, 0, 0, 0.45)"
                            borderRadius="10px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="120px"
                            h="120px"
                        >
                            {selectedFactory[1] ? (
                                <Img
                                    src={selectedFactory[1].img}
                                    maxW="110px"
                                    maxH="110px"
                                />
                            ) : null}
                        </Box>
                    </HStack>
                    <Text
                        fontFamily="Orbitron"
                        fontWeight="500"
                        fontSize="14px"
                        color="#636363"
                    >
                        Drag or click your two factories of the same level to
                        piece
                    </Text>
                </VStack>
                <VStack spacing="10px" alignItems="flex-start">
                    <HStack spacing="16px" cursor="pointer" onClick={onClear}>
                        <Img src={Clear} />
                        <Text
                            fontFamily="Orbitron"
                            fontWeight="500"
                            fontSize="24px"
                            color="#ED5B32"
                            textShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                        >
                            Clear
                        </Text>
                    </HStack>
                    <HStack
                        spacing="12px"
                        cursor={
                            selectedFactory.length !== 2
                                ? "not-allowed"
                                : "pointer"
                        }
                        onClick={onConfirm}
                    >
                        <Img src={Confirm} />
                        <Text
                            fontFamily="Orbitron"
                            fontWeight="500"
                            fontSize="24px"
                            color="#5ED9D7"
                            textShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                        >
                            Confirm
                        </Text>
                    </HStack>
                </VStack>
            </HStack>
            <Img src={ArrowDown} margin="0 0 8px 150px" />
            <VStack spacing="0" w="340px">
                <Box
                    bg="linear-gradient(180deg, #A06456 0%, #FEF561 99.99%, #FFF761 100%)"
                    border="3px solid #FFF761"
                    borderRadius="10px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="120px"
                    h="120px"
                >
                    {nextLevelFactory ? (
                        <Img
                            src={nextLevelFactory.img}
                            maxW="110px"
                            maxH="110px"
                        />
                    ) : null}
                </Box>
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="32px"
                    color="#2B2B2B"
                >
                    Level Up
                </Text>
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="14px"
                    color="#636363"
                >
                    Irrevocable after synthesis, the upgraded plant will have
                    different production capacity
                </Text>
            </VStack>
        </Box>
    );
};
