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
import FuelIcon from "../../assets/icon-fuel.svg";
import BatteryIcon from "../../assets/icon-battery.svg";
import GridImg1 from "./assets/grid-img1.svg";
import GridImg2 from "./assets/grid-img2.svg";
import GridImg3 from "./assets/grid-img3.svg";
import GridImg4 from "./assets/grid-img4.svg";
import Highlight from "./assets/highlight.png";

import { useGameContext } from "../../pages/Game";
import { GridPosition, isAdjacentToPreviousSelect, Map } from "./map";
import { Header } from "./header";
import { calculateLoad } from "./utils";
import { TutorialGroup } from "./tutorialGroup";
import MapGridInfo from "./MapGridInfo";
import UniverseTime from "./UniverseTime";
import SkyToast from "../Toast";
import CallTimeOut from "./CallTimeOut";
import { updateTokenInfoValue } from "@/utils/tokenInfo";
import useGameState from "@/hooks/useGameState";
import useSkyToast from "@/hooks/useSkyToast";

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
                fontSize="36px"
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
                fontSize="36px"
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
                fontSize="36px"
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

const KeyItem = ({ keyValue }: { keyValue: string }) => {
    return (
        <Box
            sx={{
                border: "1px solid #FFF",
                borderRadius: "5px",
                background: "rgba(255, 255, 255, 0.2)",
                width: "24px",
                lineHeight: "20px",
                textAlign: "center",
                fontSize: "14px",
                fontFamily: "Orbitron",
            }}
        >
            {keyValue}
        </Box>
    );
};

