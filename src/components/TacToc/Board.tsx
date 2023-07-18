import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XICon from "@/components/TacToc/assets/x.svg";

const Board = () => {
    const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    return (
        <Box>
            <Grid
                templateColumns="repeat(3, 1fr)"
                templateRows="repeat(3, 1fr)"
                w={"594px"}
            >
                {list.map((item, index) => {
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
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "0",
                                    bottom: "0",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    sx={{
                                        fontSize: "36px",
                                        marginRight: "12px",
                                    }}
                                >
                                    {item}
                                </Text>
                                <Box
                                    sx={{
                                        width: "70px",
                                        height: "20px",
                                        background: "#D9D9D9",
                                        borderRadius: "18px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "#000000",
                                    }}
                                >
                                    150pt
                                </Box>
                            </Box>
                            <Image
                                width={"62%"}
                                height={"62%"}
                                src={index % 2 == 0 ? CircleIcon : XICon}
                            ></Image>
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default Board;
