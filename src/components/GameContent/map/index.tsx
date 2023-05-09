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
import BlackHole from "../../../assets/icon-blackhole.svg";
import VolcanoDetail from "../../../assets/icon-volcano-detail.svg";
import ForestDetail from "../../../assets/icon-forest-detail.svg";
import DreamlandDetail from "../../../assets/icon-dreamland-detail.svg";
import BlackHoleDetail from "../../../assets/icon-blackhole-detail.svg";

import { useGameContext } from "../../../pages/Game";
import { MapInfo } from "../";
import { MiniMap } from "./miniMap";
import { LargeMap } from "./largeMap";
import { ResultMap } from "./resultMap";
import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";

type Props = {
    onSelect: (position: { x: number; y: number } | undefined) => void;
    setIsReady: (isReady: boolean) => void;
    viewOnly: boolean;
    map: MapInfo[][];
    mapPath: GridPosition[];
    aviation?: {
        img: string;
        pos: { x: number; y: number };
        transform: string;
    };
};

export type GridPosition = {
    x: number;
    y: number;
};

// 是否跟最后一次格子相关连
const isAdjacentToPreviousSelect = (
    currentSelect: GridPosition,
    previousSelect?: GridPosition,
) =>
    previousSelect
        ? Math.abs(previousSelect?.x - currentSelect.x) +
              Math.abs(previousSelect?.y - currentSelect.y) ===
          1
        : false;

export const getGridStyle = (grid: MapInfo, currentGrid?: boolean) => {
    const border = grid.hover
        ? "3px solid #FFF530"
        : grid.selected
        ? "3px solid orange"
        : `3px solid ${BatteryScalerBg[grid.batteryScaler]} `;

    if (grid.selected) {
        return {
            bg: currentGrid ? "#FFF761" : "white",
            border,
        };
    }

    return {
        bg: BatteryScalerBg[grid.batteryScaler],
        border,
    };
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

    let type;
    const d = grid.distance / 2 ** (level - 1);
    if (d >= 500) {
        type = 4;
    } else if (d >= 200) {
        type = 3;
    } else if (d >= 80) {
        type = 2;
    } else if (d >= 50) {
        type = 1;
    }

    // console.log(grid.distance / 2 ** (level - 1), "dqwjiodqwnio");
    const icon = (
        isDetail
            ? {
                  1: ForestDetail,
                  2: VolcanoDetail,
                  3: DreamlandDetail,
                  4: BlackHoleDetail,
              }
            : {
                  1: Forest,
                  2: Volcano,
                  3: Dreamland,
                  4: BlackHole,
              }
    )[type];
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
    const currentSelectedGridRef = useRef<GridPosition | undefined>();
    const currentHoverGridRef = useRef<GridPosition | undefined>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const {
        onNext: onNextProps,
        level,
        onMapChange,
        onMapPathChange,
    } = useGameContext();

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
        const _map = [...map];
        _map[x][y].hover = true;
        onMapChange(_map);
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
        const _map = [...map];
        _map[x][y].hover = false;
        onMapChange(_map);
        currentHoverGridRef.current = undefined;
    };

    const onMouseClick = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }

        const _map = [...map];

        // 如果最后选择了终点，则不能选择其他
        if (mapPath.length) {
            const lastItem = mapPath[mapPath.length - 1];
            if (
                _map[lastItem.x][lastItem.y].role === "end" &&
                _map[x][y].role !== "end"
            ) {
                return;
            }
        }

        // 如果选择 当前选择的格子 则取消
        if (
            currentSelectedGridRef.current?.x === x &&
            currentSelectedGridRef.current?.y === y
        ) {
            currentSelectedGridRef.current = undefined;
            onSelect(undefined);
        } else {
            const lastGrid = mapPath[mapPath.length - 1];
            _map[x][y].fuelLoad =
                _map[x][y].fuelLoad ||
                (lastGrid ? _map[lastGrid.x][lastGrid.y].fuelLoad : 1);
            _map[x][y].batteryLoad =
                _map[x][y].batteryLoad ||
                (lastGrid ? _map[lastGrid.x][lastGrid.y].batteryLoad : 1);
            currentSelectedGridRef.current = { x, y };
            onSelect({ x, y });
        }

        const isStartPoint =
            !mapPath.length && [0, 14].includes(x) && [0, 14].includes(y);

        if (_map[x][y].selected) {
            forceRender();
            return;
        }
        const previousSelect = mapPath[mapPath.length - 1];
        if (
            isAdjacentToPreviousSelect({ x, y }, previousSelect) ||
            isStartPoint
        ) {
            _map[x][y].selected = true;
            onMapChange(_map);
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
            const _map = [...map];
            for (let i = index; i < mapPath.length; i++) {
                _map[mapPath[i].x][mapPath[i].y].selected = false;
            }
            onMapChange(_map);

            const _mapPath = [...mapPath];
            _mapPath.splice(index, mapPath.length - index);
            onMapPathChange(_mapPath);
            currentSelectedGridRef.current = undefined;
            onSelect(undefined);
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
                                    cursor={"pointer"}
                                    border={"3px solid transparent"}
                                    {...getGridStyle(
                                        item,
                                        currentSelectedGridRef.current?.x ===
                                            x &&
                                            currentSelectedGridRef.current
                                                ?.y === y,
                                    )}
                                    onMouseOver={() => onMouseOver(x, y)}
                                    onMouseOut={() => onMouseOut(x, y)}
                                    onClick={() => onMouseClick(x, y)}
                                    onDoubleClick={() =>
                                        onMouseDoubleClick(x, y)
                                    }
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
            {aviation ? (
                <Img
                    pos="absolute"
                    src={aviation.img}
                    width="50px"
                    height="50px"
                    margin="-25px"
                    left={`${aviation.pos.x}%`}
                    top={`${aviation.pos.y}%`}
                    transform={aviation.transform}
                />
            ) : null}
        </Box>
    );
};

export { MiniMap, LargeMap, ResultMap };
