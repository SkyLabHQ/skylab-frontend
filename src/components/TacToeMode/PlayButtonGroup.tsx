import { Box, Button, Text, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import HumanPlane from "./assets/human-plane.png";
import HumanIcon from "./assets/human.png";
import RobotIcon from "./assets/robot.png";
import SetIcon from "./assets/set.svg";
import PublicGameIcom from "./assets/public-game.svg";
import GrayHumanPlane from "./assets/gray-human-plane.png";

const ButtonStyle = styled(Button)`
    border: 3px solid #bcbbbe !important;
    border-radius: 0.9375vw;
    height: 3.3333vw;
    fontsize: 1.25vw;
    textalign: left;
    outline: none;
    width: 20.8333vw;
    box-shadow: 4px 4px 0px 0px rgba(255, 255, 255, 0.5);
    justify-content: flex-start;
    padding-left: 0;
    &:focus: {
        box-shadow: none;
    }
    & .chakra-button__icon: {
        position: absolute;
        right: 0.7813vw;
    }
`;

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
                <ButtonStyle
                    disabled={tournamentDisabled}
                    onClick={onPlayTournament}
                    sx={{
                        paddingLeft: "5.2083vw !important",
                        width: "14.5833vw !important",
                        height: "4.7917vw !important",
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
                </ButtonStyle>
                <ButtonStyle
                    onClick={onPlayWithBot}
                    sx={{
                        paddingLeft: "5.2083vw !important",
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
                            width: "2.0833vw",
                            position: "absolute",
                            right: "-1.0417vw",
                            top: "-1.0417vw",
                        }}
                    ></Image>
                    <Box
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: "1.6667vw",
                            }}
                        >
                            Play{" "}
                        </Text>
                        <Text
                            sx={{
                                fontSize: "1.25vw",
                                fontWeight: "400",
                            }}
                        >
                            With Bot{" "}
                        </Text>
                    </Box>
                </ButtonStyle>
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
                    <ButtonStyle
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
                    </ButtonStyle>
                    <ButtonStyle
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
                    </ButtonStyle>
                </Box> */}
            </Box>
        </Box>
    );
};
