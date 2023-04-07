import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useRef } from "react";

import Destination from "../../../assets/destination.svg";
import ClickSound from "../../../assets/click.wav";
import { MapInfo } from "../";
import { getGridImg, getGridStyle, GridPosition, SpecialIcon } from ".";

type Props = {
    map: MapInfo[][];
    position: GridPosition;
    aviation: string;
};

export const LargeMap: FC<Props> = ({ map, position, aviation }) => {
    const mapConfig = useRef<MapInfo[][]>(map);
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
                                    border={
                                        currentGridX === x && currentGridY === y
                                            ? "5px solid #FFF530"
                                            : undefined
                                    }
                                    pos="relative"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Img
                                        src={getGridImg(item)}
                                        width="9vw"
                                        height="9vw"
                                    />
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
                <Img src={aviation} width="12vw" />
            </Box>
        </Box>
    );
};
