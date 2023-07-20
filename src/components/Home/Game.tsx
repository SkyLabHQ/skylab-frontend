import { Box, Image } from "@chakra-ui/react";
import React from "react";
import GameTitle from "@/components/Home/assets/game-title.svg";
import SectionActivities from "@/components/Home/assets/sectionActivities.png";
import Tournament from "@/components/Home/assets/tournament.png";
const Game = () => {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Image src={GameTitle} height={"136px"}></Image>
            <Box
                sx={{
                    marginTop: "10vh",
                    background: `url(${Tournament}),url(${SectionActivities})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left center,center",
                    width: "1153px",
                    height: "470px",
                }}
            ></Box>
        </Box>
    );
};
export default Game;
