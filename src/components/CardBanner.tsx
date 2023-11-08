import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement, useMemo } from "react";
import PrimitiveTitle from "@/components/Home/assets/primitive-title.png";
import WheelBase from "@/components/Home/assets/wheel-base.png";
import Aviation from "@/components/Home/assets/aviation.png";
import Bomb from "@/components/Home/assets/bomb.png";
import Brick from "@/components/Home/assets/brick.png";
import Resources from "@/components/Home/assets/resources.png";
import Factory from "@/components/Home/assets/factory.png";
import Decoration from "@/components/Home/assets/decoration.svg";
import FillCircleIcon from "@/components/Home/assets/dot.png";
import AviationTitle from "@/components/Home/assets/aviation-title.svg";
import BombTitle from "@/components/Home/assets/bomb-title.svg";
import BrickTitle from "@/components/Home/assets/brick-title.svg";
import FuelTitle from "@/components/Home/assets/fuel-title.svg";
import FactoryTitle from "@/components/Home/assets/factory-title.svg";
import BatteryTitle from "@/components/Home/assets/battery-title.svg";
import Hint from "@/components/Home/assets/hint.svg";
import Vet from "@/components/Home/assets/vet.svg";

const CircleButton = ({
    title,
    onClick,
}: {
    title: string;
    onClick: () => void;
}) => {
    return (
        <Box sx={{ position: "relative", cursor: "pointer" }} onClick={onClick}>
            <Text
                sx={{
                    position: "absolute",
                    fontSize: "24px",
                    top: "-50px",
                    left: "50%",
                    color: "#FFEEB5",
                    textAlign: "center",
                    transform: "translateX(-50%)",
                }}
            >
                {title}
            </Text>
            <Box
                sx={{
                    width: "67px",
                    height: "67px",
                    border: "1px solid #FFEEB5",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "30px",
                        height: "30px",
                        background: "#FFEEB5",
                        borderRadius: "50%",
                    }}
                ></Box>
            </Box>
        </Box>
    );
};

const FillCircle = () => {
    return (
        <Box
            sx={{
                flex: 1,
                height: "40px",
                backgroundImage: `url(${FillCircleIcon})`,
                backgroundRepeat: "repeat",
            }}
        ></Box>
    );
};
const wheelRotate = ["-45", "-90", "-200", "-250", "-280"];
const wheelRotate2 = ["-45", "-90", "-200", "-250"];
const combinationList = [
    [0, 4],
    [3, 4],
    [1, 3],
    [2, 3],
];
const activeText = [
    "The goal of Project Mercury is to upgrade aviation to higher levels through winning games.",
    "Bombs can be used to attack factories and keep the supply of factories and Fuel and Battery production capacity in check.",
    "Bricks protect factories from bomb attacks. Players receive shields as reward when losing games.",
    "Production entity of Project Mercury. tradeable and transferable.",
    "Non-transferrable and non-tradeable token that can only be loaded to aviations in games",
];
const combinationText = [
    "Fuel and batteries give aviation advantages in games",
    "Factory produces fuel and battery",
    "Bombs attack factories",
    "Bricks protect factories",
];

