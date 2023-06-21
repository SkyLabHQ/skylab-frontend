import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";

import Destination from "../../../assets/destination.svg";
import ClickSound from "../../../assets/click.wav";
import { MapInfo } from "../";
import { GridPosition, SpecialIcon } from ".";
import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";

type Props = {
    map: MapInfo[][];
    position: GridPosition;
    aviation: {
        img: string;
        transform: string;
    };
    mapPath: GridPosition[];
};

// 格子颜色
const getGridStyle = (
    grid: MapInfo,
    isCurrentGrid?: boolean,
    currentGrid?: GridPosition,
    mapPath?: GridPosition[],
) => {
    let border = `3px solid ${BatteryScalerBg[grid.batteryScaler]}`;
    if (grid.role === "start") {
        border = "3px solid #fff";
    }

    if (grid.selected) {
    }

    return border;
};

export const LargeMap: FC<Props> = ({ map, position, aviation, mapPath }) => {
    const currentGridX = Math.floor(((position.y / 100) * 208 + 1) / 14);
    const currentGridY = Math.floor(((position.x / 100) * 208 + 1) / 14);

    useEffect(() => {
        const audio = new Audio(ClickSound);
        audio.play();
    }, [currentGridX, currentGridY]);

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
                {map.map((row, x) => (
                    <HStack spacing="1.5vw" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.role === "end" ? (
                                <Box
                                    bg={
                                        item.selected &&
                                        "radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FFF761 43.75%, rgba(217, 217, 217, 0) 100%)"
                                    }
                                    width="10.5vw"
                                    height="10.5vw"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    key={y}
                                >
                                    <Img
                                        src={Destination}
                                        width="9.5vw"
                                        height="9.5vw"
                                    />
                                </Box>
                            ) : (
                                <Box
                                    key={y}
                                    width="10.5vw"
                                    height="10.5vw"
                                    bg={
                                        item.role === "start"
                                            ? "#fff"
                                            : BatteryScalerBg[
                                                  item.batteryScaler
                                              ]
                                    }
                                    border={
                                        item.selected &&
                                        mapPath.find(
                                            (path) =>
                                                path.x === x && path.y === y,
                                        )
                                            ? "6px solid #FFF530"
                                            : `6px solid ${
                                                  BatteryScalerBg[
                                                      item.batteryScaler
                                                  ]
                                              }`
                                    }
                                    pos="relative"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
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
                                    <Box
                                        pos="absolute"
                                        right="0"
                                        bottom="-1vw"
                                        w="100%"
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <SpecialIcon grid={item} isDetail />
                                    </Box>
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
                <Img
                    src={aviation.img}
                    width="12vw"
                    transform={aviation.transform}
                />
            </Box>
        </Box>
    );
};
