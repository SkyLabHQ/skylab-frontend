import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer, useRef, useState } from "react";

import Destination from "../../../assets/destination.svg";
import GridLevel1 from "../../../assets/grid-level-1.svg";
import GridLevel2 from "../../../assets/grid-level-2.svg";
import GridLevel3 from "../../../assets/grid-level-3.svg";
import GridLevel4 from "../../../assets/grid-level-4.svg";

import { MapInfo } from "../";
import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";
import { getGridStyle, SpecialIcon } from ".";

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

const getIsStartPoint = (x: number, y: number) => {
    return [0, 14].includes(x) && [0, 14].includes(y);
};

export const getGridImg = (grid: MapInfo) =>
    [GridLevel1, GridLevel2, GridLevel3, GridLevel4][
        (grid.batteryScaler ?? 1) - 1
    ];

export const StartMap: FC<Props> = ({
    setIsReady,
    map,
    mapPath,
    startPoint,
    onStartPoint,
}) => {
    const currentHoverGridRef = useRef<GridPosition | undefined>();

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
                                    {...getGridStyle(item)}
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
                                        w="100%"
                                        h="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Img
                                            w="80%"
                                            h="80%"
                                            src={FuelScalerImg[item.fuelScaler]}
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
