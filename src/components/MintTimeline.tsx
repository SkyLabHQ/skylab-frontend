import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import mintTimeline from "../assets/mint-timeline.svg";

const MintTimeline = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <Box w="100%" pos="relative">
            <Image src={mintTimeline} objectFit="cover" />
            <Box pos="absolute" w="100%" top="19.5vw">
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
                top="23vw"
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
                top="12vw"
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
                top="23vw"
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

export default MintTimeline;
