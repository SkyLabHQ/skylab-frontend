import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";
import LeaderboardIcon from "./assets/leaderboard-icon.svg";
import TutorialIcon from "@/components/Tournament/assets/tutorial-icon.svg";
import AllActivity from "@/components/Tournament/assets/all-activity.svg";
import SocialIcon from "@/components/Tournament/assets/social-icon.svg";

import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import { useState } from "react";
import MileageIcon from "./assets/mileage-icon.svg";
import Medal1 from "./assets/medal1.svg";
import Medal2 from "./assets/medal2.svg";
import Medal3 from "./assets/medal3.svg";
import styled from "@emotion/styled";
import RulesIcon from "./assets/rules-icon.svg";
import DownArrow from "./assets/down-arrow.svg";
import CosmeticGray from "./assets/cosmetic-gray.svg";
import RightArrowBlack from "./assets/right-arrow-black.svg";
import PilotIcon from "./assets/pilot-icon.svg";
import BabyMercIcon from "./assets/babymerc-icon.svg";
import { useNavigate } from "react-router-dom";

const Mileage = () => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "2.0833vw",
                borderRadius: "2.5vw",
                background: "rgba(255, 255, 255, 0.50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2.6042vw 0 4.1667vw",
            }}
        >
            <Image
                src={MileageIcon}
                sx={{
                    width: "3.125vw",
                    height: "3.125vw",
                    position: "absolute",
                    left: "-10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            ></Image>
            <Text
                sx={{
                    color: "#4A4A4A",
                    fontSize: "0.8333vw",
                    fontWeight: 500,
                }}
            >
                Mileage
            </Text>
            <Text
                sx={{
                    color: "#2B2B2B",
                    fontSize: "0.8333vw",
                    fontWeight: 500,
                }}
            >
                123456
            </Text>
        </Box>
    );
};

const RankMedal = {
    1: Medal1,
    2: Medal2,
    3: Medal3,
};

const RankBackground = {
    1: "linear-gradient(257deg, #FDCE49 61.28%, #EBD85B 64.38%, #FFF 68.02%, #FFF 70.38%, #FDCE49 81.84%)",
    2: "rgba(142, 180, 189, 0.50)",
    3: "rgba(196, 113, 102, 0.50)",
};

const TopThreeItem = ({ rank }: { rank: number }) => {
    return (
        <Box
            sx={{
                display: "flex",
                height: "5.3704vh",
                alignItems: "center",
                background: RankBackground[rank],
                borderRadius: "10px",
                padding: "0 1.0417vw 0 0.625vw",
                marginBottom: "6px",
            }}
        >
            <Image
                src={RankMedal[rank]}
                sx={{
                    width: "2.3958vw",
                    height: "2.3958vw",
                    marginRight: "22px",
                }}
            ></Image>
            <Image
                src={RankMedal[rank]}
                sx={{
                    width: "2.3958vw",
                    height: "2.3958vw",
                }}
            ></Image>
            <Text
                sx={{
                    flex: 1,
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "0.8333vw",
                }}
            >
                1234...5555
            </Text>
            <Text
                sx={{
                    color: "#BCBBBE",
                    fontSize: "0.8333vw",
                }}
            >
                123456
            </Text>
        </Box>
    );
};

const NormalItem = ({ rank }: { rank: number }) => {
    return (
        <Box
            sx={{
                display: "flex",
                height: "5.3704vh",
                alignItems: "center",
                padding: "0 1.0417vw 0 0.625vw",
                marginBottom: "0.3125vw",
                borderBottom: "1px solid #fff",
            }}
        >
            <Text
                sx={{
                    width: "2.3958vw",
                    marginRight: "1.1458vw",
                    fontSize: "1.25vw",
                    textAlign: "center",
                    color: "#fff",
                }}
            >
                {rank}
            </Text>
            <Box
                sx={{
                    width: "2.3958vw",
                    height: "2.3958vw",
                }}
            >
                <Image
                    src={RankMedal[rank]}
                    sx={{
                        width: "1.7708vw",
                        height: "1.7708vw",
                    }}
                ></Image>
            </Box>

            <Text
                sx={{
                    flex: 1,
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "0.8333vw",
                }}
            >
                1234...5555
            </Text>
            <Text
                sx={{
                    color: "#BCBBBE",
                    fontSize: "0.8333vw",
                }}
            >
                123456
            </Text>
        </Box>
    );
};

