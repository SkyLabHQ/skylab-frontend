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
};

export const Info: FC<Props> = ({ win, mine, opponent }) => {
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
        <HStack spacing="0" h="116px">
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
                        w="116px"
                        h="116px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Image
                            w="108px"
                            src={mine.avatar}
                            filter="drop-shadow(0px 2px 0px #FFF500)"
                        />
                    </Box>
                    <Box
                        w="300px"
                        h="116px"
                        pl="16px"
                        bg="linear-gradient(90deg, rgba(255, 208, 39, 0.88) 37.77%, rgba(232, 62, 68, 0) 100%)"
                    >
                        <VStack
                            spacing="4px"
                            fontFamily="Quantico"
                            fontSize="36px"
                            alignItems="flex-start"
                            onClick={() => onClick(mine.id)}
                        >
                            <Text>{mine.id}</Text>
                            <Text>{mine.time}s</Text>
                        </VStack>
                    </Box>
                </Box>
                <Box
                    sx={{
                        color: "#FFF761",
                        fontSize: "24px",
                        margin: "20px  0 0 100px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Image src={FuelIcon} width="90px"></Image>
                        <Text sx={{ margin: "0 10px" }}>fuel</Text>
                        <Text>{mine?.usedResources?.fuel}</Text>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Image src={BatteryIcon} width="90px"></Image>
                        <Text sx={{ margin: "0 10px" }}>battery</Text>
                        <Text>{mine?.usedResources?.battery}</Text>
                    </Box>
                </Box>
            </Box>

            <Text fontFamily="Orbitron" fontSize="48px" fontWeight="600">
                V.S.
            </Text>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                    }}
                >
                    <Box
                        w="300px"
                        h="116px"
                        pr="16px"
                        bg="linear-gradient(270deg, #BCBBBE 14.63%, rgba(255, 255, 255, 0) 100%)"
                    >
                        <VStack
                            spacing="4px"
                            fontFamily="Quantico"
                            fontSize="36px"
                            alignItems="flex-end"
                            onClick={() => onClick(opponent.id)}
                        >
                            <Text>{opponent.id}</Text>
                            <Text>{opponent.time}s</Text>
                        </VStack>
                    </Box>
                    <Box
                        bg={
                            win
                                ? "#D9D9D9"
                                : "radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FF8413 100%)"
                        }
                        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                        w="116px"
                        h="116px"
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
                        margin: "20px  0 0 100px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            marginRight: "100px",
                        }}
                    >
                        <Text sx={{ marginRight: "10px" }}>fuel</Text>
                        <Text sx={{ marginRight: "10px" }}>
                            {opponent?.usedResources?.fuel}
                        </Text>
                        <Image src={FuelIcon} width="90px"></Image>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            marginRight: "100px",
                        }}
                    >
                        <Text sx={{ marginRight: "10px" }}>battery</Text>
                        <Text sx={{ marginRight: "10px" }}>
                            {opponent?.usedResources?.battery}
                        </Text>
                        <Image src={BatteryIcon} width="90px"></Image>
                    </Box>
                </Box>
            </Box>
        </HStack>
    );
};
