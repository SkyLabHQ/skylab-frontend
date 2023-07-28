import { Box, HStack, Img, Text, Image } from "@chakra-ui/react";
import React, { ReactElement } from "react";

import TutorialPlayBackground from "../../assets/tutorial-play.png";
import TutorialConfirmBackground from "../../assets/tutorial-confirm.png";
import TutorialPresettingBackground from "../../assets/tutorial-presetting.png";
import DistanceInfo from "../../assets/distance-info.png";
import TutorialHint1 from "../../assets/tutorial-hint1.png";
import FuelIcon from "../../assets/icon-fuel.svg";
import BatteryIcon from "../../assets/icon-battery.svg";

const KeyCode = ({
    value,
    width = "42px",
}: {
    value: string;
    width?: string;
}) => {
    return (
        <Box>
            <Box
                sx={{
                    border: "1px solid #000",
                    borderRadius: "10px",
                    height: "37px",
                    width: width,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text
                    sx={{
                        fontSize: "24px",
                        color: "black",
                        fontWeight: "600",
                        fontFamily: "Orbitron",
                    }}
                >
                    {value}
                </Text>
            </Box>
        </Box>
    );
};

export type Config = {
    bgImg: string;
    container: {
        w: number;
        mask?: boolean;
        target?: boolean;
        h?: number;
        children?: {
            w: number;
            mask?: boolean;
            target?: boolean;
            children?: {
                h: number;
                mask?: boolean;
                target?: boolean;
            }[];
        }[];
    }[];
    hint: {
        style: Record<string, string>;
        mark?: {
            [key: string]: string;
        };
        markTwo?: {
            [key: string]: string;
        };
        flexDirection?: "row";
        padding?: string;
        content: ReactElement;
    };
    back?: {
        position?: string;
    };
    section?: string;
};

export const configs: Config[] = [
    {
        bgImg: TutorialPlayBackground,
        section: "play",
        container: [
            { mask: true, w: 100, h: 20 },
            {
                mask: false,
                w: 100,
                h: 28,
                children: [
                    { mask: true, w: 21 },
                    { mask: false, w: 35, target: true },
                    { mask: true, w: 44 },
                ],
            },
            { mask: true, w: 100, h: 5.5 },
            {
                mask: false,
                w: 100,
                h: 28,
                children: [
                    { mask: true, w: 21 },
                    { mask: false, w: 35, target: true },
                    { mask: true, w: 44 },
                ],
            },
            { mask: true, w: 100, h: 18.5 },
        ],
        hint: {
            style: {
                w: "34vw",
                // h: "48vh",
                top: "24vh",
                left: "56vw",
            },
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "2vh",
                left: "-50px",
            },
            markTwo: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                bottom: "15vh",
                left: "-50px",
            },
            content: (
                <Box sx={{ fontFamily: "Orbitron", color: "black" }}>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="34px"
                        fontWeight={600}
                    >
                        Choose how much fuel and battery you want to spend on
                        this level by typing in numbers.
                    </Text>
                    <HStack spacing="10px" mb="20px" alignItems="center">
                        <Box
                            w="40px"
                            border="1px solid #000000"
                            borderRadius="10px"
                            textAlign="center"
                            fontFamily="Orbitron"
                            fontSize="24px"
                            fontWeight={600}
                        >
                            F
                        </Box>
                        <Text
                            fontFamily="Orbitron"
                            fontSize="24px"
                            fontWeight={600}
                        >
                            Focus on the fuel load input
                        </Text>
                    </HStack>
                    <HStack spacing="10px" mb="20px" alignItems="center">
                        <Box
                            w="40px"
                            border="1px solid #000000"
                            borderRadius="10px"
                            textAlign="center"
                            fontFamily="Orbitron"
                            fontSize="24px"
                            fontWeight={600}
                        >
                            B
                        </Box>
                        <Text
                            fontFamily="Orbitron"
                            fontSize="24px"
                            fontWeight={600}
                        >
                            Focus on the battery load input
                        </Text>
                    </HStack>
                </Box>
            ),
        },
    },

    {
        bgImg: TutorialConfirmBackground,
        section: "confirm",
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 67.5,
                children: [
                    { mask: true, w: 30 },
                    { mask: false, w: 40, target: true },
                    { mask: true, w: 30 },
                ],
            },
            { mask: true, w: 100, h: 22.5 },
        ],
        hint: {
            style: {
                w: "29vw",
                // maxH: "78vh",
                top: "9vh",
                left: "70vw",
                maxW: "550px",
            },
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "30vh",
                left: "-50px",
            },
            content: (
                <Box sx={{ display: "flex" }}>
                    <Img
                        src={TutorialHint1}
                        sx={{ width: "104px", height: "409px" }}
                    />
                    <Box
                        height="409px"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text
                            fontFamily="Orbitron"
                            fontSize="28px"
                            color="black"
                        >
                            <span style={{ fontWeight: "600" }}>Battery </span>
                            gives you more advantages for dealing with high
                            turbulence.
                        </Text>

                        <Text
                            fontFamily="Orbitron"
                            fontSize="28px"
                            color="black"
                        >
                            <span style={{ fontWeight: "600" }}>Fuel </span>
                            and{" "}
                            <span style={{ fontWeight: "600" }}>
                                high air drag
                            </span>
                        </Text>
                    </Box>
                </Box>
            ),
        },
    },

    {
        bgImg: TutorialConfirmBackground,
        container: [
            { mask: true, w: 100, h: 88.5 },
            {
                mask: false,
                w: 100,
                h: 11.5,
                children: [
                    { mask: false, w: 15, target: true },
                    { mask: true, w: 85 },
                ],
            },
        ],
        hint: {
            style: {
                w: "32vw",
                // maxH: "55.5vh",
                bottom: "20vh",
                left: "2.5vw",
            },
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                left: "2vw",
                bottom: "-50px",
            },
            content: (
                <Box fontFamily="Orbitron">
                    <Text fontSize="28px" color="black">
                        Depending on your resources and the map, if you think
                        you are losing.{" "}
                    </Text>
                    <Text fontSize="28px" color="black" marginBottom="20px">
                        <span
                            style={{
                                fontWeight: "600",
                            }}
                        >
                            FLEE
                        </span>{" "}
                        and keep all unserd resource!
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "8px",
                                border: "1px solid #000",
                                width: "70px",
                                color: "black",
                                textAlign: "center",
                                fontWeight: "600",
                                marginRight: "10px",
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            Esc
                        </Box>
                        <Text
                            sx={{
                                color: "black",
                                fontWeight: "600",
                                fontSize: "20px",
                            }}
                        >
                            Flee/Quit
                        </Text>
                    </Box>
                </Box>
            ),
        },
    },

    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 40,
                children: [
                    { mask: true, w: 69.5 },
                    { mask: false, w: 28.5, target: true },
                    { mask: true, w: 2 },
                ],
            },
            { mask: true, w: 100, h: 50 },
        ],
        hint: {
            style: {
                w: "32vw",
                // maxH: "51vh",
                top: "11vh",
                left: "35vw",
            },
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "5vw",
                right: "-50px",
            },
            content: (
                <>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="28px"
                        color="black"
                        sx={{ marginBottom: "10px" }}
                    >
                        The{" "}
                        <span style={{ fontWeight: 600 }}>universe time </span>
                        refers to an in-game time for your aviation.
                    </Text>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="28px"
                        color="black"
                        sx={{ marginBottom: "20px" }}
                    >
                        Strategize! Get to the destination with least
                        <span style={{ fontWeight: 600 }}>
                            {" "}
                            universe time{" "}
                        </span>{" "}
                        in total.
                    </Text>
                </>
            ),
        },
    },

    // {
    //     bgImg: TutorialPresettingBackground,
    //     container: [
    //         { mask: true, w: 100, h: 10 },
    //         {
    //             mask: false,
    //             w: 100,
    //             h: 68,
    //             children: [
    //                 { mask: true, w: 31 },
    //                 { mask: false, w: 38, target: true },
    //                 { mask: true, w: 31 },
    //             ],
    //         },
    //         { mask: true, w: 100, h: 22 },
    //     ],
    //     hint: {
    //         style: {
    //             w: "25vw",
    //             // maxH: "25vh",
    //             top: "33vh",
    //             left: "3vw",
    //         },
    //         mark: {
    //             borderBottom: "50px solid transparent",
    //             borderTop: "50px solid transparent",
    //             borderLeft: "50px solid white",
    //             top: "5vw",
    //             right: "-50px",
    //         },
    //         content: (
    //             <Text
    //                 fontFamily="Orbitron"
    //                 fontSize="28px"
    //                 fontWeight={600}
    //                 color="black"
    //                 mb="20px"
    //             >
    //                 Click on any grid to see its detailed info.
    //             </Text>
    //         ),
    //     },
    // },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 62 },
            {
                mask: false,
                w: 100,
                h: 12,
                children: [
                    { mask: true, w: 72 },
                    { mask: false, w: 6.5, target: true },
                    {
                        mask: false,
                        w: 18,
                        children: [{ mask: true, h: 8 }],
                    },
                    { mask: true, w: 3.5 },
                ],
            },
            { mask: true, w: 100, h: 26 },
        ],
        hint: {
            style: {
                w: "960px",
                // maxH: "47vh",
                bottom: "10vh",
                right: "34vw",
            },
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                bottom: "15vh",
                right: "-50px",
            },
            content: (
                <Box>
                    {" "}
                    <Text
                        fontFamily="Orbitron"
                        fontSize="28px"
                        color="black"
                        marginBottom="20px"
                    >
                        <span style={{ fontWeight: 600 }}>Distance </span>
                        is the third factors that influences your universe time.
                        There are five types of distances: Blank, Forest,
                        Volcano, Dreamland, Black Hole. Each indicates different
                        distance multiplier.{" "}
                    </Text>
                    <Img src={DistanceInfo} sx={{ marginBottom: "20px" }} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "8px",
                                border: "1px solid #000",
                                width: "30px",
                                color: "black",
                                textAlign: "center",
                                fontWeight: "600",
                                marginRight: "10px",
                                height: "30px",
                                lineHeight: "30px",
                            }}
                        >
                            C
                        </Box>
                        <Text
                            sx={{
                                color: "black",
                                fontWeight: "600",
                                fontSize: "20px",
                            }}
                        >
                            Distance Info Panel
                        </Text>
                    </Box>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 29 },
            {
                mask: false,
                w: 100,
                h: 35,
                children: [
                    { mask: true, w: 2 },
                    { mask: false, w: 28, target: true },
                    { mask: true, w: 70 },
                ],
            },
            { mask: true, w: 100, h: 36 },
        ],
        hint: {
            style: {
                w: "840px",
                // maxH: "55vh",
                top: "28vh",
                left: "33.5vw",
            },
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderRight: "50px solid white",
                top: "5vw",
                left: "-50px",
            },
            content: (
                <Box
                    sx={{
                        color: "black",
                        fontFamily: "Orbitron",
                        width: "100%",
                    }}
                >
                    <Text fontFamily="Orbitron" fontSize="28px" color="black">
                        Adjust <span style={{ fontWeight: 600 }}>fuel</span> and{" "}
                        <span style={{ fontWeight: 600 }}>battery</span> loads
                        for your route.
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            marginTop: "30px",
                        }}
                    >
                        <Image src={FuelIcon} width="80px"></Image>
                        <Box
                            sx={{
                                width: "231px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <KeyCode value={"F"}></KeyCode>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    width: "183px",
                                }}
                            >
                                Focus on the fuel and type
                            </Text>
                        </Box>
                        <Text sx={{ fontSize: "36px", marginRight: "10px" }}>
                            OR
                        </Text>
                        <Box
                            sx={{
                                width: "185px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                marginRight: "10px",
                            }}
                        >
                            <KeyCode value={"O"}></KeyCode>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                }}
                            >
                                Decrease the fuel load{" "}
                            </Text>
                        </Box>
                        <Box
                            sx={{
                                width: "185px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <KeyCode value={"P"}></KeyCode>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    fontWeight: "600",
                                }}
                            >
                                Decrease the fuel load{" "}
                            </Text>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            marginTop: "30px",
                            marginBottom: "20px",
                        }}
                    >
                        <Image src={BatteryIcon} width="80px"></Image>
                        <Box
                            sx={{
                                width: "231px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <KeyCode value={"B"}></KeyCode>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                }}
                            >
                                Focus on the battery and type{" "}
                            </Text>
                        </Box>
                        <Text sx={{ fontSize: "36px", margin: "0 2px" }}>
                            OR
                        </Text>
                        <Box
                            sx={{
                                width: "185px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                                marginRight: "10px",
                            }}
                        >
                            <KeyCode value={","}></KeyCode>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                }}
                            >
                                Decrease the battery load{" "}
                            </Text>
                        </Box>
                        <Box
                            sx={{
                                width: "185px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <KeyCode value={"."}></KeyCode>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    fontWeight: "600",
                                }}
                            >
                                Increase the battery load{" "}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    { mask: true, w: 31 },
                    { mask: false, w: 38, target: true },
                    { mask: true, w: 31 },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            style: {
                w: "27vw",
                // maxH: "39vh",
                top: "44vh",
                left: "72vw",
            },
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderRight: "50px solid white",
                top: "5vw",
                left: "-50px",
            },
            content: (
                <Box sx={{ fontFamily: "Orbitron" }}>
                    <Text
                        fontSize="28px"
                        fontWeight={600}
                        color="black"
                        mb="20px"
                    >
                        Design a route for your aviation to reach the
                        destination.
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "140px",
                            }}
                        >
                            <KeyCode value="W"></KeyCode>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                            >
                                <KeyCode value="A"></KeyCode>
                                <KeyCode value="S"></KeyCode>
                                <KeyCode value="D"></KeyCode>
                            </Box>
                        </Box>
                        <Text>Orientation</Text>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "30px",
                        }}
                    >
                        <KeyCode value="Enter" width="118px"></KeyCode>
                        <Text
                            sx={{
                                fontSize: "24px",
                                color: "black",
                                fontWeight: "600",
                                marginLeft: "20px",
                            }}
                        >
                            Select grid
                        </Text>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        <KeyCode value="Space" width="118px"></KeyCode>
                        <Text
                            sx={{
                                fontSize: "24px",
                                color: "black",
                                fontWeight: "600",
                                marginLeft: "20px",
                            }}
                        >
                            Unselect grid{" "}
                        </Text>
                    </Box>
                </Box>
            ),
        },
    },
];
