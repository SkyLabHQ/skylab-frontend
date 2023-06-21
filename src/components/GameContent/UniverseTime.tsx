import React from "react";
import { Text, Img, VStack, HStack } from "@chakra-ui/react";
import UniverseTimeIcon from "../../assets/universe-time.svg";
import GridBlock from "../../assets/grid-block.svg";
import SumBlock from "../../assets/sum-block.svg";

const timeColor = (time: number, afterTime: number) => {
    if (time === 0) {
        return "#FFF530";
    } else if (time > afterTime) {
        return "#FF3029";
    } else if (time < afterTime) {
        return "#5EE60B";
    } else {
        return "#FFF530";
    }
};

const getLeftPadding = (time: number) => {
    const paddedNumber = time.toString().padStart(10, "0"); // 将数字左边补齐0直到10位
    const formattedNumber = paddedNumber
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedNumber;
};

const UniverseTime = ({
    grid,
    sumTime,
    afterSumTime,
    afterGrid,
}: {
    sumTime: number;
    grid?: number;
    afterSumTime?: number;
    afterGrid?: number;
}) => {
    return (
        <VStack
            bg="rgba(217, 217, 217, 0.2)"
            border="5px solid #FFF761"
            borderRadius="16px"
            w="100%"
            padding="1vh 1vw"
            spacing="1vh"
        >
            <HStack>
                <Img src={UniverseTimeIcon} w="4vw" />
                <Text
                    fontFamily="Orbitron"
                    fontSize="36px"
                    lineHeight="1"
                    ml="12px"
                    fontWeight="600"
                >
                    Universe Time
                </Text>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
                <VStack
                    w="80px"
                    justifyContent="center"
                    sx={{ marginRight: "10px" }}
                >
                    <Img src={GridBlock} w="56px" />
                    <Text
                        fontFamily="Quantico"
                        fontSize="36px"
                        lineHeight="1"
                        color="white"
                    >
                        Grid
                    </Text>
                </VStack>
                <HStack sx={{ flex: 1 }}>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="40px"
                        lineHeight="78px"
                        fontWeight="600"
                        color={timeColor(grid, afterGrid)}
                        border={`2px dashed ${timeColor(grid, afterGrid)}`}
                        borderRadius="10px"
                        padding="0 4px"
                        flex={1}
                        textAlign="right"
                    >
                        {getLeftPadding(grid)}
                    </Text>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        lineHeight="1"
                        fontWeight="600"
                        color="white"
                    >
                        s
                    </Text>
                </HStack>
            </HStack>
            <HStack w="100%" justifyContent="space-between">
                <VStack
                    w="80px"
                    justifyContent="center"
                    sx={{ marginRight: "10px" }}
                >
                    <Img src={SumBlock} w="56px" />
                    <Text
                        fontFamily="Quantico"
                        fontSize="36px"
                        lineHeight="1"
                        color="white"
                    >
                        Sum
                    </Text>
                </VStack>
                <HStack sx={{ flex: 1 }}>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="40px"
                        lineHeight="78px"
                        fontWeight="600"
                        color={timeColor(sumTime, afterSumTime)}
                        border={`2px dashed ${timeColor(
                            sumTime,
                            afterSumTime,
                        )}`}
                        borderRadius="10px"
                        padding="0 4px"
                        flex={1}
                        textAlign="right"
                    >
                        {getLeftPadding(sumTime)}
                    </Text>
                    <Text
                        fontFamily="Orbitron"
                        fontSize="36px"
                        lineHeight="1"
                        fontWeight="600"
                        color="white"
                    >
                        s
                    </Text>
                </HStack>
            </HStack>
        </VStack>
    );
};

export default UniverseTime;
