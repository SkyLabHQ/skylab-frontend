import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { isMobile } from "react-device-detect";

import diamondBullet from "../assets/diamond-bullet.svg";
import { BANNER_GRADIENT_CARDS } from "../skyConstants";
import GradientCard from "./GradientCard";

const CardBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center" pt="6%">
            <Image src={diamondBullet} />
            <Heading
                fontSize={{ base: "25px", md: "35px", lg: "50px", xl: "60px" }}
                textAlign="center"
            >
                Now: Project Mercury
            </Heading>
            <Text
                fontSize={{
                    base: "16px",
                    sm: "21px",
                    md: "24px",
                    lg: "30px",
                }}
            >
                PvP Strategy Games
            </Text>
            <Box maxW="800px" w="150%">
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
        </Stack>
    );
};

export default CardBanner;
