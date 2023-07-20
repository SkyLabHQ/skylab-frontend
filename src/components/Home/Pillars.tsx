import { Heading, Image, Box, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import PillarsContent from "@/components/Home/assets/pillars.png";

const Pillars = (): ReactElement => {
    return (
        <Box
            alignItems="center"
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Image
                src={PillarsContent}
                sx={{
                    width: "90%",
                    maxWidth: "1200px",
                }}
            />
        </Box>
    );
};

export default Pillars;
