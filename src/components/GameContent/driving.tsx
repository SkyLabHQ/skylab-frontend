import {
    Box,
    Text,
    Img,
    useDisclosure,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    VStack,
    HStack,
    Slider,
    SliderFilledTrack,
    SliderTrack,
    Input,
} from "@chakra-ui/react";
import React, {
    FC,
    useEffect,
    useRef,
    useState,
    ChangeEvent,
    useReducer,
    useMemo,
} from "react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";
import WarningIcon from "../../assets/icon-warning.svg";
import CloseIcon from "../../assets/icon-close.svg";
import FuelIcon from "../../assets/icon-fuel.svg";
import BatteryIcon from "../../assets/icon-battery.svg";
import UniverseTime from "../../assets/universe-time.svg";
import GridBlock from "../../assets/grid-block.svg";
import SumBlock from "../../assets/sum-block.svg";
import Aviation from "../../assets/aviation-4.svg";
import input from "../../assets/input.json";
import { tokenId, useGameContext } from "../../pages/Game";
import { useContract } from "../../hooks/useContract";
import { mercuryCalldata } from "../../utils/snark";
import {
    getGridImg,
    getGridStyle,
    GridPosition,
    LargeMap,
    Map,
    MiniMap,
} from "./map";
import { Header } from "./header";
import { ActualPathInfo, MapInfo } from ".";
import {
    decreaseLoad,
    getRecordFromLocalStorage,
    increaseLoad,
    mergeIntoLocalStorage,
} from "./utils";
import { TutorialGroup } from "./tutorialGroup";

type Props = {};

const Footer: FC<{
    onQuit: () => void;
    isZoomIn: boolean;
    onZoomChange: () => void;
}> = ({ onQuit, isZoomIn, onZoomChange }) => {
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
                Quit
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
                Driving Stage
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
                onClick={onZoomChange}
            >
                Zoom {isZoomIn ? "out" : "in"}
            </Text>
        </Box>
    );
};

const TOTAL_COUNT_DOWN = 60;
const SPEED = 1;
const INTERVAL = 1000;
const MAX_BATTERY = 200;
const MAX_FUEL = 200;
const formatPosition = (val: number) => (val < 0 ? 0 : val > 100 ? 100 : val);

const calculateDirection = (
    currentMapPathItem: GridPosition,
    nextMapPathItem: GridPosition,
) => {
    if (currentMapPathItem.x - nextMapPathItem.x === 1) {
        return "w";
    } else if (currentMapPathItem.y - nextMapPathItem.y === 1) {
        return "a";
    } else if (nextMapPathItem.x - currentMapPathItem.x === 1) {
        return "s";
    } else {
        return "d";
    }
};

const calculateAviationTransform = (direction: "w" | "a" | "s" | "d") => {
    switch (direction) {
        case "w":
            return "rotate(270deg)";
        case "a":
            return "rotateY(180deg)";
        case "s":
            return "rotate(90deg)";
        case "d":
            return "";
    }
};

