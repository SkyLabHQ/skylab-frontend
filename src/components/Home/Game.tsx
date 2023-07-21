import { Box, Image } from "@chakra-ui/react";
import React from "react";
import GameTitle from "@/components/Home/assets/game-title.svg";
import SectionActivities from "@/components/Home/assets/sectionActivities.png";
import Tournament from "@/components/Home/assets/tournament.png";
import { useNavigate } from "react-router-dom";
const Game = () => {
    const navigate = useNavigate();
    return (
        <Box
            id="games"
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
                    background: `url(${SectionActivities})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "left center,center",
                    width: "1153px",
                    height: "470px",
                    position: "relative",
                }}
            >
                <Image
                    src={Tournament}
                    sx={{
                        position: "absolute",
                        left: "-100px",
                        top: "80px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        navigate("/trailblazer");
                    }}
                ></Image>
            </Box>
        </Box>
    );
};
export default Game;
