import { Box, Text } from "@chakra-ui/react";
import React from "react";

const BttTimer = ({ width, time }: { width: string; time: string }) => {
    return (
        <Box>
            <Box
                sx={{
                    border: "3px solid #FFF",
                    width: "412px",
                    background: "transparent",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 1px",
                }}
            >
                <Box
                    sx={{
                        height: "24px",
                        width: width,
                        background: "#fff",
                    }}
                ></Box>
            </Box>
            <Text
                sx={{
                    fontSize: "24px",
                    position: "absolute",
                    right: "-100px",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            >
                {time}
            </Text>
        </Box>
    );
};

export default BttTimer;
