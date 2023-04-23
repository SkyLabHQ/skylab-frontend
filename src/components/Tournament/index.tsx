import {
    Box,
    Grid,
    GridItem,
    HStack,
    Img,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { ReactElement, Fragment, useState, useRef } from "react";
import { css } from "@emotion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";

import TournamentDivider from "../../assets/tournament-divider.svg";
import RoundWinner from "./assets/round-winner.svg";
import Apr from "./assets/apr.svg";
import Winner from "./assets/winner.svg";
import YelRightArrow from "./assets/yel-right-arrow.svg";
import { useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Aviation from "../../assets/aviation-1.svg";

const SwiperSlideContent = () => {
    const swiper = useSwiper();
    const [list, setList] = useState([
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
        { address: "0xaf...1234" },
    ]);
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                padding: 0,
                zIndex: 110,
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    height: "100%",
                    position: "absolute",
                    overflow: "visible",
                    left: "5vw",
                    background: "rgba(217, 217, 217, 0.2)",
                    border: "3px solid #FFF761",
                    backdropFilter: "blur(7.5px)",
                    borderRadius: "16px",
                }}
            >
                {/* <Img
                    src={YelRightArrow}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        swiper.slideNext();
                    }}
                    sx={{
                        position: "absolute",
                        right: " 0px",
                        top: "50%",
                        cursor: "pointer",
                        zIndex: 999,
                        background: "red",
                    }}
                ></Img> */}
                <VStack
                    w="36vw"
                    height="71.5vh"
                    pos="absolute"
                    left="7vw"
                    top="6vh"
                    fontFamily="Orbitron"
                    fontWeight="900"
                    fontSize="48px"
                    color="black"
                >
                    <Box w="34vw">
                        <Img
                            src={RoundWinner}
                            pos="relative"
                            top={0}
                            left="0"
                            width="100%"
                        ></Img>
                        <Text
                            textAlign="center"
                            w="100%"
                            paddingTop="5"
                            zIndex={999}
                            pos="absolute"
                            left="0"
                            top="0"
                        >
                            Round 10 Winner
                        </Text>
                    </Box>
                    <Box style={{ marginTop: "-60px" }}></Box>
                    <Box
                        flex={1}
                        overflowY="auto"
                        css={css`
                            &::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    >
                        {list.length > 0 && (
                            <HStack justifyContent="center">
                                <WinnerItem
                                    w="8.3vw"
                                    bg="radial-gradient(50% 50% at 50% 50%, rgba(255, 173, 41, 0.5) 0%, rgba(255, 247, 97, 0.5) 100%)"
                                    border="4px solid #FFF761"
                                    address={list[0].address}
                                    fontSize="24px"
                                ></WinnerItem>
                            </HStack>
                        )}

                        <Grid
                            templateColumns="repeat(2, 1fr)"
                            gap={3}
                            marginTop="11px"
                        >
                            {list.length > 2 && (
                                <GridItem
                                    w="100%"
                                    display="flex"
                                    justifyContent="flex-end"
                                >
                                    <WinnerItem
                                        w="5.9vw"
                                        address={list[1].address}
                                    ></WinnerItem>
                                </GridItem>
                            )}
                            {list.length > 3 && (
                                <GridItem w="100%" display="flex">
                                    <WinnerItem
                                        w="5.9vw"
                                        address={list[2].address}
                                    ></WinnerItem>
                                </GridItem>
                            )}
                        </Grid>
                        {list.length > 7 && (
                            <Grid
                                templateColumns="repeat(4, 1fr)"
                                gap={3}
                                marginTop="6px"
                            >
                                {list
                                    .slice(3, list.length - 1)
                                    .map((item, index) => {
                                        return (
                                            <GridItem
                                                w="100%"
                                                display="flex"
                                                key={index}
                                            >
                                                <WinnerItem
                                                    w="4.9vw"
                                                    address={list[1].address}
                                                ></WinnerItem>
                                            </GridItem>
                                        );
                                    })}
                            </Grid>
                        )}
                    </Box>
                    <Box w="34vw" pos="relative">
                        <Img
                            src={Apr}
                            pos="relative"
                            top={0}
                            left="0"
                            width="100%"
                        ></Img>
                        <Text
                            textAlign="center"
                            w="100%"
                            paddingTop="5"
                            zIndex={999}
                            pos="absolute"
                            left="0"
                            top="0"
                        >
                            2023 APR 01
                        </Text>
                    </Box>
                </VStack>
                <Box
                    fontFamily="Orbitron"
                    fontWeight={500}
                    fontSize="24px"
                    color="#BCBBBE"
                    pos="absolute"
                    right="128px"
                    w="35vw"
                    top="3vh"
                >
                    <Text>Leaderboard</Text>
                    <VStack
                        spacing="4px"
                        pos="absolute"
                        overflowY="auto"
                        height="74vh"
                        bg="rgba(0, 0, 0, 0.6)"
                        border="2px solid #FFF761"
                        borderRadius="20px"
                        padding="30px 0 "
                        css={css`
                            &::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    >
                        {config.map((item, index) => (
                            <Fragment key={index}>
                                <HStack w="100%" spacing="1.5vw">
                                    <Text
                                        w="150px"
                                        textAlign="right"
                                        fontFamily="Orbitron"
                                        color={index < 3 ? "#FFF761" : "white"}
                                        fontSize="64px"
                                        fontWeight="500"
                                    >
                                        {index + 1}
                                    </Text>
                                    <Box
                                        w="90px"
                                        h="90px"
                                        boxShadow={
                                            index < 3
                                                ? "0px 0px 10px #FFF761"
                                                : undefined
                                        }
                                        bg={
                                            index < 3
                                                ? "radial-gradient(50% 50% at 50% 50%, #7D7144 0%, #000000 100%)"
                                                : "#191823"
                                        }
                                        border={
                                            index < 3
                                                ? "4px solid #FFC110"
                                                : "1px solid #FFFFFF"
                                        }
                                        borderRadius="10px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Img src={item.img} w="90%" />
                                    </Box>
                                    <VStack spacing="4px">
                                        <Text
                                            fontFamily="Orbitron"
                                            color="white"
                                            fontSize="36px"
                                            fontWeight="500"
                                        >
                                            Level {item.level}
                                        </Text>
                                        <Text
                                            fontFamily="Orbitron"
                                            color="white"
                                            fontSize="24px"
                                            fontWeight="500"
                                        >
                                            owner: {item.owner}
                                        </Text>
                                    </VStack>
                                </HStack>
                                {index !== config.length - 1 ? (
                                    <Img src={TournamentDivider} w="100%" />
                                ) : null}
                            </Fragment>
                        ))}
                    </VStack>
                </Box>{" "}
            </Box>
        </Box>
    );
};