export const Presetting: FC = () => {
    const toast = useSkyToast();
    const worker = useRef<Worker>();
    const resourceTimer = useRef(null);
    const {
        tokenId,
        onNext,
        myInfo,
        map,
        mapPath,
        level,
        onMapChange,
        onMapPathChange,
        onOpen,
        myState,
    } = useGameContext();
    const [tutorialGroup, setTutorialGroup] = useState(false);
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
        !(
            [0, 14].includes(selectedPosition.current.x) &&
            [0, 14].includes(selectedPosition.current.y)
        ) &&
        !(selectedPosition.current.x === 7 && selectedPosition.current.y === 7);

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
        if (!position) {
            setFuelInput("0");
            setBatteryInput("0");
            forceRender();
            return;
        }
        const { x, y } = position; // 如果最后选择了终点，则不能选择其他

        const isStartPoint =
            !cMapPath.current.length &&
            [0, 14].includes(x) &&
            [0, 14].includes(y);

        if (cMap.current[x][y].selected) {
            updateTokenInfoValue(tokenId, {
                map: cMap.current,
                mapPath: cMapPath.current,
            });
            setFuelInput(cMap.current[x][y].fuelLoad.toString());
            setBatteryInput(cMap.current[x][y].batteryLoad.toString());
            forceRender();
            return;
        }

        let lastItem;
        if (cMapPath.current.length) {
            lastItem = cMapPath.current[cMapPath.current.length - 1];
            if (
                cMap.current[lastItem.y][lastItem.x].role === "end" &&
                cMap.current[x][y].role !== "end"
            ) {
                setBatteryInput("0");
                setFuelInput("0");
                worker.current.postMessage({
                    level,
                    mapDetail: cMap.current[x][y],
                    x,
                    y,
                });
                forceRender();
                return;
            }
        }
        const previousSelect = cMapPath.current[cMapPath.current.length - 1];

        let newFuleInput = 0;
        let newBatteryInput = 0;

        if (
            isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
            isStartPoint
        ) {
            cMap.current[x][y].selected = true;
            if (cMapPath.current.length > 0 && !(x === 7 && y === 7)) {
                const { x: lastX, y: lastY } = lastItem;
                const { totalFuelLoad, totalBatteryLoad } = calculateLoad(
                    cMap.current,
                );
                newFuleInput = cMap.current[lastX][lastY].fuelLoad;
                newBatteryInput = cMap.current[lastX][lastY].batteryLoad;

                if (newFuleInput + totalFuelLoad > myInfo?.fuel) {
                    newFuleInput = myInfo?.fuel - totalFuelLoad;
                }
                if (newBatteryInput + totalBatteryLoad > myInfo?.battery) {
                    newBatteryInput = myInfo?.battery - totalBatteryLoad;
                }
                cMap.current[x][y].fuelLoad = newFuleInput;
                cMap.current[x][y].batteryLoad = newBatteryInput;
            }

            cMapPath.current.push({ x, y });
        }

        setFuelInput(String(newFuleInput));
        setBatteryInput(String(newBatteryInput));
        updateTokenInfoValue(tokenId, {
            map: cMap.current,
            mapPath: cMapPath.current,
        });
        forceRender();
        worker.current.postMessage({
            level,
            mapDetail: cMap.current[x][y],
            x,
            y,
        });
    };

    const onDoubleGridSelect = async (position: GridPosition) => {
        const { x, y } = position;
        const index = cMapPath.current.findIndex(
            (pathItem) => pathItem.x === x && pathItem.y === y,
        );
        if (index !== -1) {
            for (let i = index; i < cMapPath.current.length; i++) {
                const { x, y } = cMapPath.current[i];
                cMap.current[x][y].selected = false;
                cMap.current[x][y].fuelLoad = 0;
                cMap.current[x][y].batteryLoad = 0;
            }
            cMapPath.current.splice(index, cMapPath.current.length - index);
            setFuelInput("0");
            setBatteryInput("0");

            if (index === 0) {
                selectedPosition.current = undefined;
            } else {
                selectedPosition.current = cMapPath.current[index - 1];
            }
        }
        updateTokenInfoValue(tokenId, {
            map: cMap.current,
            mapPath: cMapPath.current,
        });
        forceRender();

        if (cMapPath.current.length === 0) {
            onNext(2);
        }
    };
    const onQuit = () => {
        onOpen();
    };

    const onInputChange: (
        value: string,
        field: "fuelLoad" | "batteryLoad",
    ) => void = async (value, field) => {
        if (!selectedPosition.current) {
            return;
        }
        const { x, y } = selectedPosition.current;
        let newValue = Number(value);
        if (field === "fuelLoad") {
            if (
                newValue + totalFuelLoad - cMap.current[x][y][field] >
                myInfo?.fuel
            ) {
                newValue =
                    myInfo?.fuel - totalFuelLoad + cMap.current[x][y][field];
            }
            setFuelInput(String(newValue));
        } else {
            if (
                newValue + totalBatteryLoad - cMap.current[x][y][field] >
                myInfo?.battery
            ) {
                newValue =
                    myInfo?.battery -
                    totalBatteryLoad +
                    cMap.current[x][y][field];
            }
            setBatteryInput(String(newValue));
        }

        cMap.current[x][y][field] = newValue;

        if (resourceTimer.current) {
            clearTimeout(resourceTimer.current);
        }
        resourceTimer.current = setTimeout(() => {
            worker.current.postMessage({
                level,
                mapDetail: cMap.current[x][y],
                x,
                y,
            });
        }, 500);

        onMapChange(cMap.current);
        updateTokenInfoValue(tokenId, {
            map: cMap.current,
        });
        forceRender();
    };

    const onSliderChange: (
        val: number,
        field: "fuelLoad" | "batteryLoad",
    ) => void = (val, field) => {
        onInputChange(String(val), field);
    };

    const handleConfirm = async () => {
        if (totalFuelLoad > myInfo.fuel || totalBatteryLoad > myInfo.battery) {
            toast("Insufficient resource");
            return;
        }
        if (
            cMapPath.current[cMapPath.current.length - 1].x !== 7 ||
            cMapPath.current[cMapPath.current.length - 1].y !== 7
        ) {
            toast("Invaild path");
            return;
        }
        onMapChange(cMap.current);
        onMapPathChange(cMapPath.current);
        updateTokenInfoValue(tokenId, {
            map: cMap.current,
            mapPath: cMapPath.current,
        });
        onNext(4);
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
                if (tutorialGroup) {
                    return;
                }
                onQuit();
            }
            if (key === "Enter" && event.shiftKey) {
                handleConfirm();
            }
            if (!canInput) {
                return;
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
    }, [
        fuelInput,
        batteryInput,
        mapDetail,
        totalBatteryLoad,
        totalFuelLoad,
        tutorialGroup,
    ]);

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
            toast("worker error, please reload page");
            return;
        };
        return () => {
            // 在组件卸载时终止 Web Worker
            worker?.current?.terminate();
        };
    }, []);

    useEffect(() => {
        if ([5, 6, 7].includes(myState)) {
            onNext(6);
        }
    }, [myState]);

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
                <TutorialGroup
                    showCharacter={true}
                    horizontal={true}
                    onChange={(status) => {
                        setTutorialGroup(status);
                    }}
                />
            </Box>

            <VStack
                w="27.5vw"
                pos="absolute"
                left="2vw"
                top="12vh"
                userSelect="none"
                spacing="2vh"
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
                    <Text fontFamily="Quantico" fontSize="36px" lineHeight="1">
                        Stock
                    </Text>
                    <HStack justifyContent="space-between">
                        <HStack>
                            <Img src={FuelIcon} w="48px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="24px"
                                lineHeight="1"
                            >
                                Fuel {myInfo?.fuel}
                            </Text>
                        </HStack>
                        <HStack>
                            <Img src={BatteryIcon} w="48px" />
                            <Text
                                fontFamily="Quantico"
                                fontSize="24px"
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
                    >
                        <Box
                            fontFamily="Orbitron"
                            fontSize="36px"
                            fontWeight={600}
                            color="#FFF761"
                            bg={
                                canInput
                                    ? "linear-gradient(89.97deg, rgba(255, 247, 97, 0.5) -2.72%, rgba(255, 247, 97, 0) 99.97%)"
                                    : "linear-gradient(89.97deg, rgba(171, 171, 171, 0.5) -2.72%, rgba(255, 247, 97, 0) 99.97%)"
                            }
                            padding="0 24px"
                        >
                            Load
                        </Box>
                        <HStack sx={{ paddingTop: "10px" }}>
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
                                                marginBottom: "5px",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Img src={FuelIcon} w="64px" />
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <KeyItem
                                                        keyValue={"F"}
                                                    ></KeyItem>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                        >
                                                            <KeyItem
                                                                keyValue={"O"}
                                                            ></KeyItem>
                                                        </Box>

                                                        <KeyItem
                                                            keyValue={"P"}
                                                        ></KeyItem>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Text
                                                fontFamily="Quantico"
                                                fontSize="32px"
                                                lineHeight="1"
                                                color="white"
                                            >
                                                Fuel
                                            </Text>
                                        </Box>
                                    </VStack>
                                    <VStack
                                        spacing="0px"
                                        w="65%"
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
                                                flex={1}
                                                sx={{
                                                    padding: 0,
                                                    height: "32px",
                                                }}
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
                                                {myInfo?.fuel - totalFuelLoad}{" "}
                                                Remaining
                                            </Text>
                                        </HStack>
                                        <Slider
                                            min={0}
                                            max={myInfo?.fuel}
                                            step={1}
                                            onChange={(val) =>
                                                onSliderChange(val, "fuelLoad")
                                            }
                                            h="32px"
                                            value={mapDetail?.fuelLoad ?? 0}
                                            isDisabled={!canInput}
                                        >
                                            <SliderTrack
                                                bg="rgba(217, 217, 217, 0.8)"
                                                h="32px"
                                                borderRadius="20px"
                                            >
                                                <SliderFilledTrack
                                                    bg={"#FFF761"}
                                                    borderRadius="20px"
                                                />
                                            </SliderTrack>
                                        </Slider>
                                        <Slider
                                            min={0}
                                            max={myInfo?.fuel}
                                            step={1}
                                            h="14px"
                                            value={myInfo?.fuel - totalFuelLoad}
                                            marginTop="7px !important"
                                        >
                                            <SliderTrack
                                                bg="rgba(217, 217, 217, 0.8)"
                                                h="14px"
                                                borderRadius="20px"
                                                border="2px solid #8DF6F5"
                                            >
                                                <SliderFilledTrack
                                                    bg={"#8DF6F5"}
                                                    borderRadius="20px"
                                                />
                                            </SliderTrack>
                                        </Slider>
                                        <Text
                                            fontFamily="Quantico"
                                            fontSize="20px"
                                            color="#BCBBBE"
                                            textAlign={"right"}
                                            w="100%"
                                        >
                                            {myInfo?.fuel - totalFuelLoad} /{" "}
                                            {myInfo.fuel}
                                        </Text>
                                    </VStack>
                                </HStack>
                                <HStack margin="8px 0" alignItems="center">
                                    <VStack spacing="0" w="30%">
                                        <Box
                                            sx={{
                                                height: "100px",
                                                background:
                                                    batteryFocus &&
                                                    `url(${Highlight}) no-repeat center center / contain`,
                                                marginBottom: "5px",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Img
                                                    src={BatteryIcon}
                                                    w="64px"
                                                />
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <KeyItem
                                                        keyValue={"B"}
                                                    ></KeyItem>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            marginTop: "5px",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                marginRight:
                                                                    "5px",
                                                            }}
                                                        >
                                                            <KeyItem
                                                                keyValue={","}
                                                            ></KeyItem>
                                                        </Box>

                                                        <KeyItem
                                                            keyValue={"."}
                                                        ></KeyItem>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Text
                                                fontFamily="Quantico"
                                                fontSize="32px"
                                                lineHeight="1"
                                                color="white"
                                            >
                                                Battery
                                            </Text>
                                        </Box>
                                    </VStack>
                                    <VStack
                                        spacing="0px"
                                        w="65%"
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
                                                flex={1}
                                                sx={{
                                                    padding: 0,
                                                    height: "32px",
                                                }}
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
                                                sx={{
                                                    color: "#BCBBBE",
                                                    fontSize: "20px",
                                                }}
                                            >
                                                {myInfo?.battery -
                                                    totalBatteryLoad}{" "}
                                                Remaining
                                            </Text>
                                        </HStack>
                                        <Slider
                                            min={0}
                                            max={myInfo?.battery}
                                            step={1}
                                            h="32px"
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
                                                    bg={"#FFF761"}
                                                    borderRadius="20px"
                                                />
                                            </SliderTrack>
                                        </Slider>
                                        <Slider
                                            min={0}
                                            max={myInfo?.battery}
                                            step={1}
                                            h="14px"
                                            value={
                                                myInfo?.battery -
                                                totalBatteryLoad
                                            }
                                            marginTop="7px !important"
                                        >
                                            <SliderTrack
                                                bg="rgba(217, 217, 217, 0.8)"
                                                h="14px"
                                                borderRadius="20px"
                                                border="2px solid #8DF6F5"
                                            >
                                                <SliderFilledTrack
                                                    bg={"#8DF6F5"}
                                                    borderRadius="20px"
                                                />
                                            </SliderTrack>
                                        </Slider>

                                        <Text
                                            fontFamily="Quantico"
                                            fontSize="20px"
                                            color="#BCBBBE"
                                            textAlign={"right"}
                                            w="100%"
                                        >
                                            {myInfo?.battery - totalBatteryLoad}{" "}
                                            / {myInfo.battery}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </HStack>
                    </Box>
                </Box>
                <CallTimeOut></CallTimeOut>
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
                    currentSelectedGrid={selectedPosition.current}
                    onDoubleGridSelect={onDoubleGridSelect}
                    viewOnly={false}
                    mapPath={cMapPath.current}
                />
            </Box>
        </Box>
    );
};
