import { Box, Image, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import Bg from "./assets/settlement-bg.png";
import GardenIcon from "./assets/garden-icon.png";
import BackIcon from "./assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/pages/TacToe";
import { GameState } from ".";
import UpIcon from "./assets/up-icon.svg";
import DownIcon from "./assets/down-icon.svg";
import Loading from "../Loading";
import Playback from "./assets/playback.svg";
import { shortenAddressWithout0x } from "@/utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { aviationImg } from "@/utils/aviationImg";
import { getLevel, levelRanges } from "@/utils/level";
import RequestNextButton from "../RequrestNextButton";

// calculate level and upgrade progress
function calculateLevelAndProgress(oldPoint: number, currentPoint: number) {
    if (currentPoint === 0) {
        return 0;
    }

    const currentLevel = getLevel(currentPoint);
    const nextPoint = levelRanges[currentLevel];
    const prePoint = levelRanges[currentLevel - 1] || 0;
    const progress = ((currentPoint - prePoint) / (nextPoint - prePoint)) * 100;

    return Math.max(100, Number(progress.toFixed(0)));
}

const WinResult = ({ myNewInfo }: { myNewInfo: MyNewInfo }) => {
    const { myInfo } = useGameContext();

    const [highlight, rightPlaneImg, rightPlaneLevel] = useMemo(() => {
        if (myNewInfo.level === myInfo.level) {
            return [false, aviationImg(myInfo.level + 1), myInfo.level + 1];
        } else if (myNewInfo.level > myInfo.level) {
            return [true, aviationImg(myNewInfo.level), myNewInfo.level];
        }
    }, [myNewInfo.level, myInfo.level]);

    return (
        <Box>
            <Text
                sx={{
                    fontSize: "2.5vw",
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
                    justifyContent: "center",
                }}
            >
                <Box>
                    <Image
                        src={aviationImg(myInfo.level)}
                        sx={{
                            width: "15.625vw",
                            height: "15.625vw",
                            opacity: highlight ? "0.5" : "1",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "1.875vw", textAlign: "center" }}>
                        Lvl.{myInfo.level}
                    </Text>
                </Box>

                <Image src={UpIcon} sx={{ margin: "0 4.1667vw" }}></Image>
                <Box>
                    <Image
                        src={rightPlaneImg}
                        sx={{
                            width: "15.625vw",
                            height: "15.625vw",
                            opacity: highlight ? "1" : "0.5",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "1.875vw", textAlign: "center" }}>
                        Lvl.{rightPlaneLevel}
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "34.6354vw",
                    margin: "0 auto",
                }}
            >
                <Text
                    sx={{
                        textAlign: "right",
                        fontSize: "1.25vw",
                    }}
                >
                    {myInfo.point} pt / {myNewInfo.point} pt
                </Text>
                <Box
                    sx={{
                        height: "1.7188vw",
                        border: "0.1042vw solid #FFF",
                        borderRadius: "1.0417vw",
                        padding: "0.3125vw",
                    }}
                >
                    <Box
                        sx={{
                            width:
                                calculateLevelAndProgress(
                                    myInfo.point,
                                    myNewInfo.point,
                                ) + "%",
                            height: "100%",
                            background: "#fff",
                            borderRadius: "1.0417vw",
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
                    fontSize: "2.5vw",
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
                    justifyContent: "center",
                }}
            >
                <Box>
                    <Image
                        src={aviationImg(myNewInfo.level)}
                        sx={{
                            width: "15.625vw",
                            height: "15.625vw",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "1.875vw", textAlign: "center" }}>
                        Lvl.{myNewInfo.level}
                    </Text>
                </Box>
                <Image src={DownIcon} sx={{ margin: "0 4.1667vw" }}></Image>
                <Box>
                    <Image
                        src={myInfo.img}
                        sx={{
                            width: "15.625vw",
                            height: "15.625vw",
                            opacity: "0.5",
                        }}
                    ></Image>
                    <Text sx={{ fontSize: "1.875vw", textAlign: "center" }}>
                        Lvl.{myInfo.level}
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "34.6354vw",
                    margin: "0 auto",
                }}
            >
                <Text
                    sx={{
                        textAlign: "right",
                        fontSize: "1.25vw",
                    }}
                >
                    {myInfo.point}/{myNewInfo.point}
                </Text>
                <Box
                    sx={{
                        height: "1.7188vw",
                        border: "0.1042vw solid #FFF",
                        borderRadius: "1.0417vw",
                        padding: "0.3125vw",
                    }}
                >
                    <Box
                        sx={{
                            width:
                                calculateLevelAndProgress(
                                    myInfo.point,
                                    myNewInfo.point,
                                ) + "%",
                            height: "100%",
                            background: "#fff",
                            borderRadius: "1.0417vw",
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
    const { chainId } = useActiveWeb3React();
    const navigate = useNavigate();
    const { myGameInfo, myInfo, myNewInfo, bidTacToeGameAddress } =
        useGameContext();

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
                fontFamily: "Orbitron",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    cursor: "pointer",
                }}
            >
                <Box
                    onClick={() =>
                        navigate("/activities?step=2", {
                            replace: true,
                        })
                    }
                    sx={{
                        display: "flex",
                        marginRight: "1.0417vw",
                    }}
                >
                    <Image src={GardenIcon}></Image>
                    <Image sx={{}} src={BackIcon}></Image>
                </Box>
                <Image
                    src={Playback}
                    sx={{
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate(
                            `/tactoe/playback?gameAddress=${bidTacToeGameAddress}&burner=${shortenAddressWithout0x(
                                myInfo.burner,
                            )}&chainId=${chainId}`,
                            {
                                replace: true,
                            },
                        );
                    }}
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

                        <Text sx={{ marginTop: "3.125vw", fontSize: "1.25vw" }}>
                            Your playtest aircraft is temporary, join tournament
                            to keep your future wins.
                        </Text>
                        <RequestNextButton
                            sx={{
                                margin: "2.0833vw auto",
                            }}
                            onClick={() => {
                                window.open(
                                    "https://twitter.com/skylabHQ",
                                    "_blank",
                                );
                            }}
                        ></RequestNextButton>
                    </>
                ) : (
                    <Loading></Loading>
                )}
            </Box>
        </Box>
    );
};

export default SettlementPage;
