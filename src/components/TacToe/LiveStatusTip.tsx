import React from "react";
import { Box, Text } from "@chakra-ui/react";

const LiveStatusTip = ({
    myGameState,
    opGameState,
}: {
    myGameState: number;
    opGameState: number;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8333vw",
            }}
        >
            <Text sx={{ textAlign: "center" }}>
                {(myGameState === 1 || opGameState === 1) && "Players bidding."}

                {(myGameState === 3 ||
                    opGameState === 3 ||
                    (myGameState === 2 && opGameState === 2)) &&
                    "Revealing on chain."}
            </Text>
        </Box>
    );
};

export default LiveStatusTip;
