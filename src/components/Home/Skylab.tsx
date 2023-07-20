import { Box, Image } from "@chakra-ui/react";
import React from "react";
import Title from "@/components/Home/assets/skylab-title.png";
import Content from "@/components/Home/assets/skylab-content.png";

const Skylab = () => {
    return (
        <Box
            id="skylab"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Image
                src={Title}
                sx={{ marginTop: "100px", height: "80px" }}
            ></Image>
            <Image
                src={Content}
                sx={{ maxWidth: "1200px", width: "90%", marginTop: "50px" }}
            ></Image>
        </Box>
    );
};

export default Skylab;
