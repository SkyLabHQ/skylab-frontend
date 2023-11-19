import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import GoldIcon from "@/components/TacToe/assets/gold.svg";
import Plane1 from "@/assets/aviations/a1.png";
import { AdvantageTip, Message } from "../TacToe/UserCard";
import { GameState, getWinState } from "../TacToe";
import BotIcon from "./assets/bot.png";
import GearIcon from "./assets/gear.svg";

interface UserCardProps {
    gameState?: GameState;
    markIcon: string;
    balance: number;
    bidAmount: number;
    showAdvantageTip?: boolean;
    emote?: number;
    level: number;
    message?: number;
    status?: "my" | "op";
    planeUrl?: string;
    isBot?: boolean;
}

export const UserCard = ({
    isBot,
    message,
    emote,
    level,
    markIcon,
    balance,
    bidAmount,
    status,
    showAdvantageTip,
    planeUrl = Plane1,
    gameState,
}: UserCardProps) => {
    const isMy = status === "my";
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMy ? "flex-start" : "flex-end",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        left: isMy && "6.9792vw",
                        right: !isMy && "6.9792vw",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Message
                        message={message}
                        emote={emote}
                        status={status}
                    ></Message>
                </Box>

                {isBot ? (
                    <Box
                        sx={{
                            transform: isMy ? "" : "scaleX(-1)",
                            position: "relative",
                            background: `url(${GearIcon}) no-repeat`,
                            backgroundPosition: "0 0",
                            backgroundSize: "50%",
                        }}
                    >
                        <Image
                            src={BotIcon}
                            sx={{
                                width: "2.5vw",
                                position: "absolute",
                                right: "22%",
                            }}
                        ></Image>
                        <Image
                            sx={{
                                width: "6.9792vw",
                                height: "6.9792vw",
                            }}
                            src={planeUrl}
                        ></Image>
                    </Box>
                ) : (
                    <Image
                        sx={{
                            width: "6.9792vw",
                            height: "6.9792vw",
                            transform: isMy ? "" : "scaleX(-1)",
                        }}
                        src={planeUrl}
                    ></Image>
                )}

                <Text
                    sx={{
                        fontSize: "0.8333vw",
                        textAlign: isMy ? "left" : "right",
                        fontWeight: "bold",
                    }}
                >
                    Level {level}
                </Text>
            </Box>
            {gameState > GameState.Revealed ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "1.25vw",
                        marginTop: "1.5625vw",
                        position: "relative",
                    }}
                >
                    <Image
                        src={markIcon}
                        sx={{ width: "1.875vw", marginRight: "0.3125vw" }}
                    ></Image>
                    {isMy &&
                        (getWinState(gameState) ? (
                            <Box
                                sx={{
                                    width: "4.2188vw",
                                    height: "2.2917vw",
                                    borderRadius: "0.9375vw",
                                    background: "#FDDC2D",
                                    textAlign: "center",
                                    lineHeight: "2.2917vw",
                                    color: "#303030",
                                    right: "-4.2188vw",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    position: "absolute",
                                }}
                            >
                                Win
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    width: "4.2188vw",
                                    height: "2.2917vw",
                                    borderRadius: "0.9375vw",
                                    background: "#D9D9D9",
                                    color: "#303030",
                                    textAlign: "center",
                                    lineHeight: "2.2917vw",
                                    position: "absolute",
                                    right: "-4.2188vw",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                }}
                            >
                                Lose
                            </Box>
                        ))}
                </Box>
            ) : (
                <AdvantageTip
                    direction={isMy ? "right" : "left"}
                    markIcon={markIcon}
                    showAdvantageTip={showAdvantageTip}
                ></AdvantageTip>
            )}

            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "1.0417vw",
                    height: "9.8958vw",
                    padding: "0.3646vw 0.8333vw 0.625vw 0.7292vw",
                    marginTop: "0.7813vw",
                    width: "12.6042vw",
                }}
            >
                <Box
                    sx={{
                        width: "9.6875vw",
                        height: "2.5vw",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "1.3542vw",
                        paddingLeft: "0.7292vw",
                    }}
                >
                    <Image
                        src={GoldIcon}
                        sx={{ width: "2.8125vw", height: "2.8125vw" }}
                    ></Image>
                    <Text
                        sx={{
                            textShadow: "0.0521vw 0.0521vw 0vw #303030",
                            fontSize: "1.25vw",
                            color: "#fddc2d",
                            marginLeft: "0.6771vw",
                            lineHeight: "1.875vw",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <Box>
                    <Box sx={{ marginTop: "0.7813vw", display: "flex" }}>
                        <Box>
                            <Text sx={{ fontSize: "1.25vw" }}>Bid</Text>
                            <Box
                                sx={{
                                    height: "2.2917vw",
                                    background: "#4a4a4a",
                                    borderRadius: "0.9375vw",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fddc2d",
                                    fontSize: "1.6667vw",
                                    width: "6.25vw",
                                }}
                            >
                                {bidAmount}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                            }}
                        >
                            <Text
                                sx={{
                                    fontSize: "0.8333vw",
                                    textAlign: "right",
                                    flex: 1,
                                    color: "#bcbbbe",
                                    lineHeight: "1.875vw",
                                }}
                            >
                                Remaining
                            </Text>
                            <Text
                                sx={{
                                    fontSize: "1.6667vw",
                                    textAlign: "right",
                                    margin: "0vw 0 0 0.5208vw",
                                    flex: 1,
                                    color: "#bcbbbe",
                                }}
                            >
                                / {balance}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
