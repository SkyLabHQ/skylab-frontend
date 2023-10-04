import {
    Box,
    Container,
    Image as ChakraImage,
    keyframes,
    Text,
} from "@chakra-ui/react";

import React, { ReactElement } from "react";
import TBtIcon from "@/components/Home/assets/trailblazerBt.jpg";

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
                    backgroundImage: `url(${TBtIcon}) `,
                    width: "400px",
                    height: "115",
                    fontWeight: 600,
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: "20px",
                    border: "3px solid #FDE1B9",
                    textShadow: "5px 4px 4px #0FBFB6",
                    textAlign: "center",
                    fontSize: "36px",
                    color: "#fde189",
                    background:
                        "linear-gradient(90deg, #47807C -2.24%, #195057 112.59%)",
                    "&:hover": {
                        background:
                            "linear-gradient(to bottom right, #195057, #23B0AE)",
                        boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.50)",
                    },
                }}
                onClick={() => {
                    navigate("/activities");
                }}
            >
                <ChakraImage
                    src={TBtIcon}
                    sx={{
                        height: "115",
                        position: "absolute",
                        left: "-70px",
                        top: "-30px",
                    }}
                ></ChakraImage>
                <Text>Bid Tac Toe</Text>
                <Text>Tournament</Text>
            </Box>

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
