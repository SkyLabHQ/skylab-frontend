import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import diamondBullet from "../assets/diamond-bullet.svg";
import { BANNER_GRADIENT_CARDS } from "../constants";
import GradientCard from "./GradientCard";

const CardBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center" pt="6%">
            <Image src={diamondBullet} />
            <Heading
                fontSize={{ base: "25px", md: "35px", lg: "50px", xl: "60px" }}
                textAlign="center"
            >
                Hey Friends, Welcome to Sky Lab
            </Heading>
            <Box maxW="800px">
                <Stack spacing="30px">
                    <Text
                        textAlign="justify"
                        fontSize={{ base: "14px", md: "20px", xl: "25px" }}
                    >
                        We are building a world of strategies, risks, surprises,
                        and successes defined by the choices we make in the Sky
                        of the metaverse -- Skyverse.
                    </Text>
                    <Box position="relative" h="700px">
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
