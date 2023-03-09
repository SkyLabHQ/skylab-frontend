import {
    Box,
    Text,
    HStack,
    Img,
    Portal,
    VStack,
    Input,
    Button,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { FC, useMemo, useState } from "react";

import Fuel from "../../assets/icon-fuel.svg";
import Battery from "../../assets/icon-battery.svg";
import Aviation1 from "../../assets/aviation-1.svg";
import Aviation2 from "../../assets/aviation-2.svg";
import Aviation3 from "../../assets/aviation-3.svg";
import Aviation4 from "../../assets/aviation-4.svg";
import Aviation5 from "../../assets/aviation-5.svg";
import Aviation6 from "../../assets/aviation-6.svg";
import Aviation7 from "../../assets/aviation-7.svg";

export type Props = {
    level: number;
};

type AviationInfo = {
    img: string;
    fuel: number;
    battery: number;
};

const AVIATION_IMAGES = [
    Aviation1,
    Aviation2,
    Aviation3,
    Aviation4,
    Aviation5,
    Aviation6,
    Aviation7,
];

const useAviationInfo = (level: number) => {
    const getRandomNumber = (max: number) => Math.ceil(Math.random() * max);

    return useMemo(
        () =>
            new Array(getRandomNumber(10) + 10).fill({
                img: AVIATION_IMAGES[level - 1],
                fuel: getRandomNumber(200),
                battery: getRandomNumber(200),
            }),
        [],
    );
};

export const AviationBoard: FC<Props> = ({ level }) => {
    const aviationInfo = useAviationInfo(level);
    const [aviationDetail, setAviationDetail] = useState<
        AviationInfo | undefined
    >();

    const flexBasis = level === 1 ? "25%" : "16.66%";

    if (!level) {
        return null;
    }

    const onSelectAviation = (item: AviationInfo) => setAviationDetail(item);

    return (
        <Box
            bg="rgba(104, 62, 53, 0.25)"
            border="5px solid white"
            backdropFilter="blur(5px)"
            borderRadius="20px"
            w="100%"
            h="100%"
        >
            <Box
                padding="24px 32px"
                bg="linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFF761 100%)"
            >
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="36px"
                    color="#FFF761"
                >
                    Your Level {level} Aviation
                </Text>
            </Box>
            <HStack
                padding="20px"
                spacing={0}
                alignItems="flex-start"
                flexWrap="wrap"
                overflowY="scroll"
                h="calc(100% - 104px);"
                css={css`
                    &::-webkit-scrollbar {
                        display: none;
                    }
                    & {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            >
                {aviationInfo.map((item) => (
                    <VStack spacing={0} flexBasis={flexBasis} w="100%">
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            border="2px solid rgba(255, 247, 97, 0.3)"
                            w="100%"
                            h="160px"
                            cursor="pointer"
                            onClick={() => onSelectAviation(item)}
                        >
                            <Img maxW="130px" maxH="110px" src={item.img} />
                        </Box>
                        <Box
                            display="flex"
                            flexDir="column"
                            alignItems="center"
                            justifyContent="center"
                            fontFamily="Quantico"
                            fontSize="24px"
                            color="#FFF761"
                            border="2px solid rgba(255, 247, 97, 0.3)"
                            w="100%"
                            h="100px"
                        >
                            <Text>Fuel: {item.fuel}</Text>
                            <Text>Battery: {item.battery}</Text>
                        </Box>
                    </VStack>
                ))}
            </HStack>
        </Box>
    );
};
