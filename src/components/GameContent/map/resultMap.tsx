import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useMemo, useRef } from "react";

import Destination from "../../../assets/destination.svg";

import { MapInfo } from "../";
import { getGridImg, GridPosition, SpecialIcon } from ".";
import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";
interface ResultMap extends MapInfo {
    selected?: boolean;
    opSelected?: boolean;
}

type Props = {
    map: ResultMap[][];
    myPath: GridPosition[];
    opPath: GridPosition[];
    width?: number;
    spacing?: number;
};

export const ResultMap: FC<Props> = ({
    map,
    myPath,
    opPath,
    width = 20,
    spacing = 4,
}) => {
    const offset = width / 2;
    const mapWidth = 14 * spacing + width * 15;
    const lineWidth = Number(mapWidth / 15);
    const selectMap: ResultMap[][] = useMemo(() => {
        if (map.length === 0) {
            return [];
        }
        const _map = [...map];
        myPath.forEach((item) => {
            _map[item.x][item.y].selected = true;
        });

        opPath.forEach((item) => {
            _map[item.x][item.y].opSelected = true;
        });
        return _map;
    }, [map, myPath, opPath]);

    const OpPath = useMemo(() => {
        const node = [];
        for (let i = 0; i < opPath.length - 1; i++) {
            const item = opPath[i];
            const nextItem = opPath[i + 1];
            const width = nextItem.y !== item.y ? lineWidth + "px" : "5px";
            const height = nextItem.x !== item.x ? lineWidth + "px" : "5px";
            const isHorizontalLine = nextItem.x !== item.x;
            const centerX = (nextItem.x + item.x) / 2;
            const centerY = (nextItem.y + item.y) / 2;
            node.push(
                <Box
                    key={i}
                    sx={{
                        background: "red",
                        left: centerY * lineWidth + "px",
                        top: centerX * lineWidth + "px",
                        width: width,
                        height: height,
                        position: "absolute",
                        transform: isHorizontalLine
                            ? `translateX(${offset}px)`
                            : `translateY(${offset}px)`,
                    }}
                ></Box>,
            );
        }
        return node;
    }, [opPath]);

    const MyPath = useMemo(() => {
        const node = [];
        for (let i = 0; i < myPath.length - 1; i++) {
            const item = myPath[i];
            const nextItem = myPath[i + 1];
            const width = nextItem.y !== item.y ? lineWidth + "px" : "5px";
            const height = nextItem.x !== item.x ? lineWidth + "px" : "5px";
            const isHorizontalLine = nextItem.x !== item.x;
            const centerX = (nextItem.x + item.x) / 2;
            const centerY = (nextItem.y + item.y) / 2;
            node.push(
                <Box
                    key={i}
                    sx={{
                        background: "yellow",
                        left: centerY * lineWidth + "px",
                        top: centerX * lineWidth + "px",
                        width: width,
                        height: height,
                        position: "absolute",
                        transform: isHorizontalLine
                            ? `translateX(${offset}px)`
                            : `translateY(${offset}px)`,
                    }}
                ></Box>,
            );
        }
        return node;
    }, [myPath]);

    const SPath = useMemo(() => {
        let result = [];

        for (let i = 0; i < myPath.length - 1; i++) {
            let pointA = myPath[i];
            let pointNextA = myPath[i + 1];

            for (let j = 0; j < opPath.length - 1; j++) {
                let pointB = opPath[j];
                let pointNextB = opPath[j + 1];

                if (
                    pointA.x === pointB.x &&
                    pointA.y === pointB.y &&
                    pointNextA.x === pointNextB.x &&
                    pointNextA.y === pointNextB.y
                ) {
                    result.push(pointA);
                    result.push(pointNextA);
                    break;
                }
            }
        }

        let uniqueA = [];
        let tempObj = {};

        for (let i = 0; i < result.length; i++) {
            let point = result[i];
            let key = point.x + "|" + point.y;

            if (!tempObj[key]) {
                tempObj[key] = true;
                uniqueA.push(point);
            }
        }
        const node = [];
        for (let i = 0; i < uniqueA.length - 1; i++) {
            const item = uniqueA[i];
            const nextItem = uniqueA[i + 1];
            const width = nextItem.y !== item.y ? lineWidth + "px" : "5px";
            const height = nextItem.x !== item.x ? lineWidth + "px" : "5px";
            const absX = Math.abs(nextItem.x - item.x);
            const absY = Math.abs(nextItem.y - item.y);
            if (!((absX === 0 && absY === 1) || (absX === 1 && absY === 0))) {
                continue;
            }
            const isHorizontalLine = nextItem.x !== item.x;
            const centerX = (nextItem.x + item.x) / 2;
            const centerY = (nextItem.y + item.y) / 2;
            node.push(
                <Box
                    key={i}
                    sx={{
                        background: "orange",
                        left: centerY * lineWidth + "px",
                        top: centerX * lineWidth + "px",
                        width: width,
                        height: height,
                        position: "absolute",
                        transform: isHorizontalLine
                            ? `translateX(${offset}px)`
                            : `translateY(${offset}px)`,
                    }}
                ></Box>,
            );
        }
        return node;
    }, [myPath, opPath]);

    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing={spacing + "px"}>
                {selectMap.map((row, x) => (
                    <HStack spacing={spacing + "px"} key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Img
                                    src={Destination}
                                    width={width + "px"}
                                    height={width + "px"}
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width={width + "px"}
                                    height={width + "px"}
                                    pos="relative"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bg={BatteryScalerBg[item.batteryScaler]}
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
                                </Box>
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
            {MyPath}
            {OpPath}
            {SPath}
        </Box>
    );
};
