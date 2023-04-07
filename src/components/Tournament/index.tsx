import { Box, HStack, Img, Text, VStack } from "@chakra-ui/react";
import React, { ReactElement, Fragment } from "react";

import TournamentLeft from "../../assets/tournament-left.svg";
import TournamentRight from "../../assets/tournament-right.svg";
import TournamentTop from "../../assets/tournament-top.svg";
import TournamentBottom from "../../assets/tournament-bottom.svg";
import TournamentWinningFire from "../../assets/tournament-winning-fire.svg";
import TournamentDivider from "../../assets/tournament-divider.svg";
import Aviation from "../../assets/aviation-1.svg";

const config = new Array(8).fill({
    level: 2,
    img: Aviation,
    owner: "Test",
});

export const Tournament = (): ReactElement => {
    return (
        <Box
            w="90vw"
            h="84vh"
            pos="absolute"
            left="5vw"
            top="8vh"
            bg="rgba(217, 217, 217, 0.2)"
            border="3px solid #FFF761"
            backdropFilter="blur(7.5px)"
            borderRadius="16px"
        >
            <Img
                w="18vw"
                pos="absolute"
                left="-7vw"
                top="0"
                src={TournamentLeft}
            />
            <Img
                w="20vw"
                pos="absolute"
                right="-4vw"
                top="2vh"
                src={TournamentRight}
            />
            <Img
                w="8vw"
                pos="absolute"
                left="8vw"
                top="-6vh"
                src={TournamentTop}
            />
            <Img
                w="7vw"
                pos="absolute"
                right="3vw"
                bottom="-6vh"
                src={TournamentBottom}
            />
            <Box
                w="36vw"
                h="68vh"
                pos="absolute"
                left="7vw"
                top="10vh"
                bg={`url(${TournamentWinningFire})`}
                fontFamily="Orbitron"
                fontWeight="900"
                fontSize="48px"
                color="black"
            >
                <Text
                    w="100%"
                    textAlign="center"
                    pos="absolute"
                    left="0"
                    top="1.5vh"
                >
                    Round 10
                </Text>
                <Text
                    w="100%"
                    textAlign="center"
                    pos="absolute"
                    left="0"
                    bottom="6vh"
                >
                    2023 APR 01
                </Text>
            </Box>
            <VStack
                w="35vw"
                spacing="4px"
                pos="absolute"
                right="12vw"
                top="3vh"
            >
                {config.map((item, index) => (
                    <Fragment>
                        <HStack
                            w="100%"
                            spacing="1.5vw"
                            justifyContent="center"
                        >
                            <Text
                                w="2vw"
                                textAlign="right"
                                fontFamily="Orbitron"
                                color={index < 3 ? "#FFF761" : "white"}
                                fontSize="64px"
                                fontWeight="500"
                            >
                                {index + 1}
                            </Text>
                            <Box
                                w="90px"
                                h="90px"
                                boxShadow={
                                    index < 3
                                        ? "0px 0px 10px #FFF761"
                                        : undefined
                                }
                                bg={
                                    index < 3
                                        ? "radial-gradient(50% 50% at 50% 50%, #7D7144 0%, #000000 100%)"
                                        : "#191823"
                                }
                                border={
                                    index < 3
                                        ? "4px solid #FFC110"
                                        : "1px solid #FFFFFF"
                                }
                                borderRadius="10px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Img src={item.img} w="90%" />
                            </Box>
                            <VStack spacing="4px">
                                <Text
                                    fontFamily="Orbitron"
                                    color="white"
                                    fontSize="36px"
                                    fontWeight="500"
                                >
                                    Level {item.level}
                                </Text>
                                <Text
                                    fontFamily="Orbitron"
                                    color="white"
                                    fontSize="24px"
                                    fontWeight="500"
                                >
                                    owner: {item.owner}
                                </Text>
                            </VStack>
                        </HStack>
                        {index !== config.length - 1 ? (
                            <Img src={TournamentDivider} w="100%" />
                        ) : null}
                    </Fragment>
                ))}
            </VStack>
        </Box>
    );
};
