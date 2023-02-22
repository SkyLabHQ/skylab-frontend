import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { FC } from "react";

import { config, Factory } from ".";

type Props = {
    caveLevel: number;
    selectedFactory: Factory[];
    setSelectedFactory: (factory: Factory[]) => void;
};

export const FactoryBoard: FC<Props> = ({
    caveLevel,
    selectedFactory,
    setSelectedFactory,
}) => {
    const isDisabled = (factory: Factory) => {
        if (caveLevel === 1) {
            return (
                selectedFactory.length >= 2 ||
                factory.number < 2 ||
                (selectedFactory.length > 0 &&
                    factory.level !== selectedFactory[0]?.level)
            );
        } else {
            return selectedFactory.length >= 3;
        }
    };

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
                    {config.map((item) => (
                        <VStack spacing={0} flexBasis="33.33%" w="100%">
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                border="2px solid rgba(255, 247, 97, 0.3)"
                                w="100%"
                                h="160px"
                                cursor={
                                    isDisabled(item) ? "not-allowed" : "pointer"
                                }
                                onClick={
                                    isDisabled(item)
                                        ? undefined
                                        : () => onSelectFactory(item)
                                }
                            >
                                <Img maxW="150px" maxH="150px" src={item.img} />
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
                                X{item.number}
                            </Box>
                        </VStack>
                    ))}
                </HStack>
            </Box>
        </Box>
    );
};
