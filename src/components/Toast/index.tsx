import { Box, Image } from "@chakra-ui/react";
import React from "react";
import Close from "./assets/close.svg";

const SkyToast = ({
    message,
    onClose,
    isCloseAble,
}: {
    message: string;
    onClose?: () => void;
    isCloseAble?: boolean;
}) => {
    return (
        <Box
            color="white"
            p={3}
            bg="#ABABAB"
            borderRadius="20px"
            fontSize="30px"
            sx={{
                maxWidth: "40vw",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                breakword: "break-all",
                position: "relative",
            }}
        >
            {message}
            {isCloseAble && (
                <Image
                    src={Close}
                    sx={{
                        position: "absolute",
                        right: "10px",
                        top: "10px",
                        width: "20px",
                        cursor: "pointer",
                    }}
                    onClick={onClose}
                ></Image>
            )}
        </Box>
    );
};

export default SkyToast;
