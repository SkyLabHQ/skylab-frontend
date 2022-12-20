import {
    Box,
    Center,
    Container,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import dotted1 from "../assets/dotted-1.svg";
import dotted2 from "../assets/dotted-2.svg";
import dotted3 from "../assets/dotted-3.svg";
import graphLine from "../assets/graph-curve-line.svg";
import graphX from "../assets/graph-x.svg";
import graphY from "../assets/graph-y.svg";
import TextMorph from "../components/TextMorph";
import { randomizeString } from "../utils";
import banner from "../assets/home-bg.png";
import LandingAnimation from "../components/LandingAnimation";
import CardBanner from "../components/CardBanner";
import AboutBanner from "../components/AboutBanner";
import AboutGameBanner from "../components/AboutGameBanner";
import ConceptBanner from "../components/ConceptBanner";
import welcomeDots from "../assets/welcome-dots.svg";
import bagItems from "../assets/items.png";
import MintTimeline from "../components/MintTimeline";

const Home = (): ReactElement => {
    // hooks
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Container
                maxW="100%"
                minH="100vh"
                bgImg={banner}
                bgSize="cover"
                bgPos="top left"
                bgRepeat="no-repeat"
                p="0"
            >
                <LandingAnimation />
            </Container>
            <Container
                maxW="100%"
                minH="100vh"
                bgGradient="linear-gradient(to bottom left, #000 10%, #02146D 30%, #05126C 40%, #0A116A 50%, #360057)"
            >
                <Container maxW="1500px">
                    <Center>
                        <CardBanner />
                    </Center>
                </Container>
                <Container maxW="full">
                    <Center>
                        <AboutBanner />
                    </Center>
                </Container>
                <Box>
                    <Center>
                        <AboutGameBanner />
                    </Center>
                </Box>
                <Container maxW="1500px">
                    <Center>
                        <ConceptBanner />
                    </Center>
                </Container>
            </Container>
            <Container
                maxW="100%"
                minH="100vh"
                bgGradient="linear-gradient(to bottom right, #360057 10%, #0A116A 50%, #05126C 60%, #02146D 70%, #000)"
                p="0"
            >
                <Container maxW="full" pt="6%">
                    <Center>
                        <Stack>
                            <Stack alignItems="center" spacing="3%">
                                <Heading whiteSpace="nowrap" fontSize="6vw">
                                    Welcome To Sky Lab
                                </Heading>
                                <Box w="1vw">
                                    <Image
                                        src={welcomeDots}
                                        objectFit="cover"
                                        w="full"
                                    />
                                </Box>
                                <Heading whiteSpace="nowrap" fontSize="4vw">
                                    {t("weBuildGames")}
                                </Heading>
                                <Box w="50vw" pt="50px">
                                    <Image
                                        src={bagItems}
                                        objectFit="cover"
                                        w="full"
                                    />
                                </Box>
                            </Stack>
                            <Box w="100%">
                                <Box w="5vw" ml="10vw">
                                    <Image
                                        src={dotted1}
                                        objectFit="cover"
                                        w="full"
                                    />
                                </Box>
                            </Box>
                            <Stack spacing="30px">
                                <Box w="100%">
                                    <Heading
                                        ml="-5vw"
                                        whiteSpace="nowrap"
                                        fontSize="4vw"
                                    >
                                        {t("mechanismHint")}
                                    </Heading>
                                </Box>
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="start"
                                    fontSize="2vw"
                                    zIndex={10}
                                >
                                    <Stack>
                                        <TextMorph
                                            morphText="1dn23knxei"
                                            defaultText="1 = 10 ; 1"
                                            selector="hint1"
                                        />
                                        <TextMorph
                                            morphText="1dn23knxei"
                                            defaultText="1 + 1 = 2 ;"
                                            selector="hint2"
                                        />
                                        <TextMorph
                                            morphText="1dn23knxei"
                                            defaultText="2 + 2 = 3"
                                            selector="hint3"
                                        />
                                    </Stack>
                                    <Stack>
                                        <TextMorph
                                            morphText="ewhew-kl"
                                            defaultText=":) vs :D"
                                            selector="hint4"
                                        />
                                        <TextMorph
                                            morphText="wqihz#iw%!dk_="
                                            defaultText="12.5% = Rewards"
                                            selector="hint5"
                                        />
                                    </Stack>
                                    <TextMorph
                                        morphText="ndwh7id"
                                        defaultText="Vickery"
                                        selector="hint6"
                                    />
                                </Flex>
                            </Stack>
                        </Stack>
                    </Center>
                </Container>
                <Box w="full" minH="100vh" overflow="hidden" pb="30%">
                    <Box pos="relative">
                        <Box w="90vw" top="20vw" pos="absolute">
                            <Image src={graphX} w="full" />
                        </Box>
                        <Box left="45vw" w="2vw" pos="absolute">
                            <Image src={graphY} w="full" />
                        </Box>
                        <Box w="70vw" top="-22vw" left="0vw" pos="absolute">
                            <Image src={graphLine} w="full" />
                        </Box>
                    </Box>
                    <Box pt="53%">
                        <Stack textAlign="center" spacing="-10%">
                            <Heading whiteSpace="nowrap" fontSize="4vw">
                                {t("timeline")}
                            </Heading>
                            <MintTimeline />
                        </Stack>
                    </Box>
                    <Box w="5vw" ml="10vw" mt="2vw">
                        <Image src={dotted2} objectFit="cover" w="full" />
                    </Box>
                    <Stack
                        spacing="5%"
                        minH="300px"
                        pl="15%"
                        w="60vw"
                        fontSize="2vw"
                    >
                        <Box
                            pos="relative"
                            transform="rotate(-1.2deg)"
                            className="wrapRandomText"
                        >
                            <Text pos="absolute" className="randomizedText">
                                {randomizeString(t("haveStrategiesAndFun"))}
                            </Text>
                            <Text pos="absolute" className="hoverActualText">
                                {t("haveStrategiesAndFun")}
                            </Text>
                        </Box>
                        <Box w="5vw">
                            <Image
                                ml="15vw"
                                mt="5vw"
                                src={dotted3}
                                objectFit="cover"
                                w="full"
                            />
                        </Box>
                        <Box
                            className="wrapRandomText"
                            pos="relative"
                            transform="rotate(0.1deg)"
                            w="45vw"
                        >
                            <Text pos="absolute" className="randomizedText">
                                {randomizeString(t("emersonQuote"))}
                            </Text>
                            <Text pos="absolute" className="hoverActualText">
                                {t("emersonQuote")}
                            </Text>
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Home;
