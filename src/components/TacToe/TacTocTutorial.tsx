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
import BttTimer from "./BttTimer";

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
            mark: 0,
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
                w={"26.0938vw"}
                h={"26.0938vw"}
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
                        width: "8.125vw",
                        height: "0.8333vw",
                        position: "absolute",
                        top: "16.4063vw",
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
                w={"26.0938vw"}
                h={"26.0938vw"}
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
                        width: "8.1771vw",
                        height: "26.0938vw",
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
                w={"26.0938vw"}
                h={"26.0938vw"}
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
                    width: "21.4583vw",
                    background: "transparent",
                    height: "2.0833vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 0.3646vw",
                }}
            >
                <Box
                    sx={{
                        height: "1.3021vw",
                        width: "30%",
                        background: "#fff",
                    }}
                ></Box>
            </Box>
            <Text
                sx={{
                    fontSize: "1.875vw",
                    position: "absolute",
                    right: "-7.2917vw",
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
        }, 200);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "calc(100% - 16.6667vw)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "fixed",
                    top: "2.6042vw",
                    left: "50%",
                    width: "calc(100% - 16.6667vw)",
                    transform: "translateX(-50%)",
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
                        width: "1.6667vw",
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
                    padding: "4.8958vw 8.3333vw 9.6875vw",
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
                        height: "74.537vh",
                        padding: "2vh 1.5vw 0",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <BttTimer
                            width={"30%"}
                            time={`00:12`}
                            show={true}
                        ></BttTimer>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flex: 1,
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
                        <Box>
                            {[0, 3].includes(currentStep) && (
                                <FirstBoard></FirstBoard>
                            )}
                            {currentStep === 1 && <SecondBoard></SecondBoard>}
                            {currentStep === 2 && <ThirdBoard></ThirdBoard>}
                        </Box>

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
                </Box>{" "}
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: "88vh",
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
                        sx={{
                            cursor: currentStep === 0 ? "no-drop" : "pointer",
                        }}
                    ></Image>
                    <Image
                        src={
                            currentStep === 0
                                ? PlayPreviouGray
                                : PlayPreviouWhite
                        }
                        sx={{
                            marginLeft: "1.0417vw",
                            cursor: currentStep === 0 ? "no-drop" : "pointer",
                        }}
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
                        sx={{
                            marginLeft: "1.0417vw",

                            cursor:
                                currentStep + 1 === steps.length
                                    ? "no-drop"
                                    : "pointer",
                        }}
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
                        sx={{
                            marginLeft: "1.0417vw",
                            cursor:
                                currentStep + 1 === steps.length
                                    ? "no-drop"
                                    : "pointer",
                        }}
                        onClick={() => {
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
