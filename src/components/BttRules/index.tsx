import { Box, Text, Image, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import { useNavigate } from "react-router-dom";
import TriangleWhite from "./assets/triangle-white.svg";
import TriangleYellow from "./assets/triangle-yellow.svg";
import XpPilotsImg from "./assets/xp-pilots.png";
import CosmeticImg from "./assets/cosmetic-xp.png";
import MileageImg from "./assets/mileage.png";
import Arrow from "./assets/arrow.svg";
import Calculator from "./assets/calculator.svg";
import StructureImg from "./assets/structure.png";
import UpImg from "./assets/up.png";
import AllPlane from "./assets/all-plane.png";
import LeftArrow from "@/components/Tournament/assets/left-arrow.svg";
import RightArrow from "@/components/Tournament/assets/right-arrow.svg";
import StructAviation from "./assets/struct-aviation.png";
import StructMileage from "./assets/struct-mileage.png";
import StructUp from "./assets/struct-up.png";
import StructCosmetic from "./assets/struct-cosmetic.png";
import StructScore from "./assets/struct-score.png";

enum RuleTabEnum {
    OVERAll = 0,
    AVIATIONSYSTEM = 1,
    XPPILOT = 2,
    COSMETIC = 3,
    MILEAGEXP = 4,
    UPMERCSBREEDING = 5,
}

const OverallStructure = () => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const list = [
        {
            label: "Aviation Lvl-Pt",
            img: StructAviation,
            desc: "Play games and win to earn points(Pt) for your aviation, accumulate Pt to upgrade the level of your aviation. Losing games will cost your Pt and your aviation is at risk to be downgraded.",
        },
        {
            label: "Mileage",
            img: StructMileage,
            desc: "Simply play games to earn mileage, no matter win or lose. Top players on mileage rank will be rewarded with Upgrade Point(UP) and cosmetics.",
        },
        {
            label: "UP&Merc",
            img: StructUp,
            desc: "Upgrade Power(UP) could breed your Baby Mercs to Mercs. The Vault will buy back Mercs.",
        },
        {
            label: "Cosmetic Score",
            img: StructCosmetic,
            desc: "Estate Score is the sum of Cosmetic Score and Aviation Score. Project Mercury reward players with Sales Tax in proportion to Estate Score.",
        },
        {
            label: "Estate Score",
            img: StructScore,
            desc: "Earn cosmetic through participating in tournament and staying high on Mileage rank. Cosmetic Score add to Estate Score.",
        },
    ];
    return (
        <Box sx={{}}>
            <Image
                src={activeIndex === -1 ? StructureImg : list[activeIndex].img}
                sx={{}}
            ></Image>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    marginTop: "20px",
                }}
            >
                {list.map((item, index) => {
                    return (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (activeIndex === index) {
                                    setActiveIndex(-1);
                                } else {
                                    setActiveIndex(index);
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: "1.3021vw",
                                    height: "1.3021vw",
                                    border:
                                        activeIndex === index
                                            ? "1px solid #fff"
                                            : "1px solid transparent",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "0.6771vw",
                                        height: "0.6771vw",
                                        background: "#d9d9d9",
                                        borderRadius: "50%",
                                    }}
                                ></Box>
                            </Box>

                            <Text
                                sx={{
                                    fontSize: "16px",
                                    color: "#D9D9D9",
                                    marginTop: "8px",
                                }}
                            >
                                {item.label}
                            </Text>
                        </Box>
                    );
                })}
            </Box>
            {activeIndex >= 0 && (
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                        marginTop: "0.5208vw",
                    }}
                >
                    {list[activeIndex].desc}
                </Text>
            )}
        </Box>
    );
};

const AviationSystem = () => {
    const [test, setTest] = useState(0);
    const handleSub = () => {
        if (test <= 0) return;
        setTest(test - 20);
    };

    const handleAdd = () => {
        if (test >= 100) return;
        setTest(test + 20);
    };

    return (
        <Box>
            <Box
                sx={{
                    height: "26.0417vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3vw",
                    overflow: "hidden",
                    position: "relative",
                    background:
                        "radial-gradient(50% 50% at 50% 50%, rgba(142, 180, 189, 0.80) 0%, rgba(108, 174, 173, 0.80) 100%)",
                }}
            >
                <Box
                    sx={{
                        background: `url(${AllPlane}) no-repeat `,
                        backgroundSize: "104.1667vw 100%",
                        backgroundPosition: `${test}% 0`,
                        width: "104.1667vw",
                        height: "15.3646vw",
                        transition: "all 1s",
                    }}
                ></Box>
                <Image
                    src={LeftArrow}
                    sx={{
                        position: "absolute",
                        left: "0.5208vw",
                        cursor: "pointer",
                        width: "1.25vw",
                    }}
                    onClick={handleSub}
                ></Image>
                <Image
                    src={RightArrow}
                    sx={{
                        position: "absolute",
                        right: "0.5208vw",
                        cursor: "pointer",
                        width: "1.25vw",
                    }}
                    onClick={handleAdd}
                ></Image>
            </Box>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    lineHeight: "2.6042vw",
                    marginTop: "2vw",
                }}
            >
                Point is earned through winning game.
            </Text>{" "}
        </Box>
    );
};

