import { Box, Text, Image, VStack, HStack } from "@chakra-ui/react";
import React, { FC, useRef } from "react";

import CountdownMark from "../../assets/aviation-4.svg";

type Props = {
    countdown: number;
    total: number;
};

export const Header: FC<Props> = ({ countdown, total }) => {
    const countdownContainerRef = useRef<HTMLDivElement>(null);

    const w =
        ((countdownContainerRef.current?.clientWidth ?? 0 - 12) * countdown) /
        total;
    const countdownText = countdown >= 10 ? countdown : `0${countdown}`;

    return (
        <HStack
            pos="absolute"
            top="0"
            padding="0 40px"
            w="100%"
            userSelect="none"
            spacing="32px"
        >
            <Text
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
                fontSize="64px"
                pt="20px"
                lineHeight="1"
                css={{
                    "-webkit-text-stroke": "3px #51A2A2;",
                }}
            >
                Level 4
            </Text>
            <Box flex="1" marginTop="20px !important" position="relative">
                <Box
                    ref={countdownContainerRef}
                    height="32px"
                    bg="rgba(217, 217, 217, 0.3)"
                    border="4px solid #6CAEAD"
                />
                <Box
                    height="20px"
                    w={`${w}px`}
                    bg="linear-gradient(270deg, #77D8D6 50%, #77D8D6 107.76%)"
                    position="absolute"
                    right="6px"
                    top="6px"
                />
                <Image
                    src={CountdownMark}
                    w="150px"
                    h="90px"
                    position="absolute"
                    right={`${w - 60}px`}
                    top="-30px"
                />
            </Box>

            <VStack spacing="-8px" alignItems="flex-start">
                <Text
                    color="white"
                    fontFamily="Quantico"
                    fontSize="36px"
                    lineHeight="1"
                >
                    Earth Time
                </Text>
                <Text
                    color="white"
                    fontFamily="Orbitron"
                    fontWeight="600"
                    fontSize="48px"
                    css={{
                        "-webkit-text-stroke": "3px #51A2A2;",
                    }}
                    lineHeight="1"
                >
                    00:{countdownText}
                </Text>
            </VStack>
        </HStack>
    );
};
