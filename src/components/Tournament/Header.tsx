import { Box, Image, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import Discord from "./assets/discord.svg";
import UpArrow from "./assets/up-arrow.svg";
import FaucetIcon from "./assets/faucet-icon.svg";
import AviOnMerc from "./assets/aviOnMerc.svg";
import Lock from "./assets/tower-icon.svg";
import Tw from "./assets/tw.svg";
import Task from "./assets/task-icon.svg";
import Telegram from "./assets/telegram.svg";
import { PilotInfo } from "@/hooks/usePilotInfo";
import SkylabIcon from "./assets/skylab-icon.svg";
import MyPilot from "./MyPilot";
import Airdrop from "./assets/airdrop-icon.svg";

const IconGroup = () => {
    const { isOpen: socialOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Image
                src={Lock}
                sx={{
                    width: "2.3438vw",
                    marginRight: "1.0417vw",
                    cursor: "no-drop",
                }}
            ></Image>
            <Box
                sx={{
                    position: "relative",
                    marginRight: "1.0417vw",
                }}
            >
                <Image
                    src={SkylabIcon}
                    sx={{ width: "2.3438vw", cursor: "pointer" }}
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
                        height: socialOpen ? "10.4167vw" : "0",
                        transition: "all 0.2s",
                        top: "3.125vw",
                        overflow: "hidden",
                        justifyContent: "space-between",
                        "& > img": {
                            cursor: "pointer",
                        },
                    }}
                >
                    <Image
                        src={Telegram}
                        sx={{
                            width: "2.3438vw",
                            height: "2.3438vw",
                        }}
                        onClick={() => {
                            window.open("https://t.me/skylabHQ", "_blank");
                        }}
                    ></Image>
                    <Image
                        src={Discord}
                        onClick={() => {
                            window.open(
                                "https://discord.gg/qWxPz8Qr87",
                                "_blank",
                            );
                        }}
                    ></Image>
                    <Image
                        src={Tw}
                        sx={{
                            width: "2.3438vw",
                            height: "2.3438vw",
                        }}
                        onClick={() => {
                            window.open(
                                "https://twitter.com/skylabHQ",
                                "_blank",
                            );
                        }}
                    ></Image>
                    <Image
                        src={UpArrow}
                        sx={{ width: "2.3438vw" }}
                        onClick={() => {
                            onClose();
                        }}
                    ></Image>
                </Box>
            </Box>
            <Image
                src={FaucetIcon}
                sx={{
                    width: "2.3438vw",
                    marginRight: "1.0417vw",
                    cursor: "pointer",
                }}
                onClick={() => {
                    window.open("https://faucet.polygon.technology/");
                }}
            ></Image>
            <Image
                src={Task}
                sx={{
                    width: "2.3438vw",
                    marginRight: "1.0417vw",
                    cursor: "no-drop",
                }}
                onClick={() => {
                    window.open("https://faucet.polygon.technology/");
                }}
            ></Image>
            <Image
                src={Airdrop}
                sx={{
                    width: "2.3438vw",
                    marginRight: "1.0417vw",
                    cursor: "no-drop",
                }}
                onClick={() => {
                    window.open("https://faucet.polygon.technology/");
                }}
            ></Image>
        </Box>
    );
};

const Header = ({
    activePilot,
    onPilotClick,
}: {
    activePilot: PilotInfo;
    onPilotClick: () => void;
}) => {
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
            <MyPilot activePilot={activePilot} onClick={onPilotClick}></MyPilot>

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
                    <IconGroup></IconGroup>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
