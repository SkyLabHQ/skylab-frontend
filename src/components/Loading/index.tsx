import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";
import React from "react";

const Loading = ({ size = 100 }: { size?: number }) => {
    return (
        <Box
            sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                height: `${size}px`,
                width: `${size}px`,
                zIndex: 999,
            }}
        >
            <motion.img
                src={LoadingIcon}
                style={{
                    rotate: 0,
                    height: `${size}px`,
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 3,
                }}
                animate={{ rotate: 360 }}
            />
        </Box>
    );
};

export default Loading;
