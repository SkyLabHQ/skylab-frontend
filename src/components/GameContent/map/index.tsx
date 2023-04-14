import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer, useRef } from "react";

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
import { MiniMap } from "./miniMap";
import { LargeMap } from "./largeMap";
import { ResultMap } from "./resultMap";

type Props = {
    onSelect: (position: { x: number; y: number } | undefined) => void;
    setIsReady: (isReady: boolean) => void;
    viewOnly: boolean;
    map: MapInfo[][];
    mapPath: GridPosition[];
    aviation?: { img: string; pos: { x: number; y: number } };
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
                          (grid.airDrag ?? 1) - 1
                      ],
                border,
            };
    }
};

export const getGridImg = (grid: MapInfo) =>
    [GridLevel1, GridLevel2, GridLevel3, GridLevel4][
        (grid.turbulence ?? 1) - 1
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

export const Map: FC<Props> = ({
    onSelect,
    setIsReady,
    viewOnly,
    map,
    mapPath,
    aviation,
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

    const onMouseOver = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        if (currentHoverGridRef.current) {
            onMouseOut(
                currentHoverGridRef.current.x,
                currentHoverGridRef.current.y,
            );
        }
        map[x][y].hover = true;
        currentHoverGridRef.current = { x, y };
        forceRender();
    };

    const onMouseOut = (x: number, y: number) => {
        if (
            viewOnly ||
            x !== currentHoverGridRef.current?.x ||
            y !== currentHoverGridRef.current.y
        ) {
            return;
        }
        map[x][y].hover = false;
        currentHoverGridRef.current = undefined;
        forceRender();
    };

    const onMouseClick = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }
        if (
            currentSelectedGridRef.current?.x === x &&
            currentSelectedGridRef.current?.y === y
        ) {
            currentSelectedGridRef.current = undefined;
            onSelect(undefined);
        } else {
            const lastGrid = mapPath[mapPath.length - 1];
            map[x][y].fuelLoad =
                map[x][y].fuelLoad ||
                (lastGrid ? map[lastGrid.x][lastGrid.y].fuelLoad : 1);
            map[x][y].batteryLoad =
                map[x][y].batteryLoad ||
                (lastGrid ? map[lastGrid.x][lastGrid.y].batteryLoad : 1);
            currentSelectedGridRef.current = { x, y };
            onSelect({ x, y });
        }

        const isStartPoint =
            !mapPath.length && [0, 14].includes(x) && [0, 14].includes(y);

        if (map[x][y].selected) {
            forceRender();
            return;
        }
        const previousSelect = mapPath[mapPath.length - 1];
        if (
            isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
            isStartPoint
        ) {
            map[x][y].selected = true;
            map[x][y].role = isStartPoint ? "start" : "normal";
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
                map[mapPath[i].x][mapPath[i].y].role = "normal";
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
                if (currentHoverGridRef.current) {
                    if (mapPath.length) {
                        const xOffset = key === "s" ? 1 : key === "w" ? -1 : 0;
                        const yOffset = key === "d" ? 1 : key === "a" ? -1 : 0;
                        const x = currentHoverGridRef.current.x + xOffset;
                        const y = currentHoverGridRef.current.y + yOffset;
                        onMouseOver(x, y);
                    } else {
                        const x =
                            key === "s"
                                ? 14
                                : key === "w"
                                ? 0
                                : currentHoverGridRef.current.x > 7
                                ? 14
                                : 0;
                        const y =
                            key === "d"
                                ? 14
                                : key === "a"
                                ? 0
                                : currentHoverGridRef.current.y > 7
                                ? 14
                                : 0;
                        onMouseOver(x, y);
                    }
                } else {
                    onMouseOver(0, 0);
                }
                forceRender();
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
            if (key === " " && currentHoverGridRef.current) {
                onMouseDoubleClick(
                    currentHoverGridRef.current.x,
                    currentHoverGridRef.current.y,
                );
            }
        };

        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [viewOnly, !!mapPath.length]);

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
                                    <Box pos="absolute" right="0" bottom="0">
                                        <SpecialIcon grid={item} />
                                    </Box>
                                </Box>
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
            {aviation ? (
                <Img
                    pos="absolute"
                    src={aviation.img}
                    width="50px"
                    height="50px"
                    margin="-25px"
                    left={`${aviation.pos.x}%`}
                    top={`${aviation.pos.y}%`}
                />
            ) : null}
        </Box>
    );
};

export { MiniMap, LargeMap, ResultMap };
