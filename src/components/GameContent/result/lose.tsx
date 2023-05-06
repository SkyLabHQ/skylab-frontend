import { Box, Text, Image, Img } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";

import GameBackground from "../../../assets/game-background.png";
import GameFooter from "../../../assets/game-footer.png";
import Aviation from "../../../assets/aviation-4.svg";
import { useGameContext } from "../../../pages/Game";
import { ResultMap } from "../map";
import { generateLoseText } from "../utils";
import { Info } from "./info";

type Props = {};

const Footer: FC<{ onNext: () => void }> = ({ onNext }) => {
    const text = generateLoseText({
        myLevel: 4,
        myBattery: 15,
        myFuel: 100000,
        opponentLevel: 3,
        opponentBattery: 10,
        opponentFuel: 12,
    });
    return (
        <Box userSelect="none">
            <Img
                pos="absolute"
                left="0"
                bottom="0"
                src={GameFooter}
                h="63vh"
                w="100vw"
                pointerEvents="none"
            />
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="40px"
                left="1vw"
                bottom="2vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    onNext();
                }}
            >
                Home
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="30vw"
                minWidth="480px"
                fontSize="48px"
                left="35vw"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                Try it next time!
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="0.5vw"
                bottom="2vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        text,
                    )}`}
                >
                    Share
                </a>
            </Text>
        </Box>
    );
};

export const GameLose: FC<Props> = ({}) => {
    const { onNext, map } = useGameContext();

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === "Enter" && event.shiftKey) {
                onNext();
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => document.removeEventListener("keydown", keyboardListener);
    }, []);

    return (
        <Box
            pos="relative"
            bgImage={GameBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            <Box
                bg="linear-gradient(90deg, rgba(66, 0, 255, 0) -6.14%, rgba(82, 0, 255, 0.46) 106.26%)"
                w="65vw"
                pl="20vw"
                pos="absolute"
                right="0"
                top="0"
                userSelect="none"
                textAlign="center"
            >
                <Text
                    fontFamily="Orbitron"
                    fontSize="96px"
                    fontWeight="600"
                    color="white"
                >
                    YOU LOSE
                </Text>
            </Box>

            <Box pos="absolute" right="6vw" top="21vh">
                <Info
                    win={false}
                    mine={{ id: "0xUG", time: 24, avatar: Aviation }}
                    opponent={{ id: "0x78", time: 32, avatar: Aviation }}
                />
            </Box>

            <Image w="36vw" pos="absolute" left="0" top="18vh" src={Aviation} />

            <Footer onNext={onNext} />

            <Box pos="absolute" left="63vw" top="45vh" userSelect="none">
                <ResultMap map={map} myPath={[]} opponentPath={[]} />
            </Box>
        </Box>
    );
};
