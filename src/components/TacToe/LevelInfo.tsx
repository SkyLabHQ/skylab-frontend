import { Info, useGameContext } from "@/pages/TacToe";
import { Box, Text, Image } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import LevelUpIcon from "./assets/level-up.svg";
import LevelDownIcon from "./assets/level-down.svg";
import useCountDown from "react-countdown-hook";
import { getLevel } from "@/utils/level";
import { PilotInfo } from "@/hooks/usePilotInfo";

export const PlaneImg = ({
    detail,
    flip,
    pilotInfo,
}: {
    detail: Info;
    flip?: boolean;
    pilotInfo: PilotInfo;
}) => {
    return (
        <Box>
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Image
                    src={detail.img}
                    sx={{
                        width: "14.5833vw",
                        height: "14.5833vw",
                        transform: flip ? "scaleX(-1)" : "",
                        /*兼容IE*/
                        filter: "FlipH",
                    }}
                ></Image>
                {pilotInfo.img && (
                    <Image
                        sx={{
                            width: "3.3333vw",
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%,-50%)",
                            borderRadius: "50%",
                            border: "2px solid #000",
                        }}
                        src={pilotInfo.img}
                    ></Image>
                )}
            </Box>

            <Box
                sx={{
                    textAlign: "center",
                }}
            >
                <Text
                    sx={{
                        fontSize: "0.8333vw",
                        fontWeight: "bold",
                    }}
                >
                    Level {detail.level}{" "}
                </Text>
                <Text
                    sx={{
                        fontSize: "0.8333vw",
                        fontWeight: "bold",
                    }}
                >
                    {detail.point} pt
                </Text>
            </Box>
        </Box>
    );
};

const LevelInfo = ({}) => {
    const { myInfo, opInfo, onStep, points, myActivePilot, opActivePilot } =
        useGameContext();
    const [timeLeft, { start }] = useCountDown(5000, 1000);

    const { winPoint, losePoint } = points;

    useEffect(() => {
        start();
    }, []);

    const [myWinNewLevel, myWinNewPoint, myLoseNewLevel, myLoseNewPoint] =
        useMemo(() => {
            const myWinNewPoint = myInfo.point + winPoint;
            const myWinNewLevel = getLevel(myWinNewPoint);
            const myLoseNewPoint = myInfo.point - losePoint;
            const myLoseNewLevel = getLevel(myLoseNewPoint);

            return [
                myWinNewLevel,
                myWinNewPoint,
                myLoseNewLevel,
                myLoseNewPoint,
            ];
        }, [winPoint, losePoint, myInfo, opInfo]);

    useEffect(() => {
        setTimeout(() => {
            onStep(2);
        }, 5000);
    }, []);

    return (
        <Box
            sx={{
                fontFamily: "Orbitron",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1vh",
                }}
            >
                <PlaneImg detail={myInfo} pilotInfo={myActivePilot}></PlaneImg>
                <Text sx={{ fontSize: "2.5vw", margin: "0 1.5625vw" }}>VS</Text>
                <PlaneImg
                    detail={opInfo}
                    flip={true}
                    pilotInfo={opActivePilot}
                ></PlaneImg>
            </Box>
            <Box
                sx={{
                    fontWeight: "bold",
                    marginTop: "10vh",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #fff",
                        paddingBottom: "0.7813vw",
                    }}
                >
                    <Text
                        sx={{
                            color: "#FDDC2D",
                            fontSize: "1.0417vw",
                            width: "13.0208vw",
                        }}
                    >
                        Victory reward
                    </Text>
                    <Text
                        sx={{
                            marginRight: "0.5208vw",
                        }}
                    >
                        +{winPoint} pt
                    </Text>
                    <Image
                        src={LevelUpIcon}
                        sx={{
                            marginRight: "1.0417vw",
                        }}
                    ></Image>
                    <Box sx={{ textAlign: "center" }}>
                        <Text
                            sx={{
                                fontSize: "1.0417vw",
                            }}
                        >
                            Level {myWinNewLevel}
                        </Text>
                        <Text>{myWinNewPoint} pt</Text>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "3.125vw",
                        borderBottom: "1px solid #fff",
                        paddingBottom: "0.7813vw",
                    }}
                >
                    <Text
                        sx={{
                            color: "#fff",
                            fontSize: "1.0417vw",
                            width: "13.0208vw",
                        }}
                    >
                        Defeat penalty
                    </Text>
                    <Text
                        sx={{
                            marginRight: "0.5208vw",
                        }}
                    >
                        -{losePoint} pt
                    </Text>
                    <Image
                        src={LevelDownIcon}
                        sx={{
                            marginRight: "1.0417vw",
                        }}
                    ></Image>
                    <Box sx={{ textAlign: "center" }}>
                        <Text
                            sx={{
                                fontSize: "1.0417vw",
                            }}
                        >
                            Level {myLoseNewLevel}
                        </Text>
                        <Text>{myLoseNewPoint} pt</Text>
                    </Box>
                </Box>
            </Box>
            <Text
                sx={{
                    fontSize: "1.25vw",
                    fontWeight: "bold",
                    marginTop: "10vh",
                }}
            >
                Entering game in 5s
            </Text>
            <Box
                sx={{
                    width: "21.875vw",
                    height: "0.2083vw",
                    display: "flex",
                    justifyContent: "flex-end",
                    background: "#616161",
                    marginTop: "0.4167vw",
                }}
            >
                <Box
                    sx={{
                        width: (timeLeft / 5000) * 100 + "%",
                        transition: "width 0.5s",
                        height: "0.2083vw",
                        background: "#BCBBBE",
                    }}
                ></Box>
            </Box>
        </Box>
    );
};

export default LevelInfo;
