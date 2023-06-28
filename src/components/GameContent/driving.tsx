import { Box, Text, Img, VStack, HStack, useToast } from "@chakra-ui/react";
import React, {
    FC,
    useEffect,
    useRef,
    useState,
    useReducer,
    useMemo,
} from "react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";
import FuelIcon from "../../assets/icon-fuel.svg";
import BatteryIcon from "../../assets/icon-battery.svg";
import Aviation from "../../assets/aviation-4.svg";
import { useGameContext } from "../../pages/Game";
import { useSkylabGameFlightRaceContract } from "../../hooks/useContract";
import { getCalculateTimePerGrid } from "../../utils/snark";
import {
    GridPosition,
    isAdjacentToPreviousSelect,
    LargeMap,
    Map,
    MiniMap,
} from "./map";
import { Header } from "./header";
import { calculateDrivingLoad } from "./utils";
import { TutorialGroup } from "./tutorialGroup";

import UniverseTime from "./UniverseTime";
import useBurnerWallet, {
    ApproveGameState,
    BalanceState,
} from "@/hooks/useBurnerWallet";
import { calculateGasMargin } from "@/utils/web3Utils";
import SkyToast from "../Toast";
import { handleError } from "@/utils/error";
import Loading from "../Loading";
import { getTokenInfoValue, updateTokenInfoValue } from "@/utils/tokenInfo";
import useGameState from "@/hooks/useGameState";
import useFeeData from "@/hooks/useFeeData";

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
                fontSize="36px"
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
                fontSize="36px"
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

const SPEED = 1;
const INTERVAL = 1000;
const formatPosition = (val: number) => (val < 0 ? 0 : val > 100 ? 100 : val);

