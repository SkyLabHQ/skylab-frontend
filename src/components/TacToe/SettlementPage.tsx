import { Box, Button, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import Bg from "./assets/settlement-bg.png";
import GardenIcon from "./assets/garden-icon.png";
import BackIcon from "./assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/pages/TacToe";
import { GameState } from ".";
import UpIcon from "./assets/up-icon.svg";
import DownIcon from "./assets/down-icon.svg";
import MintIcon from "./assets/mint-icon.png";
import Loading from "../Loading";
import RightArrow from "./assets/right-arrow.svg";

export const aviationImg = (level: number) => {
    const url = require(`@/components/TacToe/assets/aviations/a${level}.png`);
    return url;
};

// calculate level and upgrade progress
function calculateLevelAndProgress(point: number) {
    if (point === 0) {
        return 0;
    }
    // 等级对应的点数范围
    const levelRanges = [
        1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
        32768,
    ];

    // 查找当前等级
    let currentLevel = 1;
    for (let i = 0; i < levelRanges.length; i++) {
        if (point >= levelRanges[i]) {
            currentLevel = i + 1;
        } else {
            break;
        }
    }

    // 计算升级所需的点数
    const pointsNeeded = levelRanges[currentLevel] - point;

    // 计算升级所需的百分比
    const totalPointsNeeded =
        levelRanges[currentLevel] - levelRanges[currentLevel - 1];
    const progress =
        ((totalPointsNeeded - pointsNeeded) / totalPointsNeeded) * 100;

    return progress.toFixed(0);
}

const WinResult = ({ myNewInfo }: { myNewInfo: MyNewInfo }) => {
    const { myInfo } = useGameContext();

    const [highlight, rightPlaneImg] = useMemo(() => {
        if (myNewInfo.level === myInfo.level) {
            return [false, aviationImg(myInfo.level + 1)];
        } else if (myNewInfo.level > myInfo.level) {
            return [true, aviationImg(myNewInfo.level)];
        }
    }, [myNewInfo.level, myInfo.level]);

    return (
        <Box>
            <Text
                sx={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#FDDC2D",
                }}
            >
                YOU WIN
            </Text>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Box>
                    <Image
                        src={aviationImg(myInfo.level)}
                        sx={{
                            width: "300px",
                            height: "300px",
                            opacity: highlight ? "0.5" : "1",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "36px", textAlign: "center" }}>
                        Lvl.{myInfo.level}
                    </Text>
                </Box>

                <Image src={UpIcon} sx={{ margin: "0 80px" }}></Image>
                <Box>
                    <Image
                        src={rightPlaneImg}
                        sx={{
                            width: "300px",
                            height: "300px",
                            opacity: highlight ? "1" : "0.5",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "36px", textAlign: "center" }}>
                        Lvl.{myNewInfo.level}
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "665px",
                    margin: "0 auto",
                }}
            >
                <Text
                    sx={{
                        textAlign: "right",
                        fontSize: "24px",
                    }}
                >
                    currentPt/NextLvlPt
                </Text>
                <Box
                    sx={{
                        height: "33px",
                        border: "2px solid #FFF",
                        borderRadius: "20px",
                        padding: "6px",
                    }}
                >
                    <Box
                        sx={{
                            width:
                                calculateLevelAndProgress(myNewInfo.point) +
                                "%",
                            height: "100%",
                            background: "#fff",
                            borderRadius: "20px",
                        }}
                    ></Box>
                </Box>
            </Box>
        </Box>
    );
};

