import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { FC } from "react";

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
    const selectedFactory = allSelectedFactory[caveLevel];

    const isDisabled = (factory: Factory) => {
        const remainingFactoryNumber = getRemainingFactoryNumber({
            allSelectedFactory,
            factoryInfo,
            level: factory.level,
        });
        if (caveLevel === 1) {
            return (
                selectedFactory.length >= 2 ||
                remainingFactoryNumber < 2 ||
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
        setSelectedFactory([...selectedFactory, factory]);
    };

    return (
        <Box
            bg="rgba(104, 62, 53, 0.25)"
            border="5px solid #FFF761"
            backdropFilter="blur(5px)"
            borderRadius="20px"
            w="32vw"
            h="60vh"
        >
            <Box
                padding="24px 32px"
                bg="linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFF761 100%)"
            >
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="36px"
                    color="#FFF761"
                >
                    Your Factories
                </Text>
            </Box>
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
                    {factoryInfo
                        .reduce((prev: Factory[], curr) => {
                            if (
                                !prev.find((item) => item.level === curr.level)
                            ) {
                                prev.push(curr);
                            }
                            return prev;
                        }, [])
                        .map((item) => (
                            <VStack spacing={0} flexBasis="33.33%" w="100%">
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px solid rgba(255, 247, 97, 0.3)"
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
                                    fontSize="24px"
                                    color="#FFF761"
                                    border="2px solid rgba(255, 247, 97, 0.3)"
                                    w="100%"
                                    h="60px"
                                >
                                    X{getFactoryNumber(item)}
                                </Box>
                            </VStack>
                        ))}
                </HStack>
            </Box>
        </Box>
    );
};