const calculateDirection = (
    currentMapPathItem: GridPosition,
    nextMapPathItem: GridPosition,
) => {
    if (!currentMapPathItem) {
        return "d";
    }
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
    const { getFeeData } = useFeeData();
    const timer = useRef(null);
    const {
        tokenId,
        map_params,
        myInfo,
        map,
        mapPath,
        level,
        onMapChange,
        onOpen,
        onNext,
    } = useGameContext();
    const getGameState = useGameState();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const {
        burner,
        getBalanceState,
        transferGas,
        approveForGame,
        getApproveGameState,
    } = useBurnerWallet(tokenId);
    const toast = useToast({
        position: "top",
    });
    const [commitData, setCommitData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [actualGamePath, setActualGamePath] = useState<GridPosition[]>([
        mapPath[0],
    ]);
    const autoRef = useRef(true);

    const [path, setPath] = useState([]);
    const [used_resources, setUsedResources] = useState([]);
    const [isZoomIn, setIsZoomIn] = useState(true);
    const [position, setPosition] = useState({
        x: mapPath[0].y === 0 ? 3 : 97,
        y: mapPath[0].x === 0 ? 3 : 97,
    });
    const animationRef = useRef<number>();
    const directionRef = useRef<"w" | "a" | "s" | "d">("d");

    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const [mapX, mapY] = useMemo(
        () => [
            Math.floor(((position.y / 100) * 208 + 1) / 14),
            Math.floor(((position.x / 100) * 208 + 1) / 14),
        ],
        [position],
    );
    const { totalTime: sumTime } = calculateDrivingLoad(map, actualGamePath);

    const mapDetail = useMemo(() => {
        return map[mapX][mapY];
    }, [map, mapX, mapY]);

    const drivingMap = useMemo(
        () =>
            map?.map((row, x) =>
                row.map((item, y) => ({
                    ...item,
                    selected: !!actualGamePath.find(
                        (item) => item.x === x && item.y === y,
                    ),
                })),
            ),
        [map, actualGamePath, mapPath],
    );

    const onQuit = () => {
        onOpen();
    };

    const handleGetInputData = async () => {
        let seed = getTokenInfoValue(tokenId, "seed");
        if (!seed) {
            seed = Math.floor(Math.random() * 1000000) + 1;
            updateTokenInfoValue(tokenId, {
                seed,
            });
        }

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

        setPath(path);
        setUsedResources(used_resources);
        // 启动一个worker，用于计算mercury的calldata
        const mercuryWorker = new Worker(
            new URL("../../utils/mercuryCalldataWorker.ts", import.meta.url),
        );
        // 接收worker的消息，提交mercury的calldata
        mercuryWorker.onmessage = async (event) => {
            const commitData = event.data;
            setCommitData(commitData);
        };
        mercuryWorker.onerror = (event: any) => {
            toast({
                render: () => (
                    <SkyToast
                        message={"worker error, please reload page"}
                    ></SkyToast>
                ),
            });
            return;
        };
        // 向worker发送消息，计算mercury的calldata
        mercuryWorker.postMessage({ input });
    };

    const endGame = async () => {
        try {
            const { a, b, c, Input } = commitData;
            setLoading(true);
            const balanceState = await getBalanceState();
            if (balanceState === BalanceState.ACCOUNT_LACK) {
                toast({
                    render: () => (
                        <SkyToast
                            message={
                                "You have not enough balance to transfer burner wallet"
                            }
                        ></SkyToast>
                    ),
                });
                return;
            } else if (balanceState === BalanceState.LACK) {
                await transferGas();
            }

            const approveState = await getApproveGameState();
            if (approveState === ApproveGameState.NOT_APPROVED) {
                await approveForGame();
            }
            const feeData = await getFeeData();
            const gas = await skylabGameFlightRaceContract
                .connect(burner)
                .estimateGas.commitPath(tokenId, a, b, c, Input);

            updateTokenInfoValue(tokenId, {
                myUsedResources: used_resources,
                myPath: path,
                myTime: sumTime.toString(),
            });
            console.log("start commit");
            const res = await skylabGameFlightRaceContract
                .connect(burner)
                .commitPath(tokenId, a, b, c, Input, {
                    gasLimit: calculateGasMargin(gas),
                    ...feeData,
                });
            await res.wait();
            console.log("success commit");
            setLoading(false);

            toast({
                render: () => (
                    <SkyToast message={"Successfully commitPath"}></SkyToast>
                ),
            });
            onNext(6);
        } catch (error) {
            setLoading(false);
            toast({
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };

    useEffect(() => {
        if (mapDetail.role === "end") {
            animationRef.current && clearInterval(animationRef.current);
            if (commitData) {
                timer.current && clearInterval(timer.current);
                endGame();
            } else {
                setLoading(true);
            }
        }
    }, [mapDetail, commitData]);

    const handleXYChange = async () => {
        const prevGrid = actualGamePath.length
            ? actualGamePath[actualGamePath.length - 1]
            : undefined;
        if (
            actualGamePath.length &&
            mapX === prevGrid?.x &&
            mapY === prevGrid?.y
        ) {
            return;
        }

        const fItem = actualGamePath.find((item) => {
            return item.x === mapX && item.y === mapY;
        });
        if (
            isAdjacentToPreviousSelect({ x: mapX, y: mapY }, prevGrid) &&
            !fItem
        ) {
            const beforeTime = map[mapX][mapY].time;
            if (!beforeTime) {
                const _map = [...map];
                const mapItem = _map[mapX][mapY];
                const time = await getCalculateTimePerGrid(level, mapItem);
                _map[mapX][mapY].time = time;
                onMapChange(_map);
            }
            const newActualGamePath = [
                ...actualGamePath,
                {
                    x: mapX,
                    y: mapY,
                },
            ];
            setActualGamePath(newActualGamePath);
        }
    };

    useEffect(() => {
        handleXYChange();
    }, [mapX, mapY, actualGamePath]);

    useEffect(() => {
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

                return { x, y };
            });
        }, INTERVAL);

        return () => {
            clearInterval(animationRef.current);
        };
    }, []);

    useEffect(() => {
        handleGetInputData();
    }, []);

    useEffect(() => {
        timer.current = setInterval(async () => {
            const state = await getGameState(tokenId);
            if ([5, 6, 7].includes(state)) {
                onNext(6);
            }
        }, 3000);
        return () => timer.current && clearInterval(timer.current);
    }, [tokenId, skylabGameFlightRaceContract]);

    return (
        <Box
            pos="relative"
            bgImage={GameBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            {loading && <Loading></Loading>}
            <Footer
                onQuit={onQuit}
                isZoomIn={isZoomIn}
                onZoomChange={() => setIsZoomIn((val) => !val)}
            />
            <Header />
            <Box pos="absolute" right="36px" bottom="18vh">
                <TutorialGroup showCharacter={true} horizontal={true} />
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
                <UniverseTime
                    afterSumTime={sumTime}
                    afterGrid={mapDetail?.time ?? 0}
                    grid={mapDetail?.time ?? 0}
                    sumTime={sumTime}
                ></UniverseTime>
            </VStack>
            <Box pos="absolute" left="33vw" top="9vh" userSelect="none">
                {isZoomIn ? (
                    <LargeMap
                        map={drivingMap}
                        position={position}
                        aviation={{
                            img: myInfo.img,
                            transform: calculateAviationTransform(
                                directionRef.current,
                            ),
                        }}
                        mapPath={actualGamePath}
                    />
                ) : (
                    <Map
                        map={drivingMap}
                        setIsReady={() => ({})}
                        onSelect={() => ({})}
                        viewOnly={true}
                        mapPath={mapPath}
                        aviation={{
                            img: myInfo.img,
                            pos: position,
                            transform: calculateAviationTransform(
                                directionRef.current,
                            ),
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};
