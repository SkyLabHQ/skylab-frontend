import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer, useRef, useState } from "react";

import Destination from "../../../assets/destination.svg";
import GridLevel1 from "../../../assets/grid-level-1.svg";
import GridLevel2 from "../../../assets/grid-level-2.svg";
import GridLevel3 from "../../../assets/grid-level-3.svg";
import GridLevel4 from "../../../assets/grid-level-4.svg";
import Volcano from "../../../assets/icon-volcano.svg";
import Forest from "../../../assets/icon-forest.svg";
import Dreamland from "../../../assets/icon-dreamland.svg";
import Tundra from "../../../assets/icon-tundra.svg";
import VolcanoDetail from "../../../assets/icon-volcano-detail.svg";
import ForestDetail from "../../../assets/icon-forest-detail.svg";
import DreamlandDetail from "../../../assets/icon-dreamland-detail.svg";
import TundraDetail from "../../../assets/icon-tundra-detail.svg";
import { useGameContext } from "../../../pages/Game";
import { getRecordFromLocalStorage, mergeIntoLocalStorage } from "../utils";
import { MapInfo } from "../";
import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";

type Props = {
    startPoint: GridPosition;
    setIsReady: (isReady: boolean) => void;
    map: MapInfo[][];
    mapPath: GridPosition[];
    aviation?: {
        img: string;
        pos: { x: number; y: number };
        transform: string;
    };
    onStartPoint: (position: GridPosition) => void;
};

export type GridPosition = {
    x: number;
    y: number;
};

export const getGridStyle = (grid: MapInfo, currentGrid: boolean) => {
    const border = grid.hover
        ? "5px solid #FFF530"
        : grid.selected
        ? "5px solid orange"
        : undefined;

    if (grid.selected) {
        return {
            bg: currentGrid ? "#FFF761" : "white",
            border,
        };
    }

    switch (grid.role) {
        case "start":
            return {
                bg: "white",
                border: border ?? "5px solid #237EFF",
            };
        case "normal":
            return {
                bg: currentGrid
                    ? "#FF0011"
                    : ["#8DF6F5", "#82D1D0", "#6C9392", "#475F5E"][
                          (grid.fuelScaler ?? 1) - 1
                      ],
                border,
            };
    }
};

const getIsStartPoint = (x: number, y: number) => {
    return [0, 14].includes(x) && [0, 14].includes(y);
};

export const getGridImg = (grid: MapInfo) =>
    [GridLevel1, GridLevel2, GridLevel3, GridLevel4][
        (grid.batteryScaler ?? 1) - 1
    ];

export const SpecialIcon: FC<{ grid: MapInfo; isDetail?: boolean }> = ({
    grid,
    isDetail,
}) => {
    const { level } = useGameContext();
    if (!level || !grid.distance) {
        return null;
    }
    const icon = (
        isDetail
            ? {
                  50: VolcanoDetail,
                  20: ForestDetail,
                  30: DreamlandDetail,
                  40: TundraDetail,
              }
            : {
                  50: Volcano,
                  20: Forest,
                  30: Dreamland,
                  40: Tundra,
              }
    )[grid.distance / level];
    return icon ? <Img src={icon} /> : null;
};

