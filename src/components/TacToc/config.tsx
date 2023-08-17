import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TourProvider, StepType } from "@reactour/tour";

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
];

export default tourConfig;
