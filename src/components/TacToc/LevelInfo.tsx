import { Box, Text, Image } from "@chakra-ui/react";
import React from "react";
import TipIcon from "./assets/tip.svg";

const LevelInfo = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                left: "20px",
                top: "20px",
            }}
        >
            <Text
                sx={{
                    fontSize: "28px",
                    fontWeight: "700",
                }}
            >
                Level 1
            </Text>

            <Text
                sx={{
                    fontSize: "20px",
                    marginTop: "20px",
                }}
            >
                Discount Rate=0.5
                <Image
                    src={TipIcon}
                    sx={{
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginLeft: "5px",
                    }}
                ></Image>
            </Text>
        </Box>
    );
};

export default LevelInfo;
