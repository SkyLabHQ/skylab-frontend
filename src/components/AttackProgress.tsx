import { Box, HStack, Text } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

import AttackItem from "../assets/attack-item.svg";
import styled from "@emotion/styled";

type Props = {
    percentage: number;
};

const AttackBox = styled(HStack)({
    background:
        "radial-gradient(60.21% 60.21% at 50% 50%, rgba(233, 175, 55, 0.4) 0%, rgba(99, 238, 205, 0.4) 100%)",
    border: "5px solid #FFFFFF",
    borderRadius: "40px",
    width: "40vw",
    padding: "29px 20px 32px 60px",
    justifyContent: "space-between",
});

export const AttackProgress: FC<Props> = ({ percentage }) => {
    const [number, setNumber] = useState(0);

    useEffect(() => {
        if (!percentage || number >= percentage) {
            return;
        }
        const timeoutId = setTimeout(() => {
            setNumber((number) => number + 1);
        }, 50);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [percentage, number]);

    return (
        <Box>
            <Box pos="absolute" top="12vh" left="10vw">
                <Box
                    bg={`url(${AttackItem}) no-repeat`}
                    bgSize="cover"
                    w="30vw"
                    pl="100px"
                    mb="16px"
                >
                    <Text fontFamily="Quantico" fontSize="32px">
                        Attack Progress
                    </Text>
                </Box>
                <AttackBox>
                    <Box
                        pos="relative"
                        bg="rgba(217, 217, 217, 0.8)"
                        border="2px solid #13FFDA"
                        borderRadius="20px"
                        w="21vw"
                        h="32px"
                    >
                        <Box
                            w={`${number}%`}
                            h="30px"
                            pos="absolute"
                            bg="#13FFDA"
                            borderRadius="20px"
                        ></Box>
                    </Box>
                    <Text fontFamily="Quantico" fontSize="96px" color="#8DF6F5">
                        {number}%
                    </Text>
                </AttackBox>
            </Box>
        </Box>
    );
};
