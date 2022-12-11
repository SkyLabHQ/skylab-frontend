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
import React, { FC, useRef, useState } from "react";
import styled from "@emotion/styled";

import CloseIcon from "../assets/close.svg";
import Shield from "../assets/shield.svg";
import ArrowLeft from "../assets/icon-arrow-left.svg";
import ArrowRight from "../assets/icon-arrow-right.svg";
import Factory1 from "../assets/factory-1.svg";
import Factory2 from "../assets/factory-2.svg";
import Factory3 from "../assets/factory-3.svg";
import Factory4 from "../assets/factory-4.svg";
import Factory5 from "../assets/factory-5.svg";
import Factory6 from "../assets/factory-6.svg";
import Factory7 from "../assets/factory-7.svg";
import Factory8 from "../assets/factory-8.svg";
import Factory11 from "../assets/factory-11.svg";
import Factory12 from "../assets/factory-12.svg";
import Factory13 from "../assets/factory-13.svg";
import Factory14 from "../assets/factory-14.svg";
import Factory15 from "../assets/factory-15.svg";
import Factory16 from "../assets/factory-16.svg";
import { css } from "@emotion/react";

export type BrickGardenOverlayProps = {
    visible: boolean;
    onOverlayClose: () => void;
};

const Overlay = styled(Box)`
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(7.5px);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 900;
`;

const CloseButton = styled(Box)`
    width: 32px;
    height: 32px;
`;

const FACTORY_IMAGES = [
    Factory1,
    Factory2,
    Factory3,
    Factory4,
    Factory5,
    Factory6,
    Factory7,
    Factory8,
    Factory11,
    Factory12,
    Factory13,
    Factory14,
    Factory15,
    Factory16,
];

export const BrickGardenOverlay: FC<BrickGardenOverlayProps> = ({
    onOverlayClose,
    visible,
}) => {
    const factoryListRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<number>();

    const onScroll = (step: number) => {
        factoryListRef.current!.scrollLeft =
            factoryListRef.current!.scrollLeft + step;
    };

    return (
        <Portal>
            <Overlay pos="relative" visibility={visible ? "visible" : "hidden"}>
                <HStack pos="relative" top="16vh" spacing="20px">
                    <Box border="1px solid #FFFFFF" flex="1" />
                    <CloseButton
                        onClick={onOverlayClose}
                        bgImage={CloseIcon}
                        top="0"
                        cursor="pointer"
                    />
                    <Box border="1px solid #FFFFFF" w="2vw" />
                </HStack>

                <VStack pos="absolute" top="26vh" left="8vw">
                    <Text
                        fontFamily="Orbitron"
                        fontWeight="500"
                        fontSize="64px"
                    >
                        Bricks
                    </Text>
                    <Img src={Shield} h="300px" w="300px" />
                </VStack>

                <VStack
                    pos="absolute"
                    top="34vh"
                    left="40vw"
                    spacing="5vh"
                    alignItems="start"
                >
                    <VStack spacing="20px" alignItems="start">
                        <Text fontFamily="Quantico" fontSize="24px">
                            Total Shields in Bag:{" "}
                            <Text
                                color="#13FFDA"
                                display="inline-block"
                                textDecoration="underline"
                            >
                                241
                            </Text>
                        </Text>
                        <Text fontFamily="Quantico" fontSize="24px">
                            Choose Factory to Protect
                        </Text>
                    </VStack>

                    <HStack h="23vh" spacing="60px">
                        <Img
                            src={ArrowLeft}
                            w="20px"
                            marginLeft="-100px"
                            onClick={() => onScroll(-300)}
                            cursor="pointer"
                        />
                        <HStack
                            ref={factoryListRef}
                            spacing="20px"
                            maxW="54vw"
                            overflow="scroll"
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
                            {FACTORY_IMAGES.map((image, index) => (
                                <Img
                                    key={index}
                                    src={image}
                                    maxH="23vh"
                                    cursor="pointer"
                                    onClick={() => setSelected(index)}
                                    border={
                                        selected === index
                                            ? "5px solid #13FFDA"
                                            : "5px solid transparent"
                                    }
                                    boxSizing="border-box"
                                />
                            ))}
                        </HStack>
                        <Img
                            src={ArrowRight}
                            w="20px"
                            onClick={() => onScroll(300)}
                            cursor="pointer"
                        />
                    </HStack>

                    {selected !== undefined ? (
                        <HStack spacing="16px">
                            <HStack>
                                <Text fontFamily="Quantico" fontSize="24px">
                                    Commit{" "}
                                </Text>
                                <Box pos="relative">
                                    <Input
                                        variant="unstyled"
                                        borderRadius="none"
                                        w="3vw"
                                        fontSize="32px"
                                        textAlign="center"
                                    />
                                    <Box
                                        pos="absolute"
                                        left="0"
                                        bottom="0"
                                        w="3vw"
                                        h="2vh"
                                        bg="linear-gradient(180deg, rgba(19, 255, 218, 0) 51.56%, #13FFDA 100%)"
                                        pointerEvents="none"
                                    />
                                </Box>
                                <Text fontFamily="Quantico" fontSize="24px">
                                    {" "}
                                    Shields
                                </Text>
                            </HStack>
                            <Button variant="outline" colorScheme="teal">
                                Confirm
                            </Button>
                        </HStack>
                    ) : null}
                </VStack>
            </Overlay>
        </Portal>
    );
};
