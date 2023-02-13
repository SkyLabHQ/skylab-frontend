import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useReducer, useRef, useState } from "react";
import { cloneDeep } from "lodash";

import Destination from "../../assets/destination.svg";
import GridLevel1 from "../../assets/grid-level-1.svg";
import GridLevel2 from "../../assets/grid-level-2.svg";
import GridLevel3 from "../../assets/grid-level-3.svg";
import GridLevel4 from "../../assets/grid-level-4.svg";
import { MapInfo } from ".";

type Props = {
    onSelect: (item: MapInfo | undefined) => void;
    setIsReady: (isReady: boolean) => void;
    viewOnly: boolean;
    map: MapInfo[][];
};

type MiniMapProps = {
    map: MapInfo[][];
    position: GridPosition;
};

type LargeMapProps = {
    map: MapInfo[][];
    position: GridPosition;
    aviation: string;
};

type GridPosition = {
    x: number;
    y: number;
};

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
    let result = true;

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
                grid.selected = false;
                result = false;
            }
            if (
                grid.role === "end" &&
                getSurroundingSelectedGridNum(map, x, y) === 0
            ) {
                result = false;
            }
        }
    }
    return result;
};

export const getGridStyle = (grid: MapInfo, currentGrid: boolean) => {
    if (grid.selected) {
        return {
            bg: currentGrid ? "#FFF761" : "white",
            border: "5px solid #FFF530",
        };
    }

    switch (grid.role) {
        case "start":
            return {
                bg: "white",
                border: grid.hover ? "5px solid #FFF530" : "5px solid #237EFF",
            };
        case "opponent_start":
            return {
                bg: "white",
                border: grid.hover ? "5px solid #FFF530" : "5px solid #E83E44",
            };
        case "normal":
            return {
                bg: currentGrid
                    ? "#FF0011"
                    : ["#8DF6F5", "#82D1D0", "#6C9392", "#475F5E"][
                          (grid.airDrag ?? 1) - 1
                      ],
                border: grid.hover ? "5px solid #FFF530" : undefined,
            };
    }
};

export const getGridImg = (grid: MapInfo) =>
    [GridLevel1, GridLevel2, GridLevel3, GridLevel4][
        (grid.turbulence ?? 1) - 1
    ];

export const Map: FC<Props> = ({ onSelect, setIsReady, viewOnly, map }) => {
    const mapConfig = useRef<MapInfo[][]>(map);
    const [currentSelectedGrid, setCurrentSelectedGrid] = useState<
        GridPosition | undefined
    >();
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    setIsReady(calculateIsReady(mapConfig.current));

    const onMouseOver = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        mapConfig.current[x][y].hover = true;
        forceRender();
    };

    const onMouseOut = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        mapConfig.current[x][y].hover = false;
        forceRender();
    };

    const onMouseClick = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        if (currentSelectedGrid?.x === x && currentSelectedGrid?.y === y) {
            setCurrentSelectedGrid(undefined);
            onSelect(undefined);
        } else {
            setCurrentSelectedGrid({ x, y });
            onSelect(mapConfig.current[x][y]);
        }

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
        mapConfig.current[x][y].selected = true;
        forceRender();
    };

    const onMouseDoubleClick = (x: number, y: number) => {
        if (viewOnly || !mapConfig.current[x][y].selected) {
            return;
        }

        mapConfig.current[x][y].selected = false;
        forceRender();
    };

    return (
        <Box userSelect="none">
            <VStack spacing="0.5vw">
                {mapConfig.current.map((row, x) => (
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
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    {...getGridStyle(
                                        item,
                                        currentSelectedGrid?.x === x &&
                                            currentSelectedGrid?.y === y,
                                    )}
                                    cursor={
                                        !viewOnly &&
                                        (getSurroundingSelectedGridNum(
                                            mapConfig.current,
                                            x,
                                            y,
                                        ) > 0 ||
                                            mapConfig.current[x][y].role ===
                                                "start" ||
                                            mapConfig.current[x][y].selected)
                                            ? "pointer"
                                            : "auto"
                                    }
                                    onMouseOver={() => onMouseOver(x, y)}
                                    onMouseOut={() => onMouseOut(x, y)}
                                    onClick={() => onMouseClick(x, y)}
                                    onDoubleClick={() =>
                                        onMouseDoubleClick(x, y)
                                    }
                                >
                                    <Img
                                        src={getGridImg(item)}
                                        w="30px"
                                        h="30px"
                                    />
                                </Box>
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};

export const MiniMap: FC<MiniMapProps> = ({ map, position }) => {
    const mapConfig = useRef<MapInfo[][]>(map);

    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing="2px">
                {mapConfig.current.map((row, x) => (
                    <HStack spacing="2px" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Img
                                    src={Destination}
                                    width="12px"
                                    height="12px"
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="12px"
                                    height="12px"
                                    {...getGridStyle(item, false)}
                                />
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
            <Box
                top={`${(position.y / 100) * 208 - 25}px`}
                left={`${(position.x / 100) * 208 - 25}px`}
                width="50px"
                height="50px"
                pos="absolute"
                border="5px solid #FFF761"
            />
        </Box>
    );
};

export const LargeMap: FC<LargeMapProps> = ({ map, position, aviation }) => {
    const mapConfig = useRef<MapInfo[][]>(map);

    return (
        <Box
            userSelect="none"
            pos="relative"
            overflow="hidden"
            w="34.5vw"
            h="34.5vw"
        >
            <VStack
                spacing="1.5vw"
                pos="absolute"
                left={`${17.25 - (position.x / 100) * 178.5}vw`}
                top={`${17.25 - (position.y / 100) * 178.5}vw`}
            >
                {mapConfig.current.map((row, x) => (
                    <HStack spacing="1.5vw" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Img
                                    src={Destination}
                                    width="10.5vw"
                                    height="10.5vw"
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="10.5vw"
                                    height="10.5vw"
                                    {...getGridStyle(item, false)}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Img
                                        src={getGridImg(item)}
                                        width="9vw"
                                        height="9vw"
                                    />
                                </Box>
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
            <Box
                pos="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="10.5vw"
                height="10.5vw"
                left="12vw"
                top="12vw"
            >
                <Img src={aviation} width="12vw" />
            </Box>
        </Box>
    );
};
