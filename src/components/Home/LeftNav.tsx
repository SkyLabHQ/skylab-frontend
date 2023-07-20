import { Box } from "@chakra-ui/react";
import React from "react";

const LeftNav = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                left: "0",
                top: "10vh",
                zIndex: "100",
            }}
        >
            <Box>
                {[1, 2, 3, 4, 5, 6].map((item) => {
                    return (
                        <Box
                            key={item}
                            sx={{
                                background: "#FFEEB5",
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                marginBottom: "6px",
                            }}
                        ></Box>
                    );
                })}
            </Box>
            <Box
                sx={{
                    border: "2px solid #FFEEB5",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                }}
            ></Box>
            <Box
                sx={{ width: "4px", height: "50vh", background: "#FFEEB5" }}
            ></Box>
            LeftNav
        </Box>
    );
};

export default LeftNav;
