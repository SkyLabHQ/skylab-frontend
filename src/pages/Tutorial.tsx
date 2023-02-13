import { Box, Button, Container, Img, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TutorialConfirmBackground from "../assets/tutorial-confirm.png";
import TutorialPresettingBackground from "../assets/tutorial-presetting.png";
import TutorialPresettingWarningBackground from "../assets/tutorial-presetting-warning.png";
import TutorialPresettingRouteBackground from "../assets/tutorial-presetting-route.png";
import TutorialPresettingUnselectBackground from "../assets/tutorial-presetting-unselect.png";
import TutorialDriveBackground from "../assets/tutorial-drive.png";
import TutorialHint from "../assets/tutorial-hint.svg";
import TutorialCursor1 from "../assets/tutorial-cursor-1.svg";
import TutorialCursor2 from "../assets/tutorial-cursor-2.svg";
import FuelIcon from "../assets/icon-fuel.svg";
import BatteryIcon from "../assets/icon-battery.svg";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";

type Config = {
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
        w: number;
        h: number;
        top: number;
        left: number;
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
};

const configs: Config[] = [
    {
        bgImg: TutorialConfirmBackground,
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
            w: 28.5,
            h: 78,
            top: 9,
            left: 70.5,
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "55vh",
                left: "-50px",
            },
            content: (
                <Box>
                    <Img src={TutorialHint} />
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        margin="20px 0"
                    >
                        Here’s an overview of the map. Each grid has two factors
                        that influence the strategy you should take.
                    </Text>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialConfirmBackground,
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
            w: 28.5,
            h: 82,
            top: 9,
            left: 70.5,
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                top: "55vh",
                left: "-50px",
            },
            content: (
                <Box>
                    <Img src={TutorialHint} />
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        marginTop="20px"
                    >
                        <Img src={FuelIcon} w="80px" />
                        <Text
                            fontFamily="Orbitron"
                            fontSize="32px"
                            fontWeight={600}
                            color="black"
                            marginLeft="20px"
                        >
                            Fuel is more effective for dealing with air drag,
                        </Text>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        marginTop="20px"
                        marginBottom="20px"
                    >
                        <Img src={BatteryIcon} w="80px" />
                        <Text
                            fontFamily="Orbitron"
                            fontSize="32px"
                            fontWeight={600}
                            color="black"
                            marginLeft="20px"
                        >
                            Battery is more effective for handling turbulence.
                        </Text>
                    </Box>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialConfirmBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 67.5,
                children: [
                    { mask: false, w: 26, target: true },
                    { mask: true, w: 48 },
                    { mask: false, w: 26, target: true },
                ],
            },
            { mask: true, w: 100, h: 22.5 },
        ],
        hint: {
            w: 41,
            h: 28,
            top: 37.5,
            left: 29,
            mark: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderRight: "50px solid white",
                bottom: "3.5vh",
                left: "-50px",
            },
            markTwo: {
                borderTop: "50px solid transparent",
                borderBottom: "50px solid transparent",
                borderLeft: "50px solid white",
                bottom: "3.5vh",
                right: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    marginBottom="20px"
                >
                    These two panels show the stocks of you and your component.
                </Text>
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
            w: 32,
            h: 55.5,
            top: 26,
            left: 2.5,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                left: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="32px"
                    fontWeight={600}
                    color="black"
                    marginBottom="20px"
                >
                    Based on the terrain condition and your stocks, you can
                    predict weather you will win or lose. If you are fear of
                    losing the game and wasting your resources, you can quit. In
                    this case, only your aviation will be down-graded.
                </Text>
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
                    { mask: true, w: 85 },
                    { mask: false, w: 15, target: true },
                ],
            },
        ],
        hint: {
            w: 32,
            h: 32,
            top: 49,
            left: 66,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                right: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="32px"
                    fontWeight={600}
                    color="black"
                    marginBottom="20px"
                >
                    If you are confident of winning or want to test your chance,
                    click on ‘Next’.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialConfirmBackground,
        container: [
            {
                mask: false,
                w: 100,
                h: 9,
                target: true,
                children: undefined,
            },
            { mask: true, w: 100, h: 91 },
        ],
        hint: {
            w: 32,
            h: 36,
            top: 14,
            left: 56,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderBottom: "50px solid white",
                left: "5vw",
                top: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="32px"
                    fontWeight={600}
                    color="black"
                    marginBottom="20px"
                >
                    You will automatically enter the game if you have not made
                    any decision in 30s (Earth Time).
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 86 },
            {
                mask: false,
                w: 100,
                h: 14,
                children: [
                    { mask: true, w: 35 },
                    { mask: false, w: 30, target: true },
                    { mask: true, w: 35 },
                ],
            },
        ],
        hint: {
            w: 32,
            h: 58,
            top: 21,
            left: 33,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                right: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    marginBottom="20px"
                    lineHeight="1.25"
                >
                    There are two stages: pre-setting stage and driving stage.
                    In presetting stage you can design your route and set the
                    loads. No decision made here is final. You can still adjust
                    your strategy in the driving stage.
                </Text>
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
            w: 32,
            h: 51,
            top: 11,
            left: 35,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "5vw",
                right: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                >
                    The universe time refers to an in-game time. It diverges
                    from earth time. To win the game you need to get to the
                    destination faster than your opponent in terms of the
                    universe time.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 25.5 },
            {
                mask: false,
                w: 100,
                h: 8,
                children: [
                    { mask: true, w: 73.5 },
                    { mask: false, w: 24.5, target: true },
                    { mask: true, w: 2 },
                ],
            },
            { mask: true, w: 100, h: 66.5 },
        ],
        hint: {
            w: 32,
            h: 33,
            top: 15,
            left: 39,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "5vw",
                right: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                >
                    Here’s the universe time that your aviation uses to pass
                    through the current grid.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 34.5 },
            {
                mask: false,
                w: 100,
                h: 10.5,
                children: [
                    { mask: true, w: 73.5 },
                    { mask: false, w: 24.5, target: true },
                    { mask: true, w: 2 },
                ],
            },
            { mask: true, w: 100, h: 55 },
        ],
        hint: {
            w: 32,
            h: 35,
            top: 25,
            left: 39,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "5vw",
                right: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                    mb="20px"
                >
                    Here’s the universe time that your aviation has consumed in
                    total through the selected grids
                </Text>
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
            w: 25,
            h: 25,
            top: 33,
            left: 3,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "5vw",
                right: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                    mb="20px"
                >
                    Click on any grid to see its detailed info.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialPresettingBackground,
        container: [
            { mask: true, w: 100, h: 52.5 },
            {
                mask: false,
                w: 100,
                h: 24,
                children: [
                    { mask: true, w: 70 },
                    { mask: false, w: 28.5, target: true },
                    { mask: true, w: 1.5 },
                ],
            },
            { mask: true, w: 100, h: 23.5 },
        ],
        hint: {
            w: 32,
            h: 47,
            top: 42,
            left: 35,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderLeft: "50px solid white",
                top: "5vw",
                right: "-50px",
            },
            content: (
                <Box>
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        marginTop="20px"
                    >
                        <Img src={FuelIcon} w="80px" />
                        <Text
                            fontFamily="Orbitron"
                            fontSize="36px"
                            lineHeight="1.25"
                            fontWeight={600}
                            color="black"
                            marginLeft="20px"
                        >
                            Fuel is more effective for dealing with air drag,
                        </Text>
                    </Box>
                    <Box
                        display="flex"
                        alignItems="flex-start"
                        marginTop="20px"
                        marginBottom="20px"
                    >
                        <Img src={BatteryIcon} w="80px" />
                        <Text
                            fontFamily="Orbitron"
                            fontSize="36px"
                            lineHeight="1.25"
                            fontWeight={600}
                            color="black"
                            marginLeft="20px"
                        >
                            Battery is more effective for handling turbulence.
                        </Text>
                    </Box>
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingWarningBackground,
        container: [
            { mask: true, w: 100, h: 28 },
            {
                mask: false,
                w: 100,
                h: 38,
                children: [
                    { mask: true, w: 2 },
                    { mask: false, w: 28.5, target: true },
                    { mask: true, w: 69.5 },
                ],
            },
            { mask: true, w: 100, h: 34 },
        ],
        hint: {
            w: 32,
            h: 55,
            top: 28,
            left: 33.5,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderRight: "50px solid white",
                top: "5vw",
                left: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                >
                    If any remaining resource is less than the number of grids
                    left to reach the destination, you are at risks of not
                    completing the game. You should try lowering the number of
                    resource you put into the grid.
                </Text>
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
            w: 26,
            h: 39,
            top: 51,
            left: 72,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderRight: "50px solid white",
                top: "5vw",
                left: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                    mb="20px"
                >
                    Design a route for your aviation to reach the destination by
                    clicking on the grid.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialPresettingRouteBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    { mask: true, w: 31 },
                    { mask: false, w: 38 },
                    {
                        mask: false,
                        w: 31,
                        children: [
                            { mask: true, h: 15 },
                            { mask: false, h: 10 },
                            { mask: true, h: 15 },
                            { mask: false, h: 28 },
                        ],
                    },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            w: 26,
            h: 39,
            top: 42,
            left: 2,
            content: (
                <Box>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        lineHeight="1.25"
                        mb="20px"
                    >
                        Click the tile to view its grid info and grid universe
                        time based on your specific allocation.
                    </Text>
                    <Img
                        pos="absolute"
                        right="-16vw"
                        top="5vh"
                        w="16vw"
                        src={TutorialCursor1}
                    />
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingRouteBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    { mask: true, w: 31 },
                    { mask: false, w: 38 },
                    { mask: true, w: 31 },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            w: 26,
            h: 39,
            top: 42,
            left: 2,
            content: (
                <Box>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        lineHeight="1.25"
                        mb="20px"
                    >
                        If the tile is connected to the selected path, that tile
                        will count as part of the path.
                    </Text>
                    <Img
                        pos="absolute"
                        right="-16vw"
                        top="5vh"
                        w="16vw"
                        src={TutorialCursor1}
                    />
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingRouteBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    {
                        mask: false,
                        w: 31,
                        children: [
                            { h: 18.5, mask: true },
                            { h: 36.5, mask: false },
                            { h: 13, mask: true },
                        ],
                    },
                    { mask: false, w: 38 },
                    {
                        mask: false,
                        w: 31,
                        children: [
                            { h: 15, mask: true },
                            { h: 10, mask: false },
                            { h: 15, mask: true },
                            { h: 28, mask: false },
                        ],
                    },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            w: 57.5,
            h: 20,
            top: 77,
            left: 2,
            flexDirection: "row",
            padding: "16px 24px",
            content: (
                <Box>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        lineHeight="1.25"
                    >
                        Adjust the loads of the selected grid by dragging the
                        slider or clicking on the number and typing in new value
                        on the load panel.
                    </Text>
                    <Img
                        pos="absolute"
                        left="12vw"
                        top="-11vh"
                        w="11vw"
                        transform="rotate(-90deg)"
                        src={TutorialCursor1}
                    />
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingUnselectBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    {
                        mask: false,
                        w: 31,
                        children: [
                            { h: 18.5, mask: true },
                            { h: 36.5, mask: false },
                            { h: 13, mask: true },
                        ],
                    },
                    { mask: false, w: 38 },
                    {
                        mask: false,
                        w: 31,
                        children: [
                            { h: 15, mask: true },
                            { h: 10, mask: false },
                            { h: 15, mask: true },
                            { h: 28, mask: false },
                        ],
                    },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            w: 57.5,
            h: 20,
            top: 77,
            left: 2,
            flexDirection: "row",
            padding: "4px 24px",
            content: (
                <Box>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        lineHeight="1.25"
                    >
                        If you click on a tile that is NOT connected to the
                        selected path, you can check its info and play with the
                        load, but it cannot be selected nor allocated resources
                        to.
                    </Text>
                    <Img
                        pos="absolute"
                        left="29vw"
                        top="-43vh"
                        w="12.5vw"
                        src={TutorialCursor2}
                    />
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingRouteBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    { mask: true, w: 31 },
                    { mask: false, w: 38 },
                    { mask: true, w: 31 },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            w: 26,
            h: 31.5,
            top: 44,
            left: 2,
            content: (
                <Box>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        lineHeight="1.25"
                        mb="20px"
                    >
                        Double click to cancel your selection.
                    </Text>
                    <Img
                        pos="absolute"
                        right="-8.5vw"
                        top="8vh"
                        w="8.5vw"
                        src={TutorialCursor1}
                    />
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialPresettingRouteBackground,
        container: [
            { mask: true, w: 100, h: 10 },
            {
                mask: false,
                w: 100,
                h: 68,
                children: [
                    { mask: true, w: 31 },
                    { mask: false, w: 38 },
                    { mask: true, w: 31 },
                ],
            },
            { mask: true, w: 100, h: 22 },
        ],
        hint: {
            w: 26,
            h: 39,
            top: 44,
            left: 2,
            content: (
                <Box>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        lineHeight="1.25"
                        mb="20px"
                    >
                        If you unselect a tile in the middle of the path, all
                        tiles afterwards will be unselected.
                    </Text>
                    <Img
                        pos="absolute"
                        right="-8.5vw"
                        top="8vh"
                        w="8.5vw"
                        src={TutorialCursor1}
                    />
                </Box>
            ),
        },
    },
    {
        bgImg: TutorialDriveBackground,
        container: [
            { mask: true, w: 100, h: 86 },
            {
                mask: false,
                w: 100,
                h: 14,
                children: [
                    { mask: true, w: 35 },
                    { mask: false, w: 30, target: true },
                    { mask: true, w: 35 },
                ],
            },
        ],
        hint: {
            w: 32,
            h: 48,
            top: 30,
            left: 33,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                right: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    marginBottom="20px"
                    lineHeight="1.25"
                >
                    The driving stage is your final chance to change your route
                    and loads. Make your decision fast! If you do nothing, your
                    aviation will go according to your presets.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialDriveBackground,
        container: [
            { mask: true, w: 100, h: 55 },
            {
                mask: false,
                w: 100,
                h: 24,
                children: [
                    { mask: true, w: 30 },
                    { mask: false, w: 13.5, target: true },
                    { mask: true, w: 56.5 },
                ],
            },
            { mask: true, w: 100, h: 21 },
        ],
        hint: {
            w: 31.5,
            h: 37,
            top: 11,
            left: 32,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                left: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                >
                    Use W A D S to control your aviation’s direction, otherwise
                    it will go according to the preset route.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialDriveBackground,
        container: [
            { mask: true, w: 100, h: 24 },
            {
                mask: false,
                w: 100,
                h: 35,
                children: [
                    { mask: true, w: 2 },
                    { mask: false, w: 28.5, target: true },
                    { mask: true, w: 69.5 },
                ],
            },
            { mask: true, w: 100, h: 41 },
        ],
        hint: {
            w: 32,
            h: 32,
            top: 25,
            left: 34,
            mark: {
                borderBottom: "50px solid transparent",
                borderTop: "50px solid transparent",
                borderRight: "50px solid white",
                top: "10vh",
                left: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                    mb="20px"
                >
                    You can still adjust the loads here, if not they will remain
                    as your preset.
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialDriveBackground,
        container: [
            { mask: true, w: 100, h: 89.5 },
            {
                mask: false,
                w: 100,
                h: 10.5,
                children: [
                    { mask: true, w: 85 },
                    { mask: false, w: 15, target: true },
                ],
            },
        ],
        hint: {
            w: 26.5,
            h: 21,
            top: 61,
            left: 70.5,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                right: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                    mb="20px"
                >
                    Return to large map
                </Text>
            ),
        },
    },
    {
        bgImg: TutorialDriveBackground,
        container: [
            { mask: true, w: 100, h: 89.5 },
            {
                mask: false,
                w: 100,
                h: 10.5,
                children: [
                    { mask: true, w: 85 },
                    { mask: false, w: 15, target: true },
                ],
            },
        ],
        hint: {
            w: 26.5,
            h: 21,
            top: 61,
            left: 70.5,
            mark: {
                borderLeft: "50px solid transparent",
                borderRight: "50px solid transparent",
                borderTop: "50px solid white",
                right: "2vw",
                bottom: "-50px",
            },
            content: (
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    color="black"
                    lineHeight="1.25"
                    mb="20px"
                >
                    Return to small map
                </Text>
            ),
        },
    },
];

const TutorialStep = ({
    config,
    onOk,
}: {
    config: Config;
    onOk: () => void;
}): ReactElement => {
    const navigate = useNavigate();

    return (
        <Container
            w="100vw"
            maxW="auto"
            h="100vh"
            bgImg={config.bgImg}
            bgSize="100% 100%"
            bgPos="top left"
            bgRepeat="no-repeat"
            p="0"
            display="flex"
            flexDirection="column"
        >
            {config.container.map((containerItem) => (
                <Box
                    w={`${containerItem.w}vw`}
                    h={`${containerItem.h}vh`}
                    bg={containerItem.mask ? "rgba(0, 0, 0, 0.8)" : "initial"}
                    borderRadius={containerItem.target ? "20px" : "initial"}
                    border={
                        containerItem.target ? "5px dashed #F5CA5C" : "initial"
                    }
                    display="flex"
                >
                    {containerItem.children?.map((child) => (
                        <Box
                            w={`${child.w}vw`}
                            bg={child.mask ? "rgba(0, 0, 0, 0.8)" : "initial"}
                            borderRadius={child.target ? "20px" : "initial"}
                            border={
                                child.target ? "5px dashed #F5CA5C" : "initial"
                            }
                            display="flex"
                            flexDirection="column"
                        >
                            {child.children?.map((secondaryChild) => (
                                <Box
                                    h={`${secondaryChild.h}vh`}
                                    bg={
                                        secondaryChild.mask
                                            ? "rgba(0, 0, 0, 0.8)"
                                            : "initial"
                                    }
                                    borderRadius={
                                        secondaryChild.target
                                            ? "20px"
                                            : "initial"
                                    }
                                    border={
                                        secondaryChild.target
                                            ? "5px dashed #F5CA5C"
                                            : "initial"
                                    }
                                ></Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            ))}
            <Box
                pos="fixed"
                bg="white"
                borderRadius="20px"
                w={`${config.hint.w}vw`}
                h={`${config.hint.h}vh`}
                left={`${config.hint.left}vw`}
                top={`${config.hint.top}vh`}
                css={{
                    ":before": {
                        content: '""',
                        width: "0px",
                        height: "0px",
                        position: "absolute",
                        ...config.hint.mark,
                    },
                    ":after": {
                        content: '""',
                        width: "0px",
                        height: "0px",
                        position: "absolute",
                        ...config.hint.markTwo,
                    },
                }}
                padding={config.hint.padding ?? "32px 40px"}
                display="flex"
                flexDirection={config.hint.flexDirection ?? "column"}
                alignItems="center"
            >
                {config.hint.content}
                <Box display="flex" justifyContent="center">
                    <Button
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        colorScheme="yellow"
                        borderRadius="20px"
                        w="160px"
                        h="90px"
                        margin="0 auto"
                        onClick={onOk}
                    >
                        OK
                    </Button>
                </Box>
            </Box>
            <Box
                pos="fixed"
                w={`${
                    config.hint.flexDirection === "row" ? "auto" : config.hint.w
                }vw`}
                left={`${
                    config.hint.flexDirection === "row"
                        ? config.hint.w + config.hint.left + 1
                        : config.hint.left
                }vw`}
                top={`${
                    config.hint.flexDirection === "row"
                        ? config.hint.top + config.hint.h - 5
                        : config.hint.top + config.hint.h + 1
                }vh`}
                textAlign="center"
            >
                <Text
                    display="inline-block"
                    margin="0 auto"
                    cursor="pointer"
                    color="#BCBBBE"
                    textDecorationLine="underline"
                    textAlign="center"
                    fontFamily="Orbitron"
                    fontSize="36px"
                    fontWeight={600}
                    onClick={() => navigate("/game")}
                >
                    Skip tutorial
                </Text>
            </Box>
        </Container>
    );
};

const Tutorial = (): ReactElement => {
    const [step, setStep] = useState(0);
    const { setIsKnobVisible } = useKnobVisibility();
    const navigate = useNavigate();

    const config = configs[step];

    const onOk = () => {
        if (step >= configs.length - 1) {
            navigate("/game");
        }
        setStep((val) => val + 1);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    });

    return <TutorialStep onOk={onOk} config={config} />;
};

export default Tutorial;
