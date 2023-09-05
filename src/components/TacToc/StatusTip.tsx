import React from "react";
import { Box, Text } from "@chakra-ui/react";

const StatusTip = ({
    loading,
    myGameState,
    opGameState,
}: {
    loading: boolean;
    myGameState: number;
    opGameState: number;
}) => {
    return (
        <Text
            sx={{
                position: "absolute",
                left: "50%",
                top: "100px",
                transform: "translateX(-50%)",
            }}
        >
            {loading && "On chain submission..."}
            {!loading &&
                myGameState === 2 &&
                opGameState === 1 &&
                "waiting for opponent to confirm"}
            {!loading &&
                myGameState === 2 &&
                opGameState === 2 &&
                "Revealling on chain..."}
            {!loading &&
                myGameState === 3 &&
                opGameState === 2 &&
                "Revealling on chain..."}
        </Text>
    );
};

export default StatusTip;
