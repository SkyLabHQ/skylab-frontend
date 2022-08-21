import { Box, Center, Container, Heading, Image } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import MintTimeline from "../components/MintTimeline";
import background from "../assets/mint-background.svg";
import Aviation1 from "../assets/aviation-1.svg";
import Aviation2 from "../assets/aviation-2.svg";
import Aviation3 from "../assets/aviation-3.svg";
import Aviation4 from "../assets/aviation-4.svg";
import Aviation5 from "../assets/aviation-5.svg";
import Aviation6 from "../assets/aviation-6.svg";
import Aviation7 from "../assets/aviation-7.svg";
import Player1 from "../assets/player01.svg";
import Player2 from "../assets/player02.svg";
import Player3 from "../assets/player03.svg";

const Mint = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <Container
            maxW="100%"
            minH="270vw"
            bgImg={background}
            bgSize="cover"
            bgPos="top left"
            bgRepeat="no-repeat"
            p="0"
        >
            <Box pt={100} minH="100vh">
                <Center>
                    <Heading
                        pt="3vw"
                        as="h1"
                        fontSize="5.5vw"
                        letterSpacing="wider"
                    >
                        {t("timeline")}
                    </Heading>
                </Center>
                <Box pos="relative" top="-8vw">
                    <MintTimeline />
                    <Box pos="relative" top="7.5vw">
                        <Box w="55vw" pos="absolute" left="12%">
                            <Image src={Aviation7} w="100%" h="100%" />
                        </Box>
                        <Center pos="absolute" top="27vw" left="39%">
                            <Heading fontSize="5.5vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 8 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="39vw">
                        <Box
                            w="26vw"
                            pos="absolute"
                            left="8%"
                            transform="rotate(-3deg)"
                            cursor="pointer"
                        >
                            <Image src={Aviation6} w="100%" h="100%" />
                        </Box>
                        <Center
                            pos="absolute"
                            top="17vw"
                            left="22%"
                            transform="rotate(-19deg)"
                        >
                            <Heading fontSize="4vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 7 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="57vw">
                        <Box
                            w="33vw"
                            pos="absolute"
                            left="31%"
                            cursor="pointer"
                        >
                            <Image src={Aviation5} w="100%" h="100%" />
                        </Box>
                        <Center
                            pos="absolute"
                            top="26vw"
                            left="51%"
                            transform="rotate(-13deg)"
                        >
                            <Heading fontSize="5vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 6 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="90vw">
                        <Box
                            w="24vw"
                            pos="absolute"
                            left="8.5%"
                            cursor="pointer"
                        >
                            <Image src={Aviation4} w="100%" h="100%" />
                        </Box>
                        <Center
                            pos="absolute"
                            top="13vw"
                            left="7.5%"
                            transform="rotate(-5deg)"
                        >
                            <Heading fontSize="3.5vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 5 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="90vw">
                        <Box
                            w="43vw"
                            pos="absolute"
                            left="37%"
                            cursor="pointer"
                        >
                            <Image src={Aviation3} w="100%" h="100%" />
                        </Box>
                        <Center
                            pos="absolute"
                            top="34vw"
                            left="37.5%"
                            transform="rotate(-5deg)"
                        >
                            <Heading fontSize="6vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 4 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="137vw">
                        <Box
                            w="38.5vw"
                            pos="absolute"
                            left="52%"
                            cursor="pointer"
                        >
                            <Image src={Aviation2} w="100%" h="100%" />
                        </Box>
                        <Center
                            pos="absolute"
                            top="26vw"
                            left="74%"
                            transform="rotate(3deg)"
                        >
                            <Heading fontSize="4.5vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 3 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="200vw">
                        <Box
                            w="15vw"
                            pos="absolute"
                            left="45.5%"
                            cursor="pointer"
                        >
                            <Image src={Aviation1} w="100%" h="100%" />
                        </Box>
                        <Center pos="absolute" top="12vw" left="52%">
                            <Heading fontSize="2.5vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 2 }} />
                            </Heading>
                        </Center>
                    </Box>
                    <Box pos="relative" top="219vw">
                        <Box w="6vw" pos="absolute" top="3.6vw" left="37%">
                            <Image src={Player1} w="100%" h="100%" />
                        </Box>
                        <Box w="6vw" pos="absolute" top="3.2vw" left="41.5%">
                            <Image src={Player2} w="100%" h="100%" />
                        </Box>
                        <Box w="5vw" pos="absolute" top="7vw" left="42.5%">
                            <Image src={Player3} w="100%" h="100%" />
                        </Box>
                        <Center pos="absolute" left="39%">
                            <Heading fontSize="2vw" userSelect="none">
                                <Trans i18nKey="level" values={{ num: 1 }} />
                            </Heading>
                        </Center>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Mint;