const MileageLeaderboard = ({ show }: { show?: boolean }) => {
    return (
        <Box
            sx={{
                height: "54.0741vh",
                borderRadius: "1.0417vw",
                border: "3px solid #F2D861",
                background: "#424242",
                position: "absolute",
                width: "100%",
                right: show ? "0" : "-100%",
                opacity: show ? 1 : 0,
                top: 0,
                transition: "all 0.3s",
            }}
        >
            <Box
                sx={{
                    height: "4.1667vh",
                    background:
                        "linear-gradient(180deg, rgba(99, 99, 99, 0.10) 0%, #636363 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1.4583vw",
                }}
            >
                <Text
                    sx={{
                        fontSize: "20px",
                        color: "#fff",
                    }}
                >
                    Leaderboard{" "}
                </Text>
                <Box>Find Me</Box>
            </Box>
            <Box>
                <Box
                    sx={{
                        padding: "0 1.4583vw",
                    }}
                >
                    <Text
                        sx={{
                            color: "#BCBBBE",
                            fontSize: "1.0417vw",
                        }}
                    >
                        {" "}
                        Estate Score
                    </Text>
                </Box>
                <Box
                    sx={{
                        height: "45.3704vh",
                        overflowY: "scroll",
                        padding: "0 1.4583vw",
                    }}
                >
                    {[1, 2, 3, 4, 5, 2, 2, 2, 2, 6].map((item, index) => {
                        return (
                            <>
                                {[0, 1, 2].includes(index) ? (
                                    <TopThreeItem
                                        rank={index + 1}
                                    ></TopThreeItem>
                                ) : (
                                    <NormalItem rank={index + 1}></NormalItem>
                                )}
                            </>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

const Cosmetics = () => {
    return (
        <Box
            sx={{
                height: "106px",
                display: "flex",
                borderRadius: "20px",
                background: "rgba(177, 177, 177, 0.50)",
                padding: "10px 0 0 16px",
                marginTop: "18px",
            }}
        >
            <Image
                src={CosmeticGray}
                sx={{
                    width: "64px",
                    height: "64px",
                    marginRight: "16px",
                }}
            ></Image>
            <Box>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "20px",
                        fontWeight: 500,
                    }}
                >
                    ^%2&{")"}$19^#v&!_
                </Text>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "14px",
                    }}
                >
                    pending...
                </Text>
            </Box>
        </Box>
    );
};

const Nav2NFT = ({
    icon,
    title,
    value,
    onClick,
}: {
    icon: string;
    title: string;
    value?: string;
    onClick?: () => void;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                borderRadius: "1.0417vw",
                background: "rgba(255, 255, 255, 0.50)",
                width: "10.9375vw",
                height: "4.1667vw",
                padding: "0.5208vw",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Image
                sx={{
                    width: "2.8125vw",
                    marginRight: "0.7292vw",
                }}
                src={icon}
            ></Image>
            <Box
                sx={{
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#4A4A4A",
                            fontSize: "1.0417vw",
                            fontWeight: 500,
                        }}
                    >
                        {title}
                    </Box>
                    <Box
                        sx={{
                            borderLeft: "1px solid rgba(96, 96, 96, 0.30)",
                            height: "1.4583vw",
                            paddingLeft: "0.2083vw",
                        }}
                    >
                        <Image src={RightArrowBlack}></Image>
                    </Box>
                </Box>
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                        color: "#4A4A4A",
                        fontWeight: 500,
                    }}
                >
                    {value}
                </Text>
            </Box>
        </Box>
    );
};

const NavButtonStyle = styled(Box)`
    width: 10.9375vw;
    height: 2.7083vw;
    border-radius: 15px;
    border: 2px solid #F2D861;
    background: linear-gradient(95deg, rgba(143, 255, 249, 0.00) 29.09%, rgba(0, 0, 0, 0.20) 60.98%, rgba(251, 209, 97, 0.00) 89.72%);
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
    font-size: 1.0417vw;
    display: flex;
    align-items: center;
    color:#F2D861;
    fonw-weight: 700;
    cursor: pointer;
}
`;

const RightNac = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

    return (
        <Box
            right="1.1979vw"
            top="3.2407vh"
            pos={"absolute"}
            sx={{
                width: "22.3958vw",
            }}
        >
            <Mileage></Mileage>
            <Box
                sx={{
                    position: "relative",
                    height: "54.0741vh",
                    marginTop: "1.8519vh",
                }}
            >
                <MileageLeaderboard show={isOpen}></MileageLeaderboard>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "14px",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <Image
                        src={DownArrow}
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "-15px",
                            transform: isOpen
                                ? "translateX(-50%)"
                                : "translateX(-50%) rotate(180deg)",
                            transition: "all 0.3s",
                            transformOrigin: "center center",
                        }}
                    ></Image>
                    <NavButtonStyle
                        onClick={() => {
                            if (isOpen) {
                                onClose();
                            } else {
                                onOpen();
                            }
                        }}
                    >
                        <Image
                            src={Medal1}
                            sx={{
                                width: "40px",
                                marginRight: "2px",
                            }}
                        ></Image>
                        <Text>Leaderboard</Text>
                    </NavButtonStyle>
                </Box>

                <NavButtonStyle
                    onClick={() => {
                        navigate("/tactoe/rules");
                    }}
                >
                    <Image
                        src={RulesIcon}
                        sx={{
                            width: "40px",
                            marginRight: "2px",
                        }}
                    ></Image>
                    <Text>Detailed Rules</Text>
                </NavButtonStyle>
            </Box>
            <Cosmetics></Cosmetics>
            <Box
                sx={{
                    marginTop: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                <Nav2NFT
                    icon={PilotIcon}
                    title={"Pilot"}
                    onClick={() => {}}
                ></Nav2NFT>
                <Nav2NFT
                    icon={BabyMercIcon}
                    title={"Mint"}
                    value={"Baby Merc"}
                    onClick={() => {}}
                ></Nav2NFT>
                <Image
                    onClick={() => {
                        window.open("/#/?part=primitives", "_blank");
                    }}
                    src={ProMerTab}
                    sx={{
                        width: "14.5833vw",
                        left: "-400px",
                        position: "absolute",
                        top: "0",
                    }}
                ></Image>
            </Box>
        </Box>
    );
};

export default RightNac;
