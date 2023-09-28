import { Box, Text, Image, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import CosmeticIcon from "./assets/cosmetic.svg";
import MileageIcon from "./assets/mileage.svg";
import TriangleWhite from "./assets/triangle-white.svg";
import TriangleYellow from "./assets/triangle-yellow.svg";
import XpPilotsImg from "./assets/xp-pilots.png";
import MileageImg from "./assets/mileage.png";
import { shortenAddress } from "@/utils";
import { current } from "@reduxjs/toolkit";
enum RuleTabEnum {
    XPPILOT = "xppilot",
    MILEAGEXP = "mileagexp",
    UPMERCSBREEDING = "upmercsbreeding",
}

const XpPilot = () => {
    return (
        <Box
            sx={{
                width: "52.0833vw",
            }}
        >
            <Image src={XpPilotsImg} sx={{}}></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    lineHeight: "2.6042vw",
                    textIndent: "3.125vw",
                }}
            >
                xp(experience point) = n% x aircraft holding point+ m% x
                cosmetic point + l% x mileage Players with top xp will split
                transaction fee for every [time interval], with the following
                ratio:
            </Text>
            <Box
                sx={{
                    marginTop: "5.2083vw",
                    "& table": { border: "1px solid #fff" },
                    "& td": {
                        border: "1px solid #fff",
                        width: "11.0417vw",
                        height: "3.4375vw",
                        paddingLeft: "40px",
                    },
                    "& tr": {
                        border: "1px solid #fff",
                    },
                }}
            >
                <table
                    style={{
                        borderCollapse: "collapse",
                    }}
                >
                    <tr>
                        <td>No.1</td>
                        <td>第一行，第二列</td>
                    </tr>
                    <tr>
                        <td>No.2</td>
                        <td>第二行，第二列</td>
                    </tr>
                    <tr>
                        <td>No.3</td>
                        <td>第三行，第二列</td>
                    </tr>
                </table>
            </Box>
        </Box>
    );
};

const MileageXp = () => {
    return (
        <Box
            sx={{
                width: "52.0833vw",
            }}
        >
            <Image src={MileageImg} sx={{}}></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    lineHeight: "2.6042vw",
                }}
            >
                Playing games could earn mileage xp.For each game:
            </Text>{" "}
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    lineHeight: "2.6042vw",
                }}
            >
                Mileage xp gained = Level x point transferred
            </Text>
        </Box>
    );
};

const UpMercsBreeding = () => {
    return (
        <Box
            sx={{
                width: "52.0833vw",
            }}
        >
            <Image src={MileageImg} sx={{}}></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    lineHeight: "2.6042vw",
                }}
            >
                Playing games could earn mileage xp.For each game:
            </Text>{" "}
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    lineHeight: "2.6042vw",
                }}
            >
                Mileage xp gained = Level x point transferred
            </Text>
        </Box>
    );
};

const NavItem = ({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) => {
    return (
        <Box
            sx={{
                width: "16.25vw",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Image
                    src={active ? TriangleYellow : TriangleWhite}
                    sx={{
                        width: "0.8333vw",
                        marginRight: "0.2083vw",
                    }}
                ></Image>

                <Text
                    sx={{
                        color: active ? "#f2d861" : "#fff",
                        fontWeight: "bold",
                        fontSize: "1.0417vw",
                    }}
                >
                    {label}
                </Text>
            </Box>
            {
                <Box
                    sx={{
                        width: "100%",
                        height: "1px",
                        background: active
                            ? "linear-gradient(90deg, rgba(242, 216, 97, 0.00) 1.6%, #F2D861 24.15%, #F2D861 74.38%, rgba(242, 216, 97, 0.00) 100%)"
                            : "transparent",
                    }}
                ></Box>
            }
        </Box>
    );
};

const AttributeTab = ({
    value,
    tabList,
    handleTabChange,
}: {
    value: number;
    tabList: any;
    handleTabChange: (value: number) => void;
}) => {
    return (
        <Box
            sx={{
                marginRight: "5.2083vw",
            }}
        >
            <Text
                sx={{
                    fontSize: "1.25vw",
                }}
            >
                Detailed Rules
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
                {tabList.map((item: any, index: number) => {
                    return (
                        <NavItem
                            onClick={() => {
                                handleTabChange(index);
                            }}
                            key={index}
                            active={index === value}
                            label={item.label}
                        ></NavItem>
                    );
                })}
            </Box>
        </Box>
    );
};

interface TabItem {
    value: RuleTabEnum;
    label: string;
}

const RulesDetail = () => {
    const navigate = useNavigate();
    const tabList: TabItem[] = [
        {
            value: RuleTabEnum.XPPILOT,
            label: "Xp & Pilots",
        },
        {
            value: RuleTabEnum.MILEAGEXP,
            label: "Mileage Xp",
        },
        {
            value: RuleTabEnum.UPMERCSBREEDING,
            label: "Up & Mercs Breeding",
        },
    ];
    const [currentTab, setCurrentTab] = useState(0);

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
                    }}
                >
                    <AttributeTab
                        handleTabChange={handleTabChange}
                        tabList={tabList}
                        value={currentTab}
                    ></AttributeTab>
                    <Box
                        sx={{
                            paddingTop: "4.5313vw",
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: "24px",
                                fontWeight: "bold",
                            }}
                        >
                            {tabList[currentTab].label}
                        </Text>
                        {currentTab === 0 && <XpPilot></XpPilot>}
                        {currentTab === 1 && <MileageXp></MileageXp>}
                        {currentTab === 2 && (
                            <UpMercsBreeding></UpMercsBreeding>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default RulesDetail;
