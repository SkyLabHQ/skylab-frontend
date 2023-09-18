import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import BaseGrid from "./assets/base-grid.svg";
import BlackXIcon from "./assets/black-x.svg";
import BlackCircle from "./assets/black-circle.svg";
import YellowCircle from "./assets/yellow-circle.svg";
import YellowX from "./assets/yellow-x.svg";
import { BoardItem, UserMarkType } from "@/pages/TacToe";

export const BoardGrid = ({
    mark,
    myValue,
    opValue,
    myMark,
    opMark,
}: BoardItem) => {
    return (
        <GridItem
            sx={{
                position: "relative",
                paddingBottom: "100%",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                                src={
                                    myMark === UserMarkType.Circle
                                        ? BlackCircle
                                        : BlackXIcon
                                }
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
                                src={
                                    opMark === UserMarkType.Circle
                                        ? BlackCircle
                                        : BlackXIcon
                                }
                                sx={{ marginRight: "10px" }}
                            ></Image>

                            {opValue}
                        </Box>
                    </Box>
                )}
                {mark === UserMarkType.Square && (
                    <Box
                        width={"70%"}
                        height={"70%"}
                        sx={{
                            border: "4px dashed #fff",
                            borderRadius: "10px",
                        }}
                    ></Box>
                )}
                {mark === UserMarkType.Circle && (
                    <Image
                        width={"70%"}
                        height={"70%"}
                        src={CircleIcon}
                    ></Image>
                )}
                {mark === UserMarkType.Cross && (
                    <Image width={"70%"} height={"70%"} src={XIcon}></Image>
                )}
                {mark === UserMarkType.YellowCircle && (
                    <Image
                        width={"70%"}
                        height={"70%"}
                        src={YellowCircle}
                    ></Image>
                )}
                {mark === UserMarkType.YellowCross && (
                    <Image width={"70%"} height={"70%"} src={YellowX}></Image>
                )}
            </Box>
        </GridItem>
    );
};

const Board = ({ list }: { list: BoardItem[] }) => {
    return (
        <Box
            sx={{
                background: `url(${BaseGrid})`,
                backgroundSize: "100% 100%",
            }}
            w={"30vw"}
            h={"30vw"}
            maxWidth="501px"
            maxHeight="501px"
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
                            myMark={item.myMark}
                            opMark={item.opMark}
                        ></BoardGrid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Board;
