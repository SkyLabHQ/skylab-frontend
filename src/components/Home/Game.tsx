import { Box, Image } from "@chakra-ui/react";
import React, { useEffect } from "react";
import GameTitle from "@/components/Home/assets/game-title.svg";
import GrayPlanet from "@/components/Home/assets/gray-planet.svg";
import SectionActivities from "@/components/Home/assets/gamebg.svg";
import Tournament from "@/components/Home/assets/tournament.svg";
import BidTitle from "@/components/Home/assets/bid-title.svg";
import TrailblazerTitle from "@/components/Home/assets/trailblazer-title.svg";
import YellowPlanet from "@/components/Home/assets/yellow-planet.svg";
import YellowishPlanet from "@/components/Home/assets/yellowish-planet.svg";
import CenterPlanet from "@/components/Home/assets/center-planet.svg";
import TransparentPlanet from "@/components/Home/assets/transparent-planet.svg";

import { useNavigate } from "react-router-dom";
const Game = () => {
    const navigate = useNavigate();
    const [active, setActive] = React.useState(false);

    useEffect(() => {
        const sections = document.getElementById("games");
        window.addEventListener("scroll", () => {
            const currentScrollPos = window.scrollY + sections.offsetHeight;
            const top = sections.offsetHeight / 2 + sections.offsetTop;
            const bottom = top + sections.offsetHeight / 2;
            if (currentScrollPos > top && currentScrollPos < bottom) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }, []);
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
                    "& *": {
                        transition: "all 0.5s ease",
                    },
                    "& img": {
                        position: "absolute",
                    },
                    // trailblazer title
                    "& .trailblazer-title": {
                        left: "-120px",
                        top: "50px",
                    },
                    ".trailblazer-title-move": {
                        left: "-100px",
                        top: "100px",
                    },
                    // blue planet
                    "& .blue-planet": {
                        left: "-40px",
                        top: "0px",
                        cursor: "pointer",
                    },
                    ".blue-planet-move": {
                        left: "-80px",
                        top: "100px",
                        transform: "scale(1.4)",
                    },
                    // bid title
                    "& .bid-title": {
                        right: "0px",
                        top: "133px",
                    },
                    ".bid-title-move": {
                        right: "100px",
                        top: "80px",
                    },
                    // gray planet
                    "& .gray-planet": {
                        right: "110px",
                        top: "185px",
                    },
                    ".gray-planet-move": {
                        right: "110px",
                        top: "100px",
                        transform: "scale(0.8)",
                    },

                    // center planet
                    "& .center-planet": {
                        left: "380px",
                        top: "20px",
                    },
                    ".center-planet-move": {
                        left: "260px",
                        top: "20px",
                    },

                    // transparent planet
                    "& .transparent-planet": {
                        left: "225px",
                        top: "24px",
                    },
                    ".transparent-planet-move": {
                        left: "140px",
                        top: "80px",
                    },

                    // yellow planet
                    "& .yellow-planet": {
                        right: "290px",
                        top: "94px",
                    },
                    ".yellow-planet-move": {
                        right: "390px",
                        top: "40px",
                    },

                    // yellowish planet
                    "& .yellowish-planet": {
                        left: "260px",
                        bottom: "100px",
                    },
                    ".yellowish-planet-move": {
                        left: "460px",
                        bottom: "80px",
                    },
                }}
            >
                <Box>
                    <Image
                        src={TrailblazerTitle}
                        className={`trailblazer-title ${
                            active && "trailblazer-title-move"
                        }`}
                    ></Image>
                    <Image
                        className={`blue-planet ${
                            active && "blue-planet-move"
                        }`}
                        src={Tournament}
                        onClick={() => {
                            navigate("/trailblazer");
                        }}
                    ></Image>
                </Box>

                <Box>
                    <Image
                        src={BidTitle}
                        className={`bid-title ${active && "bid-title-move"}`}
                    ></Image>
                    <Image
                        src={GrayPlanet}
                        className={`gray-planet ${
                            active && "gray-planet-move"
                        }`}
                    ></Image>
                </Box>
                <Image
                    src={CenterPlanet}
                    className={`center-planet ${
                        active && "center-planet-move"
                    }`}
                ></Image>
                <Image
                    src={TransparentPlanet}
                    className={`transparent-planet ${
                        active && "transparent-planet-move"
                    }`}
                ></Image>
                <Image
                    src={YellowPlanet}
                    className={`yellow-planet ${
                        active && "yellow-planet-move"
                    }`}
                ></Image>
                <Image
                    src={YellowishPlanet}
                    className={`yellowish-planet ${
                        active && "yellowish-planet-move"
                    }`}
                ></Image>
            </Box>
        </Box>
    );
};
export default Game;
