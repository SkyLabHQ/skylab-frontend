import React, { useMemo } from "react";
import { shortenAddress } from "@/utils";
import AdvantageIcon from "./assets/advantage-icon.svg";
import { Box, Button, Image, Text, useClipboard } from "@chakra-ui/react";
import CopyIcon from "./assets/copy-icon.svg";
import GoldIcon from "./assets/gold.svg";

import Plane1 from "./assets/aviations/a1.png";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";
import { AdvantageTip } from "../TacToe/UserCard";

const OpBid = ({ balance }: { balance: number }) => {
    return (
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
                            color: "#000000",
                            fontSize: "32px",
                            width: "120px",
                        }}
                    ></Box>
                </Box>
                <Box>
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
    );
};

interface UserCardProps {
    loading?: boolean;
    messageLoading?: boolean;
    emoteLoading?: boolean;
    markIcon: string;
    address: string;
    balance: number;
    bidAmount: number;
    showAdvantageTip?: boolean;
    emote?: string;
    message?: string;
    myGameState?: number;
    opGameState?: number;
    status?: "my" | "op";
    planeUrl?: string;
}

export const MyUserCard = ({
    markIcon,
    address,
    balance,
    bidAmount,
    showAdvantageTip,
    status = "my",
    myGameState,
    planeUrl = Plane1,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Image
                    sx={{
                        width: "134px",
                        height: "134px",
                    }}
                    src={planeUrl}
                ></Image>
            </Box>
            <AdvantageTip
                direction="right"
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Text
                sx={{
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "6px",
                }}
                onClick={onCopy}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        width: "16px",
                        marginLeft: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "20px",
                    height: "242px",
                    padding: "7px 16px 16px 40px",
                    marginTop: "15px",
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
                    <Image src={GoldIcon} sx={{ width: "54px" }}></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "24px",
                            color: "#fddc2d",
                            marginLeft: "13px",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

export const OpUserCard = ({
    markIcon,
    address,
    balance,
    showAdvantageTip,
    planeUrl = Plane1,
}: UserCardProps) => {
    const { onCopy } = useClipboard(address ?? "");
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                }}
            >
                <Image
                    sx={{
                        width: "134px",
                        height: "134px",
                        transform: "scaleX(-1)",
                    }}
                    src={planeUrl}
                ></Image>
            </Box>
            <AdvantageTip
                direction="left"
                markIcon={markIcon}
                showAdvantageTip={showAdvantageTip}
            ></AdvantageTip>
            <Text
                sx={{
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "6px",
                }}
                onClick={onCopy}
            >
                {shortenAddress(address, 5, 4)}
                <Image
                    src={CopyIcon}
                    sx={{
                        width: "16px",
                        marginLeft: "10px",
                        display: "inline-block",
                        verticalAlign: "middle",
                    }}
                ></Image>
            </Text>
            <Box
                sx={{
                    background: "#787878",
                    borderRadius: "20px",
                    height: "242px",
                    padding: "7px 16px 16px 40px",
                    marginTop: "15px",
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
                    <Image src={GoldIcon} sx={{ width: "54px" }}></Image>
                    <Text
                        sx={{
                            textShadow: "1px 1px 0px #303030",
                            fontSize: "24px",
                            color: "#fddc2d",
                            marginLeft: "13px",
                        }}
                    >
                        GOLD
                    </Text>
                </Box>
                <OpBid balance={balance}></OpBid>
            </Box>
        </Box>
    );
};
