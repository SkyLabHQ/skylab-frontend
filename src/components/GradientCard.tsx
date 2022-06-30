import "./GradientCard.css";
import { Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";

export interface GradientCardProps {
    title: string;
    description: string;
    img: string;
}

const GradientCard = ({
    title,
    description,
    img,
}: GradientCardProps): ReactElement => {
    return (
        <Box
            px="15px"
            py="30px"
            borderRadius="xl"
            borderColor="white"
            borderWidth="2px"
            cursor="pointer"
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
        </Box>
    );
};

export default GradientCard;
