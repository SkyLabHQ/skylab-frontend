import { Box, Image } from "@chakra-ui/react";
import React from "react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
const BackHomeButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <Box
            sx={{
                display: "flex",
                position: "absolute",
                left: "0",
                top: "0",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Image
                src={GardenIcon}
                sx={{
                    width: "4.1667vw",
                    marginRight: "0.5208vw",
                }}
            ></Image>
            <Image
                src={BackIcon}
                sx={{
                    width: "2.0833vw",
                }}
            ></Image>
        </Box>
    );
};

export default BackHomeButton;
