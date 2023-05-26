import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";
import React from "react";

const Loading = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                height: "100px",
                width: "100px",
                zIndex: 999,
            }}
        >
            <motion.img
                src={LoadingIcon}
                style={{
                    rotate: 0,
                    width: "100px",
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 2,
                }}
                animate={{ rotate: 360 }}
            />
        </Box>
    );
};

export default Loading;
