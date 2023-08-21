import { Box, Image, Text } from "@chakra-ui/react";
import { useTour } from "@reactour/tour";
import React from "react";
import TutorialIcon from "./assets/tutorial-icon.svg";

interface ToolBarProps {
    onShowTutorial?: (show: boolean) => void;
}

const ToolBar = ({ onShowTutorial }: ToolBarProps) => {
    const { setIsOpen } = useTour();
    return (
        <Box
            sx={{
                position: "absolute",
                right: "20px",
                top: "20px",
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
                onClick={() => {
                    onShowTutorial?.(true);
                    setTimeout(() => {
                        setIsOpen(true);
                    }, 0);
                }}
            >
                <Image src={TutorialIcon} sx={{ height: "40px" }}></Image>
            </Box>
            <Box
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
        </Box>
    );
};

export default ToolBar;
