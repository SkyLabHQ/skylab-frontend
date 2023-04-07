import {
    Box,
    Text,
    Image,
    HStack,
    VStack,
    useClipboard,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

type InfoProps = {
    id: string;
    time: number;
    avatar: string;
};

type Props = {
    mine: InfoProps;
    opponent: InfoProps;
    win: boolean;
};

export const WinInfo: FC<Pick<Props, "mine" | "opponent">> = ({
    mine,
    opponent,
}) => {
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
            <Box
                bg="radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FF8413 100%)"
                border="5px solid #FFF761"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                w="116px"
                h="100%"
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
                w="230px"
                h="100%"
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
            <Text fontFamily="Orbitron" fontSize="48px" fontWeight="600">
                V.S.
            </Text>
            <Box
                w="230px"
                h="100%"
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
                bg="#D9D9D9"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                w="116px"
                h="100%"
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
        </HStack>
    );
};

export const LoseInfo: FC<Pick<Props, "mine" | "opponent">> = ({
    mine,
    opponent,
}) => {
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
            <Box
                bg="#D9D9D9"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                w="116px"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Image w="108px" src={mine.avatar} filter="grayscale(100%)" />
            </Box>
            <Box
                w="230px"
                h="100%"
                pl="16px"
                bg="linear-gradient(90deg, #BCBBBE 14.63%, rgba(255, 255, 255, 0) 100%)"
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
            <Text fontFamily="Orbitron" fontSize="48px" fontWeight="600">
                V.S.
            </Text>
            <Box
                w="230px"
                h="100%"
                pr="16px"
                bg="linear-gradient(270deg, #FF2A0C 37.77%, rgba(232, 62, 68, 0) 100%)"
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
                bg="radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FF8413 100%)"
                border="5px solid #FF2A0C"
                boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
                w="116px"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Image
                    w="108px"
                    src={opponent.avatar}
                    filter="drop-shadow(0px 2px 0px #FFF500)"
                    transform="rotate(180deg)"
                />
            </Box>
        </HStack>
    );
};

export const Info: FC<Props> = ({ win, mine, opponent }) => {
    return win ? (
        <WinInfo mine={mine} opponent={opponent} />
    ) : (
        <LoseInfo mine={mine} opponent={opponent} />
    );
};
