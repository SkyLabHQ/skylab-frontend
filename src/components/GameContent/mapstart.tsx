import { Box, Text, Img, useDisclosure } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer, useRef, useState } from "react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";

import { useGameContext } from "../../pages/Game";
import { GridPosition } from "./map";
import { Header } from "./header";
import { getRecordFromLocalStorage } from "./utils";
import { TutorialGroup } from "./tutorialGroup";
import { StartMap } from "./map/startMap";
// import { gridTimeCalldata } from "@/utils/snark";

type Props = {};

const Footer: FC<{ onNext: () => void; onQuit: () => void }> = ({
    onNext,
    onQuit,
}) => {
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
                onClick={onQuit}
            >
                Flee
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="40vw"
                minWidth="480px"
                fontSize="48px"
                left="50%"
                transform="translateX(-50%)"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                Choose your starting point
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
                onClick={() => {
                    onNext();
                }}
            >
                Confirm
            </Text>
        </Box>
    );
};

const TOTAL_COUNT_DOWN = 60;

export const MapStart: FC<Props> = ({}) => {
    const [startPoint, setStartPoint] = useState<GridPosition>({ x: 0, y: 0 });
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const [countdown, setCountdown] = useState(() => {
        const gameInfo = getRecordFromLocalStorage("game-presetting");
        if (gameInfo?.countdown) {
            return gameInfo.countdown as number;
        }
        return TOTAL_COUNT_DOWN;
    });
    const { isOpen, onOpen } = useDisclosure();
    const countdownIntervalRef = useRef<number>();
    const {
        onNext: onNextProps,
        map,
        mapPath,
        level,
        onMapChange,
        onMapPathChange,
    } = useGameContext();

    const onNext = () => {
        const _map = [...map];
        _map[startPoint.x][startPoint.y].selected = true;
        onMapChange(_map);

        const _mapPath = [...mapPath];
        _mapPath.push(startPoint);
        onMapPathChange(_mapPath);
        onNextProps();
        // localStorage.removeItem("game-presetting");
    };

    const onQuit = () => {
        // onOpen();
    };

    useEffect(() => {
        if (countdown <= 0) {
            clearInterval(countdownIntervalRef.current);
        }
        // mergeIntoLocalStorage("game-presetting", {
        //     countdown,
        // });
    }, [countdown]);

    useEffect(() => {
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown((val) => val - 1);
        }, 1000);

        return () => clearInterval(countdownIntervalRef.current);
    }, []);

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "Escape") {
                onQuit();
            }
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
            <Header
                countdown={countdown > 0 ? countdown : 0}
                total={TOTAL_COUNT_DOWN}
                level={level}
            />

            <Footer onQuit={onQuit} onNext={onNext} />

            <Box pos="absolute" right="36px" bottom="18vh">
                <TutorialGroup showCharacter={true} horizontal={true} />
            </Box>

            <Box pos="absolute" left="34vw" top="9vh" userSelect="none">
                <StartMap
                    map={map}
                    setIsReady={() => ({})}
                    mapPath={mapPath}
                    startPoint={startPoint}
                    onStartPoint={(posi) => {
                        setStartPoint(posi);
                    }}
                />
            </Box>
        </Box>
    );
};
