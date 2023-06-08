import {
    Box,
    Text,
    Img,
    VStack,
    HStack,
    Slider,
    SliderFilledTrack,
    SliderTrack,
    Input,
    useToast,
} from "@chakra-ui/react";
import React, { FC, useEffect, useRef, useState, useReducer } from "react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";
import WarningIcon from "../../assets/icon-warning.svg";
import FuelIcon from "../../assets/icon-fuel.svg";
import BatteryIcon from "../../assets/icon-battery.svg";
import GridImg1 from "./assets/grid-img1.svg";
import GridImg2 from "./assets/grid-img2.svg";
import GridImg3 from "./assets/grid-img3.svg";
import GridImg4 from "./assets/grid-img4.svg";
import Highlight from "./assets/highlight.svg";

import { useGameContext } from "../../pages/Game";
import { GridPosition, isAdjacentToPreviousSelect, Map } from "./map";
import { Header } from "./header";
import { calculateLoad } from "./utils";
import { TutorialGroup } from "./tutorialGroup";
import MapGridInfo from "./MapGridInfo";
import UniverseTime from "./UniverseTime";
import SkyToast from "../Toast";
import useGameState from "@/hooks/useGameState";

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
                fontSize="40px"
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

export const Presetting: FC = () => {
    const toast = useToast();
    const worker = useRef<Worker>();

    const {
        onNext: onNextProps,
        myInfo,
        map,
        mapPath,
        level,
        onMapChange,
        onMapPathChange,
        onOpen,
        handleIsEndGame,
    } = useGameContext();
    const cMap = useRef(map);
    const cMapPath = useRef(mapPath);

    const selectedPosition = useRef<GridPosition | null>(
        cMapPath.current.length
            ? cMapPath.current[cMapPath.current.length - 1]
            : null,
    );

    const fuelInputRef = useRef<HTMLInputElement | null>(null);
    const batteryInputRef = useRef<HTMLInputElement | null>(null);
    const prevLoad = useRef({ fuel: 0, battery: 0 });
    const [fuelInput, setFuelInput] = useState("0");
    const [fuelFocus, setFuelFocus] = useState(false);
    const [batteryInput, setBatteryInput] = useState("0");
    const [batteryFocus, setBatteryFocus] = useState(false);

    const [afterSumTime, setAfterSumTime] = useState(0);
    const [afterGrid, setAfterGrid] = useState(0);

    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const canInput =
        selectedPosition.current &&
        (![0, 14].includes(selectedPosition.current.x) ||
            ![0, 14].includes(selectedPosition.current.y));

    const mapDetail =
        selectedPosition.current && cMap.current.length
            ? cMap.current[selectedPosition.current.x][
                  selectedPosition.current.y
              ]
            : undefined;

    const {
        totalFuelLoad,
        totalBatteryLoad,
        totalTime: sumTime,
    } = calculateLoad(cMap.current);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAfterSumTime(sumTime);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [sumTime]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAfterGrid(mapDetail?.time ?? 0);
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [mapDetail?.time]);

    const onGridSelect = async (position: GridPosition | undefined) => {
        selectedPosition.current = position;
        console.log(position, "position");
        if (!position) {
            forceRender();
            setFuelInput("0");
            setBatteryInput("0");
            return;
        }
        const { x, y } = position; // 如果最后选择了终点，则不能选择其他
        let lastItem;
        if (cMapPath.current.length) {
            lastItem = cMapPath.current[cMapPath.current.length - 1];
            if (
                cMap.current[lastItem.y][lastItem.x].role === "end" &&
                cMap.current[x][y].role !== "end"
            ) {
                setBatteryInput("0");
                setFuelInput("0");
                return;
            }
        }
        const isStartPoint =
            !cMapPath.current.length &&
            [0, 14].includes(x) &&
            [0, 14].includes(y);

        if (cMap.current[x][y].selected) {
            onMapChange(cMap.current);
            onMapPathChange(cMapPath.current);
            setFuelInput(cMap.current[x][y].fuelLoad.toString());
            setBatteryInput(cMap.current[x][y].batteryLoad.toString());
            forceRender();
            return;
        }
        const previousSelect = cMapPath.current[cMapPath.current.length - 1];

        if (
            isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
            isStartPoint
        ) {
            cMap.current[x][y].selected = true;
            if (cMapPath.current.length) {
                if (lastItem) {
                    const { x: lastX, y: lastY } = lastItem;
                    cMap.current[x][y].fuelLoad =
                        cMap.current[lastX][lastY].fuelLoad;
                    cMap.current[x][y].batteryLoad =
                        cMap.current[lastX][lastY].batteryLoad;
                }
            }

            cMapPath.current.push({ x, y });
        }
        setFuelInput(cMap.current[x][y].fuelLoad.toString());
        setBatteryInput(cMap.current[x][y].batteryLoad.toString());
        onMapChange(cMap.current);
        onMapPathChange(cMapPath.current);
        onResourcesDebounceChange();
        forceRender();
    };

    const onDoubleGridSelect = async (position: GridPosition) => {
        const { x, y } = position;
        const index = cMapPath.current.findIndex(
            (pathItem) => pathItem.x === x && pathItem.y === y,
        );
        if (index !== -1) {
            selectedPosition.current = undefined;
            for (let i = index; i < cMapPath.current.length; i++) {
                const { x, y } = cMapPath.current[i];
                cMap.current[x][y].selected = false;
                cMap.current[x][y].fuelLoad = 0;
                cMap.current[x][y].batteryLoad = 0;
            }
            onMapChange(cMap.current);
            cMapPath.current.splice(index, cMapPath.current.length - index);
            onMapPathChange(cMapPath.current);
            setFuelInput("0");
            setBatteryInput("0");
        }
        forceRender();
    };

    const onQuit = () => {
        onOpen();
    };

    const onInputChange: (
        value: string,
        field: "fuelLoad" | "batteryLoad",
    ) => void = async (value, field) => {
        if (field === "fuelLoad") {
            setFuelInput(value);
        } else {
            setBatteryInput(value);
        }
        if (!selectedPosition.current) {
            return;
        }
        const { x, y } = selectedPosition.current;
        cMap.current[x][y][field] = Number(value);
        onMapChange(cMap.current);
        forceRender();
    };

    const onResourcesDebounceChange = async () => {
        if (!selectedPosition.current) {
            return;
        }
        const { x, y } = selectedPosition.current;
        worker.current.postMessage({
            level,
            mapDetail: cMap.current[x][y],
            x,
            y,
        });
    };

    const onSliderChange: (
        val: number,
        field: "fuelLoad" | "batteryLoad",
    ) => void = (val, field) => {
        onInputChange(String(val), field);
    };

    const handleConfirm = async () => {
        if (totalFuelLoad > myInfo.fuel || totalBatteryLoad > myInfo.battery) {
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={"Insufficient resource"}></SkyToast>
                ),
            });
            return;
        }
        if (
            cMapPath.current[cMapPath.current.length - 1].x !== 7 ||
            cMapPath.current[cMapPath.current.length - 1].y !== 7
        ) {
            toast({
                position: "top",
                render: () => <SkyToast message={"Invaild path"}></SkyToast>,
            });
            return;
        }

        await handleIsEndGame();

        onNextProps(4);
    };

    const handleFirstLoad = async () => {
        for (let i = 0; i < cMapPath.current.length; i++) {
            const { x, y } = cMapPath.current[i];
            worker.current.postMessage({
                level,
                mapDetail: cMap.current[x][y],
                x,
                y,
            });
        }
        forceRender();
    };

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
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "Escape") {
                onQuit();
            }
            if (key === "Enter" && event.shiftKey) {
                handleConfirm();
            }

            if (mapDetail) {
                switch (key) {
                    case "f":
                        fuelInputRef.current?.focus();
                        break;
                    case "o": {
                        let value;
                        if (fuelInput && Number(fuelInput) > 0) {
                            value = Number(fuelInput) - 1;
                        } else {
                            value = 0;
                        }
                        onInputChange(String(value), "fuelLoad");
                        break;
                    }
                    case "p": {
                        let value;
                        if (fuelInput) {
                            value = Number(fuelInput) + 1;
                        } else {
                            value = 1;
                        }
                        onInputChange(String(value), "fuelLoad");
                        break;
                    }

                    case "b":
                        batteryInputRef.current?.focus();
                        break;
                    case ",": {
                        let value;
                        if (batteryInput && Number(batteryInput) > 0) {
                            value = Number(batteryInput) - 1;
                        } else {
                            value = 0;
                        }
                        onInputChange(String(value), "batteryLoad");
                        break;
                    }
                    case ".": {
                        let value;
                        if (batteryInput) {
                            value = Number(batteryInput) + 1;
                        } else {
                            value = 1;
                        }
                        onInputChange(String(value), "batteryLoad");
                        break;
                    }
                }
                forceRender();
            }
        };

        document.addEventListener("keydown", keyboardListener);
        return () => document.removeEventListener("keydown", keyboardListener);
    }, [fuelInput, batteryInput, mapDetail]);

    useEffect(() => {
        worker.current = new Worker(
            new URL("../../utils/gridTimeWoker.ts", import.meta.url),
        );
        worker.current.onmessage = (event) => {
            const result = event.data;
            const { x, y, time, fuel, battery } = result;
            if (
                fuel === cMap.current[x][y].fuelLoad &&
                battery === cMap.current[x][y].batteryLoad
            ) {
                cMap.current[x][y].time = time;
                onMapChange(cMap.current);
                forceRender();
            }
        };
        worker.current.onerror = (event: any) => {
            toast({
                position: "top",
                render: () => (
                    <SkyToast
                        message={"worker error, please reload page"}
                    ></SkyToast>
                ),
            });
            return;
        };
        return () => {
            // 在组件卸载时终止 Web Worker
            worker?.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if (!selectedPosition.current) {
            return;
        }
        onResourcesDebounceChange();
    }, [fuelInput, batteryInput]);

    useEffect(() => {
        if (!worker.current) {
            return;
        }
        handleFirstLoad();
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
            <Header />

            <Footer onQuit={onQuit} onNext={handleConfirm} />
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
                                Fuel {myInfo?.fuel}
                            </Text>
                        </HStack>
                        <HStack>
                            <Img src={BatteryIcon} w="48px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="32px"
                                lineHeight="1"
                            >
                                Battery {myInfo?.battery}
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
                            bg={
                                canInput
                                    ? "linear-gradient(89.97deg, rgba(255, 247, 97, 0.5) -2.72%, rgba(255, 247, 97, 0) 99.97%)"
                                    : "linear-gradient(89.97deg, rgba(171, 171, 171, 0.5) -2.72%, rgba(255, 247, 97, 0) 99.97%)"
                            }
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
                                <HStack margin="8px 0" alignItems="center">
                                    <VStack spacing="0" w="30%">
                                        <Box
                                            sx={{
                                                width: "100px",
                                                height: "100px",
                                                background:
                                                    fuelFocus &&
                                                    `url(${Highlight}) no-repeat center center / contain`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Img src={FuelIcon} w="64px" />
                                        </Box>
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
                                                disabled={!canInput}
                                                fontFamily="Quantico"
                                                fontSize="36px"
                                                color="white"
                                                variant="unstyled"
                                                w="60%"
                                                onChange={(e: any) => {
                                                    // 判断是否是整数
                                                    const reg = /^[0-9]*$/;
                                                    if (
                                                        !reg.test(
                                                            e.target.value,
                                                        )
                                                    ) {
                                                        return;
                                                    }
                                                    onInputChange(
                                                        e.target.value,
                                                        "fuelLoad",
                                                    );
                                                }}
                                                ref={fuelInputRef}
                                                value={fuelInput}
                                                onFocus={() => {
                                                    setFuelFocus(true);
                                                }}
                                                onBlur={() => {
                                                    setFuelFocus(false);
                                                }}
                                            />
                                            <Text
                                                fontFamily="Quantico"
                                                fontSize="20px"
                                                color="#BCBBBE"
                                            >
                                                {totalFuelLoad} / {myInfo.fuel}
                                            </Text>
                                        </HStack>
                                        <Slider
                                            min={0}
                                            max={myInfo?.fuel}
                                            step={1}
                                            onChange={(val) =>
                                                onSliderChange(val, "fuelLoad")
                                            }
                                            value={mapDetail?.fuelLoad ?? 0}
                                            isDisabled={!canInput}
                                        >
                                            <SliderTrack
                                                bg="rgba(217, 217, 217, 0.8)"
                                                h="32px"
                                                borderRadius="20px"
                                            >
                                                <SliderFilledTrack
                                                    bg={
                                                        totalFuelLoad >
                                                        myInfo?.fuel
                                                            ? "#FF0000"
                                                            : "#FFF761"
                                                    }
                                                    borderRadius="20px"
                                                />
                                            </SliderTrack>
                                        </Slider>
                                        {totalFuelLoad > myInfo?.fuel ? (
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
                                <HStack margin="8px 0" alignItems="center">
                                    <VStack spacing="0" w="30%">
                                        <Box
                                            sx={{
                                                width: "100px",
                                                height: "100px",
                                                background:
                                                    batteryFocus &&
                                                    `url(${Highlight}) no-repeat center center / contain`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Img src={BatteryIcon} w="64px" />
                                        </Box>
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
                                                disabled={!canInput}
                                                fontFamily="Quantico"
                                                fontSize="36px"
                                                color="white"
                                                variant="unstyled"
                                                w="60%"
                                                onChange={(e: any) => {
                                                    // 判断是否是整数
                                                    const reg = /^[0-9]*$/;
                                                    if (
                                                        !reg.test(
                                                            e.target.value,
                                                        )
                                                    ) {
                                                        return;
                                                    }

                                                    onInputChange(
                                                        e.target.value,
                                                        "batteryLoad",
                                                    );
                                                }}
                                                ref={batteryInputRef}
                                                value={batteryInput}
                                                onFocus={() => {
                                                    setBatteryFocus(true);
                                                }}
                                                onBlur={() => {
                                                    setBatteryFocus(false);
                                                }}
                                            />
                                            <Text
                                                fontFamily="Quantico"
                                                fontSize="20px"
                                                color="#BCBBBE"
                                            >
                                                {totalBatteryLoad} /{" "}
                                                {myInfo.battery}
                                            </Text>
                                        </HStack>
                                        <Slider
                                            min={0}
                                            max={myInfo?.battery}
                                            step={1}
                                            onChange={(val) =>
                                                onSliderChange(
                                                    val,
                                                    "batteryLoad",
                                                )
                                            }
                                            value={mapDetail?.batteryLoad ?? 0}
                                            isDisabled={!canInput}
                                        >
                                            <SliderTrack
                                                bg="rgba(217, 217, 217, 0.8)"
                                                h="32px"
                                                borderRadius="20px"
                                            >
                                                <SliderFilledTrack
                                                    bg={
                                                        totalBatteryLoad >
                                                        myInfo?.battery
                                                            ? "#FF0000"
                                                            : "#FFF761"
                                                    }
                                                    borderRadius="20px"
                                                />
                                            </SliderTrack>
                                        </Slider>
                                        {totalBatteryLoad > myInfo?.battery ? (
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
                <UniverseTime
                    afterSumTime={afterSumTime}
                    afterGrid={afterGrid}
                    grid={mapDetail?.time ?? 0}
                    sumTime={sumTime}
                ></UniverseTime>

                {/* Grid */}
                {mapDetail && mapDetail.role !== "end" ? (
                    <MapGridInfo mapDetail={mapDetail}></MapGridInfo>
                ) : null}
            </VStack>

            <Box pos="absolute" left="34vw" top="9vh" userSelect="none">
                <Map
                    map={cMap.current}
                    setIsReady={() => ({})}
                    onSelect={onGridSelect}
                    onDoubleGridSelect={onDoubleGridSelect}
                    viewOnly={false}
                    mapPath={cMapPath.current}
                />
            </Box>
        </Box>
    );
};
