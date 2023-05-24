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
};

export const ResultMap: FC<Props> = ({ map, myPath, opPath }) => {
    const mapConfig = useRef<ResultMap[][]>(map);
    console.log(myPath, "myPath");
    const selectMap: ResultMap[][] = useMemo(() => {
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
            const width = nextItem.y > item.y ? "23.8px" : "5px";
            const height = nextItem.x > item.x ? "23.8px" : "5px";
            node.push(
                <Box
                    sx={{
                        background: "yellow",
                        left: opPath[i].y * 23.7 + 10 + "px",
                        top: opPath[i].x * 23.7 + 10 + "px",
                        width: width,
                        height: height,
                        position: "absolute",
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
            const width = nextItem.y > item.y ? "23.8px" : "5px";
            const height = nextItem.x > item.x ? "23.8px" : "5px";
            node.push(
                <Box
                    sx={{
                        background: "red",
                        left: myPath[i].y * 23.7 + 10 + "px",
                        top: myPath[i].x * 23.7 + 10 + "px",
                        width: width,
                        height: height,
                        position: "absolute",
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
        console.log(result, "resultresultresult");

        var uniqueA = [];
        var tempObj = {};

        for (var i = 0; i < result.length; i++) {
            var point = result[i];
            var key = point.x + "|" + point.y;

            if (!tempObj[key]) {
                tempObj[key] = true;
                uniqueA.push(point);
            }
        }
        console.log(uniqueA, "uniqueA");
        const node = [];
        for (let i = 0; i < uniqueA.length - 1; i++) {
            const item = uniqueA[i];
            const nextItem = uniqueA[i + 1];
            const width = nextItem.y === item.y + 1 ? "23.8px" : "5px";
            const height = nextItem.x === item.x + 1 ? "23.8px" : "5px";
            node.push(
                <Box
                    sx={{
                        background: "orange",
                        left: uniqueA[i].y * 23.7 + 10 + "px",
                        top: uniqueA[i].x * 23.7 + 10 + "px",
                        width: width,
                        height: height,
                        position: "absolute",
                    }}
                ></Box>,
            );
        }
        return node;
    }, [myPath, opPath]);

    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing="4px">
                {selectMap.map((row, x) => (
                    <HStack spacing="4px" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Img
                                    src={Destination}
                                    width="20px"
                                    height="20px"
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="20px"
                                    height="20px"
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
