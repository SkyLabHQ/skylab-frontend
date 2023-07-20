import { Heading, Image, Box, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import Primitives from "@/components/Home/assets/primitive.png";

const ConceptBanner = (): ReactElement => {
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
                src={Primitives}
                sx={{
                    width: "90%",
                    maxWidth: "1500px",
                }}
            />
        </Box>
    );
};

export default ConceptBanner;
