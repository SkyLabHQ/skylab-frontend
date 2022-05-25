import { Box, Image, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import timeline from "../assets/timeline.svg";

const Timeline = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Image src={timeline} />
            <Box
                pos="absolute"
                top="4vw"
                left="47%"
                transform="rotate(8.5deg)"
                whiteSpace="nowrap"
            >
                <Text fontSize="2.5vw">{t("publicMint")} (2-8)</Text>
            </Box>
            <Box
                pos="absolute"
                top="11vw"
                left="11%"
                transform="rotate(8.5deg)"
                whiteSpace="nowrap"
            >
                <Text fontSize="2.5vw">{t("privateMint")} (2-8)</Text>
            </Box>
            <Box
                pos="absolute"
                top="16vw"
                left="50%"
                transform="rotate(8.5deg)"
                whiteSpace="nowrap"
            >
                <Text fontSize="2.5vw">{t("mechanismReveal")} (1 ∞)</Text>
            </Box>
            <Box
                pos="absolute"
                top="7vw"
                left="20.5%"
                transform="rotate(8.5deg)"
                whiteSpace="nowrap"
                color="#237EFF"
            >
                <Text fontSize="2vw">6/21</Text>
            </Box>
            <Box
                pos="absolute"
                top="10.2vw"
                left="53.2%"
                transform="rotate(8.5deg)"
                whiteSpace="nowrap"
                color="#237EFF"
            >
                <Text fontSize="2vw">6/28</Text>
            </Box>
            <Box
                pos="absolute"
                top="13.9vw"
                left="93.6%"
                transform="rotate(8.5deg)"
                whiteSpace="nowrap"
                color="#237EFF"
            >
                <Text fontSize="2vw">8/31</Text>
            </Box>
        </React.Fragment>
    );
};

export default Timeline;