export const Driving: FC<Props> = ({}) => {
    const { onNext: onNextProps, map, mapPath } = useGameContext();
    const [actualGamePath, setActualGamePath] = useState<ActualPathInfo[]>(
        () => {
            const gameInfo = getRecordFromLocalStorage("game-driving");
            if (gameInfo?.actualGamePath) {
                return gameInfo.actualGamePath as ActualPathInfo[];
            }
            return [];
        },
    );
    const [mapDetail, setMapDetail] = useState<MapInfo>(() => {
        const gameInfo = getRecordFromLocalStorage("game-driving");
        if (gameInfo?.mapDetail) {
            return gameInfo.mapDetail as MapInfo;
        }
        return map[mapPath[0].x][mapPath[0].y];
    });
    const [countdown, setCountdown] = useState(() => {
        const gameInfo = getRecordFromLocalStorage("game-driving");
        if (gameInfo?.countdown) {
            return gameInfo.countdown as number;
        }
        return TOTAL_COUNT_DOWN;
    });
    const [isZoomIn, setIsZoomIn] = useState(true);
    const [position, setPosition] = useState(() => {
        const gameInfo = getRecordFromLocalStorage("game-driving");
        if (gameInfo?.position) {
            return gameInfo.position as { x: number; y: number };
        }
        return {
            x: mapPath[0].y === 0 ? 3 : 97,
            y: mapPath[0].x === 0 ? 3 : 97,
        };
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const countdownIntervalRef = useRef<number>();
    const animationRef = useRef<number>();
    const autoRef = useRef(
        (() => {
            const gameInfo = getRecordFromLocalStorage("game-driving");
            if (gameInfo?.auto) {
                return gameInfo.auto as boolean;
            }
            return true;
        })(),
    );
    const directionRef = useRef<"w" | "a" | "s" | "d">(
        (() => {
            const gameInfo = getRecordFromLocalStorage("game-driving");
            if (gameInfo?.direction) {
                return gameInfo.direction as "d";
            }
            return calculateDirection(mapPath[0], mapPath[1]);
        })(),
    );
    const fuelInputRef = useRef<HTMLInputElement | null>(null);
    const batteryInputRef = useRef<HTMLInputElement | null>(null);
    const mapDetailRef = useRef<MapInfo>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const contract = useContract();
    const [mapX, mapY] = useMemo(
        () => [
            Math.floor(((position.y / 100) * 208 + 1) / 14),
            Math.floor(((position.x / 100) * 208 + 1) / 14),
        ],
        [position],
    );
    const drivingMap = useMemo(
        () =>
            map?.map((row, x) =>
                row.map((item, y) => ({
                    ...item,
                    hover:
                        !!mapPath.find(
                            (item) => item.x === x && item.y === y,
                        ) &&
                        !actualGamePath.find(
                            (item) => item.x === x && item.y === y,
                        ),
                    selected: !!actualGamePath.find(
                        (item) => item.x === x && item.y === y,
                    ),
                })),
            ),
        [map, actualGamePath, mapPath],
    );

    const { totalFuelLoad, totalBatteryLoad } = actualGamePath.reduce(
        (prev, curr) => {
            prev.totalBatteryLoad += curr.batteryLoad;
            prev.totalFuelLoad += curr.fuelLoad;
            return prev;
        },
        { totalFuelLoad: 0, totalBatteryLoad: 0 },
    );

    const onNext = () => {
        onNextProps();
        localStorage.removeItem("game-driving");
    };

    const onQuit = () => {
        onOpen();
    };

    const onInputChange: (
        e: ChangeEvent<HTMLInputElement>,
        field: string,
    ) => void = (e, field) => {
        const val = parseInt(e.currentTarget.value, 10);
        if (Number.isNaN(val)) {
            map[mapX][mapY][field as "fuelLoad"] = 0;
            setMapDetail(map[mapX][mapY]);
            actualGamePath[actualGamePath.length - 1][field as "fuelLoad"] = 0;
            return;
        }
        let isResourceInsufficient = false;
        switch (field) {
            case "fuelLoad":
                isResourceInsufficient = totalFuelLoad + val > MAX_FUEL;
                break;
            case "batteryLoad":
                isResourceInsufficient = totalBatteryLoad + val > MAX_BATTERY;
                break;
        }
        if (!isResourceInsufficient) {
            map[mapX][mapY][field as "fuelLoad"] = val;
            setMapDetail(map[mapX][mapY]);
            actualGamePath[actualGamePath.length - 1][field as "fuelLoad"] =
                val;
        }
    };

    const onSliderChange: (val: number, field: string) => void = (
        val,
        field,
    ) => {
        let isResourceInsufficient = false;
        switch (field) {
            case "fuelLoad":
                isResourceInsufficient = totalFuelLoad > MAX_FUEL;
                break;
            case "batteryLoad":
                isResourceInsufficient = totalBatteryLoad > MAX_BATTERY;
                break;
        }
        if (!isResourceInsufficient) {
            map[mapX][mapY][field as "fuelLoad"] = val;
            setMapDetail(map[mapX][mapY]);
            actualGamePath[actualGamePath.length - 1][field as "fuelLoad"] =
                val;
        }
    };

    const keyboardListener = (event: KeyboardEvent) => {
        const key = event.key;
        if (["w", "a", "s", "d"].includes(key)) {
            directionRef.current = key as "w";
            autoRef.current = false;
        }
        if (key === "Escape") {
            onQuit();
        }
        if (key === "Enter" && event.shiftKey) {
            onNext();
        }
        if (mapDetailRef.current) {
            switch (key) {
                case "f":
                    fuelInputRef.current?.focus();
                    break;
                case "o":
                    mapDetailRef.current.fuelLoad = decreaseLoad(
                        MAX_FUEL,
                        mapDetailRef.current.fuelLoad,
                    );
                    break;
                case "p":
                    mapDetailRef.current.fuelLoad = increaseLoad(
                        MAX_FUEL,
                        mapDetailRef.current.fuelLoad,
                    );
                    break;
                case "b":
                    batteryInputRef.current?.focus();
                    break;
                case ",":
                    mapDetailRef.current.batteryLoad = decreaseLoad(
                        MAX_BATTERY,
                        mapDetailRef.current.batteryLoad,
                    );
                    break;
                case ".":
                    mapDetailRef.current.batteryLoad = increaseLoad(
                        MAX_BATTERY,
                        mapDetailRef.current.batteryLoad,
                    );
                    break;
            }
            forceRender();
        }
    };

    const endGame = async () => {
        clearInterval(countdownIntervalRef.current);
        clearInterval(animationRef.current);
        document.removeEventListener("keydown", keyboardListener);
        const { a, b, c, Input } = (await mercuryCalldata(input)) ?? {};
        await contract?.commitPath(tokenId, a, b, c, Input);
    };

    useEffect(() => {
        if (countdown <= 0) {
            clearInterval(countdownIntervalRef.current);
        }
        mergeIntoLocalStorage("game-driving", {
            countdown,
        });
    }, [countdown]);

    useEffect(() => {
        mapDetailRef.current = mapDetail;
        if (mapDetail.role === "end") {
            endGame();
        }
        mergeIntoLocalStorage("game-driving", {
            mapDetail,
        });
    }, [mapDetail]);

    useEffect(() => {
        const prevGrid = actualGamePath
            ? actualGamePath[actualGamePath.length - 1]
            : undefined;
        if (
            actualGamePath.length &&
            mapX === prevGrid?.x &&
            mapY === prevGrid?.y
        ) {
            return;
        }
        const newFuelLoad =
            mapDetailRef.current?.fuelLoad ?? actualGamePath.length > 0
                ? prevGrid?.fuelLoad!
                : 1;
        const newBatteryLoad =
            mapDetailRef.current?.fuelLoad ?? actualGamePath.length > 0
                ? prevGrid?.batteryLoad!
                : 1;
        const newActualGamePath = [
            ...actualGamePath,
            {
                x: mapX,
                y: mapY,
                fuelLoad: newFuelLoad,
                batteryLoad: newBatteryLoad,
            },
        ];
        map[mapX][mapY].fuelLoad = newFuelLoad;
        map[mapX][mapY].batteryLoad = newBatteryLoad;
        setMapDetail(map[mapX][mapY]);
        mergeIntoLocalStorage("game-driving", {
            actualGamePath: newActualGamePath,
        });
        setActualGamePath(newActualGamePath);
    }, [mapX, mapY, actualGamePath]);

    useEffect(() => {
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown((val) => val - 1);
        }, 1000);

        animationRef.current = window.setInterval(() => {
            setPosition((pos) => {
                let x = pos.x;
                let y = pos.y;
                switch (directionRef.current) {
                    case "w":
                        y -= SPEED;
                        break;
                    case "a":
                        x -= SPEED;
                        break;
                    case "s":
                        y += SPEED;
                        break;
                    case "d":
                        x += SPEED;
                        break;
                }
                x = formatPosition(x);
                y = formatPosition(y);

                if (autoRef.current) {
                    const xOffset =
                        directionRef.current === "d"
                            ? -5
                            : directionRef.current === "a"
                            ? 5
                            : 0;
                    const yOffset =
                        directionRef.current === "s"
                            ? -5
                            : directionRef.current === "w"
                            ? 5
                            : 0;
                    const mapDetailX = Math.floor(
                        ((y / 100) * 208 + yOffset) / 14,
                    );
                    const mapDetailY = Math.floor(
                        ((x / 100) * 208 + xOffset) / 14,
                    );
                    const index = mapPath.findIndex(
                        (pathItem) =>
                            pathItem.x === mapDetailX &&
                            pathItem.y === mapDetailY,
                    );
                    if (index >= 0) {
                        const nextIndex =
                            index + 1 < mapPath.length ? index + 1 : index;
                        const currentMapPathItem = mapPath[index];
                        const nextMapPathItem = mapPath[nextIndex];
                        directionRef.current = calculateDirection(
                            currentMapPathItem,
                            nextMapPathItem,
                        );
                    }
                }
                mergeIntoLocalStorage("game-driving", {
                    position: { x, y },
                    direction: directionRef.current,
                    auto: autoRef.current,
                });
                return { x, y };
            });
        }, INTERVAL);

        document.addEventListener("keydown", keyboardListener);

        return () => {
            clearInterval(countdownIntervalRef.current);
            clearInterval(animationRef.current);
            document.removeEventListener("keydown", keyboardListener);
        };
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
            />

            <Footer
                onQuit={onQuit}
                isZoomIn={isZoomIn}
                onZoomChange={() => setIsZoomIn((val) => !val)}
            />

            <Box pos="absolute" right="36px" bottom="16vh">
                <TutorialGroup horizontal={true} />
            </Box>

            <VStack
                w="27.5vw"
                pos="absolute"
                left="2vw"
                top="12vh"
                userSelect="none"
                spacing="8px"
                alignItems="flex-start"
            >
                {/* Stock */}
                <Box
                    bg="rgba(217, 217, 217, 0.2)"
                    border="2px solid #13FFDA"
                    borderRadius="16px"
                    color="#9EFFFF"
                    w="100%"
                    padding="4px 24px"
                >
                    <Text fontFamily="Quantico" fontSize="64px" lineHeight="1">
                        Stock
                    </Text>
                    <HStack justifyContent="space-between">
                        <HStack>
                            <Img src={FuelIcon} w="48px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="32px"
                                lineHeight="1"
                            >
                                Fuel {MAX_FUEL}
                            </Text>
                        </HStack>
                        <HStack>
                            <Img src={BatteryIcon} w="48px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="32px"
                                lineHeight="1"
                            >
                                Battery {MAX_BATTERY}
                            </Text>
                        </HStack>
                    </HStack>
                </Box>

                {/* Load */}
                <Box
                    bg="rgba(217, 217, 217, 0.2)"
                    border="5px solid #FFF761"
                    borderRadius="16px"
                    w="100%"
                >
                    <Box
                        margin="1px"
                        bg="rgba(217, 217, 217, 0.2)"
                        border="3px solid #FFF761"
                        borderRadius="10px"
                        pb="24px"
                    >
                        <Box
                            fontFamily="Orbitron"
                            fontSize="48px"
                            fontWeight={600}
                            color="#FFF761"
                            bg="linear-gradient(89.97deg, rgba(255, 247, 97, 0.5) -2.72%, rgba(255, 247, 97, 0) 99.97%)"
                            padding="8px 24px"
                        >
                            Load
                        </Box>
                        <HStack margin="8px 0" alignItems="flex-start">
                            <VStack spacing="0" w="30%">
                                <Img src={FuelIcon} w="64px" />
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="36px"
                                    lineHeight="1"
                                    color="white"
                                >
                                    Fuel
                                </Text>
                            </VStack>
                            <VStack spacing="8px" w="60%" pos="relative">
                                <HStack
                                    w="100%"
                                    justifyContent="space-between"
                                    mb="4px"
                                >
                                    <Input
                                        disabled={!mapDetail}
                                        fontFamily="Quantico"
                                        fontSize="36px"
                                        color="white"
                                        variant="unstyled"
                                        w="60%"
                                        onChange={(e) =>
                                            onInputChange(e, "fuelLoad")
                                        }
                                        ref={fuelInputRef}
                                        value={mapDetail?.fuelLoad ?? 0}
                                    />
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#BCBBBE"
                                    >
                                        {totalFuelLoad} / {MAX_FUEL}
                                    </Text>
                                </HStack>
                                <Slider
                                    isDisabled={!mapDetail}
                                    min={0}
                                    max={
                                        MAX_FUEL -
                                        totalFuelLoad +
                                        (mapDetail?.fuelLoad ?? 0)
                                    }
                                    step={1}
                                    onChange={(val) =>
                                        onSliderChange(val, "fuelLoad")
                                    }
                                    value={mapDetail?.fuelLoad ?? 0}
                                >
                                    <SliderTrack
                                        bg="rgba(217, 217, 217, 0.8)"
                                        h="32px"
                                        borderRadius="20px"
                                    >
                                        <SliderFilledTrack
                                            bg={
                                                totalFuelLoad > MAX_FUEL
                                                    ? "#FF0000"
                                                    : "#FFF761"
                                            }
                                            borderRadius="20px"
                                        />
                                    </SliderTrack>
                                </Slider>
                                {totalFuelLoad > MAX_FUEL ? (
                                    <HStack
                                        pos="absolute"
                                        left="0"
                                        bottom="-64px"
                                    >
                                        <Img src={WarningIcon} w="48px" />
                                        <Text
                                            fontFamily="Quantico"
                                            fontSize="20px"
                                            color="#FF2A0C"
                                        >
                                            Insufficient Resource
                                        </Text>
                                    </HStack>
                                ) : null}
                            </VStack>
                        </HStack>
                        <HStack margin="8px 0" alignItems="flex-start">
                            <VStack spacing="0" w="30%">
                                <Img src={BatteryIcon} w="64px" />
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="36px"
                                    lineHeight="1"
                                    color="white"
                                >
                                    Battery
                                </Text>
                            </VStack>
                            <VStack spacing="8px" w="60%" pos="relative">
                                <HStack
                                    w="100%"
                                    justifyContent="space-between"
                                    mb="4px"
                                >
                                    <Input
                                        disabled={!mapDetail}
                                        fontFamily="Quantico"
                                        fontSize="36px"
                                        color="white"
                                        variant="unstyled"
                                        w="60%"
                                        onChange={(e) =>
                                            onInputChange(e, "batteryLoad")
                                        }
                                        ref={batteryInputRef}
                                        value={mapDetail?.batteryLoad ?? 0}
                                    />
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#BCBBBE"
                                    >
                                        {totalBatteryLoad} / {MAX_BATTERY}
                                    </Text>
                                </HStack>
                                <Slider
                                    isDisabled={!mapDetail}
                                    min={0}
                                    max={
                                        MAX_BATTERY -
                                        totalBatteryLoad +
                                        (mapDetail?.batteryLoad ?? 0)
                                    }
                                    step={1}
                                    onChange={(val) =>
                                        onSliderChange(val, "batteryLoad")
                                    }
                                    value={mapDetail?.batteryLoad ?? 0}
                                >
                                    <SliderTrack
                                        bg="rgba(217, 217, 217, 0.8)"
                                        h="32px"
                                        borderRadius="20px"
                                    >
                                        <SliderFilledTrack
                                            bg={
                                                totalBatteryLoad > MAX_BATTERY
                                                    ? "#FF0000"
                                                    : "#FFF761"
                                            }
                                            borderRadius="20px"
                                        />
                                    </SliderTrack>
                                </Slider>
                                {totalBatteryLoad > MAX_BATTERY ? (
                                    <HStack
                                        pos="absolute"
                                        left="0"
                                        bottom="-64px"
                                    >
                                        <Img src={WarningIcon} w="48px" />
                                        <Text
                                            fontFamily="Quantico"
                                            fontSize="20px"
                                            color="#FF2A0C"
                                        >
                                            Insufficient Resource
                                        </Text>
                                    </HStack>
                                ) : null}
                            </VStack>
                        </HStack>
                    </Box>
                </Box>

                <Box
                    bg="rgba(217, 217, 217, 0.2)"
                    boxShadow="10px 4px 4px rgba(0, 0, 0, 0.8)"
                    borderRadius="16px"
                    padding="12px"
                >
                    <MiniMap
                        map={drivingMap}
                        position={position}
                        actualGamePath={actualGamePath}
                    />
                </Box>
            </VStack>

            <VStack
                w="27.5vw"
                pos="absolute"
                right="2vw"
                top="12vh"
                userSelect="none"
                spacing="32px"
            >
                {/* Time */}
                <VStack
                    bg="rgba(217, 217, 217, 0.2)"
                    border="5px solid #FFF761"
                    borderRadius="16px"
                    w="100%"
                    padding="12px 16px 24px"
                    spacing="40px"
                >
                    <HStack>
                        <Img src={UniverseTime} w="90px" />
                        <Text
                            fontFamily="Orbitron"
                            fontSize="48px"
                            lineHeight="1"
                            ml="12px"
                            fontWeight="600"
                        >
                            Universe Time
                        </Text>
                    </HStack>
                    <HStack w="100%" justifyContent="space-between">
                        <HStack w="60%" justifyContent="center">
                            <Img src={GridBlock} w="56px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="36px"
                                lineHeight="1"
                                color="white"
                            >
                                Grid
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                fontFamily="Orbitron"
                                fontSize="80px"
                                lineHeight="1"
                                fontWeight="600"
                                color="#FFF530"
                                mr="16px"
                                border="2px dashed #FFF761"
                                borderRadius="10px"
                                padding="0 4px"
                                w="150px"
                                textAlign="center"
                            >
                                02
                            </Text>
                            <Text
                                fontFamily="Orbitron"
                                fontSize="36px"
                                lineHeight="1"
                                fontWeight="600"
                                color="white"
                            >
                                s
                            </Text>
                        </HStack>
                    </HStack>
                    <HStack w="100%" justifyContent="space-between">
                        <HStack w="60%" justifyContent="center">
                            <Img src={SumBlock} w="56px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="36px"
                                lineHeight="1"
                                color="white"
                            >
                                Sum
                            </Text>
                        </HStack>
                        <HStack>
                            <Text
                                fontFamily="Orbitron"
                                fontSize="80px"
                                lineHeight="1"
                                fontWeight="600"
                                color="#FFF530"
                                mr="16px"
                                border="2px dashed #FFF761"
                                borderRadius="10px"
                                padding="0 4px"
                                w="150px"
                                textAlign="center"
                            >
                                {10}
                            </Text>
                            <Text
                                fontFamily="Orbitron"
                                fontSize="36px"
                                lineHeight="1"
                                fontWeight="600"
                                color="white"
                            >
                                s
                            </Text>
                        </HStack>
                    </HStack>
                </VStack>

                {/* Grid */}
                {mapDetail ? (
                    <VStack
                        bg="rgba(217, 217, 217, 0.2)"
                        border="5px solid #FFF761"
                        borderRadius="16px"
                        w="100%"
                        padding="24px 32px"
                        spacing="40px"
                    >
                        <Text
                            fontFamily="Orbitron"
                            fontSize="48px"
                            lineHeight="1"
                            fontWeight="600"
                            w="100%"
                        >
                            Grid Info
                        </Text>
                        <HStack
                            w="100%"
                            spacing="24px"
                            justifyContent="space-between"
                        >
                            <Box
                                width="124px"
                                height="124px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                {...getGridStyle(
                                    {
                                        ...mapDetail,
                                        selected: false,
                                        hover: false,
                                    },
                                    false,
                                )}
                            >
                                <Img
                                    src={getGridImg(mapDetail)}
                                    w="120px"
                                    h="120px"
                                />
                            </Box>
                            <VStack
                                alignItems="flex-start"
                                justifyContent="space-between"
                                flex="1"
                                h="124px"
                            >
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="36px"
                                    lineHeight="1"
                                    color="white"
                                >
                                    Air drag {mapDetail.airDrag}
                                </Text>
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="36px"
                                    lineHeight="1"
                                    color="white"
                                >
                                    Air turbulence {mapDetail.turbulence}
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>
                ) : null}
            </VStack>

            <Box pos="absolute" left="33vw" top="9vh" userSelect="none">
                {isZoomIn ? (
                    <LargeMap
                        map={drivingMap}
                        position={position}
                        aviation={{
                            img: Aviation,
                            transform: calculateAviationTransform(
                                directionRef.current,
                            ),
                        }}
                    />
                ) : (
                    <Map
                        map={drivingMap}
                        setIsReady={() => ({})}
                        onSelect={() => ({})}
                        viewOnly={true}
                        mapPath={mapPath}
                        aviation={{
                            img: Aviation,
                            pos: position,
                            transform: calculateAviationTransform(
                                directionRef.current,
                            ),
                        }}
                    />
                )}
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
                <ModalOverlay />
                <ModalContent
                    bg="rgba(255, 255, 255, 0.7)"
                    border="3px solid #FDDC2D"
                    borderRadius="20px"
                >
                    <Img
                        pos="absolute"
                        top="16px"
                        right="16px"
                        w="32px"
                        src={CloseIcon}
                        cursor="pointer"
                        onClick={() => onClose()}
                    />
                    <ModalBody pb="0" pt="36px">
                        <Box display="flex" justifyContent="space-between">
                            <Img w="220px" src={WarningIcon} />
                            <Text
                                color="black"
                                fontSize="36px"
                                fontFamily="Orbitron"
                                fontWeight="600"
                            >
                                If you quit the game now, your aviation will be
                                down-graded but you will keep all unused
                                resources
                            </Text>
                        </Box>
                    </ModalBody>

                    <ModalFooter
                        display="flex"
                        justifyContent="space-between"
                        pt="0"
                    >
                        <Button
                            bg="white"
                            colorScheme="white"
                            onClick={onClose}
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                            w="40%"
                            padding="32px 0"
                            borderRadius="20px"
                        >
                            Quit
                        </Button>
                        <Button
                            colorScheme="yellow"
                            onClick={onClose}
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                            w="50%"
                            padding="32px 0"
                            borderRadius="20px"
                        >
                            Continue to collide
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
