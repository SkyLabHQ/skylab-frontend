import { Box, HStack, Img, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import SectionTitleStart from "./assets/section-title-start.svg";
import OilBlue from "./assets/oil-blue.svg";
import Battery from "./assets/battery.svg";
import AttackButton from "./assets/attack-button.svg";

import Tip from "./assets/tip.svg";

interface ChildProps {
    onNextRound: () => void;
}

const SpendRound = ({ onNextRound }: ChildProps) => {
    return (
        <Box fontFamily="Quantico">
            <Text
                fontSize="88px"
                pos="absolute"
                left="2vw"
                top="1vh"
                zIndex={100}
                fontWeight={800}
            >
                Trailblazer
            </Text>

            <Box pos="absolute" top="24.1vh" left="10.8vw" zIndex={100}>
                <HStack
                    bg={`url(${SectionTitleStart})`}
                    w="575px"
                    height="35px"
                    pl={"90px"}
                >
                    <Text fontWeight={400} fontSize="40px" lineHeight="35px">
                        Spend
                    </Text>
                    <Img src={Tip} cursor="pointer"></Img>
                </HStack>
                <Box
                    marginTop="23px"
                    w="673px"
                    height="236px"
                    bg="radial-gradient(60.21% 60.21% at 50% 50%, rgba(233, 175, 55, 0.4) 0%, rgba(99, 238, 205, 0.4) 100%)"
                    border="1px solid #fff"
                    borderRadius="40px"
                    padding=" 0px 119px 0 90px"
                >
                    <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        h={"100%"}
                    >
                        <VStack alignItems={"center"}>
                            <Img src={OilBlue} w="86px"></Img>
                            <Text
                                fontSize={"40px"}
                                fontWeight="400"
                                marginTop="18px"
                            >
                                Fuel
                            </Text>
                        </VStack>
                        <Box
                            bg={" rgba(217, 217, 217, 0.5)"}
                            border="3px solid #FFF"
                            borderRadius="10px"
                            w="213px"
                            h="142px"
                        >
                            <Text
                                fontSize={"96px"}
                                color="#8DF6F5"
                                fontWeight={400}
                                textAlign="center"
                            >
                                104
                            </Text>
                        </Box>
                    </HStack>
                </Box>
                <Box
                    marginTop="50px"
                    w="673px"
                    height="236px"
                    bg="radial-gradient(60.21% 60.21% at 50% 50%, rgba(233, 175, 55, 0.4) 0%, rgba(99, 238, 205, 0.4) 100%)"
                    border="1px solid #fff"
                    borderRadius="40px"
                    padding=" 0px 119px 0 90px"
                >
                    <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        h={"100%"}
                    >
                        <VStack alignItems={"center"}>
                            <Img src={Battery} w="86px"></Img>
                            <Text
                                fontSize={"40px"}
                                fontWeight="400"
                                marginTop="18px"
                            >
                                Battery
                            </Text>
                        </VStack>
                        <Box
                            bg={" rgba(217, 217, 217, 0.5)"}
                            border="3px solid #FFF"
                            borderRadius="10px"
                            w="213px"
                            h="142px"
                        >
                            <Text
                                fontSize={"96px"}
                                color="#8DF6F5"
                                fontWeight={400}
                                textAlign="center"
                            >
                                104
                            </Text>
                        </Box>
                    </HStack>
                </Box>
                <Box marginTop="77px">
                    <Img
                        src={AttackButton}
                        cursor="pointer"
                        onClick={onNextRound}
                    ></Img>
                </Box>
            </Box>
        </Box>
    );
};

export default SpendRound;
