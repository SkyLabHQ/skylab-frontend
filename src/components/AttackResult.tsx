import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { FC } from "react";

import Fuel from "../assets/icon-fuel.svg";
import Bomb from "../assets/bomb-in-attack.png";
import Shield from "../assets/shield.svg";
import Battery from "../assets/icon-battery.svg";
import AttackItem from "../assets/attack-item.svg";

type Props = {
    win: boolean;
};

const AttackBox = styled(HStack)(({ win, w, padding }: any) => ({
    background: win
        ? "radial-gradient(60.21% 60.21% at 50% 50%, rgba(233, 175, 55, 0.4) 0%, rgba(99, 238, 205, 0.4) 100%)"
        : "rgba(255, 255, 255, 0.2)",
    border: "1px solid #FFFFFF",
    borderRadius: "40px",
    width: (w as string) ?? "35vw",
    padding: (padding as string) ?? "10px 100px 10px 70px",
    justifyContent: "space-between",
}));

const TitleStyle = {
    fontSize: "96px",
    lineHeight: 1,
    fontFamily: "Orbitron",
    fontWeight: "600",
};

export const AttackResult: FC<Props> = ({ win }) => {
    return (
        <Box color="white">
            <Text
                w="70vw"
                pl="44px"
                pos="absolute"
                top="14vh"
                left="0"
                bg={
                    win
                        ? "linear-gradient(270deg, rgba(253, 220, 45, 0) -6.14%, #FDDC2D 106.26%)"
                        : "linear-gradient(270deg, rgba(171, 171, 171, 0) -6.14%, #ABABAB 106.26%)"
                }
                {...TitleStyle}
            >
                ATTACK {win ? "SUCCESSFUL" : "FAILED"}
            </Text>

            <Box pos="absolute" top="28vh" left="8vw">
                <Box
                    bg={`url(${AttackItem}) no-repeat`}
                    filter={win ? undefined : "grayscale(100%)"}
                    bgSize="cover"
                    w="30vw"
                    pl="100px"
                    mb="16px"
                >
                    <Text fontFamily="Quantico" fontSize="32px">
                        You Consumed
                    </Text>
                </Box>
                <AttackBox win={win}>
                    <Img src={Bomb} w="120px" />
                    <Box
                        fontFamily="Quantico"
                        fontSize="40px"
                        textAlign="center"
                    >
                        <Text>Bomb</Text>
                        <Text color="#8DF6F5">200</Text>
                    </Box>
                </AttackBox>
            </Box>
            <Box pos="absolute" top="50vh" left="8vw">
                <Box
                    bg={`url(${AttackItem}) no-repeat`}
                    filter={win ? undefined : "grayscale(100%)"}
                    bgSize="cover"
                    w="30vw"
                    pl="100px"
                    mb="16px"
                >
                    <Text fontFamily="Quantico" fontSize="32px">
                        You Destroyed
                    </Text>
                </Box>
                <AttackBox win={win}>
                    <Img src={Shield} w="120px" />
                    <Box
                        fontFamily="Quantico"
                        fontSize="40px"
                        textAlign="center"
                    >
                        <Text>Shield</Text>
                        <Text color="#8DF6F5">
                            {win ? 200 : 15}/
                            <Text
                                display="inline"
                                color={win ? undefined : "#FF0000"}
                            >
                                200
                            </Text>
                        </Text>
                    </Box>
                </AttackBox>
            </Box>
            {win ? (
                <Box pos="absolute" top="72vh" left="8vw">
                    <Box
                        bg={`url(${AttackItem}) no-repeat`}
                        filter={win ? undefined : "grayscale(100%)"}
                        bgSize="cover"
                        w="30vw"
                        pl="100px"
                        mb="16px"
                    >
                        <Text fontFamily="Quantico" fontSize="32px">
                            You Get
                        </Text>
                    </Box>
                    <HStack justifyContent="space-between" w="35vw">
                        <AttackBox win={win} w="16.5vw" padding="20px 30px">
                            <Img src={Fuel} w="120px" />
                            <Box
                                fontFamily="Quantico"
                                fontSize="40px"
                                textAlign="center"
                            >
                                <Text>Fuel</Text>
                                <Text color="#8DF6F5">30</Text>
                            </Box>
                        </AttackBox>
                        <AttackBox win={win} w="16.5vw" padding="20px 30px">
                            <Img src={Battery} w="120px" />
                            <Box
                                fontFamily="Quantico"
                                fontSize="40px"
                                textAlign="center"
                            >
                                <Text>Battery</Text>
                                <Text color="#8DF6F5">30</Text>
                            </Box>
                        </AttackBox>
                    </HStack>
                </Box>
            ) : null}
        </Box>
    );
};
