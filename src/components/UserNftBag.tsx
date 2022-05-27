import { Box, Heading, Image, Stack } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import Carousel from "./Carousel";
import box from "../assets/bag-box.svg";

interface UserNftBagProps {
    name: string;
}

const UserNftBag = ({ name }: UserNftBagProps): ReactElement => {
    return (
        <Box pt="10px" pos="relative" w="100%">
            <Image src={box} w="100%" />
            <Stack
                alignItems="center"
                pos="absolute"
                top="10vw"
                w="100%"
                spacing="1vw"
            >
                <Heading fontSize="5vw">{name}</Heading>
                <Box w="100%" h="26vw">
                    <Carousel />
                </Box>
            </Stack>
        </Box>
    );
};

export default UserNftBag;
