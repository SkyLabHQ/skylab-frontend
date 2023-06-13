import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import { useGameContext } from "@/pages/Game";
import { Box, Text, Image, VStack, HStack } from "@chakra-ui/react";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import useCountDown from "react-countdown-hook";

type Props = {
    countdown?: number;
    total?: number;
    level?: number;
};

const total = 60 * 13 * 1000;

export const Header: FC<Props> = () => {
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const { level, myInfo, tokenId } = useGameContext();
    const [timeLeft, { start, pause, resume, reset }] = useCountDown(0, 1000);
    const countdownContainerRef = useRef<HTMLDivElement>(null);

    const getGameTime = async () => {
        let time = await skylabGameFlightRaceContract.timeout(tokenId);
        time = time.toNumber();
        console.log(time, "time");
        start(
            time * 1000 > Math.floor(Date.now())
                ? time * 1000 - Math.floor(Date.now())
                : 0,
        );
    };
    const minutes = useMemo(() => {
        const time = Math.floor(timeLeft / 60000);
        if (time < 10) {
            return `0${time}`;
        }
        return time;
    }, [timeLeft]);

    const second = useMemo(() => {
        const time = Math.floor((timeLeft / 1000) % 60);
        if (time < 10) {
            return `0${time}`;
        }
        return time;
    }, [timeLeft]);

    const w = (timeLeft / total) * 100;

    useEffect(() => {
        if (!tokenId || !skylabGameFlightRaceContract) {
            return;
        }
        getGameTime();
    }, [tokenId, skylabGameFlightRaceContract]);

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
                Level {level}
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
                    w={`${w}%`}
                    bg="linear-gradient(270deg, #77D8D6 50%, #77D8D6 107.76%)"
                    position="absolute"
                    right="6px"
                    top="6px"
                />
                <Image
                    src={myInfo.img}
                    w="150px"
                    h="90px"
                    position="absolute"
                    right={`${w}%`}
                    transform={"translateX(30px)"}
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
                    {minutes}:{second}
                </Text>
            </VStack>
        </HStack>
    );
};
