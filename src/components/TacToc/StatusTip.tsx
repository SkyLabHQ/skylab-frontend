import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Loading from "../Loading";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";

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
        <Box
            sx={{
                position: "absolute",
                left: "50%",
                top: "100px",
                transform: "translateX(-50%)",
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
                    "Revealling on chain..."}
                {!loading &&
                    (myGameState === 3 || opGameState === 3) &&
                    "Revealling on chain..."}
            </Text>
            {myGameState === 3 ||
                (opGameState === 3 && (
                    <Box
                        sx={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <motion.img
                            src={LoadingIcon}
                            style={{
                                rotate: 0,
                                height: `40px`,
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
