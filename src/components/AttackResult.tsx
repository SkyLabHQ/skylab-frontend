import { Box, Img, Text } from "@chakra-ui/react";
import React, { FC } from "react";

import Fuel from "../assets/fuel.svg";
import Shield from "../assets/shield.svg";
import Diamond from "../assets/diamond.svg";

type Props = {
    win: boolean;
};

const TitleStyle = {
    fontSize: "64px",
    fontFamily: "Orbitron",
    fontWeight: "500",
};

const TextStyle = {
    fontSize: "40px",
    fontFamily: "Quantico",
};

export const AttackResult: FC<Props> = ({ win }) => {
    return (
        <Box color="white">
            <Text pos="absolute" top="20vh" left="5vw" {...TitleStyle}>
                Factory Condition
            </Text>

            <Img src={Shield} pos="absolute" top="30vh" left="5vw" />

            <Text
                pos="absolute"
                top="31vh"
                left="21vw"
                {...TextStyle}
                whiteSpace="nowrap"
            >
                Factory had{" "}
                <Text display="inline-block" textDecorationLine="underline">
                    200
                </Text>{" "}
                bricks
            </Text>
            <Text
                pos="absolute"
                top="39vh"
                left="21vw"
                {...TextStyle}
                whiteSpace="nowrap"
            >
                You destroyed{" "}
                <Text
                    display="inline-block"
                    color="#FF2784"
                    textDecorationLine="underline"
                >
                    200
                </Text>{" "}
                bricks
            </Text>

            {win ? (
                <>
                    <Text pos="absolute" top="53vh" left="5vw" {...TitleStyle}>
                        Rewards
                    </Text>

                    <Box pos="absolute" top="68vh" left="6vw">
                        <Img src={Fuel} />
                        <Text
                            pos="absolute"
                            top="3vh"
                            left="7vw"
                            whiteSpace="nowrap"
                            {...TitleStyle}
                        >
                            X 58
                        </Text>
                        <Text
                            pos="absolute"
                            top="16vh"
                            left="1.5vw"
                            {...TextStyle}
                        >
                            Fuel
                        </Text>
                    </Box>

                    <Box pos="absolute" top="68vh" left="29vw">
                        <Img src={Diamond} />
                        <Text
                            pos="absolute"
                            top="3vh"
                            left="9vw"
                            whiteSpace="nowrap"
                            {...TitleStyle}
                        >
                            X 58
                        </Text>
                        <Text
                            pos="absolute"
                            top="16vh"
                            left="1.5vw"
                            {...TextStyle}
                        >
                            Battery
                        </Text>
                    </Box>
                </>
            ) : null}
        </Box>
    );
};
