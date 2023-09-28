import { Box, Image, Text } from "@chakra-ui/react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import CosmeticIcon from "./assets/cosmetic.svg";
import MileageIcon from "./assets/mileage.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
import XpIcon from "./assets/xp.svg";
import Calculator from "./assets/calculator.svg";
import Arrow from "./assets/arrow.svg";

const NavItem = ({
    onClick,
    active,
    icon,
    label,
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
                    width: "50px",
                    height: "50px",
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
                    color: active ? "#f2d861" : "#fff",
                    fontWeight: "bold",
                    fontSize: "20px",
                    width: "114px",
                }}
            >
                {label}
            </Text>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1px",
                    width: "82px",
                    height: "24px",
                    borderRadius: "26px",
                    background: "rgba(74, 74, 74, 0.50)",
                    position: "relative",
                }}
            >
                <Image src={XpIcon}></Image>
                <Text
                    sx={{
                        textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    10
                </Text>
            </Box>
        </Box>
    );
};

const LeftContent = ({
    handleTabChange,
    value,
}: {
    value: number;
    handleTabChange: (value: number) => void;
}) => {
    const tabList = [
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
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Image
                    src={GardenIcon}
                    sx={{
                        width: "95px",
                        height: "95px",
                        fontSize: "24px",
                    }}
                ></Image>
                <Box>
                    <Text>name 1234</Text>
                    <Image
                        src={GardenIcon}
                        sx={{ height: "42px", width: "200px" }}
                    ></Image>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "48px",
                    "& >div": {
                        marginBottom: "15px",
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
                            onClick={() => handleTabChange(index)}
                            active={index === value}
                            icon={index === value ? item.activeIcon : item.icon}
                            label={item.label}
                        ></NavItem>
                    );
                })}
            </Box>
            <CosmeticDetail></CosmeticDetail>
        </Box>
    );
};

const CosmeticDetail = () => {
    return (
        <Box
            sx={{
                marginTop: "5.5556vh",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    sx={{
                        color: "#f2d861",
                        fontSize: "20px",
                        fontWeight: "bold",
                    }}
                >
                    Cosmetic Detail
                </Text>
                <Image src={Calculator}></Image>
            </Box>
            <Box
                sx={{
                    width: "16.9271vw",
                    height: "1px",
                    marginTop: "0.2604vw",
                    background:
                        "linear-gradient(90deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.84) 15.62%, #FFF 83.85%, rgba(255, 255, 255, 0.00) 100%, rgba(255, 255, 255, 0.50) 100%)",
                }}
            ></Box>
            <Box
                sx={{
                    fontSize: "0.8333vw",
                    lineHeight: "1.25vw",
                    marginTop: "0.4167vw",
                }}
            >
                <Text>Item Rarity Xp 10</Text>
                <Text>Fashion Combo Xp 0</Text>
                <Text>Color Combo Xp 0</Text>
                <Text>Spirit Rarity Xp 10</Text>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "1.1458vw",
                    borderRadius: "2.0833vw",
                    marginTop: "0.625vw",
                    padding: "0.2083vw 0.5208vw",
                    width: "fit-content",
                    background:
                        "linear-gradient(90deg, rgba(43, 43, 43, 0.50) -2.24%, rgba(255, 255, 255, 0.50) 112.59%)",
                }}
            >
                <Text sx={{ fontWeight: "blod", marginRight: "0.5208vw" }}>
                    Detailed Rules
                </Text>
                <Image src={Arrow}></Image>
            </Box>
        </Box>
    );
};

const PilotDetail = () => {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = React.useState(0);
    const handleTabChange = (value: number) => {
        setCurrentTab(value);
    };
    return (
        <Box
            sx={{
                paddingTop: "7.2917vw",
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
                    width: "62.5vw",
                    margin: "0 auto",
                    borderTop: "1px solid #fff",
                    paddingTop: "1.0417vw",
                }}
            >
                <Box>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                        }}
                    >
                        {"< "}Pilots
                    </Text>

                    <Box sx={{ display: "flex" }}>
                        <LeftContent
                            value={currentTab}
                            handleTabChange={handleTabChange}
                        ></LeftContent>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PilotDetail;
