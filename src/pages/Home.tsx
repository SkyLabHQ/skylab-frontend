import { Box, Container } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import LandingAnimation from "../components/LandingAnimation";
import HomeBg from "@/components/Home/assets/homeBg.png";
import CardBanner from "../components/CardBanner";
import ConceptBanner from "../components/ConceptBanner";
import Pillars from "@/components/Home/Pillars";
import LeftNav from "@/components/Home/LeftNav";
import Game from "@/components/Home/Game";
import Skylab from "@/components/Home/Skylab";
import Blog from "@/components/Home/Blog";
import Backed from "@/components/Home/Backed";
import DecorBg from "@/components/Home/assets/decor.gif";

const Home = (): ReactElement => {
    return (
        <Box
            sx={{
                backgroundImage: `url(${DecorBg}), url(${HomeBg})`,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundSize: "contain,cover",
                backgroundPosition: "0 0,center",
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
            <Container maxW="100%" minH="100vh" sx={{ background: "#122A39" }}>
                <Backed></Backed>
            </Container>
        </Box>
    );
};

export default Home;
