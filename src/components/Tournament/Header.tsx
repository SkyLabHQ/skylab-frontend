import { Box, Image, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import UnknowPilot from "./assets/unknow-pilot.svg";
import Discord from "@/assets/discord.svg";
import RightArrow from "./assets/right-arrow.svg";
import FaucetIcon from "./assets/faucet-icon.svg";
import AviOnMerc from "./assets/aviOnMerc.svg";
import Tw from "@/assets/tw.svg";
import Telegram from "@/components/Tournament/assets/telegram.svg";

const IconGroup = () => {
    const {
        isOpen: socialOpen,
        onOpen,
        onClose,
    } = useDisclosure({
        defaultIsOpen: true,
    });
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Image
                src={AviOnMerc}
                sx={{ width: "45px", marginRight: "20px", cursor: "pointer" }}
            ></Image>
            <Box
                sx={{
                    position: "relative",
                    marginRight: "20px",
                }}
            >
                <Image
                    src={UnknowPilot}
                    sx={{ width: "45px", cursor: "pointer" }}
                    onClick={() => {
                        if (socialOpen) {
                            onClose();
                        } else {
                            onOpen();
                        }
                    }}
                ></Image>
                <Box
                    sx={{
                        display: "flex",
                        position: "absolute",
                        flexDirection: "column",
                        right: 0,
                        height: socialOpen ? "160px" : "0",
                        transition: "all 0.2s",
                        top: "60px",
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
                            width: "45px",
                            height: "45px",
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
                            width: "45px",
                            height: "45px",
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
                            width: "45px",
                            height: "45px",
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
                    src={RightArrow}
                    sx={{
                        position: "absolute",
                        right: "0",
                        top: "250px",
                        opacity: socialOpen ? 1 : 0,
                        cursor: "pointer",
                        display: socialOpen ? "block" : "none",
                    }}
                    onClick={() => {
                        onClose();
                    }}
                ></Image>
            </Box>
            <Image
                src={FaucetIcon}
                sx={{ width: "45px", marginRight: "20px", cursor: "pointer" }}
                onClick={() => {
                    window.open("https://faucet.polygon.technology/");
                }}
            ></Image>
        </Box>
    );
};

const Header = () => {
    return (
        <Box
            pos="absolute"
            left="1.1979vw"
            top="3.2407vh"
            width={"100%"}
            zIndex={20}
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Image
                src={UnknowPilot}
                sx={{
                    width: "4.8958vw",
                    height: "4.8958vw",
                    marginRight: "0.5208vw",
                }}
            ></Image>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                    }}
                >
                    <Text
                        sx={{
                            color: "#F2D861",
                            textShadow: "0.2083vw 0.2083vw 0vw #000",
                            fontFamily: "Orbitron",
                            fontSize: "2.5vw",
                            fontStyle: "normal",
                            fontWeight: 800,
                            lineHeight: "normal",
                            WebkitTextStroke: "0.1042vw #000",
                            marginRight: "1.5625vw",
                        }}
                    >
                        Tournament
                    </Text>
                    {/* <IconGroup></IconGroup> */}
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
