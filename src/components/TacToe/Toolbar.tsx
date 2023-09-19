import { Box, Image, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import TutorialIcon from "./assets/tutorial-icon.svg";
import BidTacToeTutorial from "./BidTacToeTutorial";
import QuitModal from "./QuitModal";

const ToolBar = ({ quitType }: { quitType?: "wait" | "game" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box
            sx={{
                position: "absolute",
                right: "0",
                top: "0",
                display: "flex",
                alignItems: "center",
                "& > div": {
                    cursor: "pointer",
                },
            }}
        >
            <Box
                sx={{
                    borderRadius: "18px",
                    height: "58px",
                    width: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    marginRight: "14px",
                }}
            >
                <BidTacToeTutorial>
                    <Image
                        src={TutorialIcon}
                        sx={{
                            width: "42px",
                            height: "42px",
                        }}
                    ></Image>
                </BidTacToeTutorial>
            </Box>
            <Box
                onClick={onOpen}
                sx={{
                    borderRadius: "18px",
                    height: "58px",
                    width: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                }}
            >
                <Text sx={{ fontSize: "28px" }}>Quit</Text>
            </Box>
            {quitType && (
                <QuitModal
                    isOpen={isOpen}
                    onClose={onClose}
                    quitType={quitType}
                ></QuitModal>
            )}
        </Box>
    );
};

export default ToolBar;
