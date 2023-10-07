import { Box, Text } from "@chakra-ui/react";
import React from "react";

const BttTimer = ({
    width,
    time,
    show = true,
}: {
    width: string;
    time: string;
    show?: boolean;
}) => {
    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <Box
                sx={{
                    border: show ? "3px solid #FFF" : "3px solid #616161",
                    width: "412px",
                    background: "transparent",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 1px",
                }}
            >
                <Box
                    sx={{
                        height: "16px",
                        width: width,
                        background: "#fff",
                    }}
                ></Box>
            </Box>
            {show && (
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
            )}
        </Box>
    );
};

export default BttTimer;
