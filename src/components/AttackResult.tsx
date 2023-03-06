import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
import React, { FC } from "react";

import Fuel from "../assets/icon-fuel.svg";
import Shield from "../assets/shield.svg";
import Battery from "../assets/icon-battery.svg";

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
    paddingLeft: "20px",
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
                shields
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
                shields
            </Text>

            {win ? (
                <>
                    <Text pos="absolute" top="53vh" left="5vw" {...TitleStyle}>
                        Rewards
                    </Text>

                    <VStack
                        spacing="8px"
                        pos="absolute"
                        top="68vh"
                        left="6vw"
                        alignItems="flex-start"
                    >
                        <HStack spacing="20px">
                            <Img h="140px" src={Fuel} />
                            <Text whiteSpace="nowrap" {...TitleStyle}>
                                X 58
                            </Text>
                        </HStack>
                        <Text {...TextStyle}>Fuel</Text>
                    </VStack>

                    <VStack
                        spacing="8px"
                        pos="absolute"
                        top="68vh"
                        left="29vw"
                        alignItems="flex-start"
                    >
                        <HStack spacing="20px">
                            <Img h="140px" src={Battery} />
                            <Text whiteSpace="nowrap" {...TitleStyle}>
                                X 58
                            </Text>
                        </HStack>
                        <Text {...TextStyle}>Battery</Text>
                    </VStack>
                </>
            ) : null}
        </Box>
    );
};
