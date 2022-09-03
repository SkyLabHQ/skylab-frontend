import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import mintTimeline from "../assets/mint-timeline.svg";

const MintTimeline = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <Box w="100%" pos="relative" overflow="hidden">
            <Box w="100vw">
                <Image src={mintTimeline} objectFit="cover" w="full" />
            </Box>
            <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                pos="absolute"
                top="22vw"
                left="40%"
                w="20vw"
                whiteSpace="nowrap"
            >
                <Text
                    display="inline"
                    fontSize="2.5vw"
                    textShadow="0px 4px 4px #FF2927"
                >
                    Q4 2022
                </Text>
                <Text
                    display="inline"
                    fontSize="2.5vw"
                    textShadow="0px 4px 4px #FF2927"
                >
                    Season 1 Launch
                </Text>
            </Flex>
        </Box>
    );
};

export default MintTimeline;
