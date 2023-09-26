import { Box, Image, Text } from "@chakra-ui/react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import CosmeticIcon from "./assets/cosmetic.svg";
import MileageIcon from "./assets/mileage.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
import XpIcon from "./assets/xp.svg";

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
                    color: "#f2d861",
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

const PilotDetail = () => {
    const boxStyles = {
        backgroundColor: "lightblue",
        color: "darkblue",
        padding: "10px",
    };
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = React.useState<AttributeTabEnum>(
        AttributeTabEnum.AIRCRAFT,
    );
    return (
        <Box
            sx={{
                paddingTop: "140px",
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
                    width: "1200px",
                    margin: "0 auto",
                    borderTop: "1px solid #fff",
                    paddingTop: "20px",
                }}
                // className="test"
            >
                <Box>
                    <Text
                        sx={{
                            fontSize: "24px",
                        }}
                    >
                        {"< "}Pilots
                    </Text>

                    <Box sx={{ display: "flex" }}>
                        <AttributeTab value={currentTab}></AttributeTab>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PilotDetail;
