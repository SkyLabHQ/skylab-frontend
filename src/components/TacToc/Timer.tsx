import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Timer = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                    sx={{
                        border: "3px solid #FFF",
                        width: "656px",
                        background: "#000",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "0 7px",
                    }}
                >
                    <Box
                        sx={{
                            height: "25px",
                            width: "100px",
                            background: "#fff",
                        }}
                    ></Box>
                </Box>
                <Text sx={{ fontSize: "36px" }}>00:30</Text>
            </Box>
        </Box>
    );
};

export default Timer;
