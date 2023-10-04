import {
    Box,
    Image,
    NumberInput,
    NumberInputField,
    Text,
    useDisclosure,
    Button,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import CosmeticIcon from "./assets/cosmetic.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
import XpBg from "./assets/xp-bg.png";
import RegisterIcon from "./assets/register.svg";
import RegisterActiveIcon from "./assets/register-active.svg";
import RegisteredIcon from "./assets/registered.svg";
import RegisteredActiveIcon from "./assets/registered-active.svg";
import BabymercIcon from "./assets/babymerc.svg";
import RightArrowBlackIcon from "./assets/right-arrow-black.svg";

const ActivePiolt = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Image
                src={AircraftActiveIcon}
                sx={{
                    width: "4.4271vw",
                    height: "4.4271vw",
                    marginRight: "1.3542vw",
                }}
            ></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                }}
            >
                You are not owner of this NFT.
            </Text>
        </Box>
    );
};

const RegisteredPilot = () => {
    return (
        <Box
            sx={{
                width: "49.6354vw",
                height: "27.7083vw",
                backdropFilter: "blur(5px)",
                border: "2px solid #fff",
                borderRadius: "0.8333vw",
                display: "flex",
                padding: "2.0833vw",
                marginTop: "3.125vw",
            }}
        >
            <Grid
                templateColumns="repeat(5, 1fr)"
                templateRows={"repeat(3, 1fr)"}
                sx={{
                    width: "100%",
                }}
            >
                {[12, 3, 4, 5, 2, 2, 2, 2].map((item, index) => {
                    return (
                        <GridItem
                            w="100%"
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={BabymercIcon}
                                sx={{
                                    width: "3.4375vw",
                                    height: "3.4375vw",
                                }}
                            ></Image>
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};

const SearchButton = ({ disabled }: { disabled: boolean }) => {
    return (
        <Button
            sx={{
                width: "13.4375vw",
                height: "3.125vw",
                borderRadius: "1.5625vw",
                fontSize: "1.25vw",
                fontWeight: 900,
                background: "#D9D9D9",
                color: "#000",
                "&[disabled]": {
                    color: "#636363",
                    background: "#ABABAB",
                },
                "&[disabled]:hover": {
                    color: "#636363",
                    background: "#ABABAB",
                },
            }}
            disabled={disabled}
            variant="unstyled"
        >
            Search
        </Button>
    );
};

const PilotItem = ({ onClick }: { onClick: () => void }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "0.5208vw",
                border: "1px solid #FFF",
                background: "rgb(182, 200, 202)",
                width: "20.8333vw",
                height: "4.2708vw",
                position: "relative",
                paddingLeft: "0.5208vw",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Image src={CosmeticIcon}></Image>
            <Text
                sx={{
                    textAlign: "center",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.0417vw",
                    color: "#4A4A4A",
                }}
            >
                Mefe
            </Text>
        </Box>
    );
};

const SelectPilotCollections = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    marginTop: "1.3542vw",
                }}
            >
                Select Pilot from these colletions
            </Text>
            <Box
                sx={{
                    position: "relative",
                    marginTop: "0.8333vw",
                }}
            >
                {isOpen ? (
                    <Box
                        sx={{
                            position: "absolute",
                            left: "0%",
                            top: "0%",
                        }}
                    >
                        {[1, 2, 3].map((item, index) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        marginBottom: "0.3125vw",
                                    }}
                                >
                                    <PilotItem onClick={onClose}></PilotItem>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Box>
                        <PilotItem onClick={onOpen}></PilotItem>{" "}
                        <Text
                            sx={{
                                fontSize: "1.0417vw",
                                marginTop: "1.875vw",
                            }}
                        >
                            In-put Token Id{" "}
                        </Text>
                        <NumberInput
                            variant="unstyled"
                            sx={{
                                borderRadius: "0.2604vw",
                                background: "#D9D9D9",
                                color: "#000",
                                paddingLeft: "0.5208vw",
                                width: "20.8333vw",
                                height: "2.0833vw",
                                marginTop: "0.8333vw",
                                lineHeight: "2.0833vw",
                                fontSize: "1.0417vw",
                            }}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const IndicateNav = () => {
    return (
        <Box sx={{ marginTop: "12.7604vw", width: "12.5vw" }}>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    fontFamily: "Quantico",
                }}
            >
                If you do not have any pilot, mint a Baby Merc:
            </Text>
            <Box
                sx={{
                    marginTop: "0.3125vw",
                    width: "12.5vw",
                    height: "3.4896vw",
                    flexShrink: 0,
                    borderRadius: "0.5208vw",
                    background: "rgba(255, 255, 255, 0.50)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 0.5208vw",
                }}
            >
                <Image
                    src={BabymercIcon}
                    sx={{
                        width: "2.8125vw",
                        height: "2.8125vw",
                        marginRight: "0.2604vw",
                    }}
                ></Image>
                <Box
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "1.0417vw",
                        flex: 1,
                        fontWeight: "500",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text>Mint</Text>
                        <Box
                            sx={{
                                borderLeft: "1px solid rgba(96, 96, 96, 0.30)",
                                paddingLeft: "0.2083vw",
                            }}
                        >
                            <Image
                                sx={{
                                    width: "1.1458vw",
                                }}
                                src={RightArrowBlackIcon}
                            ></Image>
                        </Box>
                    </Box>
                    <Text>Baby Merc</Text>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "1.6667vw",
                    width: "12.5vw",
                    height: "2.7083vw",
                    flexShrink: 0,
                    borderRadius: "0.7813vw",
                    display: "flex",
                    padding: "0 0.5208vw",
                    background:
                        "linear-gradient(95deg, rgba(143, 255, 249, 0.00) 29.09%, rgba(251, 209, 97, 0.80) 60.98%, rgba(251, 209, 97, 0.00) 89.72%)",
                    boxShadow:
                        "0.2083vw 0.2083vw 0.2083vw 0vw rgba(0, 0, 0, 0.25)",
                    border: "2px solid #FFF",
                }}
            >
                <Image
                    src={BabymercIcon}
                    sx={{
                        marginRight: "0.2604vw",
                        width: "1.5625vw",
                    }}
                ></Image>
                <Box
                    sx={{
                        color: "#fff",
                        fontSize: "1.0417vw",
                        flex: 1,
                        fontWeight: "900",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text>Leaderboard</Text>
                        <Box
                            sx={{
                                borderLeft:
                                    "0.0521vw solid rgba(96, 96, 96, 0.30)",
                                paddingLeft: "0.2083vw",
                            }}
                        >
                            <Image
                                sx={{
                                    width: "1.1458vw",
                                }}
                                src={RightArrowBlackIcon}
                            ></Image>
                        </Box>
                    </Box>
                </Box>
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
            icon: RegisterIcon,
            activeIcon: RegisterActiveIcon,
            label: "Register",
        },
        {
            icon: RegisteredIcon,
            activeIcon: RegisteredActiveIcon,
            label: "Registered Pilot",
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
                        width: "4.8958vw",
                        height: "4.8958vw",
                        marginRight: "0.5208vw",
                    }}
                ></Image>
                <Box>
                    <Text
                        sx={{
                            fontSize: "1.0417vw",
                        }}
                    >
                        name 1234
                    </Text>
                    <Box
                        sx={{
                            background: `url(${XpBg})`,
                            width: "11.4063vw",
                            height: "3.5417vw",
                            backgroundSize: "100% 100%",
                        }}
                    ></Box>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "2.5vw",
                    "& >div": {
                        marginBottom: "0.7813vw",
                    },
                    "& >div:last-child": {
                        marginBottom: "0",
                    },
                }}
            >
                {tabList.map((item, index) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => handleTabChange(index)}
                        >
                            <Image
                                src={
                                    index === value
                                        ? item.activeIcon
                                        : item.icon
                                }
                                sx={{
                                    marginRight: "1.0417vw",
                                    width: "3.125vw",
                                    height: "3.125vw",
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "1.0417vw",
                                    fontWeight: 900,
                                    color: index === value ? "#f2d861" : "#fff",
                                }}
                            >
                                {item.label}
                            </Text>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

const CurrentPilot = () => {
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
                    width: "83.3333vw",
                    margin: "0 auto",
                    borderTop: "1px solid #fff",
                    paddingTop: "1.0417vw",
                    position: "relative",
                }}
            >
                <Box>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                        }}
                    >
                        Current Pilot{" "}
                    </Text>

                    <Box sx={{ display: "flex", paddingTop: "2.3148vh" }}>
                        <Box
                            sx={{
                                marginRight: "4.6875vw",
                            }}
                        >
                            <LeftContent
                                value={currentTab}
                                handleTabChange={handleTabChange}
                            ></LeftContent>
                        </Box>
                        <Box>
                            <ActivePiolt></ActivePiolt>
                            {currentTab === 0 && (
                                <SelectPilotCollections></SelectPilotCollections>
                            )}
                            {currentTab === 1 && (
                                <RegisteredPilot></RegisteredPilot>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    width: "83.3333vw",
                    position: "absolute",
                    bottom: "9.2593vh",
                    left: "50%",
                    transform: "translate(-50%, 0)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <IndicateNav></IndicateNav>
                <SearchButton disabled={false}></SearchButton>
            </Box>
        </Box>
    );
};

export default CurrentPilot;
