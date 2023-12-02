import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import { useAllBttTransaction } from "@/hooks/useTacToeStore";
import BttIcon from "@/assets/btt-icon.png";
import LevelUpIcon from "@/assets/level-up.svg";
import LevelDownIcon from "@/assets/level-down.svg";
import dayjs from "dayjs";
import PlayBackIcon from "@/assets/playback-icon.svg";
import { shortenAddressWithout0x } from "@/utils";
import BttHelmet from "@/components/Helmet/BttHelmet";

interface RecordInfo {
    chainId: number;
    account: string;
    time: number;
    tokenId: number;
    gameAddress: string;
    oldLevel: number;
    newLevel: number;
    oldPoint: number;
    newPoint: number;
    burner: string;
    win: boolean;
}

const BttHistory = () => {
    const navigate = useNavigate();
    const { setIsKnobVisible } = useKnobVisibility();
    const allRecords = useAllBttTransaction();

    const handleToPlayBack = (record: RecordInfo) => {
        const { gameAddress, burner, chainId } = record;
        navigate(
            `/btt/playback?gameAddress=${gameAddress}&burner=${shortenAddressWithout0x(
                burner,
            )}&chainId=${chainId}`,
        );
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return (
        <>
            <BttHelmet></BttHelmet>
            <Box
                sx={{
                    position: "relative",
                    padding: "140px 150px",
                    fontFamily: "Orbitron",
                    background: "#303030",
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
                        borderTop: "1px solid #fff",
                    }}
                >
                    <Text
                        sx={{
                            fontSize: "24px",
                            fontWeight: "500",
                            marginTop: "21px",
                        }}
                    >
                        History
                    </Text>
                    <Box
                        sx={{
                            fontSize: "24px",
                            height: "calc(100vh - 340px)",
                            overflowY: "auto",
                        }}
                    >
                        {allRecords.map((item) => {
                            return (
                                <Box
                                    key={item.gameAddress}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "200px",
                                        }}
                                    >
                                        <Image
                                            src={BttIcon}
                                            sx={{
                                                width: "74px",
                                                marginRight: "15px",
                                            }}
                                        ></Image>
                                        <Text
                                            sx={{
                                                fontSize: "24px",
                                                fontWeight: 800,
                                                color: item.win
                                                    ? "#c0fffe"
                                                    : "#A83D39",
                                                width: "100px",
                                            }}
                                        >
                                            {item.win ? "Win" : "Lose"}
                                        </Text>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "200px",
                                        }}
                                    >
                                        <Image
                                            sx={{
                                                marginRight: "10px",
                                            }}
                                            src={
                                                item.win
                                                    ? LevelUpIcon
                                                    : LevelDownIcon
                                            }
                                        ></Image>
                                        <Text
                                            sx={{
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            Lvl.{item.oldLevel} {">>"} Lvl.
                                            {item.newLevel}{" "}
                                        </Text>
                                    </Box>
                                    <Text sx={{ width: "260px" }}>
                                        Points net {item.oldPoint} (
                                        {item.win
                                            ? "+" +
                                              (item.newPoint - item.oldPoint)
                                            : item.newPoint - item.oldPoint}
                                        )
                                    </Text>
                                    <Text
                                        sx={{
                                            width: "280px",
                                        }}
                                    >
                                        {dayjs(item.time).format(
                                            "HH:mm MM-DD-YYYY",
                                        )}
                                    </Text>
                                    <Image
                                        sx={{
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleToPlayBack(item)}
                                        src={PlayBackIcon}
                                    ></Image>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default BttHistory;
