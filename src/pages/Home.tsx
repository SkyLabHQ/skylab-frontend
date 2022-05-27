import { Box, Center, Container, Heading, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { BsChevronDoubleDown } from "react-icons/bs";
import * as Scroll from "react-scroll";
import landingImg from "../assets/landing.jpeg";
import dotted1 from "../assets/dotted-1.svg";
import dotted2 from "../assets/dotted-2.svg";
import dotted3 from "../assets/dotted-3.svg";
import dotted4 from "../assets/dotted-4.svg";
import dotted5 from "../assets/dotted-5.svg";
import dotted6 from "../assets/dotted-6.svg";
import dotted8 from "../assets/dotted-8.svg";
import dotted9 from "../assets/dotted-9.svg";
import rock from "../assets/rock.svg";
import tree from "../assets/tree.svg";
import bricks from "../assets/bricks.svg";
import diamond from "../assets/diamond.svg";
import apple from "../assets/apple.svg";
import ball from "../assets/ball.svg";
import graphLine from "../assets/graph-curve-line.svg";
import graphX from "../assets/graph-x.svg";
import graphY from "../assets/graph-y.svg";
import TextMorph from "../components/TextMorph";
import { randomizeString } from "../utils";
import { isMobile } from "react-device-detect";
import Timeline from "../components/Timeline";

const Home = (): ReactElement => {
    // hooks
    const { t } = useTranslation();

    // state
    const scroll = Scroll.scroller;
    const ScrollTargetElement = Scroll.Element;
    const MotionBox = motion(Box);

    return (
        <React.Fragment>
            <Container
                mt={isMobile ? "80px" : 0}
                maxW="100%"
                minH="55vw"
                bg="black"
                pos="relative"
            >
                <Center>
                    <Heading
                        as="h1"
                        fontSize="7.5vw"
                        letterSpacing="wider"
                        zIndex={5}
                        pos="absolute"
                        top="7vw"
                    >
                        SkyLab
                    </Heading>
                </Center>
                <Box w="50vw" pos="absolute" left="3%" top="15vw">
                    <Box
                        boxSize="30vw"
                        transform="rotate(-24deg)"
                        pos="absolute"
                        left="20%"
                        top="1vw"
                        zIndex={4}
                    >
                        <Image
                            borderRadius="15px"
                            src={landingImg}
                            alt="Landing"
                            objectFit="cover"
                            boxShadow="2xl"
                        />
                    </Box>
                    <Box
                        boxSize="25vw"
                        transform="rotate(-9deg)"
                        pos="absolute"
                        zIndex={2}
                        bgColor="black"
                        borderRadius="15px"
                        left="3%"
                        h="fit-content"
                    >
                        <Image
                            borderRadius="15px"
                            src={landingImg}
                            alt="Landing"
                            objectFit="cover"
                            opacity="0.7"
                        />
                    </Box>
                    <Box
                        boxSize="23vw"
                        transform="rotate(12deg)"
                        pos="absolute"
                        top="13vw"
                        left="40%"
                        zIndex={0}
                        bgColor="black"
                        borderRadius="15px"
                        h="fit-content"
                    >
                        <Image
                            borderRadius="15px"
                            src={landingImg}
                            alt="Landing"
                            objectFit="cover"
                            opacity="0.6"
                        />
                    </Box>
                </Box>
                <Box fontSize="4.5vw" top="28vw" right="15%" pos="absolute">
                    <TextMorph defaultText={t("startGame")} selector="start1" />
                </Box>
                <Box fontSize="4.5vw" top="33.5vw" right="15%" pos="absolute">
                    <TextMorph defaultText={t("startGame")} selector="start2" />
                </Box>
                <Box fontSize="4.5vw" top="39vw" right="15%" pos="absolute">
                    <TextMorph defaultText={t("startGame")} selector="start3" />
                </Box>
                <Center>
                    <Box cursor="pointer" position="absolute" top="50vw">
                        <MotionBox
                            whileHover={{ scale: 1.2, color: "#237EFF" }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <BsChevronDoubleDown
                                onClick={() =>
                                    scroll.scrollTo("scroll", {
                                        delay: 200,
                                        smooth: true,
                                    })
                                }
                                size="4vw"
                            />
                        </MotionBox>
                    </Box>
                </Center>
            </Container>
            <Container maxW="100%" p="0" h="150vw" bg="black" pos="relative">
                <Box left={0} w="8vw" top="-10vw" pos="absolute">
                    <Image src={dotted1} />
                </Box>
                <ScrollTargetElement name="scroll">
                    <Center pos="absolute" left="12.5%" top="8vw" w="48vw">
                        <Heading
                            transform="rotate(4deg)"
                            as="h1"
                            fontSize="4.5vw"
                            letterSpacing="wide"
                            whiteSpace="nowrap"
                        >
                            {t("weBuildGames")}
                        </Heading>
                    </Center>
                </ScrollTargetElement>
                <Box right="25%" top="13vw" w="10vw" pos="absolute">
                    <Image src={dotted2} />
                </Box>
                <Box
                    pos="absolute"
                    left="58%"
                    top="28vw"
                    w="32vw"
                    textAlign="center"
                >
                    <Heading
                        as="h1"
                        fontSize="4.5vw"
                        letterSpacing="wide"
                        whiteSpace="nowrap"
                    >
                        {t("mechanismHint")}
                    </Heading>
                    <Center fontSize="2.5vw" mt="2vw" lineHeight="3vw">
                        <TextMorph
                            morphText="3436484639"
                            defaultText={"1 + 1 = 2"}
                            selector="hint1"
                        />
                    </Center>
                    <Center fontSize="2.5vw" lineHeight="3vw">
                        <TextMorph
                            morphText="3436+^-=_%!4846+39"
                            defaultText={"2 + 2 = 3"}
                            selector="hint2"
                        />
                    </Center>
                    <Center fontSize="2.5vw" mt="1vw">
                        <TextMorph
                            morphText="ewhew-kl"
                            defaultText={":) vs :D"}
                            selector="hint3"
                        />
                    </Center>
                    <Center fontSize="2.5vw">
                        <TextMorph
                            morphText="wqihz#iw%!dk_="
                            defaultText="7% = 🎁"
                            selector="hint4"
                        />
                    </Center>
                    <Center mt="2vw" fontSize="3vw">
                        <TextMorph defaultText="Vickery" selector="hint5" />
                    </Center>
                </Box>
                <Box right="1vw" top="38vw" w="13vw" pos="absolute">
                    <Image src={dotted8} />
                </Box>
                <Box
                    transform="rotate(-5deg)"
                    left="18.5%"
                    top="17vw"
                    w="6vw"
                    pos="absolute"
                >
                    <Image src={rock} />
                </Box>
                <Box
                    transform="rotate(-5deg)"
                    left="28%"
                    top="15vw"
                    w="18vw"
                    pos="absolute"
                >
                    <Image src={tree} />
                </Box>
                <Box
                    transform="rotate(-5deg)"
                    left="22%"
                    top="31vw"
                    w="16.5vw"
                    pos="absolute"
                >
                    <Image src={bricks} />
                </Box>
                <Box
                    transform="rotate(-5deg)"
                    left="26%"
                    top="25vw"
                    w="5.5vw"
                    pos="absolute"
                >
                    <Image src={diamond} />
                </Box>
                <Box left="18%" top="30vw" w="3.5vw" pos="absolute">
                    <Image src={ball} />
                </Box>
                <Box
                    transform="rotate(-5deg)"
                    left="39%"
                    top="27vw"
                    w="12vw"
                    pos="absolute"
                >
                    <Image src={apple} />
                </Box>
                <Box left={0} top="65vw" w="80vw" pos="absolute">
                    <Image src={graphX} />
                </Box>
                <Box left="27%" top="50vw" w="1.3vw" pos="absolute">
                    <Image src={graphY} />
                </Box>
                <Box left={0} top="21vw" w="56vw" pos="absolute">
                    <Image src={graphLine} />
                </Box>
                <Box
                    transform="rotate(-13deg)"
                    left="8%"
                    top="25vw"
                    pos="absolute"
                >
                    <Text fontSize="2vw">🛡</Text>
                </Box>
                <Box
                    transform="rotate(8deg)"
                    left="15%"
                    top="38vw"
                    pos="absolute"
                >
                    <Text fontSize="3vw">🛡</Text>
                </Box>
                <Box
                    transform="rotate(-5deg)"
                    left="40%"
                    top="40vw"
                    pos="absolute"
                    bgColor="black"
                >
                    <Text opacity="0.7" fontSize="1.5vw">
                        🛡
                    </Text>
                </Box>
                <Center right="13vw" top="84vw" w="20vw" pos="absolute">
                    <Heading
                        as="h1"
                        fontSize="5vw"
                        letterSpacing="wide"
                        whiteSpace="nowrap"
                    >
                        {t("timeline")}
                    </Heading>
                </Center>
                <Box right="1vw" top="77.5vw" w="8vw" pos="absolute">
                    <Image src={dotted3} />
                </Box>
                <Box left="19vw" top="85vw" w="43vw" pos="absolute">
                    <Image src={dotted4} />
                </Box>
                <Box boxSize="70%" pos="relative" top="90vw">
                    <Timeline />
                </Box>
                <Box left="15vw" top="109vw" w="11.5vw" pos="absolute">
                    <Image src={dotted5} />
                </Box>
                <Box
                    left="13%"
                    top="132vw"
                    fontSize="3vw"
                    lineHeight="3vw"
                    pos="absolute"
                    transform="rotate(-6.2deg)"
                    className="wrapRandomText"
                    w="50vw"
                >
                    <Text pos="absolute" className="randomizedText">
                        {randomizeString(t("haveStrategiesAndFun"))}
                    </Text>
                    <Text pos="absolute" className="hoverActualText">
                        {t("haveStrategiesAndFun")}
                    </Text>
                </Box>
                <Box left="34%" top="139vw" w="6.5vw" pos="absolute">
                    <Image src={dotted6} />
                </Box>
                <Center
                    left="17%"
                    top="161vw"
                    fontSize="3vw"
                    w="55vw"
                    lineHeight="3vw"
                    pos="absolute"
                    transform="rotate(-2.2deg)"
                    display="flex"
                    flexDir="column"
                    alignItems="start"
                    className="wrapRandomText"
                >
                    <Text pos="absolute" className="randomizedText">
                        {randomizeString(t("emersonQuote"))}
                    </Text>
                    <Text pos="absolute" className="hoverActualText">
                        {t("emersonQuote")}
                    </Text>
                </Center>
                <Box left={0} top="175vw" w="17.5vw" pos="absolute">
                    <Image src={dotted9} />
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Home;
