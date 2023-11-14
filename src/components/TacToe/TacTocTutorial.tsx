import { Box, Grid, Text, Image } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MyUserCard, OpUserCard } from "./UserCard";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import { BoardGrid } from "@/components/TacToe/Board";
import BaseGrid from "./assets/base-grid.svg";
import { useTour } from "@reactour/tour";
import { GameState } from ".";
import { UserMarkType } from "@/pages/TacToe";
import PlayStartWhite from "./assets/play-start-white.svg";
import PlayStartGray from "./assets/play-start-gray.svg";
import PlayPreviouWhite from "./assets/play-previous-white.svg";
import PlayPreviouGray from "./assets/play-previous-gray.svg";
import PlayNextWhite from "./assets/play-next-white.svg";
import PlayNextGray from "./assets/play-next-gray.svg";
import PlayEndWhite from "./assets/play-end-white.svg";
import PlayEndGray from "./assets/play-end-gray.svg";
import CloseIcon from "./assets/close.svg";

const FirstBoard = () => {
    const list = [
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 1,
            myValue: 12,
            opValue: 10,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 6,
            opValue: 8,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 5,
            opValue: 8,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 1,
            myValue: 7,
            opValue: 4,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 1,
            myValue: 10,
            opValue: 4,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
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
                            myMark={item.myMark}
                            opMark={item.opMark}
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
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 1,
            myValue: 6,
            opValue: 4,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 9,
            opValue: 6,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 4,
            opValue: 10,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 14,
            opValue: 12,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 12,
            opValue: 4,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
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
                            myMark={item.myMark}
                            opMark={item.opMark}
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
            myValue: 12,
            opValue: 7,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 16,
            opValue: 5,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 4,
            opValue: 9,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 9,
            opValue: 20,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 11,
            opValue: 24,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 12,
            opValue: 4,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 15,
            opValue: 3,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 2,
            myValue: 12,
            opValue: 24,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
        },
        {
            mark: 3,
            myValue: 9,
            opValue: 4,
            myMark: UserMarkType.Circle,
            opMark: UserMarkType.Cross,
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
                            myMark={item.myMark}
                            opMark={item.opMark}
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

const TacToeTutorial = ({}) => {
    const { currentStep, steps, setIsOpen, setCurrentStep } = useTour();

    useEffect(() => {
        setTimeout(() => {
            setIsOpen(true);
        }, 100);
    }, []);

    return (
        <Box>
            <Box
                sx={{
                    width: "calc(100% - 500px)",
                    height: "calc(100% - 280px)",
                    position: "fixed",
                    top: "94px",
                    left: "250px",
                    zIndex: 9999999,
                    border: "2px solid #FFF",
                    boxShadow: "5px 4px 8px 0px rgba(255, 255, 255, 0.50)",
                }}
            ></Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "fixed",
                    top: "50px",
                    left: "250px",
                    width: "calc(100% - 500px)",
                    zIndex: 9999999,
                }}
            >
                <Text
                    sx={{
                        fontSize: "1.25vw",
                    }}
                >
                    Tutorial
                </Text>
                <Image
                    src={CloseIcon}
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setIsOpen(false);
                    }}
                ></Image>
            </Box>
            <Box
                sx={{
                    width: "100vw",
                    height: "100vh",
                    inset: 0,
                    padding: "94px 250px 186px",
                    background: "rgba(217, 217, 217, 1)",
                    zIndex: 100,
                    position: "absolute",
                    left: 0,
                    top: 0,
                }}
            >
                <Box
                    sx={{
                        background: "#303030",
                        height: "100%",
                        padding: "20px 60px 100px",
                        width: "100%",
                    }}
                >
                    <Box sx={{}}>
                        <Box
                            sx={{
                                height: "58px",
                                position: "relative",
                            }}
                        >
                            <Timer></Timer>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingTop: "12vh",
                            }}
                        >
                            <MyUserCard
                                showTutorialStep
                                status="my"
                                showAdvantageTip
                                markIcon={CircleIcon}
                                level={1}
                                address={
                                    "0x2f49Be6976324000da4Bd091B0217E217b81A93d"
                                }
                                balance={
                                    [0, 1, 2].includes(currentStep)
                                        ? 60
                                        : currentStep === 3
                                        ? 55
                                        : 0
                                }
                                bidAmount={15}
                            ></MyUserCard>
                            {[0].includes(currentStep) && (
                                <FirstBoard></FirstBoard>
                            )}
                            {currentStep === 1 && <SecondBoard></SecondBoard>}
                            {currentStep === 2 && <ThirdBoard></ThirdBoard>}
                            <OpUserCard
                                status="op"
                                markIcon={XIcon}
                                level={1}
                                address={
                                    "0x40BA69df5c58A1106480b42aFEF78DA08860081c"
                                }
                                balance={
                                    [0, 1, 2].includes(currentStep)
                                        ? 64
                                        : currentStep == 3
                                        ? 64
                                        : 0
                                }
                                bidAmount={15}
                                opGameState={GameState.WaitingForBid}
                            ></OpUserCard>
                        </Box>
                    </Box>
                </Box>{" "}
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    bottom: "3vw",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 99999999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        width: "5.2083vw",
                        height: "1.875vw",
                        borderRadius: "1.0417vw",
                        background: "#D9D9D9",
                        color: "#303030",
                        fontFamily: "Quantico",
                        fontSize: "1.25vw",
                    }}
                >
                    {currentStep + 1}/{steps.length}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.7813vw",
                        justifyContent: "space-between",
                        width: "12.5vw",
                    }}
                >
                    <Image
                        src={currentStep === 0 ? PlayStartGray : PlayStartWhite}
                        onClick={() => {
                            currentStep !== 0 && setCurrentStep(0);
                        }}
                    ></Image>
                    <Image
                        src={
                            currentStep === 0
                                ? PlayPreviouGray
                                : PlayPreviouWhite
                        }
                        sx={{ marginLeft: "20px" }}
                        onClick={() => {
                            currentStep !== 0 &&
                                setCurrentStep(currentStep - 1);
                        }}
                    ></Image>
                    <Image
                        src={
                            currentStep + 1 === steps.length
                                ? PlayNextGray
                                : PlayNextWhite
                        }
                        sx={{ marginLeft: "20px" }}
                        onClick={() => {
                            currentStep + 1 !== steps.length &&
                                setCurrentStep(currentStep + 1);
                        }}
                    ></Image>
                    <Image
                        src={
                            currentStep + 1 === steps.length
                                ? PlayEndGray
                                : PlayEndWhite
                        }
                        sx={{ marginLeft: "20px" }}
                        onClick={() => {
                            console.log(steps, "steps");
                            currentStep + 1 !== steps.length &&
                                setCurrentStep(steps.length - 1);
                        }}
                    ></Image>
                </Box>
            </Box>
        </Box>
    );
};

export default TacToeTutorial;