const LoseResult = ({ myNewInfo }: { myNewInfo: MyNewInfo }) => {
    const { myInfo } = useGameContext();

    return (
        <Box>
            <Text
                sx={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    textAlign: "center",
                }}
            >
                YOU LOSE
            </Text>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Box>
                    <Image
                        src={aviationImg(myNewInfo.level)}
                        sx={{
                            width: "300px",
                            height: "300px",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "36px", textAlign: "center" }}>
                        Lvl.{myNewInfo.level}
                    </Text>
                </Box>
                <Image src={DownIcon} sx={{ margin: "0 80px" }}></Image>
                <Box>
                    <Image
                        src={myInfo.img}
                        sx={{
                            width: "300px",
                            height: "300px",
                            opacity: "0.5",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "36px", textAlign: "center" }}>
                        Lvl.{myInfo.level}
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "665px",
                    margin: "0 auto",
                }}
            >
                <Text
                    sx={{
                        textAlign: "right",
                        fontSize: "24px",
                    }}
                >
                    currentPt/NextLvlPt
                </Text>
                <Box
                    sx={{
                        height: "33px",
                        border: "2px solid #FFF",
                        borderRadius: "20px",
                        padding: "6px",
                    }}
                >
                    <Box
                        sx={{
                            width:
                                calculateLevelAndProgress(myNewInfo.point) +
                                "%",
                            height: "100%",
                            background: "#fff",
                            borderRadius: "20px",
                        }}
                    ></Box>
                </Box>
            </Box>
        </Box>
    );
};

interface MyNewInfo {
    level: number;
    point: number;
}

const SettlementPage = ({}) => {
    const navigate = useNavigate();
    const { myGameInfo, onStep, myNewInfo } = useGameContext();

    const win = useMemo(() => {
        return [
            GameState.WinByConnecting,
            GameState.WinBySurrender,
            GameState.WinByTimeout,
            GameState.WinByGridCount,
        ].includes(myGameInfo.gameState);
    }, [myGameInfo.gameState]);

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                background: `url(${Bg}) no-repeat center center`,
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    left: "0",
                    top: "0",
                }}
            >
                <Image src={GardenIcon}></Image>
                <Image
                    sx={{
                        cursor: "pointer",
                    }}
                    src={BackIcon}
                    onClick={() => navigate("/activities")}
                ></Image>
            </Box>

            <Box
                sx={{
                    position: "relative",
                }}
            >
                {myNewInfo ? (
                    <>
                        {win ? (
                            <WinResult myNewInfo={myNewInfo}></WinResult>
                        ) : (
                            <LoseResult myNewInfo={myNewInfo}></LoseResult>
                        )}

                        <Text sx={{ marginTop: "60px", fontSize: "24px" }}>
                            Your Lvl.{myNewInfo.level} Plane is temporary, mint
                            one below to keep your future wins.
                        </Text>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    background: "#fff",
                                    borderRadius: "18px",
                                    color: "#000",
                                    padding: "4px 6px",
                                    fontFamily: "Orbitron",
                                    cursor: "pointer",
                                    marginTop: "30px",
                                    width: "300px",
                                }}
                                onClick={() => {
                                    navigate("/activities");
                                }}
                            >
                                <Image
                                    src={MintIcon}
                                    sx={{ height: "84px" }}
                                ></Image>
                                <Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text
                                            sx={{
                                                fontSize: "32px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Mint
                                        </Text>
                                        <Box
                                            sx={{
                                                borderLeft: "1px solid #000",
                                            }}
                                        >
                                            <Image
                                                src={RightArrow}
                                                sx={{ height: "32px" }}
                                            ></Image>
                                        </Box>
                                    </Box>
                                    <Text sx={{ fontWeight: "bold" }}>
                                        Get Lvl.1 Paper Plane
                                    </Text>
                                </Box>
                            </Box>
                            <Button
                                sx={{
                                    borderRadius: "18px",
                                    width: "140px",
                                    height: "52px",
                                    color: "#d9d9d9",
                                    fontSize: "20px",
                                    margin: "30px 0 0",
                                }}
                                variant={"ghost"}
                                onClick={() => {
                                    onStep(1);
                                }}
                            >
                                <Text
                                    sx={{
                                        textDecorationLine: "underline",
                                        color: "#BCBBBE",
                                    }}
                                >
                                    Back
                                </Text>
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Loading></Loading>
                )}
            </Box>
        </Box>
    );
};

export default SettlementPage;