const XpPilot = () => {
    return (
        <Box sx={{}}>
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

const CosmeticXp = () => {
    return (
        <Box sx={{}}>
            <Image src={CosmeticImg} sx={{}}></Image>
            <Box
                sx={{
                    width: "14.8958vw",
                    height: "38px",
                    borderRadius: "40px",
                    display: "flex",
                    position: "relative",
                    alignItems: "center",
                    paddingLeft: "45px",
                    background:
                        "linear-gradient(90deg, rgba(43, 43, 43, 0.50) -2.24%, rgba(255, 255, 255, 0.50) 112.59%)",
                }}
            >
                <Image
                    src={Calculator}
                    sx={{
                        position: "absolute",
                        left: "0px",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                ></Image>
                <Text
                    sx={{
                        marginRight: "0.2604vw",
                        fontSize: "0.8333vw",
                        fontWeight: "bold",
                    }}
                >
                    Cosmertic Pt Calculator
                </Text>
                <Image
                    src={Arrow}
                    sx={{
                        width: "0.9375vw",
                    }}
                ></Image>
            </Box>
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

const MileageXp = () => {
    return (
        <Box sx={{}}>
            <Image src={MileageImg} sx={{}}></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    marginTop: "37px",
                }}
            >
                Pilot earn mileage through playing games.
            </Text>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                }}
            >
                For each game:{" "}
            </Text>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                }}
            >
                Mileage gained = Level of aviation x point transferred{" "}
            </Text>
        </Box>
    );
};

const UpMercsBreeding = () => {
    return (
        <Box>
            <Image src={UpImg} sx={{}}></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    marginTop: "60px",
                }}
            >
                Mercs have governance rights, can arbitrage, and would have a
                buff to estate score{" "}
            </Text>{" "}
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
                    fontWeight: "bold",
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
                {tabList.map((item: any) => {
                    return (
                        <NavItem
                            onClick={() => {
                                handleTabChange(item.value);
                            }}
                            key={item.value}
                            active={item.value === value}
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

const BttRules = () => {
    const navigate = useNavigate();
    const tabList: TabItem[] = [
        {
            value: RuleTabEnum.OVERAll,
            label: "Overall Structure",
        },
        {
            value: RuleTabEnum.AVIATIONSYSTEM,
            label: "Aviation Lvl-Pt System",
        },
        // {
        //     value: RuleTabEnum.XPPILOT,
        //     label: "Xp & Pilots",
        // },
        // {
        //     value: RuleTabEnum.COSMETIC,
        //     label: "Cosmetic Xp",
        // },
        {
            value: RuleTabEnum.MILEAGEXP,
            label: "Mileage",
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
                fontFamily: "Orbitron",
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
                    onClick={() => navigate("/activities?step=2")}
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
                            width: "52.0833vw",
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: "24px",
                                fontWeight: "bold",
                            }}
                        >
                            {
                                tabList.find((item) => {
                                    return item.value === currentTab;
                                }).label
                            }
                        </Text>
                        {currentTab === RuleTabEnum.OVERAll && (
                            <OverallStructure></OverallStructure>
                        )}

                        {currentTab === RuleTabEnum.AVIATIONSYSTEM && (
                            <AviationSystem></AviationSystem>
                        )}

                        {currentTab === RuleTabEnum.XPPILOT && (
                            <XpPilot></XpPilot>
                        )}
                        {currentTab === RuleTabEnum.COSMETIC && (
                            <CosmeticXp></CosmeticXp>
                        )}
                        {currentTab === RuleTabEnum.MILEAGEXP && (
                            <MileageXp></MileageXp>
                        )}
                        {currentTab === RuleTabEnum.UPMERCSBREEDING && (
                            <UpMercsBreeding></UpMercsBreeding>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BttRules;
