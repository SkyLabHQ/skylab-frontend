import {
    Box,
    Center,
    Flex,
    Heading,
    HStack,
    Image,
    Text,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import mintTimeline from "../assets/mint-timeline.svg";

const Mint = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <Box mt={isMobile ? "150px" : "100px"} pos="relative">
            <Center>
                <Heading
                    pt="3vw"
                    as="h1"
                    fontSize="7.5vw"
                    letterSpacing="wider"
                >
                    {t("timeline")}
                </Heading>
            </Center>
            <Box w="100%" top="7vw" pos="absolute">
                <Image src={mintTimeline} objectFit="cover" />
            </Box>
            <Box pos="absolute" w="100%" top="27vw">
                <HStack ml="9%" spacing="24.8%" color="#237EFF" fontSize="2vw">
                    <Text>6/21</Text>
                    <HStack w="100%" spacing="45%">
                        <Text>6/28</Text>
                        <Text>8/31</Text>
                    </HStack>
                </HStack>
            </Box>
            <Flex
                justifyContent="center"
                pos="absolute"
                top="30vw"
                left="0.5%"
                w="20vw"
                whiteSpace="nowrap"
            >
                <Text
                    display="inline"
                    fontSize="2.5vw"
                    textShadow="5px 5px 10px #237EFF"
                >
                    {t("privateMint")} (2-8)
                </Text>
            </Flex>
            <Flex
                justifyContent="center"
                pos="absolute"
                top="20vw"
                left="26%"
                w="20vw"
                whiteSpace="nowrap"
            >
                <Text display="inline" fontSize="2.5vw">
                    {t("publicMint")} (2-8)
                </Text>
            </Flex>
            <Flex
                justifyContent="center"
                pos="absolute"
                top="30vw"
                left="55%"
                w="20vw"
                whiteSpace="nowrap"
            >
                <Text display="inline" fontSize="2.5vw">
                    {t("mechanismReveal")} (1 ∞)
                </Text>
            </Flex>
        </Box>
    );
};

export default Mint;
