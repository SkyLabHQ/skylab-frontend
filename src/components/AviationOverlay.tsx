import {
    Box,
    Heading,
    Image,
    Portal,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
} from "@chakra-ui/react";
import React, { FC, Fragment } from "react";
import { Trans } from "react-i18next";
import styled from "@emotion/styled";

import CloseIcon from "../assets/close.svg";
import OverlayTop from "../assets/aviation-overlay-top-vector.svg";
import ColorfulOverlayTop from "../assets/aviation-overlay-colorful-top-vector.svg";
import ColorfulOverlay1 from "../assets/aviation-overlay-colorful-vector-1.svg";
import ColorfulOverlay2 from "../assets/aviation-overlay-colorful-vector-2.svg";
import DashedBorder from "../assets/dashed-border.svg";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import ConnectWallet from "./ConnectWallet";

export type AviationOverlayProps = {
    level: number;
    img: string;
    onOverlayClose: () => void;
};

const Overlay = styled(Box)`
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 1) 40%,
        rgba(0, 0, 0, 0.5)
    );
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

const ConnectWalletWrapper = styled(Text)`
    font-size: 36px;
    padding: 0 2.5vw;
    border: 2px solid #ffffff;
    border-radius: 10px;
    cursor: pointer;
`;

export const AviationOverlay: FC<AviationOverlayProps> = ({
    onOverlayClose,
    level,
    img,
}) => {
    const { account } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isNewLayout = level === 1;

    return (
        <Portal>
            <Overlay pos="relative">
                <Image
                    src={isNewLayout ? ColorfulOverlayTop : OverlayTop}
                    w="15vw"
                    h="6vw"
                    pos="absolute"
                    top="70vw"
                    left="3vw"
                />
                <Box pos="relative" top="75vw">
                    <CloseButton
                        onClick={onOverlayClose}
                        bgImage={CloseIcon}
                        top="0"
                        right="3.5vw"
                        pos="absolute"
                        cursor="pointer"
                    />
                    <Heading
                        fontSize="128px"
                        fontWeight="700"
                        paddingLeft="5vw"
                    >
                        <Trans i18nKey="level" values={{ num: level }} />
                    </Heading>
                    <Box
                        paddingLeft="5vw"
                        marginTop="3vw"
                        pos={isNewLayout ? "absolute" : "relative"}
                        top={isNewLayout ? "27vw" : "initial"}
                        maxW={isNewLayout ? "43vw" : "none"}
                    >
                        <Text fontSize="40px">
                            A luxury business jet, which can provides more sits
                            and a comfortable driving experience!
                        </Text>
                    </Box>
                    {isNewLayout ? (
                        <Box
                            w="82vw"
                            height="44vw"
                            pos="absolute"
                            left="17vw"
                            top="8vw"
                            overflowY="hidden"
                            overflowX="visible"
                        >
                            <Image
                                pos="absolute"
                                src={ColorfulOverlay1}
                                w="30vw"
                                h="16vw"
                            />
                            <Image
                                pos="absolute"
                                src={ColorfulOverlay2}
                                w="45vw"
                                h="7vw"
                                top="1.5vw"
                                left="46vw"
                            />
                            <Image
                                pos="absolute"
                                src={img}
                                w="44vw"
                                h="44vw"
                                top="-13vw"
                                left="14vw"
                            />
                        </Box>
                    ) : (
                        <Box
                            w="52vw"
                            height="32vw"
                            pos="absolute"
                            left={isNewLayout ? "28vw" : "3vw"}
                            top={isNewLayout ? "1vw" : "initial"}
                        >
                            <Image src={img} w="100%" h="100%" />
                        </Box>
                    )}
                    <Box
                        w="38vw"
                        pos="absolute"
                        left="56vw"
                        top={isNewLayout ? "22vw" : "initial"}
                    >
                        {isNewLayout ? (
                            <Box
                                display="flex"
                                alignItems="center"
                                marginTop="2vw"
                                justifyContent="flex-end"
                            >
                                <Text fontSize="40px">Price</Text>
                            </Box>
                        ) : (
                            <Fragment>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    marginTop="2vw"
                                >
                                    <Text fontSize="40px">Floor Price</Text>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    marginTop="2vw"
                                >
                                    <Text fontSize="40px">Aviation Minted</Text>
                                </Box>
                            </Fragment>
                        )}
                        <Box
                            display="flex"
                            alignItems="flex-end"
                            justifyContent="end"
                            marginTop={isNewLayout ? "4.5vw" : "7.5vw"}
                            onClick={onOpen}
                        >
                            <Image
                                src={DashedBorder}
                                width="18vw"
                                marginBottom="10px"
                                marginRight="-2px"
                            />
                            <ConnectWalletWrapper>
                                <div>
                                    {account
                                        ? isNewLayout
                                            ? "Mint"
                                            : "Purchase On"
                                        : "Connect Wallet"}
                                </div>
                            </ConnectWalletWrapper>
                        </Box>
                        <Box
                            display="flex"
                            alignItems="flex-start"
                            marginTop="2vw"
                            width="36vw"
                        >
                            <Text fontSize="16px" marginTop="6px">
                                &bull;
                            </Text>
                            <Text fontSize="24px" marginLeft="4px">
                                Only{" "}
                                <Text as="span" color="rgba(19, 255, 218, 1)">
                                    Level 1
                                </Text>{" "}
                                vehicles can be minted directly
                            </Text>
                        </Box>
                        <Box
                            display="flex"
                            alignItems="flex-start"
                            marginTop="8px"
                            width="36vw"
                        >
                            <Text fontSize="16px" marginTop="6px">
                                &bull;
                            </Text>
                            <Text fontSize="24px" marginLeft="4px">
                                <Text as="span" color="rgba(19, 255, 218, 1)">
                                    Higher level
                                </Text>{" "}
                                vehicles can only be minted when{" "}
                                <Text as="span" color="rgba(19, 255, 218, 1)">
                                    being upgraded
                                </Text>{" "}
                                in the game
                            </Text>
                        </Box>
                    </Box>
                </Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay
                        backdropFilter="blur(30px)"
                        bg="rgba(0, 0, 0, 0.2)"
                    />
                    <ModalContent
                        bgColor="rgba(0, 0, 0, 0.8)"
                        maxWidth="65vw"
                        top="8vw"
                    >
                        <ConnectWallet onModalClose={onClose} />
                    </ModalContent>
                </Modal>
            </Overlay>
        </Portal>
    );
};
