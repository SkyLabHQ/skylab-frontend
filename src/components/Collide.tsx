import { Box, Text } from "@chakra-ui/react";
import React, { FC } from "react";

import CollideBackground from "../assets/collide.png";

type Props = {
    onNext: () => void;
};

export const Collide: FC<Props> = ({ onNext }) => {
    return (
        <Box
            pos="relative"
            bgImage={CollideBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
        >
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="1vw"
                bottom="2.5vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onNext}
            >
                Next
            </Text>
        </Box>
    );
};
