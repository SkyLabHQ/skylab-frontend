import { Box, Text, Image, Img } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

import GameBackground from "../../../assets/game-win-background.png";
import Aviation from "../../../assets/aviation-4.svg";
import { useGameContext } from "../../../pages/Game";
import { ResultMap } from "../map";
import { generateWinText } from "../utils";
import { Info } from "./info";

type Props = {};

const Footer: FC<{ onNext: () => void }> = ({ onNext }) => {
    const text = generateWinText({
        myLevel: 4,
        myBattery: 15,
        myFuel: 100000,
        opponentLevel: 3,
        opponentBattery: 10,
        opponentFuel: 12,
    });

    const onShare = async () => {
        const canvas = await html2canvas(document.body);
        canvas.toBlob((blob) => {
            if (!blob) {
                return;
            }
            saveAs(blob, "my_image.jpg");
        });
    };

    return (
        <Box userSelect="none">
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="40px"
                left="1vw"
                top="14.5vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onNext}
            >
                Home
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="0.5vw"
                top="14.5vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onShare}
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

export const GameWin: FC<Props> = ({}) => {
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
            <Image
                w="45vw"
                pos="absolute"
                left="2vw"
                bottom="8vh"
                src={Aviation}
            />

            <Box pos="absolute" left="43vw" top="36vh">
                <Info
                    win
                    mine={{ id: "0xUG", time: 24, avatar: Aviation }}
                    opponent={{ id: "0x78", time: 32, avatar: Aviation }}
                />
            </Box>

            <Footer onNext={onNext} />

            <Box pos="absolute" left="52vw" bottom="8vh" userSelect="none">
                <ResultMap map={map} myPath={[]} opponentPath={[]} />
            </Box>
        </Box>
    );
};
