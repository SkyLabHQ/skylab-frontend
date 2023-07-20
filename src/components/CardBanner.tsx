import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { isMobile } from "react-device-detect";

import { BANNER_GRADIENT_CARDS } from "../skyConstants";
import GradientCard from "./GradientCard";
import PrimitiveTitle from "@/components/Home/assets/primitive-title.png";
import TitleDecor from "@/components/Home/assets/title-decor.png";
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image src={TitleDecor} sx={{}}></Image>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        margin: "0 10px",
                    }}
                >
                    <Box
                        sx={{
                            border: "2px solid #fde189",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "8px",
                        }}
                    >
                        <Box
                            sx={{
                                width: "18px",
                                height: "18px",
                                background: "#fde189",
                                borderRadius: "50%",
                            }}
                        ></Box>
                    </Box>
                    <Text
                        sx={{
                            color: "#fde189",
                            fontSize: "48px",
                            fontFamily: "Orbitron",
                            fontWeight: 600,
                        }}
                    >
                        Live: Project Mercury
                    </Text>
                </Box>
                <Image src={TitleDecor} sx={{}}></Image>
            </Box>

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
