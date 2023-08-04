import {
    Box,
    Container,
    Image as CharkraImage,
    keyframes,
} from "@chakra-ui/react";
import React, { ReactElement, useEffect, useState } from "react";
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
import logo from "@/components/Home/assets/logo.svg";

export const airpdImg = (index: number) => {
    const index1 = index + 100;
    const url = require(`@/components/Home/assets/comp/Pre-comp 5_${index1}.png`);
    return url;
};

const Home = (): ReactElement => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // setLoading(true);
        let loadedImages = 0;
        const picImg = 59; // 机械手图片数量
        // 监听所有img标签的加载完成事件
        const images = document.querySelectorAll("img");
        const totalImages = images.length;
        const backgroundImgs = 2;

        const checkAllImagesLoaded = () => {
            loadedImages++;

            if (loadedImages === totalImages + picImg + backgroundImgs) {
                // setLoading(false);
            }
        };

        // 加载机械手图片计数
        const loadRobotEvent = () => {
            const imgList: any = [];
            for (let i = 0; i < picImg; i++) {
                const img = new Image();
                img.src = airpdImg(i);
                imgList.push(img);
            }
            for (let i = 0; i < picImg; i++) {
                imgList[i].addEventListener("load", checkAllImagesLoaded);
            }
        };
        loadRobotEvent();

        // 加载所有图片组件计数
        const loadAllImgEvent = () => {
            for (let i = 0; i < totalImages; i++) {
                images[i].addEventListener("load", checkAllImagesLoaded);
            }
        };
        loadAllImgEvent();

        // 加载背景图片计数
        const loadBackgroundEvent = () => {
            const img = new Image();
            img.src = HomeBg;
            img.addEventListener("load", checkAllImagesLoaded);

            const img1 = new Image();
            img1.src = DecorBg;
            img1.addEventListener("load", checkAllImagesLoaded);
        };
        loadBackgroundEvent();
    }, []);

    return (
        <>
            {loading ? (
                <Box
                    sx={{
                        height: "100vh",
                        width: "100vw",
                        position: "absolute",
                        background: "#2A484D",
                        inset: 0,
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box>
                        <CharkraImage src={logo}></CharkraImage>
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        backgroundImage: `url(${DecorBg}), url(${HomeBg})`,
                        backgroundRepeat: "no-repeat, no-repeat",
                        backgroundSize: "contain,cover",
                        backgroundPosition: "0 0,center",
                        fontFamily: "Orbitron",
                        "& img": {
                            imageRendering: "optimizeContrast",
                        },
                    }}
                >
                    <LeftNav></LeftNav>
                    <Container maxW="100%" minH="100vh">
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
                    <Box sx={{ background: "#122A39" }}>
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
                </Box>
            )}
        </>
    );
};

export default Home;
