import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import BaseGrid from "./assets/base-grid.svg";
import BlackXIcon from "./assets/black-x.svg";
import BlackCircle from "./assets/black-circle.svg";
import YellowCircle from "./assets/yellow-circle.svg";
import YellowX from "./assets/yellow-x.svg";
import { MarkType } from ".";

interface BoardGridProp {
    mark: MarkType;
    myValue: number;
    opValue: number;
}

export const BoardGrid = ({ mark, myValue, opValue }: BoardGridProp) => {
    return (
        <GridItem
            w="198px"
            h="198px"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
            }}
        >
            {(mark === MarkType.Circle || mark === MarkType.Cross) && (
                <Box
                    sx={{
                        position: "absolute",
                        left: "0",
                        bottom: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "0 10px",
                    }}
                >
                    <Box
                        sx={{
                            width: "70px",
                            height: "20px",
                            background: "#D9D9D9",
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            color: "#000000",
                            padding: "0 4px",
                        }}
                    >
                        <Image
                            width={"15px"}
                            height={"15px"}
                            src={BlackCircle}
                        ></Image>{" "}
                        {myValue} pt
                    </Box>

                    <Box
                        sx={{
                            width: "70px",
                            height: "20px",
                            background: "#D9D9D9",
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            color: "#000000",
                            padding: "0 4px",
                        }}
                    >
                        <Image
                            width={"15px"}
                            height={"15px"}
                            src={BlackXIcon}
                        ></Image>{" "}
                        {opValue} pt
                    </Box>
                </Box>
            )}

            {mark === MarkType.Square && (
                <Box
                    width={"130px"}
                    height={"130px"}
                    sx={{
                        border: "4px dashed #fff",
                        borderRadius: "10px",
                    }}
                ></Box>
            )}
            {mark === MarkType.Circle && (
                <Image
                    width={"130px"}
                    height={"130px"}
                    src={CircleIcon}
                ></Image>
            )}
            {mark === MarkType.Cross && (
                <Image width={"130px"} height={"130px"} src={XIcon}></Image>
            )}
            {mark === MarkType.YellowCircle && (
                <Image
                    width={"130px"}
                    height={"130px"}
                    src={YellowCircle}
                ></Image>
            )}
            {mark === MarkType.YellowCross && (
                <Image width={"130px"} height={"130px"} src={YellowX}></Image>
            )}
        </GridItem>
    );
};

const Board = ({ list }: { list: BoardGridProp[] }) => {
    return (
        <Box
            sx={{
                background: `url(${BaseGrid})`,
                backgroundSize: "100% 100%",
            }}
        >
            <Grid
                templateColumns="repeat(3, 1fr)"
                templateRows="repeat(3, 1fr)"
                w={"600px"}
                h={"600px"}
                sx={{
                    position: "relative",
                }}
            >
                {list.map((item, index) => {
                    return (
                        <BoardGrid
                            key={index}
                            mark={item.mark}
                            myValue={item.myValue}
                            opValue={item.opValue}
                        ></BoardGrid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Board;
