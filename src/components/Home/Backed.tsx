import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";

import BackedTitle from "@/components/Home/assets/backed-title.png";
import CssB from "@/components/Home/assets/cssb.svg";
const Backed = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            <Image src={BackedTitle} height="80px"></Image>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "50px",
                }}
            >
                <Box
                    sx={{
                        width: "400px",
                        height: "280px",
                        background: "#D9D9D980",
                        borderRadius: "29px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10vw",
                    }}
                >
                    <Image src={CssB} height="80%"></Image>
                </Box>
                <Box
                    sx={{
                        width: "400px",
                        height: "280px",
                        background: "#D9D9D980",
                        borderRadius: "29px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        sx={{
                            color: "#FDE1B9",
                            fontSize: "40px",
                            fontWeight: "bold",
                        }}
                    >
                        Selected Angels
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};

export default Backed;
