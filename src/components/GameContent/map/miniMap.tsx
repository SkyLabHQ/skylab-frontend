import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC } from "react";

import Destination from "../../../assets/destination.svg";
import { MapInfo } from "../";
import { GridPosition } from ".";
import { BatteryScalerBg } from "@/skyConstants/gridInfo";

type Props = {
    map: MapInfo[][];
    position: GridPosition;
    actualGamePath: GridPosition[];
};

export const MiniMap: FC<Props> = ({ map, position, actualGamePath }) => {
    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing="2px">
                {map.map((row, x) => (
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
                                    bg={
                                        actualGamePath.find((item) => {
                                            return item.x === x && item.y === y;
                                        })
                                            ? "#fff"
                                            : BatteryScalerBg[
                                                  item.batteryScaler
                                              ]
                                    }
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
