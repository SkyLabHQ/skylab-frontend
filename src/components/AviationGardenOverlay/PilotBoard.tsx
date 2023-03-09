import { Box, Text, HStack, Img } from "@chakra-ui/react";
import React, { FC, useMemo, useState } from "react";

import Aviation1 from "../../assets/aviation-1.svg";
import Aviation2 from "../../assets/aviation-2.svg";
import Aviation3 from "../../assets/aviation-3.svg";
import { css } from "@emotion/react";

export type Props = {};

const pilots = new Array(30).fill(1).map((_val, index) => {
    if (index % 3 === 0) {
        return {
            img: Aviation1,
            type: "Crypto",
        };
    }
    if (index % 3 === 1) {
        return {
            img: Aviation2,
            type: "Nouns",
        };
    }
    return {
        img: Aviation3,
        type: "Mfer",
    };
});

export const PilotBoard: FC<Props> = () => {
    const [selectedType, setSelectedType] = useState("All");

    const selectedPilots = useMemo(() => {
        if (selectedType === "All") {
            return pilots;
        }
        return pilots.filter((pilot) => pilot.type === selectedType);
    }, [selectedType]);

    return (
        <Box
            bg="rgba(53, 104, 101, 0.25)"
            border="5px solid white"
            backdropFilter="blur(5px)"
            borderRadius="20px"
            w="100%"
            h="100%"
        >
            <Box
                padding="24px 32px"
                bg="linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #13FFDA 100%)"
            >
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="36px"
                    color="#FFF761"
                >
                    Pilots
                </Text>
            </Box>
            <HStack spacing="10px" padding="20px 28px">
                {["All", "Crypto", "Nouns", "Mfer"].map((type) => (
                    <Text
                        key={type}
                        fontFamily="Orbitron"
                        fontWeight="500"
                        fontSize="20px"
                        textDecor="underline"
                        color={selectedType === type ? "#FFF761" : "white"}
                        cursor="pointer"
                        onClick={() => setSelectedType(type)}
                    >
                        {type}
                    </Text>
                ))}
            </HStack>
            <HStack
                padding="16px"
                spacing="0"
                alignItems="flex-start"
                flexWrap="wrap"
                overflowY="scroll"
                h="calc(100% - 174px);"
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
                {selectedPilots.map((pilot) => (
                    <Box flexBasis="25%">
                        <Img src={pilot.img} />
                    </Box>
                ))}
            </HStack>
        </Box>
    );
};
