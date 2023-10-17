import { Info, UserMarkType } from "@/pages/TacToe";
import { Box, Image, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import YellowCircle from "./assets/yellow-circle.svg";
import YellowX from "./assets/yellow-x.svg";
import { shortenAddress } from "@/utils";

const ResultUserCard = ({
    showResult,
    win,
    userInfo,
}: {
    showResult?: boolean;
    win?: boolean;
    userInfo: Info;
}) => {
    const mark = useMemo(() => {
        if (win) {
            if (userInfo.mark === UserMarkType.Circle) {
                return YellowCircle;
            } else {
                return YellowX;
            }
        } else {
            if (userInfo.mark === UserMarkType.Circle) {
                return CircleIcon;
            } else {
                return XIcon;
            }
        }
    }, [win, userInfo]);

    return (
        <Box>
            <Box sx={{ height: "2.7083vw" }}>
                {showResult && (
                    <Box
                        sx={{
                            width: "5.4688vw",
                            height: "2.7083vw",
                            color: "#303030",
                            background: win ? "#fddc2d" : "#d9d9d9",
                            borderRadius: "0.9375vw",
                            fontSize: "1.875vw",
                            textAlign: "center",
                            lineHeight: "2.7083vw",
                        }}
                    >
                        {win ? "Win" : "Lose"}
                    </Box>
                )}
            </Box>

            <Image
                sx={{
                    width: "2.3958vw",
                    height: "2.3958vw",
                    marginTop: "1.5625vw",
                }}
                src={mark}
            ></Image>
            <Text
                sx={{
                    color: win ? "#fddc2d" : "#d9d9d9",
                    marginTop: "0.5208vw",
                    fontSize: "1.875vw",
                }}
            >
                {shortenAddress(userInfo.address)}
            </Text>
        </Box>
    );
};

export default ResultUserCard;
