import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";
import React from "react";
import BidTacToeTutorial from "@/components/TacToe/BidTacToeTutorial";
import BulbIcon from "@/components/TacToe/assets/bulb.svg";
import KeyBoard from "../BttComponents/KeyBoard";
import PlayBackIcon from "./assets/playback-icon.svg";
import { useNavigate } from "react-router-dom";

export const Toolbar = () => {
    const navigate = useNavigate();
    const {
        isOpen: keyBoardOpen,
        onToggle: keyBoardOnToggle,
        onClose: keyBoardOnClose,
    } = useDisclosure();

    return (
        <Box
            sx={{
                position: "absolute",
                right: "3.125vw",
                top: "1.4063vw",
                display: "flex",
            }}
        >
            <Image
                src={PlayBackIcon}
                sx={{
                    width: "2.3958vw",
                    height: "2.3958vw",
                    marginRight: "0.7292vw",
                    cursor: "pointer",
                }}
                onClick={() => {
                    navigate("/btt/history");
                }}
            ></Image>
            <KeyBoard
                type={false}
                isOpen={keyBoardOpen}
                onToggle={() => {
                    keyBoardOnToggle();
                }}
                onClose={keyBoardOnClose}
            ></KeyBoard>
            <BidTacToeTutorial>
                <Box
                    sx={{
                        width: "2.3958vw",
                        height: "2.3958vw",
                        boxShadow: "0px 0px 8px 4px rgba(255, 255, 255, 0.50)",
                        borderRadius: "0.5208vw",
                        border: "2px solid #FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "0.7292vw",
                        cursor: "pointer",
                        position: "relative",
                    }}
                >
                    <Image
                        sx={{
                            width: "1.6667vw",
                            height: "1.6667vw",
                        }}
                        src={BulbIcon}
                    ></Image>

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: "-4.6875vw",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "10.4167vw",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Box
                            sx={{
                                width: 0,
                                height: 0,
                                borderLeft: "0.4427vw solid transparent",
                                borderRight: "0.4427vw solid transparent",
                                borderBottom: "0.7668vw solid #fff",
                            }}
                        ></Box>
                        <Text
                            sx={{
                                textAlign: "center",
                                fontSize: "0.8333vw",
                                marginTop: "0.2083vw",
                                fontFamily: "Quantico",
                            }}
                        >
                            You can always revisit tutorial here
                        </Text>
                    </Box>
                </Box>
            </BidTacToeTutorial>
        </Box>
    );
};
