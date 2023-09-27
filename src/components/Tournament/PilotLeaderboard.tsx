import { Box, Text, Image, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import CosmeticIcon from "./assets/cosmetic.svg";
import MileageIcon from "./assets/mileage.svg";
import Medal1 from "./assets/medal1.svg";
import Medal2 from "./assets/medal2.svg";
import Medal3 from "./assets/medal3.svg";
import { shortenAddress } from "@/utils";
const NavItem = ({
    active,
    icon,
    label,
}: {
    active: boolean;
    icon: string;
    label: string;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
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
                <Image src={icon} sx={{}}></Image>
            </Box>

            <Text
                sx={{
                    color: "#f2d861",
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

const AttributeTab = ({ value }: { value: string }) => {
    const tabList = [
        {
            value: AttributeTabEnum.AIRCRAFT,
            icon: AircraftActiveIcon,
            activeIcon: AircraftActiveIcon,
            label: "Aircraft",
        },
        {
            value: AttributeTabEnum.COSMETIC,
            icon: CosmeticIcon,
            activeIcon: CosmeticIcon,
            label: "Cosmetic",
        },
        {
            value: AttributeTabEnum.MILEAGE,
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
                            key={index}
                            active={item.value === value}
                            icon={
                                item.value === value
                                    ? item.activeIcon
                                    : item.icon
                            }
                            label={item.label}
                        ></NavItem>
                    );
                })}
            </Box>
        </Box>
    );
};

enum AttributeTabEnum {
    AIRCRAFT = "aircraft",
    COSMETIC = "cosmetic",
    MILEAGE = "mileage",
}

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
        <Box
            sx={{
                width: "43.9583vw",
                height: "68.5185vh",
                overflowY: "scroll",
            }}
        >
            <Box>
                {list[0] && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Top3Item medalIcon={Medal1}></Top3Item>
                    </Box>
                )}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "5.5556vh",
                    }}
                >
                    {list[1] && <Top3Item medalIcon={Medal2}></Top3Item>}
                    {list[2] && <Top3Item medalIcon={Medal3}></Top3Item>}
                </Box>
            </Box>

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
    );
};

const PilotLeaderboard = () => {
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState("xp");
    const [list, setList] = useState([
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
        1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
    ]);
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
                    <AttributeTab value={currentTab}></AttributeTab>
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
                    <Button
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
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PilotLeaderboard;
