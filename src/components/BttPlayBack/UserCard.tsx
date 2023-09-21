import React, { useMemo } from "react";
import { shortenAddress } from "@/utils";
import AdvantageIcon from "./assets/advantage-icon.svg";
import { Box, Button, Image, Text, useClipboard } from "@chakra-ui/react";
import CopyIcon from "@/components/TacToe/assets/copy-icon.svg";
import GoldIcon from "@/components/TacToe/assets/gold.svg";

import Plane1 from "@/components/TacToe/assets/aviations/a1.png";
import { AdvantageTip, Message } from "../TacToe/UserCard";

interface UserCardProps {
    loading?: boolean;
    messageLoading?: boolean;
    emoteLoading?: boolean;
    markIcon: string;
    balance: number;
    bidAmount: number;
    showAdvantageTip?: boolean;
    emote?: string;
    level: number;
    message?: string;
    myGameState?: number;
    opGameState?: number;
    status?: "my" | "op";
    planeUrl?: string;
}

export const UserCard = ({
    message,
    emote,
    level,
    markIcon,
    balance,
    bidAmount,
    status,
    showAdvantageTip,
    planeUrl = Plane1,
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
                        left: isMy && "134px",
                        right: !isMy && "134px",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    {(message || emote) && (
                        <Message
                            message={message}
                            emote={emote}
                            status={status}
                        ></Message>
                    )}
                </Box>
                <Image
                    sx={{
                        width: "134px",
                        height: "134px",
                        transform: isMy ? "" : "scaleX(-1)",
                    }}
                    src={planeUrl}
                ></Image>
                <Text
                    sx={{
                        fontSize: "16px",
                        textAlign: isMy ? "left" : "right",
                        fontWeight: "bold",
                    }}
                >
                    Level {level}
                </Text>
            </Box>
            <AdvantageTip
                direction={isMy ? "right" : "left"}
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "20px",
                    height: "190px",
                    padding: "7px 16px 12px 14px",
                    marginTop: "15px",
                    width: "242px",
                }}
            >
                <Box
                    sx={{
                        width: "186px",
                        height: "48px",
                        background: "#bcbbbe",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "26px",
                        paddingLeft: "14px",
                    }}
                >
                    <Image
                        src={GoldIcon}
                        sx={{ width: "54px", height: "54px" }}
                    ></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "24px",
                            color: "#fddc2d",
                            marginLeft: "13px",
                            lineHeight: "36px",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <Box>
                    <Box sx={{ marginTop: "15px", display: "flex" }}>
                        <Box>
                            <Text sx={{ fontSize: "24px" }}>Bid</Text>
                            <Box
                                sx={{
                                    height: "44px",
                                    background: "#4a4a4a",
                                    borderRadius: "18px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fddc2d",
                                    fontSize: "32px",
                                    width: "120px",
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
                                    fontSize: "16px",
                                    textAlign: "right",
                                    flex: 1,
                                    color: "#bcbbbe",
                                    lineHeight: "36px",
                                }}
                            >
                                Remaining
                            </Text>
                            <Text
                                sx={{
                                    fontSize: "32px",
                                    textAlign: "right",
                                    margin: "0px 0 0 10px",
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
