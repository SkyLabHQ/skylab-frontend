import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useRef } from "react";

import Destination from "../../../assets/destination.svg";
import { MapInfo } from "../";
import { getGridStyle, GridPosition } from ".";

type Props = {
    map: MapInfo[][];
    position: GridPosition;
};

export const MiniMap: FC<Props> = ({ map, position }) => {
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
