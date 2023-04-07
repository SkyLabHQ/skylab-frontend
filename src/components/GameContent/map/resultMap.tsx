import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useRef } from "react";

import Destination from "../../../assets/destination.svg";

import { MapInfo } from "../";
import { getGridImg, getGridStyle, GridPosition, SpecialIcon } from ".";

type Props = {
    map: MapInfo[][];
    myPath: GridPosition[];
    opponentPath: GridPosition[];
};

export const ResultMap: FC<Props> = ({ map, myPath, opponentPath }) => {
    const mapConfig = useRef<MapInfo[][]>(map);

    return (
        <Box userSelect="none" pos="relative">
            <VStack spacing="4px">
                {mapConfig.current.map((row, x) => (
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
                                    {...getGridStyle(item, false)}
                                >
                                    <Img
                                        src={getGridImg(item)}
                                        w="16px"
                                        h="16px"
                                    />
                                    <Box
                                        pos="absolute"
                                        right="0"
                                        bottom="0"
                                        maxW="50%"
                                    >
                                        <SpecialIcon grid={item} />
                                    </Box>
                                </Box>
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};
