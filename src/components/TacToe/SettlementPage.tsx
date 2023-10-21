import { Box, Image, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import Bg from "./assets/settlement-bg.png";
import GardenIcon from "./assets/garden-icon.png";
import BackIcon from "./assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import { Info, MyNewInfo, useGameContext } from "@/pages/TacToe";
import { GameState } from ".";
import UpIcon from "./assets/up-icon.svg";
import DownIcon from "./assets/down-icon.svg";
import Loading from "../Loading";
import Playback from "./assets/playback.svg";
import { shortenAddressWithout0x } from "@/utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { aviationImg } from "@/utils/aviationImg";
import { levelRanges } from "@/utils/level";
import RequestNextButton from "../RequrestNextButton";
import { usePilotInfo } from "@/hooks/usePilotInfo";
import MyPilot from "../Tournament/MyPilot";
import MileageIcon from "@/components/Tournament/assets/mileage-icon.svg";
import PilotIcon from "@/components/Tournament/assets/pilot-icon.svg";
import RightArrowBlack from "@/components/Tournament/assets/right-arrow-black.svg";

const PilotInfo = () => {
    const { account } = useActiveWeb3React();
    const { activePilot } = usePilotInfo(account);
    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                }}
            >
                {/* <MyPilot
                    activePilot={activePilot}
                    sx={{
                        width: "5.7292vw !important",
                        height: "5.7292vw !important",
                        marginRight: "1.0417vw",
                    }}
                ></MyPilot> */}
                <Box>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                            fontWeight: 700,
                        }}
                    >
                        Pilot earned
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src={MileageIcon}
                            sx={{
                                width: "2.8646vw",
                                height: "2.8646vw",
                                marginRight: "0.4167vw",
                            }}
                        ></Image>
                        <Box
                            sx={{
                                width: "5.3646vw",
                                height: "1.5625vw",
                                borderRadius: "1.3542vw",
                                background: "rgba(188, 187, 190, 0.50)",
                                color: "#FFF",
                                textAlign: "center",
                                fontSize: "20px",
                            }}
                        >
                            10
                        </Box>
                    </Box>
                    <Text
                        sx={{
                            color: "#FDDC2D",
                            fontSize: "0.8333vw",
                        }}
                    >
                        Mileage
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.50)",
                    borderRadius: "0.5208vw",
                    marginTop: "0.5208vw",
                    width: "5.7292vw",
                    height: "1.7708vw",
                    padding: "0 0.4167vw",
                    justifyContent: "space-between",
                }}
            >
                <Image
                    src={PilotIcon}
                    sx={{
                        width: "20px",
                    }}
                ></Image>
                <Text
                    sx={{
                        fontSize: "16px",
                        color: "#4A4A4A",
                    }}
                >
                    Pilot
                </Text>
                <Box
                    sx={{
                        borderLeft: "1px solid rgba(96, 96, 96, 0.30)",
                        paddingLeft: "2px",
                    }}
                >
                    <Image
                        src={RightArrowBlack}
                        sx={{
                            width: "16px",
                        }}
                    ></Image>
                </Box>
            </Box>
            <Text
                sx={{
                    fontSize: "16px",
                    width: "360px",
                    marginTop: "10px",
                    fontStyle: "italic",
                }}
            >
                Set an active pilot to not have your hard-earned Mileage from
                games go wasted.
            </Text>
        </Box>
    );
};

// calculate level and upgrade progress
function calculateLevelAndProgress(currentPoint: number, win: boolean = true) {
    if (currentPoint === 0) {
        return 0;
    }

    let nextPoint = 0;
    let prePoint = 0;

    if (win) {
        for (let i = 0; i < levelRanges.length; i++) {
            if (currentPoint <= levelRanges[i]) {
                nextPoint = levelRanges[i];
                prePoint = levelRanges[i - 1];
                break;
            }
        }
    } else {
        for (let i = levelRanges.length - 1; i >= 0; i--) {
            if (currentPoint >= levelRanges[i]) {
                nextPoint = levelRanges[i + 1];
                prePoint = levelRanges[i];
                break;
            }
        }
    }

    const progress = ((currentPoint - prePoint) / (nextPoint - prePoint)) * 100;

    return progress.toFixed(0);
}

const WinResult = ({
    myInfo,
    myNewInfo,
}: {
    myInfo: Info;
    myNewInfo: MyNewInfo;
}) => {
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
                    {myInfo.point} pt +{" "}
                    <span style={{ color: "rgba(253, 220, 45, 1)" }}>
                        {myNewInfo.point - myInfo.point} pt
                    </span>{" "}
                    / {myNewInfo.point} pt
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
                                calculateLevelAndProgress(myNewInfo.point) +
                                "%",
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

const LoseResult = ({
    myInfo,
    myNewInfo,
}: {
    myInfo: Info;
    myNewInfo: MyNewInfo;
}) => {
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
                    {myInfo.point} pt -{" "}
                    <span style={{ color: "rgba(253, 220, 45, 1)" }}>
                        {myInfo.point - myNewInfo.point} pt
                    </span>{" "}
                    / {myNewInfo.point} pt
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
                                    myNewInfo.point,
                                    false,
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

const SettlementPage = ({}) => {
    const { chainId } = useActiveWeb3React();
    const navigate = useNavigate();
    const {
        myGameInfo,
        // myInfo,
        // myNewInfo,
        bidTacToeGameAddress,
    } = useGameContext();

    const myInfo: any = {
        level: 1,
        point: 4,
        burner: "0x122",
    };

    const myNewInfo = {
        level: 3,
        point: 8,
    };

    const win = useMemo(() => {
        return true;
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
                            <WinResult
                                myInfo={myInfo}
                                myNewInfo={myNewInfo}
                            ></WinResult>
                        ) : (
                            <LoseResult
                                myInfo={myInfo}
                                myNewInfo={myNewInfo}
                            ></LoseResult>
                        )}

                        <Text sx={{ marginTop: "3.125vw", fontSize: "1.25vw" }}>
                            Your playtest aviation is temporary, join tournament
                            to keep your future wins.
                        </Text>
                        <PilotInfo></PilotInfo>
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
