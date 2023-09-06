import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import BaseGrid from "./assets/base-grid.svg";
import BlackXIcon from "./assets/black-x.svg";
import BlackCircle from "./assets/black-circle.svg";
import YellowCircle from "./assets/yellow-circle.svg";
import YellowX from "./assets/yellow-x.svg";
import { UserMarkType } from "@/pages/TacToe";

interface BoardGridProp {
    mark: UserMarkType;
    myValue: number;
    opValue: number;
}

export const BoardGrid = ({ mark, myValue, opValue }: BoardGridProp) => {
    return (
        <GridItem
            w="165px"
            h="165px"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
            }}
        >
            {mark !== UserMarkType.Square && mark !== UserMarkType.Empty && (
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
                            width: "64px",
                            height: "18px",
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
                            sx={{ marginRight: "10px" }}
                        ></Image>
                        {myValue}
                    </Box>

                    <Box
                        sx={{
                            width: "64px",
                            height: "18px",
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
                            sx={{ marginRight: "10px" }}
                        ></Image>

                        {opValue}
                    </Box>
                </Box>
            )}

            {mark === UserMarkType.Square && (
                <Box
                    width={"110px"}
                    height={"110px"}
                    sx={{
                        border: "4px dashed #fff",
                        borderRadius: "10px",
                    }}
                ></Box>
            )}
            {mark === UserMarkType.Circle && (
                <Image
                    width={"110px"}
                    height={"110px"}
                    src={CircleIcon}
                ></Image>
            )}
            {mark === UserMarkType.Cross && (
                <Image width={"110px"} height={"110px"} src={XIcon}></Image>
            )}
            {mark === UserMarkType.YellowCircle && (
                <Image
                    width={"110px"}
                    height={"110px"}
                    src={YellowCircle}
                ></Image>
            )}
            {mark === UserMarkType.YellowCross && (
                <Image width={"110px"} height={"110px"} src={YellowX}></Image>
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
            w={"501px"}
            h={"501px"}
        >
            <Grid
                templateColumns="repeat(3, 1fr)"
                templateRows="repeat(3, 1fr)"
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
