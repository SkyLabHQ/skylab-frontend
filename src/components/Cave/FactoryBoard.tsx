import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { FC, useMemo, useState } from "react";

import Fuel from "../../assets/icon-fuel.svg";
import Battery from "../../assets/icon-battery.svg";
import Back from "../../assets/icon-back-yellow.svg";
import { Factory, useFactoryInfo } from ".";

type Props = {
    caveLevel: number;
    allSelectedFactory: Record<number, Factory[]>;
    setSelectedFactory: (factory: Factory[]) => void;
};

const getRemainingFactoryNumber = ({
    allSelectedFactory,
    factoryInfo,
    level,
}: {
    allSelectedFactory: Record<number, Factory[]>;
    factoryInfo: Factory[];
    level: number;
}) => {
    const totalNumber = factoryInfo.filter(
        (item) => item.level === level,
    ).length;
    const selectedNumber =
        allSelectedFactory[1].filter((item) => item.level === level).length +
        allSelectedFactory[2].filter((item) => item.level === level).length;
    return totalNumber - selectedNumber;
};

export const FactoryBoard: FC<Props> = ({
    caveLevel,
    allSelectedFactory,
    setSelectedFactory,
}) => {
    const factoryInfo = useFactoryInfo();
    const [selectedLevel, setSelectedLevel] = useState<number>();
    const selectedFactory = allSelectedFactory[caveLevel];

    const filteredFactory = useMemo(() => {
        if (selectedLevel) {
            return factoryInfo.filter(
                (factory) => factory.level === selectedLevel,
            );
        }
        return factoryInfo;
    }, [selectedLevel]);

    const isDisabled = (factory: Factory) => {
        const remainingFactoryNumber = getRemainingFactoryNumber({
            allSelectedFactory,
            factoryInfo,
            level: factory.level,
        });
        if (caveLevel === 1) {
            return (
                selectedFactory.length >= 2 ||
                remainingFactoryNumber < 1 ||
                !!selectedFactory.find((item) => item.id === factory.id) ||
                (selectedFactory.length > 0 &&
                    factory.level !== selectedFactory[0]?.level)
            );
        }

        return selectedFactory.length >= 3 || remainingFactoryNumber <= 0;
    };

    const getFactoryNumber = (factory: Factory) =>
        getRemainingFactoryNumber({
            allSelectedFactory,
            factoryInfo,
            level: factory.level,
        });

    const onSelectFactory = (factory: Factory) => {
        console.log(selectedFactory, selectedLevel, factory);
        if (selectedLevel) {
            setSelectedFactory([...selectedFactory, factory]);
            return;
        }
        setSelectedLevel(factory.level);
    };

    return (
        <Box
            bg={
                selectedLevel
                    ? "rgba(104, 121, 131, 0.25)"
                    : "rgba(104, 62, 53, 0.25)"
            }
            border={selectedLevel ? "5px solid #FFFFFF" : "5px solid #FFF761"}
            borderRadius="20px"
            w="32vw"
            h="60vh"
        >
            <HStack
                padding="24px 32px"
                bg={
                    selectedLevel
                        ? "linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFFFFF 100%)"
                        : "linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFF761 100%)"
                }
                onClick={() => setSelectedLevel(undefined)}
            >
                {selectedLevel ? <Img src={Back} /> : null}
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="32px"
                    color={selectedLevel ? "white" : "#FFF761"}
                >
                    {selectedLevel
                        ? `Your Level ${selectedLevel} Factories`
                        : "Your Factories"}
                </Text>
            </HStack>
            <Box padding="20px">
                <HStack
                    spacing={0}
                    alignItems="flex-start"
                    flexWrap="wrap"
                    overflowY="scroll"
                    h="440px"
                    css={css`
                        &::-webkit-scrollbar {
                            display: none;
                        }
                        & {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}
                >
                    {filteredFactory
                        .reduce((prev: Factory[], curr) => {
                            if (
                                !prev.find(
                                    (item) => item.level === curr.level,
                                ) ||
                                selectedLevel
                            ) {
                                prev.push(curr);
                            }
                            return prev;
                        }, [])
                        .map((item) => (
                            <VStack
                                spacing={0}
                                flexBasis="33.33%"
                                w="100%"
                                key={item.id}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    border={
                                        selectedLevel
                                            ? "2px solid rgba(255, 255, 255, 0.3)"
                                            : "2px solid rgba(255, 247, 97, 0.3)"
                                    }
                                    w="100%"
                                    h="160px"
                                    cursor={
                                        isDisabled(item)
                                            ? "not-allowed"
                                            : "pointer"
                                    }
                                    onClick={
                                        isDisabled(item)
                                            ? undefined
                                            : () => onSelectFactory(item)
                                    }
                                >
                                    <Img
                                        maxW="130px"
                                        maxH="110px"
                                        src={item.img}
                                    />
                                    <Text
                                        mt="4px"
                                        fontSize="24px"
                                        fontFamily="Orbitron"
                                    >
                                        Level {item.level}
                                    </Text>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontFamily="Orbitron"
                                    fontSize={selectedLevel ? "16px" : "24px"}
                                    border={
                                        selectedLevel
                                            ? "2px solid rgba(255, 255, 255, 0.3)"
                                            : "2px solid rgba(255, 247, 97, 0.3)"
                                    }
                                    w="100%"
                                    h="60px"
                                >
                                    {selectedLevel ? (
                                        <VStack
                                            spacing="0"
                                            alignItems="flex-start"
                                        >
                                            <Text color="white">
                                                Output Per Day:
                                            </Text>
                                            <HStack
                                                alignItems="space-between"
                                                justifyContent="center"
                                            >
                                                <HStack spacing="4px">
                                                    <Text
                                                        color="#FFF761"
                                                        textDecor="underline"
                                                    >
                                                        {item.dailyFuelOutput}
                                                    </Text>
                                                    <Img w="32px" src={Fuel} />
                                                </HStack>
                                                <HStack spacing="4px">
                                                    <Text
                                                        color="#FFF761"
                                                        textDecor="underline"
                                                    >
                                                        {
                                                            item.dailyBatteryOutput
                                                        }
                                                    </Text>
                                                    <Img
                                                        w="32px"
                                                        src={Battery}
                                                    />
                                                </HStack>
                                            </HStack>
                                        </VStack>
                                    ) : (
                                        <Text color="#FFF761">
                                            X{getFactoryNumber(item)}
                                        </Text>
                                    )}
                                </Box>
                            </VStack>
                        ))}
                </HStack>
            </Box>
        </Box>
    );
};
