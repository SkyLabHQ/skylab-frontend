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

    console.log(socialOpen, "socialOpen");
    return (
        <Box
            right="2vw"
            bottom="100px"
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
            ></Image>
            <Image
                src={LeaderboardIcon}
                onClick={onBack}
                sx={{ marginTop: "8px" }}
            ></Image>
            <Image
                src={TutorialIcon}
                sx={{ marginTop: "8px" }}
                onClick={onOpenTutorial}
            ></Image>
            <Box
                sx={{
                    marginTop: "8px",
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
                        left: "-110px",
                        height: "45px",
                        top: "5px",
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
                        right: socialOpen ? "48px" : "58px",
                        width: socialOpen ? "165px" : "0",
                        transition: "all 0.3s",
                        top: 0,
                        overflow: "hidden",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            border: "3px solid #F2D861",
                            borderRadius: "15px",
                            background: "rgba(0, 0, 0, 0.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "53px",
                            height: "53px",
                            marginRight: "5px",
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
                            borderRadius: "15px",
                            background: "rgba(0, 0, 0, 0.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "53px",
                            height: "53px",
                            marginRight: "5px",
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
                            borderRadius: "15px",
                            background: "rgba(0, 0, 0, 0.20)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "53px",
                            height: "53px",
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
                        width: "53px",
                        transform: socialOpen ? "translateX(10px)" : "",
                        transition: "all 0.3s",
                    }}
                ></Image>
                <Text
                    sx={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "#f2d861",
                        transform: socialOpen ? "translateX(10px)" : "",
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
                sx={{ width: "280px", marginTop: "40px" }}
            ></Image>
        </Box>
    );
};

export default RightNac;
