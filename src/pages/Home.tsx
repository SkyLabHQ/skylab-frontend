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
import LandingAnimation from "../components/LandingAnimation";
import HomeBg from "@/components/Home/assets/homeBg.png";
import CardBanner from "../components/CardBanner";
import AboutBanner from "../components/AboutBanner";
import AboutGameBanner from "../components/AboutGameBanner";
import ConceptBanner from "../components/ConceptBanner";
import MintTimeline from "../components/MintTimeline";
import { randomizeString } from "../utils";
import Pillars from "@/components/Home/Pillars";
import LeftNav from "@/components/Home/LeftNav";
import Game from "@/components/Home/Game";
import Skylab from "@/components/Home/Skylab";
import Blog from "@/components/Home/Blog";
import Backed from "@/components/Home/Backed";

const Home = (): ReactElement => {
    // hooks
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                backgroundImage: `url(${HomeBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <LeftNav></LeftNav>
            <Container maxW="100%" minH="100vh" p="0">
                <LandingAnimation />
            </Container>
            <Container maxW="100%" minH="100vh">
                <Game></Game>
            </Container>
            <Container maxW="100%" minH="100vh">
                <CardBanner />
            </Container>
            <Container maxW="100%" minH="100vh">
                <ConceptBanner />
            </Container>
            <Container maxW="100%" minH="100vh">
                <Pillars />
            </Container>
            <Container maxW="100%" minH="100vh">
                <Skylab></Skylab>
            </Container>
            <Container maxW="100%" minH="100vh">
                <Blog></Blog>
            </Container>
            <Container maxW="100%" minH="100vh">
                <Backed></Backed>
            </Container>
        </Box>
    );
};

export default Home;
