import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useReducer, useRef } from "react";
import { cloneDeep } from "lodash";

import Destination from "../../assets/destination.svg";
import { MapInfo } from ".";

type Props = {
    onSelect: (item: MapInfo | undefined) => void;
};

const randomColor = () => {
    const colors = ["#39ACFF", "#13FFDA", "#FF2784"];
    const index = Math.floor(Math.random() * 3);
    return colors[index];
};

const initMap = () => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            if (i === 7 && j === 7) {
                map[i].push({
                    img: Destination,
                });
            } else if (i === 14 && j === 0) {
                map[i].push({
                    color: "white",
                    border: "5px solid #237EFF",
                });
            } else if (i === 0 && j === 14) {
                map[i].push({
                    color: "white",
                    border: "5px solid #E83E44",
                });
            } else {
                map[i].push({
                    color: randomColor(),
                });
            }
        }
    }
    return map;
};

const initialMap = initMap();

export const Map: FC<Props> = ({ onSelect }) => {
    const mapConfig = useRef<MapInfo[][]>(cloneDeep(initialMap));
    const containerMouseOutRef = useRef<number>();
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const onMouseOver = (x: number, y: number) => {
        mapConfig.current[x][y].hover = true;
        onSelect(mapConfig.current[x][y]);
    };

    const onMouseOut = (x: number, y: number) => {
        mapConfig.current[x][y].hover = false;
        onSelect({});
    };

    const onMouseClick = (x: number, y: number) => {
        mapConfig.current[x][y].selected = !mapConfig.current[x][y].selected;
        forceRender();
    };

    const onContainerMouseLeave = () => {
        containerMouseOutRef.current = window.setTimeout(() => {
            onSelect(undefined);
        }, 1000);
    };

    const onContainerMouseEnter = () => {
        if (containerMouseOutRef.current) {
            clearTimeout(containerMouseOutRef.current);
        }
    };

    return (
        <Box
            userSelect="none"
            onMouseEnter={onContainerMouseEnter}
            onMouseLeave={onContainerMouseLeave}
        >
            <VStack spacing="0.5vw">
                {mapConfig.current.map((row, x) => (
                    <HStack spacing="0.5vw" key={x}>
                        {row.map((item: MapInfo, y) =>
                            item.img ? (
                                <Img
                                    src={item.img}
                                    width="2vw"
                                    height="2vw"
                                    key={y}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="2vw"
                                    height="2vw"
                                    bg={
                                        item.selected || item.hover
                                            ? "white"
                                            : item.color
                                    }
                                    border={
                                        item.selected
                                            ? "5px solid #FFF530"
                                            : item.border
                                    }
                                    cursor="pointer"
                                    onMouseOver={() => onMouseOver(x, y)}
                                    onMouseOut={() => onMouseOut(x, y)}
                                    onClick={() => onMouseClick(x, y)}
                                />
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};
