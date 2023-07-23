import {
    Box,
    HStack,
    Img,
    Stack,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TutorialIcon from "../../assets/icon-tutorial.svg";
import KeyboardIcon from "../../assets/icon-keyboard.svg";
import DistanceIcon from "../../assets/icon-distance.svg";
import KeyboardModal from "./KeyboardModal";
import DistanceModal from "./DistanceModal";
import TutorialModal from "./TutorialModal";

type Props = {
    horizontal?: boolean;
    showDescription?: boolean;
    showCharacter?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    onChange?: (isOpen: boolean) => void;
};

const Description = styled(Text)({
    fontFamily: "Orbitron",
    fontWeight: 600,
    fontSize: 24,
    color: "white",
});

const Shortcut = styled(Box)({
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid #FFFFFF",
    borderRadius: "10px",
    fontFamily: "Orbitron",
    fontWeight: 600,
    fontSize: 24,
    color: "white",
    width: "40px",
    textAlign: "center",
});

export const TutorialGroup: FC<Props> = ({
    horizontal,
    showDescription,
    showCharacter,

    onChange,
}) => {
    const {
        isOpen: isTutorialOpen,
        onOpen: onTutorialOpen,
        onClose: onTutorialClose,
    } = useDisclosure();
    const {
        isOpen: isKeyboardOpen,
        onOpen: onKeyboardOpen,
        onClose: onKeyboardClose,
    } = useDisclosure();

    const {
        isOpen: isDistanceOpen,
        onOpen: onDistanceOpen,
        onClose: onDistanceClose,
    } = useDisclosure();

    const handleTutorialOpen = () => {
        onTutorialOpen();
        onChange?.(true);
    };

    const handleKeyboardOpen = () => {
        onKeyboardOpen();
        onChange?.(true);
    };

    const handleDistanceOpen = () => {
        onDistanceOpen();
        onChange?.(true);
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "Escape") {
                if (isTutorialOpen || isKeyboardOpen || isDistanceOpen) {
                    onChange?.(false);
                    onTutorialClose();
                    onKeyboardClose();
                    onDistanceClose();
                    return;
                }
            }
            if (key === "t") {
                onChange?.(!isTutorialOpen);
                if (isTutorialOpen) {
                    onTutorialClose();
                } else {
                    onTutorialOpen();
                }
            }
            if (key === "k") {
                onChange?.(!isKeyboardOpen);
                if (isKeyboardOpen) {
                    onKeyboardClose();
                } else {
                    onKeyboardOpen();
                }
            }
            if (key === "c") {
                onChange?.(!isDistanceOpen);
                if (isDistanceOpen) {
                    onDistanceClose();
                } else {
                    onDistanceOpen();
                }
            }
        };

        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [isTutorialOpen, isKeyboardOpen, isDistanceOpen]);

    return (
        <>
            {horizontal && (
                <Stack direction={"row"} spacing="12px" alignItems="flex-end">
                    <HStack
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        spacing="10px"
                        pos="relative"
                        onClick={handleTutorialOpen}
                    >
                        {showDescription ? (
                            <Fragment>
                                <Description>Tutorial</Description>
                                <Shortcut>T</Shortcut>
                            </Fragment>
                        ) : null}
                        <Img src={TutorialIcon} w="60px" />
                        {showCharacter && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: "-42px",
                                    left: "0%",
                                }}
                            >
                                <Shortcut>T</Shortcut>
                            </Box>
                        )}
                    </HStack>
                    <HStack
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        spacing="10px"
                        pos="relative"
                        onClick={handleKeyboardOpen}
                    >
                        {showDescription ? (
                            <Fragment>
                                <Description>
                                    Keyboard Short-cut Panel
                                </Description>
                                <Shortcut>K</Shortcut>
                            </Fragment>
                        ) : null}
                        <Img src={KeyboardIcon} w="60px" />
                        {showCharacter && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: "-42px",
                                    left: "0%",
                                }}
                            >
                                <Shortcut>K</Shortcut>
                            </Box>
                        )}
                    </HStack>
                    <HStack
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        spacing="10px"
                        pos="relative"
                        onClick={handleDistanceOpen}
                    >
                        {showDescription ? (
                            <Fragment>
                                <Description>Distance Info Panel</Description>
                                <Shortcut>C</Shortcut>
                            </Fragment>
                        ) : null}
                        <Img src={DistanceIcon} w="60px" />
                        {showCharacter && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: "-42px",
                                    left: "0%",
                                }}
                            >
                                <Shortcut>C</Shortcut>
                            </Box>
                        )}
                    </HStack>
                </Stack>
            )}

            {!horizontal && (
                <VStack alignItems="flex-end" w={"500px"}>
                    <HStack
                        onClick={handleTutorialOpen}
                        sx={{ cursor: "pointer" }}
                    >
                        <Text
                            fontSize="24px"
                            fontWeight={600}
                            marginRight="10px"
                        >
                            Tutorial
                        </Text>
                        <Box
                            bg="rgba(255, 255, 255, 0.2)"
                            border="1px solid #FFFFFF"
                            w="42px"
                            h="37px"
                            textAlign="center"
                            lineHeight="37px"
                            borderRadius="10px"
                            marginRight="10px"
                            marginInlineStart="0 !important"
                        >
                            <Text fontSize="24px" fontWeight={600}>
                                T
                            </Text>
                        </Box>
                        <Img
                            cursor="pointer"
                            src={TutorialIcon}
                            w="60px"
                            h="60px"
                        ></Img>
                    </HStack>
                    <HStack
                        sx={{ cursor: "pointer" }}
                        onClick={handleKeyboardOpen}
                    >
                        <Text
                            fontSize="24px"
                            fontWeight={600}
                            marginRight="10px"
                        >
                            Keyboard Short-cut Panel
                        </Text>
                        <Box
                            bg="rgba(255, 255, 255, 0.2)"
                            border="1px solid #FFFFFF"
                            w="42px"
                            h="37px"
                            textAlign="center"
                            lineHeight="37px"
                            borderRadius="10px"
                            marginRight="10px"
                            marginInlineStart="0 !important"
                        >
                            <Text fontSize="24px" fontWeight={600}>
                                K
                            </Text>
                        </Box>
                        <Img
                            cursor="pointer"
                            src={KeyboardIcon}
                            w="60px"
                            h="60px"
                        ></Img>
                    </HStack>
                    <HStack
                        sx={{ cursor: "pointer" }}
                        onClick={handleDistanceOpen}
                    >
                        <Text
                            fontSize="24px"
                            fontWeight={600}
                            marginRight="10px"
                        >
                            Distance Info Panel
                        </Text>
                        <Box
                            bg="rgba(255, 255, 255, 0.2)"
                            border="1px solid #FFFFFF"
                            w="42px"
                            h="37px"
                            textAlign="center"
                            lineHeight="37px"
                            borderRadius="10px"
                            marginRight="10px"
                            marginInlineStart="0 !important"
                        >
                            <Text fontSize="24px" fontWeight={600}>
                                C
                            </Text>
                        </Box>
                        <Img
                            cursor="pointer"
                            src={DistanceIcon}
                            w="60px"
                            h="60px"
                        ></Img>
                    </HStack>
                </VStack>
            )}

            <TutorialModal
                onClose={onTutorialClose}
                isOpen={isTutorialOpen}
            ></TutorialModal>
            <KeyboardModal
                onClose={onKeyboardClose}
                isOpen={isKeyboardOpen}
            ></KeyboardModal>
            <DistanceModal
                onClose={onDistanceClose}
                isOpen={isDistanceOpen}
            ></DistanceModal>
        </>
    );
};
