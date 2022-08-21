import { Box, Center, Container, Heading, Image } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import MintTimeline from "../components/MintTimeline";
import { Aviation } from "../components/Aviation";
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
                    <Aviation
                        img={Aviation7}
                        level={8}
                        layout={{
                            container: { top: "7.5vw" },
                            image: { left: "12%", width: "55vw" },
                            text: {
                                fontSize: "5.5vw",
                                top: "27vw",
                                left: "39%",
                            },
                        }}
                    />
                    <Aviation
                        img={Aviation6}
                        level={7}
                        layout={{
                            container: { top: "39vw" },
                            image: {
                                left: "8%",
                                width: "26vw",
                                transform: "rotate(-3deg)",
                            },
                            text: {
                                fontSize: "4vw",
                                top: "17vw",
                                left: "22%",
                                transform: "rotate(-19deg)",
                            },
                        }}
                    />
                    <Aviation
                        img={Aviation5}
                        level={6}
                        layout={{
                            container: { top: "57vw" },
                            image: {
                                left: "31%",
                                width: "33vw",
                            },
                            text: {
                                fontSize: "5vw",
                                top: "26vw",
                                left: "51%",
                                transform: "rotate(-13deg)",
                            },
                        }}
                    />
                    <Aviation
                        img={Aviation4}
                        level={5}
                        layout={{
                            container: { top: "90vw" },
                            image: {
                                left: "8.5%",
                                width: "24vw",
                            },
                            text: {
                                fontSize: "3.5vw",
                                top: "13vw",
                                left: "7.5%",
                                transform: "rotate(-5deg)",
                            },
                        }}
                    />
                    <Aviation
                        img={Aviation3}
                        level={4}
                        layout={{
                            container: { top: "90vw" },
                            image: {
                                left: "37%",
                                width: "43vw",
                            },
                            text: {
                                fontSize: "6vw",
                                top: "34vw",
                                left: "37.5%",
                                transform: "rotate(-5deg)",
                            },
                        }}
                    />
                    <Aviation
                        img={Aviation2}
                        level={3}
                        layout={{
                            container: { top: "137vw" },
                            image: {
                                left: "52%",
                                width: "38.5vw",
                            },
                            text: {
                                fontSize: "4.5vw",
                                top: "26vw",
                                left: "74%",
                                transform: "rotate(3deg)",
                            },
                        }}
                    />
                    <Aviation
                        img={Aviation1}
                        level={2}
                        layout={{
                            container: { top: "200vw" },
                            image: {
                                left: "45.5%",
                                width: "15vw",
                            },
                            text: {
                                fontSize: "2.5vw",
                                top: "12vw",
                                left: "52%",
                            },
                        }}
                    />
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
