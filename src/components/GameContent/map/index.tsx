import { Box, grid, HStack, Img, VStack } from "@chakra-ui/react";
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
    onDoubleGridSelect?: (
        position: { x: number; y: number } | undefined,
    ) => void;
    setIsReady: (isReady: boolean) => void;
    viewOnly: boolean;
    map: MapInfo[][];
    mapPath: GridPosition[];
    aviation?: {
        img: string;
        pos: { x: number; y: number };
        transform: string;
    };
    inputing?: boolean;
};

export type GridPosition = {
    x: number;
    y: number;
};

// 是否跟最后一次格子相关连
export const isAdjacentToPreviousSelect = (
    currentSelect: GridPosition,
    previousSelect?: GridPosition,
) =>
    previousSelect
        ? Math.abs(previousSelect?.x - currentSelect.x) +
              Math.abs(previousSelect?.y - currentSelect.y) ===
          1
        : false;

// 格子颜色
export const getGridStyle = (grid: MapInfo, currentGrid?: boolean) => {
    const border = grid.hover
        ? "3px solid #FFF530"
        : grid.selected
        ? "3px solid orange"
        : currentGrid
        ? "3px solid #FFF530"
        : `3px solid ${BatteryScalerBg[grid.batteryScaler]} `;

    if (grid.selected) {
        return {
            bg: currentGrid ? "#FFF761" : "white",
            border,
        };
    }

    return {
        bg:
            grid.role === "start"
                ? "#fff"
                : BatteryScalerBg[grid.batteryScaler],
        border,
    };
};

// 格子颜色
export const getV2GridStyle = (
    grid: MapInfo,
    isCurrentGrid?: boolean,
    currentGrid?: GridPosition,
    mapPath?: GridPosition[],
    inputing?: boolean,
) => {
    let border = `3px solid ${BatteryScalerBg[grid.batteryScaler]}`;
    if (grid.role === "start") {
        border = "3px solid #fff";
    }

    if (grid.selected) {
        border = "3px solid #FFF530";
    }

    if (isCurrentGrid) {
        const fItem = mapPath.find((item) => {
            return item.x === currentGrid.x && item.y === currentGrid.y;
        });
        if (fItem) {
            if (inputing) {
                border = "3px solid orange";
            } else {
                border = "3px solid #FFF530";
            }
            return border;
        }

        if (mapPath.length > 0) {
            const lastGrid = mapPath[mapPath.length - 1];
            if (lastGrid.x === 7 && lastGrid.y === 7) {
                border = "3px solid #FF0011";
                return border;
            }
            if (isAdjacentToPreviousSelect(currentGrid, lastGrid)) {
                if (inputing) {
                    border = "3px solid orange";
                } else {
                    border = "3px solid #FFF530";
                }
            } else {
                border = "3px solid #FF0011";
            }
            return border;
        }
    }

    return border;
};

// 格子图片
export const getGridImg = (grid: MapInfo) =>
    [GridLevel1, GridLevel2, GridLevel3, GridLevel4][
        (grid.batteryScaler ?? 1) - 1
    ];

// 格子图片
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
    return icon ? <Img src={icon} sx={{ height: "100%" }} /> : null;
};

export const Map: FC<Props> = ({
    onDoubleGridSelect,
    onSelect,
    setIsReady,
    viewOnly,
    map,
    mapPath,
    aviation,
    inputing,
}) => {
    const currentSelectedGridRef = useRef<GridPosition | undefined>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    setIsReady(
        mapPath.length
            ? map[mapPath[mapPath.length - 1].x][mapPath[mapPath.length - 1].y]
                  .role === "end"
            : false,
    );

    const onMouseClick = (x: number, y: number) => {
        if (viewOnly) {
            return;
        }

        // 如果选择 当前选择的格子 则取消
        if (
            currentSelectedGridRef.current?.x === x &&
            currentSelectedGridRef.current?.y === y
        ) {
            currentSelectedGridRef.current = undefined;
            onSelect(undefined);
        } else {
            currentSelectedGridRef.current = { x, y };
            onSelect({ x, y });
        }

        forceRender();
    };

    const onMouseDoubleClick = (x: number, y: number) => {
        if (viewOnly || !map[x][y].selected) {
            return;
        }
        onDoubleGridSelect({ x, y });
    };

    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing="0.5vw">
                {map.map((row, x) => (
                    <HStack spacing="0.5vw" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Box width="1.8vw" height="1.8vw" key={y}>
                                    <Box
                                        position={"absolute"}
                                        left="50%"
                                        top="50%"
                                        bg={
                                            item.selected &&
                                            "radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FFF761 43.75%, rgba(217, 217, 217, 0) 100%)"
                                        }
                                        width="2.2vw"
                                        height="2.2vw"
                                        transform="translate(-50%, -50%)"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Img
                                            src={Destination}
                                            width="1.5vw"
                                            height="1.5vw"
                                            cursor={"pointer"}
                                            onClick={() => onMouseClick(x, y)}
                                            onDoubleClick={() =>
                                                onMouseDoubleClick(x, y)
                                            }
                                        />
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    key={y}
                                    width="1.8vw"
                                    height="1.8vw"
                                    pos="relative"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bg={
                                        item.role === "start"
                                            ? "#fff"
                                            : BatteryScalerBg[
                                                  item.batteryScaler
                                              ]
                                    }
                                    border={getV2GridStyle(
                                        item,
                                        currentSelectedGridRef.current?.x ===
                                            x &&
                                            currentSelectedGridRef.current
                                                ?.y === y,
                                        currentSelectedGridRef.current,
                                        mapPath,
                                        inputing,
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
                                    onClick={() => onMouseClick(x, y)}
                                    onDoubleClick={() =>
                                        onMouseDoubleClick(x, y)
                                    }
                                >
                                    <Box
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
