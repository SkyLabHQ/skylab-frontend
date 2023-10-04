import {
    Box,
    Container,
    Image as ChakraImage,
    keyframes,
    Text,
} from "@chakra-ui/react";

import React, { ReactElement } from "react";

import TBtIcon from "@/components/Home/assets/trailblazerBt.svg";
import TBtHoverIcon from "@/components/Home/assets/trailblazerBt-hover.svg";

import { useNavigate } from "react-router-dom";
const move = keyframes`
    0% {
        opacity:0
    }
    
    100% {
        opacity: 1;
    }
`;
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
                fontFamily: "Orbitron",
            }}
        >
            <Text
                sx={{
                    fontSize: "158px",
                    color: "rgb(253,225,185)",
                    fontWeight: 600,
                }}
            >
                Sky Lab
            </Text>
            <Box
                sx={{
                    background: `url(${TBtIcon})`,
                    width: "550px",
                    height: "146px",
                    fontWeight: 600,
                    cursor: "pointer",
                    backgroundSize: "100% 100%",
                    "&:hover": {
                        background: `url(${TBtHoverIcon})`,
                        backgroundSize: "100% 100%",
                    },
                }}
            ></Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "30px",
                }}
                animation={`${move} 1s linear infinite alternate`}
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
