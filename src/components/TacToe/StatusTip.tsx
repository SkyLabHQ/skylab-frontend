import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";

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
            }}
        >
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
            {loading ||
                myGameState === 3 ||
                (opGameState === 3 && (
                    <Box
                        sx={{
                            marginLeft: "20px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <motion.img
                            src={LoadingIcon}
                            style={{
                                rotate: 0,
                                height: `30px`,
                            }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 3,
                            }}
                            animate={{ rotate: 360 }}
                        />
                    </Box>
                ))}
        </Box>
    );
};

export default StatusTip;
