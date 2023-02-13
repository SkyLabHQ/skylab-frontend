import { Box, Img, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import CollideBackground from "../assets/collide.png";
import TutorialBulb from "../assets/tutorial-bulb.svg";

type Props = {
    onNext: () => void;
};

export const Collide: FC<Props> = ({ onNext }) => {
    const navigate = useNavigate();

    return (
        <Box
            pos="relative"
            bgImage={CollideBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
        >
            <Box
                pos="absolute"
                left="24px"
                top="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                cursor="pointer"
                onClick={() => navigate("/tutorial")}
            >
                <Img src={TutorialBulb} w="40px" />
                <Text
                    color="#BEBEC0"
                    fontSize="24px"
                    fontWeight={600}
                    fontFamily="Orbitron"
                    marginTop="12px"
                >
                    Tutorial
                </Text>
            </Box>
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
