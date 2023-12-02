import { Box, Text, Image } from "@chakra-ui/react";
import React from "react";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { PrimaryButton } from "@/components/Button/Index";
import YellowArrowIcon from "@/assets/yellow-arrow.svg";
import { onGoingGame } from "@/pages/TacToeMode";
export const LiveGame = ({ list }: { list: onGoingGame[] }) => {
    const { chainId } = useActiveWeb3React();

    const handleWatch = (gameAddress: string) => {
        const url = `${window.location.origin}/#/btt/live?gameAddress=${gameAddress}&chainId=${chainId}`;
        window.open(url, "_blank");
    };
    return (
        <Box
            sx={{
                width: "16.6667vw",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1.0417vw",
                        height: "1.0417vw",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        marginRight: "0.7813vw",
                    }}
                >
                    <Box
                        sx={{
                            width: "0.625vw",
                            height: "0.625vw",
                            background: "#fff",
                            borderRadius: "50%",
                        }}
                    ></Box>
                </Box>
                <Box>
                    <Text
                        sx={{
                            fontFamily: "Quantico",
                            fontSize: "1.25vw",
                            fontWeight: 700,
                            lineHeight: "1.0417vw",
                        }}
                    >
                        Live Games
                    </Text>
                    <Text
                        sx={{
                            fontFamily: "Quantico",
                            fontSize: "1.25vw",
                            fontWeight: 700,
                            lineHeight: "1.0417vw",
                            marginTop: "0.5208vw",
                        }}
                    >
                        {list.length * 2} in Games
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "2.5926vh",
                    height: "20vh",
                    overflow: "auto",
                }}
            >
                {list.map((item) => {
                    return (
                        <Box
                            key={item.gameAddress}
                            sx={{
                                fontSize: "0.8333vw",
                                fontFamily: "Quantico",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "0.5208vw",
                            }}
                        >
                            <Text>
                                Lvl.{item.level1} vs Lvl.{item.level2}
                            </Text>
                            <PrimaryButton
                                onClick={() => {
                                    handleWatch(item.gameAddress);
                                }}
                                sx={{
                                    border: "0.0521vw solid rgba(242, 216, 97, 1)",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "4.4271vw",
                                    height: "1.4583vw",
                                }}
                            >
                                <Text
                                    sx={{
                                        color: "rgba(242, 216, 97, 1)",
                                        fontSize: "0.8333vw",
                                    }}
                                >
                                    Watch
                                </Text>
                                <Image
                                    src={YellowArrowIcon}
                                    sx={{
                                        width: "1.0417vw",
                                    }}
                                ></Image>
                            </PrimaryButton>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
