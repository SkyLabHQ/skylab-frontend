import { Info, UserMarkType } from "@/pages/TacToe";
import { Box, Image, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
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
    console.log(
        userInfo.address,
        "userInfo.addressuserInfo.addressuserInfo.address",
    );
    return (
        <Box>
            <Box sx={{ height: "52px" }}>
                {showResult && (
                    <Box
                        sx={{
                            width: "105px",
                            height: "52px",
                            color: "#303030",
                            background: win ? "#fddc2d" : "#d9d9d9",
                            borderRadius: "18px",
                            fontSize: "36px",
                            textAlign: "center",
                            lineHeight: "52px",
                        }}
                    >
                        {win ? "Win" : "Lose"}
                    </Box>
                )}
            </Box>

            <Image
                sx={{ width: "46px", height: "46px", marginTop: "30px" }}
                src={mark}
            ></Image>
            <Text
                sx={{
                    color: win ? "#fddc2d" : "#d9d9d9",
                    marginTop: "10px",
                }}
            >
                {shortenAddress(userInfo.address)}
            </Text>
        </Box>
    );
};

export default ResultUserCard;
