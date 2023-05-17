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
import FuelIcon from "../../assets/icon-fuel.svg";
import BatteryIcon from "../../assets/icon-battery.svg";
import GridBlock from "../../assets/grid-block.svg";
import SumBlock from "../../assets/sum-block.svg";
import GridImg1 from "./assets/grid-img1.svg";
import GridImg2 from "./assets/grid-img2.svg";
import GridImg3 from "./assets/grid-img3.svg";
import GridImg4 from "./assets/grid-img4.svg";
import Highlight from "./assets/highlight.svg";
import LoadingIcon from "@/assets/loading.svg";

import { useGameContext } from "../../pages/Game";
import {
    getGridStyle,
    GridPosition,
    isAdjacentToPreviousSelect,
    Map,
    SpecialIcon,
} from "./map";
import { Header } from "./header";
import { MapInfo } from ".";
import { calculateLoad, decreaseLoad, increaseLoad } from "./utils";
import { TutorialGroup } from "./tutorialGroup";
import {
    getCalculateTimePerGrid,
    mercuryCalldata,
    pathHashCalldata,
} from "@/utils/snark";
import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";
import useDebounce from "@/utils/useDebounce";
import MapGridInfo from "./MapGridInfo";
import UniverseTime from "./UniverseTime";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import { motion } from "framer-motion";

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

const MAX_BATTERY = 200;
const MAX_FUEL = 200;

