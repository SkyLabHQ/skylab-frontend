import { Box, Text, Image } from "@chakra-ui/react";
import LeaderboardIcon from "./assets/leaderboard-icon.svg";
import TutorialIcon from "@/components/Tournament/assets/tutorial-icon.svg";
import AllActivity from "@/components/Tournament/assets/all-activity.svg";
import SocialIcon from "@/components/Tournament/assets/social-icon.svg";
import Discord from "@/assets/discord.svg";
import Tw from "@/assets/tw.svg";
import Telegram from "@/components/Tournament/assets/telegram.svg";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import { useState } from "react";
import RightArrow from "./assets/right-arrow.svg";

interface RightNacProps {
    onShowAllActivities: () => void;
    onBack: () => void;
    onOpenTutorial: () => void;
}

const RightNac = ({
    onShowAllActivities,
    onBack,
    onOpenTutorial,
}: RightNacProps) => {
    const [socialOpen, setSocialOpen] = useState(false);
    const handleOpenSocial = () => {
        setSocialOpen(!socialOpen);
    };

    return (
        <Box
            right="1.0417vw"
            bottom="1.0417vw"
            pos={"absolute"}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                "& img": {
                    cursor: "pointer",
                },
            }}
        >
            <Image
                src={AllActivity}
                onClick={() => {
                    onShowAllActivities();
                }}
                sx={{ height: "3.6458vw" }}
            ></Image>
            <Image
                src={LeaderboardIcon}
                onClick={onBack}
                sx={{ marginTop: "0.4167vw", height: "3.6458vw" }}
            ></Image>
            <Image
                src={TutorialIcon}
                sx={{ marginTop: "0.4167vw", height: "3.6458vw" }}
                onClick={onOpenTutorial}
            ></Image>
            <Box
                sx={{
                    marginTop: "0.4167vw",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    transition: "all 0.3s",
                }}
            >
                <Image
                    src={RightArrow}
                    sx={{
                        position: "absolute",
                        left: "-6.25vw",
                        height: "2.3438vw",
                        top: "0.2604vw",
                        opacity: socialOpen ? 1 : 0,
                        cursor: "pointer",
                        display: socialOpen ? "block" : "none",
                    }}
                    onClick={() => {
                        setSocialOpen(false);
                    }}
                ></Image>
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        right: socialOpen ? "2.5vw" : "3.0208vw",
                        width: socialOpen ? "8.5938vw" : "0",
                        transition: "all 0.3s",
                        top: 0,
                        overflow: "hidden",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            border: "3px solid #F2D861",
                            borderRadius: "0.7813vw",
                            background: "rgba(0, 0, 0, 0.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.5vw",
                            height: "2.5vw",
                            marginRight: "0.2604vw",
                        }}
                        onClick={() => {
                            window.open("https://t.me/skylabHQ", "_blank");
                        }}
                    >
                        <Image
                            src={Telegram}
                            width={"100%"}
                            height="100%"
                        ></Image>
                    </Box>
                    <Box
                        sx={{
                            border: "3px solid #F2D861",
                            borderRadius: "0.7813vw",
                            background: "rgba(0, 0, 0, 0.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.5vw",
                            height: "2.5vw",
                            marginRight: "0.2604vw",
                        }}
                        onClick={() => {
                            window.open(
                                "https://discord.gg/qWxPz8Qr87",
                                "_blank",
                            );
                        }}
                    >
                        <Image
                            src={Discord}
                            width={"100%"}
                            height="100%"
                        ></Image>
                    </Box>
                    <Box
                        sx={{
                            border: "3px solid #F2D861",
                            borderRadius: "0.7813vw",
                            background: "rgba(0, 0, 0, 0.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.5vw",
                            height: "2.5vw",
                        }}
                        onClick={() => {
                            window.open(
                                "https://twitter.com/skylabHQ",
                                "_blank",
                            );
                        }}
                    >
                        <Image src={Tw} width={"100%"} height="100%"></Image>
                    </Box>
                </Box>

                <Image
                    src={SocialIcon}
                    onClick={handleOpenSocial}
                    sx={{
                        width: "2.5vw",
                        transform: socialOpen ? "translateX(0.5208vw)" : "",
                        transition: "all 0.3s",
                    }}
                ></Image>
                <Text
                    sx={{
                        fontSize: "0.9375vw",
                        fontWeight: 800,
                        color: "#f2d861",
                        transform: socialOpen ? "translateX(0.5208vw)" : "",
                        transition: "all 0.3s",
                    }}
                >
                    Social Media
                </Text>
            </Box>

            <Image
                onClick={() => {
                    window.open("/#/?part=primitives", "_blank");
                }}
                src={ProMerTab}
                sx={{ width: "14.5833vw", marginTop: "1vh" }}
            ></Image>
        </Box>
    );
};

export default RightNac;