const CardBanner = (): ReactElement => {
    const [active, setActive] = React.useState(0);
    const [combination, setCombination] = React.useState(-1);

    const handleSetActive = (index: number) => {
        setActive(index);
        setCombination(-1);
    };

    const handleSetCombination = (index: number) => {
        setCombination(index);
        setActive(-1);
    };

    const isActive = (chooseActive: number) => {
        if (combination != -1) {
            return combinationList[combination].includes(chooseActive);
        }
        return chooseActive === active;
    };

    const text = useMemo(() => {
        if (combination != -1) {
            return combinationText[combination];
        }
        return activeText[active];
    }, [active, combination]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                padding: "0 200px",
                margin: "0 auto",
            }}
            id="primitives"
        >
            <Image src={PrimitiveTitle} sx={{ height: "80px" }} />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    borderBottom: "2px solid #FDE1B9",
                }}
            >
                <Box
                    sx={{
                        background: `url(${Vet})`,
                        height: "30px",
                        flex: 1,
                    }}
                ></Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        margin: "0 30px",
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: "50%",
                            border: "3px solid #FDE1B9",
                            height: "40px",
                            width: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                width: "20px",
                                height: "20px",
                                background: "#FDE1B9",
                                borderRadius: "50%",
                            }}
                        ></Box>
                    </Box>
                    <Text
                        sx={{
                            fontSize: "48px",
                            color: "#FDE1B9",
                            fontWeight: "bold",
                        }}
                    >
                        Coming Soon: Project Mercury
                    </Text>
                </Box>

                <Box
                    sx={{
                        background: `url(${Vet})`,
                        height: "30px",
                        flex: 1,
                    }}
                ></Box>
            </Box>

            <Box
                sx={{
                    position: "relative",
                    width: "672px",
                    marginTop: "8vh",
                    height: "700px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& img": {
                        transition: "all 0.3s ease-in-out",
                    },
                }}
            >
                <Text
                    sx={{
                        width: "320px",
                        textAlign: "center",
                        fontSize: "28px",
                        color: "#FFEEB5",
                        fontWeight: "bold",
                        fontFamily: "Quantico",
                    }}
                >
                    {text}
                </Text>
                <Image
                    src={Decoration}
                    sx={{
                        position: "absolute",
                        left: "-60px",
                        top: "-10px",
                        width: "600px",
                    }}
                ></Image>
                <Image
                    src={WheelBase}
                    sx={{
                        width: "100%",
                        position: "absolute",
                        inset: "0",
                        transform: `rotate(${
                            combination !== -1
                                ? wheelRotate2[combination]
                                : wheelRotate[active]
                        }deg)`,
                    }}
                ></Image>
                <Box>
                    <Image
                        src={Aviation}
                        sx={{
                            width: "192px",
                            position: "absolute",
                            top: "-30px",
                            left: "50%",
                            transform: `translateX(-50%) ${
                                isActive(0) ? "rotate(0deg)" : "rotate(-60deg)"
                            } `,
                            opacity: isActive(0) ? "1" : "0.2",
                            cursor: "pointer",
                        }}
                        onClick={() => handleSetActive(0)}
                    ></Image>
                    <Image
                        src={Hint}
                        sx={{
                            width: "320px",
                            position: "absolute",
                            top: "-30px",
                            left: "63%",
                            opacity: isActive(0) ? "1" : "0",
                        }}
                    ></Image>
                    <Image
                        src={AviationTitle}
                        sx={{
                            width: "192px",
                            position: "absolute",
                            top: "150px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            opacity: isActive(0) ? "1" : "0",
                        }}
                    ></Image>
                </Box>
                <Box>
                    <Image
                        src={Bomb}
                        sx={{
                            width: "160px",
                            position: "absolute",
                            top: "30%",
                            left: "90px",
                            transform: `translateX(-50%) ${
                                isActive(1) ? "rotate(0deg)" : "rotate(-40deg)"
                            } `,
                            opacity: isActive(1) ? "1" : "0.2",
                            cursor: "pointer",
                        }}
                        onClick={() => handleSetActive(1)}
                    ></Image>
                    <Image
                        src={BombTitle}
                        sx={{
                            width: "160px",
                            position: "absolute",
                            top: "52%",
                            left: "10px",
                            opacity: isActive(1) ? "1" : "0",
                        }}
                    ></Image>
                </Box>

                <Box>
                    <Image
                        src={Brick}
                        sx={{
                            width: "140px",
                            position: "absolute",
                            bottom: "10%",
                            left: "100px",
                            transform: `translateX(-50%) ${
                                isActive(2)
                                    ? "rotate(0deg)  scale(1.1)"
                                    : "rotate(40deg)"
                            } `,
                            opacity: isActive(2) ? "1" : "0.2",
                            cursor: "pointer",
                        }}
                        onClick={() => handleSetActive(2)}
                    ></Image>
                    <Image
                        src={BrickTitle}
                        sx={{
                            width: "200px",
                            position: "absolute",
                            bottom: "0%",
                            left: "10px",
                            opacity: isActive(2) ? "1" : "0",
                        }}
                    ></Image>
                </Box>
                <Box>
                    <Image
                        src={Factory}
                        sx={{
                            width: "120px",
                            position: "absolute",
                            top: "30%",
                            right: "-40px",
                            transform: `translateX(-50%) ${
                                isActive(3)
                                    ? "rotate(0deg) scale(1.3)"
                                    : "rotate(50deg)"
                            } `,
                            opacity: isActive(3) ? "1" : "0.2",
                            cursor: "pointer",
                        }}
                        onClick={() => handleSetActive(3)}
                    ></Image>
                    <Image
                        src={FactoryTitle}
                        sx={{
                            width: "220px",
                            position: "absolute",
                            top: "50%",
                            right: "-120px",
                            opacity: isActive(3) ? "1" : "0",
                        }}
                        onClick={() => handleSetActive(3)}
                    ></Image>
                </Box>

                <Box>
                    <Image
                        src={FuelTitle}
                        sx={{
                            width: "168px",
                            position: "absolute",
                            bottom: "20%",
                            right: "-120px",
                            opacity: isActive(4) ? "1" : "0",
                        }}
                    ></Image>
                    <Image
                        src={BatteryTitle}
                        sx={{
                            width: "168px",
                            position: "absolute",
                            bottom: "10%",
                            right: "-90px",
                            opacity: isActive(4) ? "1" : "0",
                        }}
                    ></Image>
                    <Image
                        src={Resources}
                        sx={{
                            width: "168px",
                            position: "absolute",
                            bottom: "10%",
                            right: "-20px",
                            transform: `translateX(-50%) ${
                                isActive(4) ? "rotate(0deg)" : "rotate(-120deg)"
                            } `,
                            opacity: isActive(4) ? "1" : "0.2",
                            cursor: "pointer",
                        }}
                        onClick={() => handleSetActive(4)}
                    ></Image>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: "8vh",
                    alignItems: "center",
                }}
            >
                <CircleButton
                    title="Play"
                    onClick={() => {
                        handleSetCombination(0);
                    }}
                ></CircleButton>
                <FillCircle></FillCircle>
                <CircleButton
                    title="Produce"
                    onClick={() => {
                        handleSetCombination(1);
                    }}
                ></CircleButton>
                <FillCircle></FillCircle>
                <CircleButton
                    title="Attack"
                    onClick={() => {
                        handleSetCombination(2);
                    }}
                ></CircleButton>
                <FillCircle></FillCircle>
                <CircleButton
                    title="Protect"
                    onClick={() => {
                        handleSetCombination(3);
                    }}
                ></CircleButton>
            </Box>
        </Box>
    );
};

export default CardBanner;