export const Presetting: FC<Props> = ({}) => {
    const {
        tokenId,
        onNext: onNextProps,
        map_params,
        myInfo,
        map,
        mapPath,
        level,
        onMapChange,
        onMapPathChange,
        onOpen,
    } = useGameContext();
    const [loading, setLoading] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<GridPosition>(
        mapPath.length ? mapPath[mapPath.length - 1] : null,
    );
    const fuelInputRef = useRef<HTMLInputElement | null>(null);
    const batteryInputRef = useRef<HTMLInputElement | null>(null);
    const prevLoad = useRef({ fuel: 0, battery: 0 });
    const mapDetailRef = useRef<MapInfo>();
    const [fuelInput, setFuelInput] = useState("0");
    const [fuelFocus, setFuelFocus] = useState(false);
    const [batteryInput, setBatteryInput] = useState("0");
    const [batteryFocus, setBatteryFocus] = useState(false);
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const sumTime = useMemo(() => {
        let time = 0;
        for (let i = 0; i < mapPath.length; i++) {
            const { x, y } = mapPath[i];
            if (!!map[x][y].time) {
                time += map[x][y].time;
            }
        }
        return time;
    }, [map, mapPath]);

    const mapDetail = useMemo(
        () =>
            selectedPosition && map.length
                ? map[selectedPosition.x][selectedPosition.y]
                : undefined,
        [selectedPosition, map],
    );

    const { totalFuelLoad, totalBatteryLoad, totalTime } = calculateLoad(map);
    const onGridSelect = async (position: GridPosition | undefined) => {
        setSelectedPosition(position);

        if (!position) {
            setBatteryInput("0");
            setFuelInput("0");
            return;
        }
        const _map = [...map];
        const _mapPath = [...mapPath];
        const { x, y } = position; // 如果最后选择了终点，则不能选择其他
        console.log(x, y, " x, y ");
        if (mapPath.length) {
            const lastItem = mapPath[mapPath.length - 1];
            if (
                _map[lastItem.x][lastItem.y].role === "end" &&
                _map[x][y].role !== "end"
            ) {
                setBatteryInput("0");
                setFuelInput("0");
                return;
            }
        }
        const isStartPoint =
            !mapPath.length && [0, 14].includes(x) && [0, 14].includes(y);

        setBatteryInput(String(_map[x][y].batteryLoad) ?? "0");
        setFuelInput(String(_map[x][y].fuelLoad) ?? "0");

        if (_map[x][y].selected) {
            onMapChange(_map);
            onMapPathChange(_mapPath);
            return;
        }
        const previousSelect = mapPath[mapPath.length - 1];
        const time = await getCalculateTimePerGrid(level, _map[x][y]);
        _map[x][y].time = time;
        if (
            isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
            isStartPoint
        ) {
            _map[x][y].selected = true;
            _mapPath.push({ x, y });
        }
        onMapChange(_map);
        onMapPathChange(_mapPath);
    };

    const onNext = () => {
        onNextProps();
    };

    const onQuit = () => {
        onOpen();
    };

    const onInputChange: (
        value: string,
        field: "fuelLoad" | "batteryLoad",
    ) => void = async (value, field) => {
        const _map = [...map];
        if (field === "fuelLoad") {
            setFuelInput(value);
        } else {
            setBatteryInput(value);
        }
        if (!selectedPosition) {
            return;
        }
        const { x, y } = selectedPosition;
        _map[x][y][field] = Number(value);
        onMapChange(_map);
    };
    const fuelDebounce = useDebounce(fuelInput, 1000);
    const batteryDebounce = useDebounce(batteryInput, 1000);

    useEffect(() => {
        if (!selectedPosition) {
            return;
        }
        onResourcesDebounceChange();
    }, [fuelDebounce, batteryDebounce]);

    const onResourcesDebounceChange = async () => {
        const _map = [...map];
        const { x, y } = selectedPosition;
        const time = await getCalculateTimePerGrid(level, _map[x][y]);
        _map[x][y].time = time;
        onMapChange(_map);
    };

    const onSliderChange: (val: number, field: string) => void = (
        val,
        field,
    ) => {
        mapDetail![field as "fuelLoad"] = val;
        forceRender();
    };

    const handleConfirm = async () => {
        try {
            setLoading(true);
            const seed = localStorage.getItem("seed");
            const path = Array.from({ length: 50 }, () => [7, 7]);
            const used_resources = Array.from({ length: 50 }, () => [0, 0]);
            const start_fuel = myInfo.fuel;
            const start_battery = myInfo.battery;
            const level_scaler = 2 ** (level - 1);
            let c1;
            if (level <= 7) {
                c1 = 2;
            } else if (level <= 12) {
                c1 = 6;
            } else {
                c1 = 17;
            }
            console.log(mapPath, "mapPath");
            mapPath.forEach((item, index) => {
                const { x, y } = item;
                path[index][0] = x;
                path[index][1] = y;
                used_resources[index][0] = map[x][y].fuelLoad;
                used_resources[index][1] = map[x][y].batteryLoad;
            });
            const input = {
                map_params: map_params,
                seed,
                level_scaler,
                c1,
                start_fuel,
                start_battery,
                used_resources,
                path,
            };
            const { a, b, c, Input } = await mercuryCalldata(input);
            const res = await skylabGameFlightRaceContract.commitPath(
                tokenId,
                a,
                b,
                c,
                Input,
            );
            await res.wait();
            localStorage.setItem(
                "used_resources",
                JSON.stringify(used_resources),
            );
            localStorage.setItem("path", JSON.stringify(path));
            localStorage.setItem("time", sumTime.toString());

            setLoading(false);
            onNextProps(6);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleFirstLoad = async () => {
        const _map = [...map];
        for (let i = 0; i < mapPath.length; i++) {
            const { x, y } = mapPath[i];
            const mapItem = _map[x][y];
            const time = await getCalculateTimePerGrid(level, mapItem);
            mapItem.time = time;
            onMapChange(_map);
        }
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
        handleFirstLoad();
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
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        height: "100px",
                        width: "100px",
                        zIndex: 999,
                    }}
                >
                    <motion.img
                        src={LoadingIcon}
                        style={{
                            rotate: 0,
                            width: "100px",
                        }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 2,
                        }}
                        animate={{ rotate: 360 }}
                    />
                </Box>
            )}
            <Header />

            <Footer onQuit={onQuit} onNext={handleConfirm} />
            {/* <Footer onQuit={onQuit} onNext={handleGetRevealParams} /> */}

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
                                                fontFamily="Quantico"
                                                fontSize="36px"
                                                color="white"
                                                variant="unstyled"
                                                w="60%"
                                                onChange={(e: any) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        "fuelLoad",
                                                    )
                                                }
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
                                                fontFamily="Quantico"
                                                fontSize="36px"
                                                color="white"
                                                variant="unstyled"
                                                w="60%"
                                                onChange={(e: any) =>
                                                    onInputChange(
                                                        e.target.value,
                                                        "batteryLoad",
                                                    )
                                                }
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
                    mapDetail={mapDetail}
                    sumTime={sumTime}
                ></UniverseTime>

                {/* Grid */}
                {mapDetail && mapDetail.role !== "end" ? (
                    <MapGridInfo mapDetail={mapDetail}></MapGridInfo>
                ) : null}
            </VStack>

            <Box pos="absolute" left="34vw" top="9vh" userSelect="none">
                <Map
                    map={map}
                    setIsReady={() => ({})}
                    onSelect={onGridSelect}
                    viewOnly={false}
                    inputing={fuelFocus || batteryFocus}
                    mapPath={mapPath}
                />
            </Box>
        </Box>
    );
};
