import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";
import { GameState } from ".";

const StatusTip = ({
    loading,
    myGameState,
    opGameState,
}: {
    loading?: boolean;
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
                height: `1.5625vw`,
            }}
        >
            <Text sx={{ textAlign: "center" }}>
                {!loading &&
                    opGameState === GameState.LoseBySurrender &&
                    "Opponent quit"}
            </Text>

            {myGameState <= 3 && (
                <>
                    <Text sx={{ textAlign: "center" }}>
                        {loading && "On chain submission..."}
                        {!loading &&
                            myGameState === 1 &&
                            (opGameState === 1 || opGameState === 2) &&
                            "Please input bids for the selected grid"}

                        {!loading &&
                            myGameState === 2 &&
                            opGameState === 1 &&
                            "waiting for opponent to confirm"}
                        {!loading &&
                            myGameState === 2 &&
                            opGameState === 2 &&
                            "Revealing on chain..."}
                        {!loading &&
                            (myGameState === 3 || opGameState === 3) &&
                            "Revealing on chain..."}
                    </Text>
                    {(loading || myGameState === 3 || opGameState === 3) && (
                        <Box
                            sx={{
                                marginLeft: "1.0417vw",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <motion.img
                                src={LoadingIcon}
                                style={{
                                    rotate: 0,
                                    height: `1.5625vw`,
                                }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 3,
                                }}
                                animate={{ rotate: 360 }}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default StatusTip;
