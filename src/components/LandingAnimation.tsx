import { Box, Container, Flex, Heading, Image, Text } from "@chakra-ui/react";

import React, { ReactElement } from "react";

import TBtIcon from "@/components/Home/assets/trailblazerBt.svg";
import { useNavigate } from "react-router-dom";
import DecorBg from "@/components/Home/assets/decor.gif";

const LandingAnimation = (): ReactElement => {
    const navigate = useNavigate();

    return (
        <Container
            overflow="hidden"
            pos="relative"
            left="50%"
            m="auto"
            maxW="100%"
            h="100vh"
            transform="translateX(-50%)"
            whiteSpace="nowrap"
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                paddingTop: "14vh",
                backgroundImage: `url(${DecorBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Text
                sx={{
                    fontSize: "120px",
                    color: "rgb(253,225,185)",
                    fontWeight: 600,
                }}
            >
                Sky Lab
            </Text>
            <Image
                sx={{ cursor: "pointer" }}
                onClick={() => {
                    navigate("/trailblazer");
                }}
                src={TBtIcon}
            ></Image>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        border: "2px solid rgb(253,225,185)",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "4px",
                    }}
                >
                    <Box
                        sx={{
                            width: "12px",
                            height: "12px",
                            background: "rgb(253,225,185)",
                            borderRadius: "50%",
                        }}
                    ></Box>
                </Box>
                <Text
                    sx={{
                        color: "rgb(253,225,185)",
                        fontSize: "24px",
                        fontWeight: "600",
                    }}
                >
                    Live
                </Text>
            </Box>
        </Container>
    );
};

export default LandingAnimation;
