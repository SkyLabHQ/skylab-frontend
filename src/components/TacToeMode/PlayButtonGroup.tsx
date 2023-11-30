import { Box, Button, Text, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import HumanPlane from "./assets/human-plane.png";
import HumanIcon from "./assets/human.png";
import RobotIcon from "./assets/robot.png";
import SetIcon from "./assets/set.svg";
import PublicGameIcom from "./assets/public-game.svg";
import GrayHumanPlane from "./assets/gray-human-plane.png";
import { GrayButton } from "../Button/Index";

export const PlayButtonGroup = ({
    tournamentDisabled,
    onPlayTournament,
    onPlayTestWithBot,
    onPlayWithHuman,
    onPlayWithBot,
}: {
    tournamentDisabled: boolean;
    onPlayTournament: () => void;
    onPlayTestWithBot: () => void;
    onPlayWithHuman: () => void;
    onPlayWithBot: () => void;
}) => {
    return (
        <Box
            sx={{
                width: "20.8333vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "30.2083vw",
                }}
            >
                <GrayButton
                    onClick={onPlayTournament}
                    sx={{
                        paddingLeft: "5.2083vw !important",
                        width: "14.5833vw !important",
                        height: "4.7917vw !important",
                        opacity: tournamentDisabled ? 0.5 : 1,
                    }}
                    variant="outline"
                >
                    <Image
                        src={tournamentDisabled ? GrayHumanPlane : HumanPlane}
                        sx={{
                            width: "6.25vw",
                            position: "absolute",
                            left: "0.2604vw",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    ></Image>
                    <Box
                        sx={{
                            textAlign: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            sx={{
                                color: tournamentDisabled ? "#bcbbbe" : "#fff",
                                fontSize: "1.6667vw",
                            }}
                        >
                            Play
                        </Text>
                        <Text
                            sx={{
                                fontSize: "1.25vw",
                                fontWeight: "400",
                                color: tournamentDisabled
                                    ? "#bcbbbe"
                                    : "rgba(215, 200, 120, 1)",
                            }}
                        >
                            Tournament
                        </Text>
                    </Box>
                </GrayButton>
                <GrayButton
                    onClick={onPlayWithBot}
                    sx={{
                        paddingLeft: "4.1667vw !important",
                        width: "14.5833vw !important",
                        height: "4.7917vw !important",
                    }}
                    variant="outline"
                    position={"relative"}
                >
                    <Image
                        src={RobotIcon}
                        sx={{
                            width: "2.2917vw",
                            position: "absolute",
                            left: "1.0417vw",
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    ></Image>
                    <Image
                        src={SetIcon}
                        sx={{
                            width: "3.3333vw",
                            position: "absolute",
                            right: "-1.0417vw",
                            top: "-1.5625vw",
                        }}
                    ></Image>
                    <Box
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: "1.25vw",
                            }}
                        >
                            Quick Start
                        </Text>
                    </Box>
                </GrayButton>
                {/* <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            height: "1px",
                            background: "#fff",
                        }}
                    ></Box>
                    <Text
                        sx={{
                            fontSize: "16px",
                            margin: "0 5px",
                        }}
                    >
                        Quick Start
                    </Text>
                    <Box
                        sx={{
                            flex: 1,
                            height: "1px",
                            background: "#fff",
                        }}
                    ></Box>
                </Box> */}
                {/* <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "10px",
                    }}
                >
                    <GrayButton
                        onClick={onPlayWithHuman}
                        sx={{
                            width: "9.8958vw !important",
                        }}
                        variant="outline"
                    >
                        <Image
                            src={PublicGameIcom}
                            sx={{
                                width: "2.0833vw",
                                margin: "0 0.5208vw",
                            }}
                        ></Image>
                        <Box
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            <Text
                                sx={{
                                    fontSize: "1.25vw",
                                }}
                            >
                                Find{" "}
                            </Text>
                            <Text
                                sx={{
                                    fontSize: "0.8333vw",
                                    fontWeight: "400",
                                }}
                            >
                                Public Game
                            </Text>
                        </Box>
                    </GrayButton>
                    <GrayButton
                        onClick={onPlayWithHuman}
                        sx={{
                            width: "9.8958vw !important",
                        }}
                        variant="outline"
                    >
                        <Image
                            src={HumanIcon}
                            sx={{
                                width: "2.0833vw",
                                margin: "0 0.5208vw",
                            }}
                        ></Image>
                        <Box
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            <Text
                                sx={{
                                    fontSize: "1.25vw",
                                }}
                            >
                                Host
                            </Text>
                            <Text
                                sx={{
                                    fontSize: "0.8333vw",
                                    fontWeight: "400",
                                }}
                            >
                                Private Game{" "}
                            </Text>
                        </Box>
                    </GrayButton>
                </Box> */}
            </Box>
        </Box>
    );
};
