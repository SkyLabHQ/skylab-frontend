import { Box, HStack, Img, VStack } from "@chakra-ui/react";
import React, { FC, useEffect, useReducer, useRef, useState } from "react";
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
    const [isDesigningRoute, setIsDesigningRoute] = useState(false);
    const [selectedItem, setSelectedItem] = useState<
        | {
              x: number;
              y: number;
          }
        | undefined
    >();
    const [isRouteCompleted, setIsRouteCompleted] = useState(false);
    const [_, forceRender] = useReducer((x) => x + 1, 0);

    const onMouseOver = (x: number, y: number) => {
        if (!isDesigningRoute) {
            return;
        }
        mapConfig.current[x][y].selected = true;
        forceRender();
    };

    const onMouseClick = (x: number, y: number) => {
        if (selectedItem?.x === x && selectedItem?.y === y) {
            onSelect(undefined);
            setSelectedItem(undefined);
            return;
        }
        onSelect(mapConfig.current[x][y]);
        setSelectedItem({ x, y });
    };

    const onMouseDown = (x: number, y: number) => {
        if (!(x === 14 && y === 0)) {
            return;
        }
        resetMap();
        setIsDesigningRoute(true);
        mapConfig.current[x][y].selected = true;
        setIsRouteCompleted(false);
    };

    const resetMap = () => {
        mapConfig.current = cloneDeep(initialMap);
        forceRender();
    };

    useEffect(() => {
        const listener = () => {
            setIsDesigningRoute(false);
            if (!mapConfig.current[7][7].selected) {
                resetMap();
            }
        };
        window.addEventListener("mouseup", listener);
        return () => {
            window.removeEventListener("mouseup", listener);
        };
    }, []);

    return (
        <Box userSelect="none">
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
                                    onMouseOver={() => onMouseOver(x, y)}
                                />
                            ) : (
                                <Box
                                    key={y}
                                    width="2vw"
                                    height="2vw"
                                    bg={item.selected ? "white" : item.color}
                                    border={
                                        item.selected
                                            ? "5px solid #FFF530"
                                            : item.border
                                    }
                                    cursor="pointer"
                                    onMouseOver={() => onMouseOver(x, y)}
                                    onClick={() => onMouseClick(x, y)}
                                    onMouseDown={() => onMouseDown(x, y)}
                                />
                            ),
                        )}
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
};
