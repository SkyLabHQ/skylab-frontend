import { Box, Grid } from "@chakra-ui/react";
import React, { useState } from "react";
import UserCard from "./UserCard";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import { BoardGrid } from "@/components/TacToc/Board";
import Timer from "@/components/TacToc/Timer";
import BaseGrid from "./assets/base-grid.svg";
import { useTour } from "@reactour/tour";
import ToolBar from "./Toolbar";
import LevelInfo from "./LevelInfo";

const FirstBoard = () => {
    const list = [
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 1,
            myValue: 0,
            opValue: 0,
        },
    ];

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
                    console.log(item, "rrrrr");
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

const SecondBoard = () => {
    const list = [
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
    ];

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
                <Box
                    className="fifth-step"
                    sx={{
                        width: "200px",
                        height: "600px",
                        position: "absolute",
                        top: 0,
                        right: 0,
                    }}
                ></Box>
            </Grid>
        </Box>
    );
};

const ThirdBoard = () => {
    const list = [
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 2,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: 3,
            myValue: 0,
            opValue: 0,
        },
    ];

    return (
        <Box
            sx={{
                background: `url(${BaseGrid})`,
                backgroundSize: "100% 100%",
            }}
            className="sixth-step"
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

const TacTocTutorial = ({}) => {
    const { currentStep } = useTour();
    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                inset: 0,
                padding: "27px 90px",
                background: "#303030",
                zIndex: 100,
            }}
        >
            <LevelInfo></LevelInfo>
            <Timer></Timer>
            <ToolBar></ToolBar>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "10vh",
                }}
            >
                <UserCard
                    showAdvantageTip
                    showButton
                    markIcon={CircleIcon}
                    address={"0x2f49Be6976324000da4Bd091B0217E217b81A93d"}
                    balance={"4556"}
                    currentBid={"15"}
                ></UserCard>
                {[0, 1, 2, 3].includes(currentStep) && (
                    <FirstBoard></FirstBoard>
                )}
                {currentStep === 4 && <SecondBoard></SecondBoard>}
                {currentStep === 5 && <ThirdBoard></ThirdBoard>}
                {/* <Board></Board> */}
                <UserCard
                    showButton={false}
                    markIcon={XIcon}
                    address={"0x2f49Be6976324000da4Bd091B0217E217b81A93d"}
                    balance={"4556"}
                    currentBid={"15"}
                ></UserCard>
            </Box>
        </Box>
    );
};

export default TacTocTutorial;
