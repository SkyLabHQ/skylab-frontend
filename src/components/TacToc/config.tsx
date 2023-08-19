import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TourProvider, StepType } from "@reactour/tour";
import { CSSObject } from "@emotion/react";

const opositeSide = {
    top: "bottom",
    bottom: "top",
    right: "left",
    left: "right",
};

function doArrow(
    position: "top" | "right" | "bottom" | "left" | "custom",
    verticalAlign: "top" | "bottom",
    horizontalAlign: "left" | "right",
): CSSObject {
    if (!position || position === "custom") {
        return {};
    }

    const width = 40;
    const height = 30;
    const color = "white";
    const isVertical = position === "top" || position === "bottom";
    const spaceFromSide = 25;

    const obj = {
        [`--rtp-arrow-${
            isVertical ? opositeSide[horizontalAlign] : verticalAlign
        }`]: height + spaceFromSide + "px",
        [`--rtp-arrow-${opositeSide[position]}`]: -height + 2 + "px",
        [`--rtp-arrow-border-${isVertical ? "left" : "top"}`]: `${
            width / 2
        }px solid transparent`,
        [`--rtp-arrow-border-${isVertical ? "right" : "bottom"}`]: `${
            width / 2
        }px solid transparent`,
        [`--rtp-arrow-border-${position}`]: `${height}px solid ${color}`,
    };

    console.log(obj, "objobj");
    return obj;
}

const tourConfig: StepType[] = [
    {
        selector: ".first-step",
        position: "bottom",
        content: () => {
            return (
                <Box>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        The player with higher{" "}
                        <span style={{ color: "#c8ad23" }}>bid</span> conquers
                        the{" "}
                        <span
                            style={{
                                border: "2px solid #76c551",
                                color: "#76c551",
                            }}
                        >
                            grid
                        </span>
                    </Text>
                </Box>
            );
        },
    },
    {
        selector: ".second-step",
        position: "bottom",
        content: `If bids from two players equal, player who didn't get the last grid will get the current grid. If bids are equal for the first grid, the winner will be randomly selected based on [method].`,
    },
    {
        selector: ".third-step",
        position: "bottom",
        content: () => {
            return (
                <Box>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        After bidding, the
                        <span style={{ color: "#c8ad23" }}>bid</span> amount is
                        subtracted from your balance, no matter you won the{" "}
                        <span
                            style={{
                                border: "2px solid #76c551",
                                color: "#76c551",
                            }}
                        >
                            grid
                        </span>{" "}
                        or not.
                    </Text>
                </Box>
            );
        },
    },
    {
        selector: ".fourth-step",
        position: (prop) => {
            const { windowHeight, windowWidth } = prop;
            return [windowWidth / 2, windowHeight / 2];
        },
        styles: {
            popover: (base: any, state: any) => {
                console.log(base, "base");
                return {
                    ...base,
                    boxShadow: "none",
                    borderRadius: "16px",
                    maxWidth: "580px",
                    ...doArrow(
                        "bottom",
                        state.verticalAlign,
                        state.horizontalAlign,
                    ),
                };
            },
        },
        content: () => {
            return (
                <Box>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        Here are marks of of each grid.
                    </Text>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            marginTop: "20px",
                        }}
                    >
                        Mark=Existing Mark * Discount Rate + New Bid
                    </Text>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                            marginTop: "20px",
                        }}
                    >
                        The player with higher mark win the grid.
                    </Text>
                </Box>
            );
        },
    },
    {
        selector: ".fifth-step",
        position: "bottom",
        content: () => {
            return (
                <Box>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                        }}
                    >
                        Here are marks of of each grid.
                    </Text>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            marginTop: "20px",
                        }}
                    >
                        Mark=Existing Mark * Discount Rate + New Bid
                    </Text>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                            marginTop: "20px",
                        }}
                    >
                        The player with higher mark win the grid.
                    </Text>
                </Box>
            );
        },
    },
    {
        selector: ".sixth-step",
        position: "right",
        content: () => {
            return (
                <Box>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "20px",
                            fontWeight: 600,
                            lineHeight: "40px",
                        }}
                    >
                        If there's no 3 connected{" "}
                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-block",
                            }}
                        >
                            <span
                                style={{
                                    color: "#76c551",
                                }}
                            >
                                grids
                            </span>{" "}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "-4px",
                                    left: 0,
                                    display: "flex",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: "17px",
                                        height: "17px",
                                        border: "2px solid #76c551",
                                        marginRight: "2px",
                                    }}
                                ></Box>
                                <Box
                                    sx={{
                                        width: "17px",
                                        height: "17px",
                                        border: "2px solid #76c551",
                                        marginRight: "2px",
                                    }}
                                ></Box>{" "}
                                <Box
                                    sx={{
                                        width: "17px",
                                        height: "17px",
                                        border: "2px solid #76c551",
                                        marginRight: "2px",
                                    }}
                                ></Box>
                            </Box>
                        </Box>{" "}
                        and the board is full, then the player who has occupied
                        more{" "}
                        <span
                            style={{
                                border: "2px solid #76c551",
                                color: "#76c551",
                            }}
                        >
                            grid
                        </span>{" "}
                        wins.
                    </Text>
                </Box>
            );
        },
    },
];

export { tourConfig, doArrow };
