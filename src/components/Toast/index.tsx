import { Box } from "@chakra-ui/react";
import React from "react";

const SkyToast = ({ message }: { message: string }) => {
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
            }}
        >
            {message}
        </Box>
    );
};

export default SkyToast;
