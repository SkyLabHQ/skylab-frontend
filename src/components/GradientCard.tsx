import "./GradientCard.css";
import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { motion } from "framer-motion";

export interface GradientCardProps {
    title: string;
    description: string;
    img: string;
    position: Record<string, number>;
}

const GradientCard = ({
    title,
    description,
    img,
    position,
}: GradientCardProps): ReactElement => {
    return (
        <motion.div
            style={{
                padding: "30px 15px",
                borderRadius: "0.75rem",
                border: "2px solid white",
                cursor: "pointer",
                width: "48%",
                height: "230px",
                position: "absolute",
                overflow: "hidden",
                ...position,
            }}
            whileHover={{
                width: "100%",
                height: "500px",
                paddingTop: "150px",
                zIndex: 1000,
            }}
            transition={{ type: "tween" }}
            id="gradient"
        >
            <Stack spacing="15px" alignItems="center" textAlign="center">
                <Box boxSize="50px">
                    <Image src={img} objectFit="cover" w="full" />
                </Box>
                <Stack spacing="30px">
                    <Heading>{title}</Heading>
                    <Text>{description}</Text>
                </Stack>
            </Stack>
        </motion.div>
    );
};

export default GradientCard;