export const StartMap: FC<Props> = ({
    setIsReady,
    map,
    mapPath,
    startPoint,
    onStartPoint,
}) => {
    const currentSelectedGridRef = useRef<GridPosition | undefined>(
        (() => {
            const gameInfo = getRecordFromLocalStorage("game-map");
            if (gameInfo?.currentSelectedGrid) {
                return gameInfo.currentSelectedGrid as GridPosition | undefined;
            }
            return undefined;
        })(),
    );
    const currentHoverGridRef = useRef<GridPosition | undefined>(
        (() => {
            const gameInfo = getRecordFromLocalStorage("game-map");
            if (gameInfo?.currentHoverGrid) {
                return gameInfo.currentHoverGrid as GridPosition | undefined;
            }
            return undefined;
        })(),
    );
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    mergeIntoLocalStorage("game-map", {
        map,
        mapPath,
        currentSelectedGrid: currentSelectedGridRef.current,
        currentHoverGrid: currentHoverGridRef.current,
    });

    setIsReady(
        mapPath.length
            ? map[mapPath[mapPath.length - 1].x][mapPath[mapPath.length - 1].y]
                  .role === "end"
            : false,
    );

    const onMouseClick = (x: number, y: number) => {
        if (!getIsStartPoint(x, y)) {
            return;
        }
        onStartPoint({ x, y });
        return;
    };
    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (["w", "a", "s", "d"].includes(key)) {
                if (startPoint.x === 0 && startPoint.y === 0) {
                    if (key === "d") {
                        onStartPoint({ x: 0, y: 14 });
                    } else if (key === "s") {
                        onStartPoint({ x: 14, y: 0 });
                    }
                } else if (startPoint.x === 0 && startPoint.y === 14) {
                    if (key === "a") {
                        onStartPoint({ x: 0, y: 0 });
                    } else if (key === "s") {
                        onStartPoint({ x: 14, y: 14 });
                    }
                } else if (startPoint.x === 14 && startPoint.y === 0) {
                    if (key === "d") {
                        onStartPoint({ x: 14, y: 14 });
                    } else if (key === "w") {
                        onStartPoint({ x: 0, y: 0 });
                    }
                } else if (startPoint.x === 14 && startPoint.y === 14) {
                    if (key === "a") {
                        onStartPoint({ x: 14, y: 0 });
                    } else if (key === "w") {
                        onStartPoint({ x: 0, y: 14 });
                    }
                }
            }
            if (
                key === "Enter" &&
                !event.shiftKey &&
                currentHoverGridRef.current
            ) {
                onMouseClick(
                    currentHoverGridRef.current.x,
                    currentHoverGridRef.current.y,
                );
            }
        };

        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [startPoint, !!mapPath.length]);

    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing="0.5vw">
                {map.map((row, x) => (
                    <HStack spacing="0.5vw" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Img
                                    src={Destination}
                                    width="1.8vw"
                                    height="1.8vw"
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="1.8vw"
                                    height="1.8vw"
                                    pos="relative"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    {...getGridStyle(
                                        item,
                                        currentSelectedGridRef.current?.x ===
                                            x &&
                                            currentSelectedGridRef.current
                                                ?.y === y,
                                    )}
                                    cursor={
                                        getIsStartPoint(x, y)
                                            ? "pointer"
                                            : "auto"
                                    }
                                    opacity={
                                        getIsStartPoint(x, y) ? "1" : "0.5"
                                    }
                                    onClick={() => onMouseClick(x, y)}
                                >
                                    <Box
                                        bg={BatteryScalerBg[item.batteryScaler]}
                                    >
                                        <Img
                                            src={FuelScalerImg[item.fuelScaler]}
                                            w="30px"
                                            h="30px"
                                        />
                                    </Box>

                                    <Box pos="absolute" right="0" bottom="0">
                                        <SpecialIcon grid={item} />
                                    </Box>
                                </Box>
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
            <Box
                sx={{
                    width: 0,
                    height: 0,
                    borderLeft:
                        startPoint.x === 0 && startPoint.y === 0
                            ? "2.6vw solid #FFF530"
                            : "2.6vw solid #D9D9D9",
                    borderTop: "2.6vw solid transparent",
                    borderBottom: "2.6vw solid transparent",
                    left: "-2.6vw",
                    top: 0,
                    position: "absolute",
                }}
            ></Box>
            <Box
                sx={{
                    width: 0,
                    height: 0,
                    borderLeft:
                        startPoint.x === 14 && startPoint.y === 0
                            ? "2.6vw solid #FFF530"
                            : "2.6vw solid #D9D9D9",
                    borderTop: "2.6vw solid transparent",
                    borderBottom: "2.6vw solid transparent",
                    left: "-2.6vw",
                    bottom: 0,
                    position: "absolute",
                }}
            ></Box>
            <Box
                sx={{
                    width: 0,
                    height: 0,
                    borderTop: "2.6vw solid transparent",
                    borderBottom: "2.6vw solid transparent",
                    borderRight:
                        startPoint.x === 0 && startPoint.y === 14
                            ? "2.6vw solid #FFF530"
                            : "2.6vw solid #D9D9D9",
                    right: "-2.6vw",
                    top: 0,
                    position: "absolute",
                }}
            ></Box>
            <Box
                sx={{
                    width: 0,
                    height: 0,
                    borderTop: "2.6vw solid transparent",
                    borderBottom: "2.6vw solid transparent",
                    borderRight:
                        startPoint.x === 14 && startPoint.y === 14
                            ? "2.6vw solid #FFF530"
                            : "2.6vw solid #D9D9D9",
                    right: "-2.6vw",
                    bottom: 0,
                    position: "absolute",
                }}
            ></Box>
        </Box>
    );
};
