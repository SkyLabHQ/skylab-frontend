import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { isMobile } from "react-device-detect";

import { BANNER_GRADIENT_CARDS } from "../skyConstants";
import GradientCard from "./GradientCard";
import PrimitiveTitle from "@/components/Home/assets/primitive-title.png";
import TitleDecor from "@/components/Home/assets/title-decor.png";
import ProjectMercury from "@/components/Home/assets/project-mercury.svg";
const CardBanner = (): ReactElement => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
            id="primitives"
        >
            <Image src={PrimitiveTitle} />

            <Image src={ProjectMercury}></Image>

            <Box maxW="800px" w="150%" sx={{ marginTop: "30px" }}>
                <Stack spacing="30px">
                    <Box
                        position="relative"
                        h={isMobile ? 1900 : 680}
                        sx={{ display: "flex", alignItems: "center" }}
                    >
                        {BANNER_GRADIENT_CARDS.map((card) => (
                            <GradientCard key={card.title} {...card} />
                        ))}
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default CardBanner;
