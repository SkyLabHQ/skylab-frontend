import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useReducer, useRef } from "react";
import { cloneDeep } from "lodash";

import Destination from "../../assets/destination.svg";
import { MapInfo } from ".";

type Props = {
    onSelect: (item: MapInfo | undefined) => void;
    setIsReady: (isReady: boolean) => void;
};

const initMap = () => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            if (i === 7 && j === 7) {
                map[i].push({
                    role: "end",
                });
            } else if (i === 14 && j === 0) {
                map[i].push({
                    role: "start",
                });
            } else if (i === 0 && j === 14) {
                map[i].push({
                    role: "opponent_start",
                });
            } else {
                map[i].push({
                    role: "normal",
                    level: Math.floor(Math.random() * 3) + 1,
                });
            }
        }
    }
    return map;
};

const initialMap = initMap();

const getSurroundingSelectedGridNum = (
    map: MapInfo[][],
    x: number,
    y: number,
): number => {
    let res = 0;
    if (x > 0 && map[x - 1][y].selected) {
        res++;
    }
    if (y > 0 && map[x][y - 1].selected) {
        res++;
    }
    if (x < map.length - 1 && map[x + 1][y].selected) {
        res++;
    }
    if (y < map[0].length - 1 && map[x][y + 1].selected) {
        res++;
    }
    return res;
};

const getSelectedGrids = (
    map: MapInfo[][],
    selectedGrids: string[],
    x: number,
    y: number,
) => {
    if (
        x > 0 &&
        map[x - 1][y].selected &&
        !selectedGrids.includes(`${x - 1},${y}`)
    ) {
        selectedGrids.push(`${x - 1},${y}`);
        getSelectedGrids(map, selectedGrids, x - 1, y);
    }
    if (
        y > 0 &&
        map[x][y - 1].selected &&
        !selectedGrids.includes(`${x},${y - 1}`)
    ) {
        selectedGrids.push(`${x},${y - 1}`);
        getSelectedGrids(map, selectedGrids, x, y - 1);
    }
    if (
        x < map.length - 1 &&
        map[x + 1][y].selected &&
        !selectedGrids.includes(`${x + 1},${y}`)
    ) {
        selectedGrids.push(`${x + 1},${y}`);
        getSelectedGrids(map, selectedGrids, x + 1, y);
    }
    if (
        y < map[0].length - 1 &&
        map[x][y + 1].selected &&
        !selectedGrids.includes(`${x},${y + 1}`)
    ) {
        selectedGrids.push(`${x},${y + 1}`);
        getSelectedGrids(map, selectedGrids, x, y + 1);
    }
};

const calculateIsReady = (map: MapInfo[][]): boolean => {
    const start = [];
    const path: string[] = [];

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            const grid = map[x][y];
            if (grid.role === "start") {
                if (!grid.selected) {
                    return false;
                }
                start.push(x, y);
                path.push(`${x},${y}`);
            }
        }
    }

    getSelectedGrids(map, path, start[0], start[1]);

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            const grid = map[x][y];
            if (grid.selected && !path.includes(`${x},${y}`)) {
                return false;
            }
            if (
                grid.role === "end" &&
                getSurroundingSelectedGridNum(map, x, y) === 0
            ) {
                return false;
            }
        }
    }
    return true;
};

const getGridStyle = (grid: MapInfo) => {
    if (grid.selected) {
        return {
            bg: "white",
            border: "5px solid #FFF530",
        };
    }
    if (grid.hover) {
        return {
            bg: "white",
        };
    }

    switch (grid.role) {
        case "start":
            return {
                bg: "white",
                border: "5px solid #237EFF",
            };
        case "opponent_start":
            return {
                bg: "white",
                border: "5px solid #E83E44",
            };
        case "normal":
            return {
                bg: ["#39ACFF", "#13FFDA", "#FF2784"][(grid.level ?? 1) - 1],
            };
    }
};

export const Map: FC<Props> = ({ onSelect, setIsReady }) => {
    const mapConfig = useRef<MapInfo[][]>(cloneDeep(initialMap));
    const containerMouseOutRef = useRef<number>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    setIsReady(calculateIsReady(mapConfig.current));

    const onMouseOver = (x: number, y: number) => {
        mapConfig.current[x][y].hover = true;
        onSelect(mapConfig.current[x][y]);
    };

    const onMouseOut = (x: number, y: number) => {
        mapConfig.current[x][y].hover = false;
    };

    const onMouseClick = (x: number, y: number) => {
        const surroundingSelectedGridNum = getSurroundingSelectedGridNum(
            mapConfig.current,
            x,
            y,
        );
        if (
            surroundingSelectedGridNum === 0 &&
            mapConfig.current[x][y].role !== "start" &&
            !mapConfig.current[x][y].selected
        ) {
            return;
        }
        mapConfig.current[x][y].selected = !mapConfig.current[x][y].selected;
        forceRender();
    };

    const onContainerMouseLeave = () => {
        containerMouseOutRef.current = window.setTimeout(() => {
            onSelect(undefined);
        }, 1000);
    };

    const onContainerMouseEnter = () => {
        if (containerMouseOutRef.current) {
            clearTimeout(containerMouseOutRef.current);
        }
    };

    return (
        <Box
            userSelect="none"
            onMouseEnter={onContainerMouseEnter}
            onMouseLeave={onContainerMouseLeave}
        >
            <VStack spacing="0.5vw">
                {mapConfig.current.map((row, x) => (
                    <HStack spacing="0.5vw" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Img
                                    src={Destination}
                                    width="2vw"
                                    height="2vw"
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="2vw"
                                    height="2vw"
                                    {...getGridStyle(item)}
                                    cursor={
                                        getSurroundingSelectedGridNum(
                                            mapConfig.current,
                                            x,
                                            y,
                                        ) > 0 ||
                                        mapConfig.current[x][y].role ===
                                            "start" ||
                                        mapConfig.current[x][y].selected
                                            ? "pointer"
                                            : "not-allowed"
                                    }
                                    onMouseOver={() => onMouseOver(x, y)}
                                    onMouseOut={() => onMouseOut(x, y)}
                                    onClick={() => onMouseClick(x, y)}
                                />
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};
