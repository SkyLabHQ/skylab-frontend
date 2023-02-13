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
import { getGridImg, getGridStyle, Map } from "./map";
import { Header } from "./header";
import { MapInfo } from ".";
import { calculateLoad } from "./utils";

type Props = {
    onNext: () => void;
    map: MapInfo[][];
};

const Footer: FC<{ onNext: Props["onNext"]; onQuit: () => void }> = ({
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
                onClick={onNext}
            >
                Confirm
            </Text>
        </Box>
    );
};

const TOTAL_COUNT_DOWN = 60;

export const Presetting: FC<Props> = ({ onNext, map }) => {
    const [mapDetail, setMapDetail] = useState<MapInfo | undefined>();
    const [countdown, setCountdown] = useState(TOTAL_COUNT_DOWN);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const countdownIntervalRef = useRef<number>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const { totalFuelLoad, totalBatteryLoad, totalTime } = calculateLoad(map);

    const onQuit = () => {
        onOpen();
    };

    const onInputChange: (
        e: ChangeEvent<HTMLInputElement>,
        field: string,
    ) => void = (e, field) => {
        const val = parseInt(e.currentTarget.value, 10);
        if (Number.isNaN(val)) {
            return;
        }
        mapDetail![field as "fuelLoad"] = val;
        forceRender();
    };

    const onSliderChange: (val: number, field: string) => void = (
        val,
        field,
    ) => {
        mapDetail![field as "fuelLoad"] = val;
        forceRender();
    };

    useEffect(() => {
        if (countdown <= 0) {
            clearInterval(countdownIntervalRef.current);
        }
    }, [countdown]);

    useEffect(() => {
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown((val) => val - 1);
        }, 1000);

        return () => clearInterval(countdownIntervalRef.current);
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
                                Fuel 200
                            </Text>
                        </HStack>
                        <HStack>
                            <Img src={BatteryIcon} w="48px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="32px"
                                lineHeight="1"
                            >
                                Battery 200
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
                                        disabled={!mapDetail?.selected}
                                        fontFamily="Quantico"
                                        fontSize="36px"
                                        color="white"
                                        variant="unstyled"
                                        w="60%"
                                        onChange={(e) =>
                                            onInputChange(e, "fuelLoad")
                                        }
                                        value={mapDetail?.fuelLoad ?? 0}
                                    />
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#BCBBBE"
                                    >
                                        {totalFuelLoad} / 200
                                    </Text>
                                </HStack>
                                <Slider
                                    isDisabled={!mapDetail?.selected}
                                    min={0}
                                    max={200}
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
                                                totalFuelLoad > 200
                                                    ? "#FF0000"
                                                    : "#FFF761"
                                            }
                                            borderRadius="20px"
                                        />
                                    </SliderTrack>
                                </Slider>
                                {totalFuelLoad > 200 ? (
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
                                        disabled={!mapDetail?.selected}
                                        fontFamily="Quantico"
                                        fontSize="36px"
                                        color="white"
                                        variant="unstyled"
                                        w="60%"
                                        onChange={(e) =>
                                            onInputChange(e, "batteryLoad")
                                        }
                                        value={mapDetail?.batteryLoad ?? 0}
                                    />
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#BCBBBE"
                                    >
                                        {totalBatteryLoad} / 200
                                    </Text>
                                </HStack>
                                <Slider
                                    isDisabled={!mapDetail?.selected}
                                    min={0}
                                    max={200}
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
                                                totalBatteryLoad > 200
                                                    ? "#FF0000"
                                                    : "#FFF761"
                                            }
                                            borderRadius="20px"
                                        />
                                    </SliderTrack>
                                </Slider>
                                {totalBatteryLoad > 200 ? (
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

            <Box pos="absolute" left="34vw" top="9vh" userSelect="none">
                <Map
                    map={map}
                    setIsReady={() => ({})}
                    onSelect={setMapDetail}
                    viewOnly={false}
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
