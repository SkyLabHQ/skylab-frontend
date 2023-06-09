import {
    Box,
    Text,
    Image,
    HStack,
    VStack,
    useClipboard,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import FuelIcon from "@/assets/icon-fuel.svg";
import BatteryIcon from "@/assets/icon-battery.svg";
type InfoProps = {
    id: string;
    time: number;
    avatar: string;
    usedResources?: {
        fuel: number;
        battery: number;
    };
};

type Props = {
    mine: InfoProps;
    opponent: InfoProps;
    win: boolean;
    showRetreat?: boolean;
};

export const Info: FC<Props> = ({ showRetreat, win, mine, opponent }) => {
    const [copyText, setCopyText] = useState("");
    const { onCopy } = useClipboard(copyText);

    const onClick = (id: string) => {
        setCopyText(id);
    };

    useEffect(() => {
        if (copyText) {
            onCopy();
        }
    }, [copyText]);

    return (
        <Box>
            <HStack spacing="0" sx={{ alignItems: "flex-start" }}>
                <Box>
                    <Box sx={{ display: "flex" }}>
                        <Box
                            bg={
                                win
                                    ? "radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FF8413 100%)"
                                    : "#D9D9D9"
                            }
                            border="5px solid #FFF761"
                            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                            w="6vw"
                            h="6vw"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Image
                                w="5.6vw"
                                src={mine.avatar}
                                filter="drop-shadow(0px 2px 0px #FFF500)"
                            />
                        </Box>
                        <Box
                            w="12vw"
                            h="6vw"
                            pl="16px"
                            bg="linear-gradient(90deg, rgba(255, 208, 39, 0.88) 37.77%, rgba(232, 62, 68, 0) 100%)"
                        >
                            <VStack
                                fontFamily="Quantico"
                                fontSize="30px"
                                alignItems="flex-start"
                                justifyContent="space-between"
                                h="100%"
                                onClick={() => onClick(mine.id)}
                            >
                                <Text>{mine.id} </Text>
                                <Text>
                                    {mine.time == 0 ? "N/A" : mine.time}s
                                </Text>
                            </VStack>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            color: "#FFF761",
                            fontSize: "24px",
                            marginTop: "1vh",
                            width: "18vw",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Image src={FuelIcon} width="3vw"></Image>
                            <Text sx={{ margin: "0 10px" }}>fuel</Text>
                            <Text>
                                {mine.time == 0
                                    ? "N/A"
                                    : mine?.usedResources?.fuel}
                            </Text>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Image src={BatteryIcon} width="3vw"></Image>
                            <Text sx={{ margin: "0 10px" }}>battery</Text>
                            <Text>
                                {mine.time == 0
                                    ? "N/A"
                                    : mine?.usedResources?.battery}
                            </Text>
                        </Box>
                    </Box>
                </Box>

                <Text
                    fontFamily="Orbitron"
                    fontSize="32px"
                    fontWeight="600"
                    paddingTop="20px"
                >
                    V.S.
                </Text>
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                        }}
                    >
                        <Box
                            w="12vw"
                            h="6vw"
                            pr="16px"
                            bg="linear-gradient(270deg, #BCBBBE 14.63%, rgba(255, 255, 255, 0) 100%)"
                        >
                            <VStack
                                fontFamily="Quantico"
                                fontSize="30px"
                                alignItems="flex-end"
                                justifyContent="space-between"
                                h="100%"
                                onClick={() => onClick(opponent.id)}
                            >
                                <Text>{opponent.id}</Text>
                                <Text>
                                    {opponent.time == 0 ? "N/A" : opponent.time}
                                    s
                                </Text>
                            </VStack>
                        </Box>
                        <Box
                            bg={
                                win
                                    ? "#D9D9D9"
                                    : "radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FF8413 100%)"
                            }
                            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                            w="6vw"
                            h="6vw"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Image
                                w="108px"
                                src={opponent.avatar}
                                filter="grayscale(100%)"
                                transform="rotate(180deg)"
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            color: "white",
                            fontSize: "24px",
                            marginTop: "1vh",
                            width: "18vw",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Text sx={{ marginRight: "10px" }}>fuel</Text>
                            <Text sx={{ marginRight: "10px" }}>
                                {opponent.time == 0
                                    ? "N/A"
                                    : opponent?.usedResources?.fuel}
                            </Text>
                            <Image src={FuelIcon} width="3vw"></Image>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Text sx={{ marginRight: "10px" }}>battery</Text>
                            <Text sx={{ marginRight: "10px" }}>
                                {opponent.time == 0
                                    ? "N/A"
                                    : opponent?.usedResources?.battery}
                            </Text>
                            <Image src={BatteryIcon} width="3vw"></Image>
                        </Box>
                    </Box>
                </Box>
            </HStack>
            <Box>
                {showRetreat && (
                    <Text sx={{ fontSize: "32px", textAlign: "center" }}>
                        You are too intimidating that your opponent surrendered.
                    </Text>
                )}
            </Box>
        </Box>
    );
};
