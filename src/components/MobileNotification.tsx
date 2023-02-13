import { Container, Box, Heading, Img } from "@chakra-ui/react";
import React, { ReactElement } from "react";

import banner from "../assets/home-bg.png";
import Helicopter from "../assets/aviation-9.svg";

export const MobileNotification = (): ReactElement => {
    const helicopterWidth =
        window.innerWidth / 2 > 300 ? 300 : window.innerWidth / 2;
    return (
        <Container
            w="100vw"
            h="100vh"
            bgImg={banner}
            bgSize="cover"
            bgPos="top left"
            bgRepeat="no-repeat"
            p="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                width="90vw"
                maxW="400px"
                bg="rgba(255, 255, 255, 0.7)"
                border="3px solid #FFFFFF"
                borderRadius="20px"
                padding="24px"
                pos="relative"
            >
                <Heading fontSize="20px" textAlign="center" color="black">
                    Please access with PC for better experience.
                </Heading>
                <Img
                    src={Helicopter}
                    pos="absolute"
                    right={-helicopterWidth / 4.5}
                    bottom={-helicopterWidth / 2.5}
                    w={helicopterWidth}
                    transform="rotate(-24deg)"
                />
            </Box>
        </Container>
    );
};
