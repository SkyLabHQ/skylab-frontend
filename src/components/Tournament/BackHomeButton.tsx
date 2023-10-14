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
            <Image src={GardenIcon}></Image>
            <Image sx={{}} src={BackIcon}></Image>
        </Box>
    );
};

export default BackHomeButton;
