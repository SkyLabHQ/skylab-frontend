import { Box, Text, Image, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import CosmeticIcon from "./assets/cosmetic.svg";
import MileageIcon from "./assets/mileage.svg";
import XpIcon from "./assets/xp.svg";

import { shortenAddress } from "@/utils";
const NavItem = ({
    active,
    icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: string;
    label: string;
    onClick: () => void;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    width: "2.6042vw",
                    height: "2.6042vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "8px",
                }}
            >
                <Image
                    src={icon}
                    sx={{
                        width: "2.2396vw",
                    }}
                ></Image>
            </Box>

            <Text
                sx={{
                    color: active ? "#f2d861" : "#fff",
                    fontWeight: "bold",
                    fontSize: "1.0417vw",
                    width: "5.9375vw",
                }}
            >
                {label}
            </Text>
        </Box>
    );
};

const AttributeTab = ({
    value,
    handleTabChange,
}: {
    value: number;
    handleTabChange: (value: number) => void;
}) => {
    const tabList = [
        {
            icon: XpIcon,
            activeIcon: XpIcon,
            label: "XP",
        },
        {
            icon: AircraftActiveIcon,
            activeIcon: AircraftActiveIcon,
            label: "Aircraft",
        },
        {
            icon: CosmeticIcon,
            activeIcon: CosmeticIcon,
            label: "Cosmetic",
        },
        {
            icon: MileageIcon,
            activeIcon: MileageIcon,
            label: "Mileage",
        },
    ];

    return (
        <Box>
            <Text
                sx={{
                    fontSize: "1.25vw",
                }}
            >
                Leaderboard
            </Text>
            <Box
                sx={{
                    marginTop: "4.4444vh",
                    "& >div": {
                        marginBottom: "1.3889vh",
                    },
                    "& >div:last-child": {
                        marginBottom: "0",
                    },
                }}
            >
                {tabList.map((item, index) => {
                    return (
                        <NavItem
                            onClick={() => handleTabChange(index)}
                            key={index}
                            active={index === value}
                            icon={index === value ? item.activeIcon : item.icon}
                            label={item.label}
                        ></NavItem>
                    );
                })}
            </Box>
        </Box>
    );
};

const Top3Item = ({ medalIcon }: { medalIcon: string }) => {
    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <Image
                src={medalIcon}
                sx={{
                    width: "4.4792vw",
                }}
            ></Image>
            <Image
                src={MileageIcon}
                sx={{
                    width: "5.5208vw",
                    margin: "0 0.2604vw",
                }}
            ></Image>

            <Box>
                <Text
                    sx={{
                        fontSize: "1.25vw",
                        color: "#f2d861",
                    }}
                >
                    {shortenAddress(
                        "0x40BA69df5c58A1106480b42aFEF78DA08860081c",
                        4,
                        4,
                    )}
                </Text>
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                    }}
                >
                    12xp
                </Text>
            </Box>
        </Box>
    );
};

const RankList = ({ list }: { list: any }) => {
    return (
        <Box sx={{ width: "62.3958vw", overflowY: "scroll" }}>
            <Box
                sx={{
                    width: "43.9583vw",
                    height: "68.5185vh",
                    margin: "0 auto",
                }}
            >
                <Box
                    sx={{
                        marginTop: "5.5556vh",
                    }}
                >
                    {list.slice(3).map((item: any, index: number) => {
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #fff",
                                    padding: "3px 0",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        sx={{
                                            fontSize: "1.25vw",
                                            fontStyle: "normal",
                                            width: "2.6042vw",
                                        }}
                                    >
                                        {index + 4}
                                    </Text>
                                    <Image
                                        src={MileageIcon}
                                        sx={{
                                            width: "3.125vw",
                                            height: "3.125vw",
                                            borderRadius: "0.5208vw",
                                            border: "1px solid #FFF",
                                            marginRight: "1.4583vw",
                                        }}
                                    ></Image>
                                    <Text
                                        sx={{
                                            fontSize: "1.0417vw",
                                        }}
                                    >
                                        {shortenAddress(
                                            "0x40BA69df5c58A1106480b42aFEF78DA08860081c",
                                            4,
                                            4,
                                        )}
                                    </Text>
                                </Box>

                                <Text
                                    sx={{
                                        fontSize: "1.0417vw",
                                        fontWeight: 500,
                                    }}
                                >
                                    12xp
                                </Text>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

const PilotLeaderboard = () => {
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState(0);
    const [list, setList] = useState([
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
    ]);
    const handleTabChange = (value: number) => {
        setCurrentTab(value);
    };
    return (
        <Box
            sx={{
                position: "relative",
                paddingTop: "10vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    cursor: "pointer",
                }}
            >
                <Image src={GardenIcon}></Image>
                <Image
                    sx={{}}
                    src={BackIcon}
                    onClick={() => navigate("/activities")}
                ></Image>
            </Box>
            <Box
                sx={{
                    width: "83.3333vw",
                    margin: "0 auto",
                    borderTop: "1px solid #fff",
                    paddingTop: "1.8519vh",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <AttributeTab
                        value={currentTab}
                        handleTabChange={handleTabChange}
                    ></AttributeTab>
                    <RankList list={list}></RankList>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "2.7778vh",
                    }}
                >
                    <Image src={MileageIcon}></Image>
                    {/* <Button
                        variant={"unstyled"}
                        sx={{
                            width: "13.4375vw",
                            height: "2.6042vw",
                            borderRadius: "1.5625vw",
                            background: "#d9d9d9",
                            color: "#000",
                            fontSize: "1.25vw",
                            fontWeight: "bold",
                        }}
                    >
                        Find Me
                    </Button> */}
                </Box>
            </Box>
        </Box>
    );
};

export default PilotLeaderboard;