const config = new Array(10).fill({
    level: 2,
    img: Aviation,
    owner: "Test",
});

const WinnerItem = ({
    w,
    bg = "rgba(255, 255, 255, 0.5)",
    border = "4px solid #fff",
    address,
    fontSize = "16px",
}: {
    w?: string;
    bg?: string;
    border?: string;
    address?: string;
    fontSize?: string;
}) => {
    return (
        <VStack>
            <Box w={w} h={w} bg={bg} border={border} borderRadius="20px">
                <Img src={Winner} w={w} marginLeft="10px"></Img>
            </Box>
            <Text color="#fff" fontSize={fontSize} textAlign="center">
                {address}
            </Text>
        </VStack>
    );
};

interface ChildProps {
    onNextRound: () => void;
}

export const Tournament = ({ onNextRound }: ChildProps): ReactElement => {
    const swiper = useSwiper();
    const mySwiper = useRef(null);
    const navigationRef = useRef(null);
    const list = [1, 2, 3, 4];
    return (
        <Box
            w="100vw"
            h="100vh"
            overflow="hidden"
            pos="absolute"
            sx={{
                ".swiper-pagination": {
                    width: "auto",
                    left: "50%",
                    height: "33px",
                    transform: "translateX(-50%)",
                    background: "rgba(217, 217, 217, 0.1)",
                    borderRadius: "40px",
                    padding: "0px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ".swiper-pagination-bullet": {
                        width: "9px",
                        height: "9px",
                    },
                    ".swiper-pagination-bullet.swiper-pagination-bullet-active":
                        {
                            background: "#D9D9D9",
                        },
                },

                ".swiper-button-next": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                    right: "2%",
                    zIndex: 100,
                },
                ".swiper-button-next:after": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                },
                ".swiper-button-prev": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                    left: "2%",
                    zIndex: 100,
                },
                ".swiper-button-prev:after": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                },
            }}
            onClick={(e: any) => {
                try {
                    const classs = e.target.classList;
                    for (let item of classs) {
                        if (item.includes("button")) {
                            return;
                        }
                    }
                    onNextRound();
                } catch (error) {}
            }}
        >
            <Box pos="absolute" bottom={0} w="90vw" left="5vw">
                <VStack justify="center">
                    <Text fontFamily="Orbitron" fontWeight={900}>
                        Tap anywhere to continue
                    </Text>
                </VStack>
            </Box>

            <Swiper
                navigation={true}
                pagination={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                style={{
                    width: "100vw",
                    height: "97vh",
                    position: "relative",
                    left: "0vw",
                    borderRadius: "16px",
                    padding: 0,
                    zIndex: 8,
                    top: "0vh",
                }}
            >
                {list.map((item, index) => {
                    return (
                        <SwiperSlide
                            key={index}
                            style={{
                                background: "transparent",
                                height: "84vh",
                                overflow: "visible",
                                zIndex: 110,
                                top: "8vh",
                            }}
                        >
                            <SwiperSlideContent></SwiperSlideContent>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Box>
    );
};
