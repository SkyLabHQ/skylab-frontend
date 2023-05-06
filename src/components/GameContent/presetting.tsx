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
import GridImg1 from "./assets/grid-img1.svg";
import GridImg2 from "./assets/grid-img2.svg";
import GridImg3 from "./assets/grid-img3.svg";
import GridImg4 from "./assets/grid-img4.svg";

import { useGameContext } from "../../pages/Game";
import { getGridImg, getGridStyle, GridPosition, Map } from "./map";
import { Header } from "./header";
import { MapInfo } from ".";
import {
    calculateLoad,
    decreaseLoad,
    getRecordFromLocalStorage,
    increaseLoad,
    mergeIntoLocalStorage,
} from "./utils";
import { TutorialGroup } from "./tutorialGroup";
import { gridTimeCalldata } from "@/utils/snark";
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
                width="30vw"
                minWidth="480px"
                fontSize="48px"
                left="35vw"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                Presetting Stage
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
const MAX_BATTERY = 200;
const MAX_FUEL = 200;

export const Presetting: FC<Props> = ({}) => {
    const [selectedPosition, setSelectedPosition] = useState<
        GridPosition | undefined
    >(() => {
        const gameInfo = getRecordFromLocalStorage("game-presetting");
        if (gameInfo?.selectedPosition) {
            return gameInfo.selectedPosition as GridPosition | undefined;
        }
        return undefined;
    });
    const [countdown, setCountdown] = useState(() => {
        const gameInfo = getRecordFromLocalStorage("game-presetting");
        if (gameInfo?.countdown) {
            return gameInfo.countdown as number;
        }
        return TOTAL_COUNT_DOWN;
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const countdownIntervalRef = useRef<number>();
    const fuelInputRef = useRef<HTMLInputElement | null>(null);
    const batteryInputRef = useRef<HTMLInputElement | null>(null);
    const prevLoad = useRef({ fuel: 0, battery: 0 });
    const mapDetailRef = useRef<MapInfo>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const {
        onNext: onNextProps,
        map,
        mapPath,
        level,
        onMapChange,
    } = useGameContext();
    const mapDetail = useMemo(
        () =>
            selectedPosition && map.length
                ? map[selectedPosition.x][selectedPosition.y]
                : undefined,
        [selectedPosition, map],
    );

    const { totalFuelLoad, totalBatteryLoad, totalTime } = calculateLoad(map);

    const onGridSelect = (position: GridPosition | undefined) => {
        // console.log(position, "position");
        setSelectedPosition(position);
        // mergeIntoLocalStorage("game-presetting", {
        //     selectedPosition: position,
        // });
        forceRender();
    };

    const onNext = () => {
        onNextProps();
        localStorage.removeItem("game-presetting");
    };

    const onQuit = () => {
        onOpen();
    };

    const onInputChange: (
        e: ChangeEvent<HTMLInputElement>,
        field: string,
    ) => void = (e, field) => {
        const val = parseInt(e.currentTarget.value, 10);
        console.log(mapDetail, "mapDetail");
        if (Number.isNaN(val)) {
            mapDetail![field as "fuelLoad"] = 0;
        } else {
            mapDetail![field as "fuelLoad"] = val;
        }
        forceRender();
    };

    const onSliderChange: (val: number, field: string) => void = (
        val,
        field,
    ) => {
        mapDetail![field as "fuelLoad"] = val;
        forceRender();
    };

    const getCalculateTimePerGrid = async () => {
        const level_scaler = 2 ^ (level - 1);
        let c1;
        if (level <= 7) {
            c1 = 2;
        } else if (level <= 12) {
            c1 = 6;
        } else {
            c1 = 17;
        }

        const used_fuel = mapDetail.fuelLoad;
        const fuel_scaler = mapDetail.fuelScaler;
        const used_battery = mapDetail.batteryLoad;
        const battery_scaler = mapDetail.batteryScaler;
        const Distance = mapDetail.distance;
        const input = {
            level_scaler,
            c1,
            used_fuel,
            fuel_scaler,
            used_battery,
            battery_scaler,
            Distance,
        };
        // TODO GET Grid time
    };

    useEffect(() => {
        // if (countdown <= 0) {
        //     clearInterval(countdownIntervalRef.current);
        // }
        // mergeIntoLocalStorage("game-presetting", {
        //     countdown,
        // });
    }, [countdown]);

    useEffect(() => {
        mapDetailRef.current = mapDetail;
        if (mapDetail) {
            getCalculateTimePerGrid();
        }
    }, [mapDetail]);

    useEffect(() => {
        prevLoad.current = {
            battery: mapDetail?.batteryLoad ?? 0,
            fuel: mapDetail?.fuelLoad ?? 0,
        };
        return () => {
            if (!mapDetail) {
                return;
            }
        };
    }, [mapDetail, mapDetail?.selected]);

    useEffect(() => {
        // countdownIntervalRef.current = window.setInterval(() => {
        //     setCountdown((val) => val - 1);
        // }, 1000);
        // return () => clearInterval(countdownIntervalRef.current);
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
            />

            <Footer onQuit={onQuit} onNext={onNext} />

            <Box pos="absolute" right="36px" bottom="18vh">
                <TutorialGroup showCharacter={true} horizontal={true} />
            </Box>

            <VStack
                w="27.5vw"
                pos="absolute"
                left="2vw"
                top="12vh"
                userSelect="none"
                spacing="60px"
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
                        <HStack>
                            <VStack sx={{ paddingLeft: "8px" }}>
                                {[GridImg1, GridImg2, GridImg3, GridImg4].map(
                                    (item, index) => {
                                        return (
                                            <Img
                                                src={item}
                                                w="32px"
                                                key={index}
                                            ></Img>
                                        );
                                    },
                                )}
                            </VStack>
                            <Box>
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
                                    <VStack
                                        spacing="8px"
                                        w="60%"
                                        pos="relative"
                                    >
                                        <HStack
                                            w="100%"
                                            justifyContent="space-between"
                                            mb="4px"
                                        >
                                            <Input
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
                                            min={0}
                                            max={MAX_FUEL}
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
                                                <Img
                                                    src={WarningIcon}
                                                    w="48px"
                                                />
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
                                    <VStack
                                        spacing="8px"
                                        w="60%"
                                        pos="relative"
                                    >
                                        <HStack
                                            w="100%"
                                            justifyContent="space-between"
                                            mb="4px"
                                        >
                                            <Input
                                                fontFamily="Quantico"
                                                fontSize="36px"
                                                color="white"
                                                variant="unstyled"
                                                w="60%"
                                                onChange={(e) =>
                                                    onInputChange(
                                                        e,
                                                        "batteryLoad",
                                                    )
                                                }
                                                ref={batteryInputRef}
                                                value={
                                                    mapDetail?.batteryLoad ?? 0
                                                }
                                            />
                                            <Text
                                                fontFamily="Quantico"
                                                fontSize="20px"
                                                color="#BCBBBE"
                                            >
                                                {totalBatteryLoad} /{" "}
                                                {MAX_BATTERY}
                                            </Text>
                                        </HStack>
                                        <Slider
                                            min={0}
                                            max={MAX_BATTERY}
                                            step={1}
                                            onChange={(val) =>
                                                onSliderChange(
                                                    val,
                                                    "batteryLoad",
                                                )
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
                                                        totalBatteryLoad >
                                                        MAX_BATTERY
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
                                                <Img
                                                    src={WarningIcon}
                                                    w="48px"
                                                />
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
                        </HStack>
                    </Box>
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
                                {totalTime}
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
                                    Air drag {mapDetail.fuelScaler}
                                </Text>
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="36px"
                                    lineHeight="1"
                                    color="white"
                                >
                                    Air batteryScaler {mapDetail.batteryScaler}
                                </Text>
                            </VStack>
                        </HStack>
                    </VStack>
                ) : null}
            </VStack>

            <Box pos="absolute" left="34vw" top="9vh" userSelect="none">
                <Map
                    map={map}
                    setIsReady={() => ({})}
                    onSelect={onGridSelect}
                    viewOnly={isOpen}
                    mapPath={mapPath}
                />
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
