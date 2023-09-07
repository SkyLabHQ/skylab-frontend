import { Box, Grid, Text, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import { BoardGrid } from "@/components/TacToe/Board";
import BaseGrid from "./assets/base-grid.svg";
import { useTour } from "@reactour/tour";
import TutorialIcon from "./assets/tutorial-icon.svg";
import TipIcon from "./assets/tip.svg";
import { GameState } from ".";

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
                w={"501px"}
                h={"501px"}
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
                    className="btt-fourth-step"
                    sx={{
                        width: "156px",
                        height: "16px",
                        position: "absolute",
                        top: "315px",
                        right: "50%",
                        transform: "translateX(50%)",
                    }}
                ></Box>
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
                w={"501px"}
                h={"501px"}
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
                    className="btt-fifth-step"
                    sx={{
                        width: "157px",
                        height: "501px",
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
            className="btt-sixth-step"
        >
            <Grid
                templateColumns="repeat(3, 1fr)"
                templateRows="repeat(3, 1fr)"
                w={"501px"}
                h={"501px"}
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

const Timer = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                width: "fit-content",
                left: "50%",
                transform: "translateX(-50%)",
            }}
        >
            <Box
                sx={{
                    border: "3px solid #FFF",
                    width: "412px",
                    background: "transparent",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 7px",
                }}
            >
                <Box
                    sx={{
                        height: "25px",
                        width: "30%",
                        background: "#fff",
                    }}
                ></Box>
            </Box>
            <Text
                sx={{
                    fontSize: "36px",
                    position: "absolute",
                    right: "-140px",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            >
                01:30
            </Text>
        </Box>
    );
};

const ToolBar = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                right: "20px",
                top: "20px",
                display: "flex",
                alignItems: "center",
                "& > div": {
                    cursor: "pointer",
                },
            }}
        >
            <Box
                sx={{
                    borderRadius: "18px",
                    height: "58px",
                    width: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    marginRight: "14px",
                }}
            >
                <Image src={TutorialIcon} sx={{ height: "40px" }}></Image>
            </Box>
            <Box
                sx={{
                    borderRadius: "18px",
                    height: "58px",
                    width: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                }}
            >
                <Text sx={{ fontSize: "28px" }}>Quit</Text>
            </Box>
        </Box>
    );
};

const LevelInfo = ({}) => {
    return (
        <Box
            sx={{
                position: "absolute",
                left: "20px",
                top: "20px",
            }}
        >
            <Text
                sx={{
                    fontSize: "28px",
                    fontWeight: "700",
                }}
            >
                Level {}
            </Text>

            <Text
                sx={{
                    fontSize: "20px",
                    marginTop: "20px",
                }}
            >
                Discount Rate=0.5
                <Image
                    src={TipIcon}
                    sx={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginLeft: "5px",
                    }}
                ></Image>
            </Text>
        </Box>
    );
};

const TacToeTutorial = ({}) => {
    const { currentStep } = useTour();

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                inset: 0,
                padding: "27px 60px",
                background: "#303030",
                zIndex: 100,
                position: "absolute",
                left: 0,
                top: 0,
            }}
        >
            <Timer></Timer>
            <ToolBar></ToolBar>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12vh",
                }}
            >
                <UserCard
                    status="my"
                    showAdvantageTip
                    markIcon={CircleIcon}
                    address={"0x2f49Be6976324000da4Bd091B0217E217b81A93d"}
                    balance={67}
                    bidAmount={15}
                ></UserCard>
                {[0, 1, 2, 3].includes(currentStep) && (
                    <FirstBoard></FirstBoard>
                )}
                {currentStep === 4 && <SecondBoard></SecondBoard>}
                {currentStep === 5 && <ThirdBoard></ThirdBoard>}
                {/* <Board></Board> */}
                <UserCard
                    status="op"
                    markIcon={XIcon}
                    address={"0x2f49Be6976324000da4Bd091B0217E217b81A93d"}
                    balance={56}
                    bidAmount={15}
                    opGameState={GameState.WaitingForBid}
                ></UserCard>
            </Box>
        </Box>
    );
};

export default TacToeTutorial;
