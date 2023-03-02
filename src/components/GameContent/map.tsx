import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer, useRef, useState } from "react";

import Destination from "../../assets/destination.svg";
import GridLevel1 from "../../assets/grid-level-1.svg";
import GridLevel2 from "../../assets/grid-level-2.svg";
import GridLevel3 from "../../assets/grid-level-3.svg";
import GridLevel4 from "../../assets/grid-level-4.svg";
import { MapInfo } from ".";

type Props = {
    onSelect: (position: { x: number; y: number } | undefined) => void;
    setIsReady: (isReady: boolean) => void;
    viewOnly: boolean;
    map: MapInfo[][];
    mapPath: GridPosition[];
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

export type GridPosition = {
    x: number;
    y: number;
};

const isAdjacentToPreviousSelect = (
    currentSelect: GridPosition,
    previousSelect?: GridPosition,
) =>
    previousSelect
        ? Math.abs(previousSelect?.x - currentSelect.x) +
              Math.abs(previousSelect?.y - currentSelect.y) ===
          1
        : false;

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

export const Map: FC<Props> = ({
    onSelect,
    setIsReady,
    viewOnly,
    map,
    mapPath,
}) => {
    const [currentSelectedGrid, _setCurrentSelectedGrid] = useState<
        GridPosition | undefined
    >();
    const currentSelectedGridRef = useRef<GridPosition | undefined>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const setCurrentSelectedGrid = (grid: GridPosition | undefined) => {
        currentSelectedGridRef.current = grid;
        _setCurrentSelectedGrid(grid);
    };
    setIsReady(
        mapPath.length
            ? map[mapPath[mapPath.length - 1].x][mapPath[mapPath.length - 1].y]
                  .role === "end"
            : false,
    );

    const onMouseOver = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        map[x][y].hover = true;
        forceRender();
    };

    const onMouseOut = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        map[x][y].hover = false;
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
            const lastGrid = mapPath[mapPath.length - 1];
            map[x][y].fuelLoad = lastGrid
                ? map[lastGrid.x][lastGrid.y].fuelLoad
                : 1;
            map[x][y].batteryLoad = lastGrid
                ? map[lastGrid.x][lastGrid.y].batteryLoad
                : 1;
            setCurrentSelectedGrid({ x, y });
            onSelect({ x, y });
        }

        if (
            map[x][y].selected ||
            (!mapPath.length && map[x][y].role !== "start")
        ) {
            return;
        }
        const previousSelect = mapPath[mapPath.length - 1];
        if (
            isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
            map[x][y].role === "start"
        ) {
            map[x][y].selected = true;
            mapPath.push({ x, y });
        }
        forceRender();
    };

    const onMouseDoubleClick = (x: number, y: number) => {
        if (viewOnly || !map[x][y].selected) {
            return;
        }

        const index = mapPath.findIndex(
            (pathItem) => pathItem.x === x && pathItem.y === y,
        );
        if (index !== -1) {
            for (let i = index; i < mapPath.length; i++) {
                map[mapPath[i].x][mapPath[i].y].selected = false;
            }
            mapPath.splice(index, mapPath.length - index);
        }
        forceRender();
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (viewOnly) {
                return;
            }

            if (["w", "a", "s", "d"].includes(key)) {
                if (currentSelectedGridRef.current) {
                    const xOffset = key === "s" ? 1 : key === "w" ? -1 : 0;
                    const yOffset = key === "d" ? 1 : key === "a" ? -1 : 0;
                    const x = currentSelectedGridRef.current.x + xOffset;
                    const y = currentSelectedGridRef.current.y + yOffset;
                    setCurrentSelectedGrid({ x, y });
                    onSelect({ x, y });
                } else {
                    for (let x = 0; x < map.length; x++) {
                        for (let y = 0; y < map[x].length; y++) {
                            if (map[x][y].role === "start") {
                                setCurrentSelectedGrid({ x, y });
                                onSelect({ x, y });
                            }
                        }
                    }
                }
            }
            if (key === "Enter" && currentSelectedGridRef.current) {
                const x = currentSelectedGridRef.current.x;
                const y = currentSelectedGridRef.current.y;
                if (map[x][y].selected) {
                    const index = mapPath.findIndex(
                        (pathItem) => pathItem.x === x && pathItem.y === y,
                    );
                    if (index !== -1) {
                        for (let i = index; i < mapPath.length; i++) {
                            map[mapPath[i].x][mapPath[i].y].selected = false;
                        }
                        mapPath.splice(index, mapPath.length - index);
                    }
                } else {
                    if (!mapPath.length && map[x][y].role !== "start") {
                        return;
                    }
                    const previousSelect = mapPath[mapPath.length - 1];
                    if (
                        isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
                        map[x][y].role === "start"
                    ) {
                        map[x][y].selected = true;
                        mapPath.push({ x, y });
                    }
                }
                forceRender();
            }
        };

        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);

    return (
        <Box userSelect="none">
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
                                        (isAdjacentToPreviousSelect(
                                            { x, y },
                                            mapPath[(mapPath.length ?? 1) - 1],
                                        ) ||
                                            map[x][y].role === "start" ||
                                            map[x][y].selected)
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
