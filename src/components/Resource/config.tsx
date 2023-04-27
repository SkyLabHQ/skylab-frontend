import React, { ReactElement } from "react";
import { Config } from "../TutorialStep/config";
import TutorialBg from "./assets/tutorial-bg.png";
import { Box, Img, Text } from "@chakra-ui/react";

export const configs: Config[] = [
    {
        bgImg: TutorialBg,
        container: [
            { mask: true, w: 100, h: 28 },
            {
                mask: false,
                w: 100,
                h: 5,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 28 },
            {
                mask: false,
                w: 100,
                h: 5,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 34 },
        ],
        hint: {
            style: {
                w: "33.8vw",
                top: "24vh",
                left: "54.9vw",
                height: "45vh",
            },
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "8%",
                left: "-50px",
            },
            markTwo: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                bottom: "6%",
                left: "-50px",
            },
            content: (
                <Box fontFamily="Orbitron" sx={{ paddingLeft: "30px" }}>
                    <Text
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        margin="1.85vh 0"
                    >
                        Choose how much fuel and battery you want to spend on
                        this level by typing in numbers.
                    </Text>
                    <Text
                        fontSize="24px"
                        fontWeight={600}
                        color="black"
                        marginTop="1.85vh"
                        paddingLeft={"40px"}
                    >
                        Focus on the fuel load input
                    </Text>
                    <Text
                        fontSize="24px"
                        fontWeight={600}
                        color="black"
                        margin="1vh 0 8vh"
                        paddingLeft={"40px"}
                    >
                        Focus on the fuel load input
                    </Text>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialBg,
        container: [
            { mask: true, w: 100, h: 35 },
            {
                mask: false,
                w: 100,
                h: 12,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 21 },
            {
                mask: false,
                w: 100,
                h: 12,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 20 },
        ],
        hint: {
            style: {
                w: "33.8vw",
                top: "24vh",
                left: "54.9vw",
                height: "45vh",
            },
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "8%",
                left: "-50px",
            },
            markTwo: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                bottom: "6%",
                left: "-50px",
            },
            content: (
                <Box fontFamily="Orbitron" sx={{ paddingLeft: "30px" }}>
                    <Text
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        margin="1.85vh 0"
                    >
                        ...or by dragging the scale bar, or simply tap on the
                        percentage tab
                    </Text>
                    <Text
                        fontSize="24px"
                        fontWeight={600}
                        color="black"
                        marginTop="1.85vh"
                        paddingLeft={"40px"}
                    >
                        Focus on the fuel load input
                    </Text>
                    <Text
                        fontSize="24px"
                        fontWeight={600}
                        color="black"
                        margin="1vh 0 8vh"
                        paddingLeft={"40px"}
                    >
                        Focus on the battery load input
                    </Text>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialBg,
        container: [
            { mask: true, w: 100, h: 42 },
            {
                mask: false,
                w: 100,
                h: 22,
                children: [
                    { mask: true, w: 70 },
                    { mask: false, w: 24 },
                    { mask: true, w: 6 },
                ],
            },
            { mask: true, w: 100, h: 36 },
        ],
        hint: {
            style: {
                w: "27vw",
                top: "29.8vh",
                left: "40.6vw",
                height: "39.8vh",
            },
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "30%",
                right: "-50px",
            },

            content: (
                <Box fontFamily="Orbitron">
                    <Text
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        margin="1.85vh 0 10vh"
                    >
                        Here are the remaining fuel and batteries on your plane.
                    </Text>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialBg,
        container: [
            { mask: true, w: 100, h: 14 },
            {
                mask: false,
                w: 100,
                h: 4,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 5,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 28 },
            {
                mask: false,
                w: 100,
                h: 5,
                children: [
                    { mask: true, w: 34 },
                    { mask: false, w: 18.5 },
                    { mask: true, w: 47.5 },
                ],
            },
            { mask: true, w: 100, h: 34 },
        ],
        hint: {
            style: {
                w: "33.8vw",
                top: "5vh",
                left: "54.9vw",
            },
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "10%",
                left: "-50px",
            },

            content: (
                <Box fontFamily="Orbitron">
                    <Text
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        margin="0 0"
                    >
                        The sum of fuel and battery that you can at most spend
                        for this level.
                    </Text>
                    <Text
                        fontSize="24px"
                        fontWeight={600}
                        color="black"
                        marginTop="1.85vh"
                    >
                        Input fuel + input Batter Lvl Spnd Cap
                    </Text>
                    <Text
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        margin="3vh 0"
                    >
                        The cap varies through levels. Be strategic about the
                        amount of fuel and battery that you spend in one game.
                        Higher usage could make you winning one game more
                        easily, but it might cause you to lose in higher level.
                    </Text>
                </Box>
            ),
        },
    },
];
