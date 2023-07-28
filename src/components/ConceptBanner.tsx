import { Heading, Image, Box, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import Primitives from "@/components/Home/assets/primitive.png";
import Rectangles from "@/components/Home/assets/rectangles.svg";
import TextImg2 from "@/components/Home/assets/textImg2.svg";
import TextImg3 from "@/components/Home/assets/textImg3.svg";
import Vet from "@/components/Home/assets/vet.svg";
import Aiming from "@/components/Home/assets/aiming.svg";

const Content = ({ textImg }: { textImg: string }) => {
    return (
        <Box
            sx={{
                width: "610px",
                height: "172px",
                background: `url(${textImg})`,
                backgroundRepeat: "no-repeat",
                position: "relative",
                transition: "all 0.5s ease",
                "&:hover >div": {
                    background: "transparent",
                    backdropFilter: "none",
                },
                "&:hover img": {
                    transform: "rotate(90deg)",
                },
            }}
        >
            <Box
                sx={{
                    width: "calc(100% - 4px)",
                    height: "calc(100% - 6px)",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(253, 225, 185, 0.20)",
                    backdropFilter: "blur(11px)",
                    transition: "all 0.5s ease",
                }}
            ></Box>
            <Image
                src={Aiming}
                sx={{
                    position: "absolute",
                    left: "-100px",
                    top: "-16px",
                    transition: "all 0.5s ease",
                    transform: "rotate(45deg)",
                }}
            ></Image>
        </Box>
    );
};

const ConceptBanner = (): ReactElement => {
    return (
        <Box
            alignItems="center"
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Orbitron",
                paddingTop: "50px",
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    maxWidth: "1500px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "#fde189",
                        fontSize: "16px",
                    }}
                >
                    <Text>CLASSIFIED TOP SECRET</Text>
                    <Text>CAUTIOUS DRIVING</Text>
                </Box>
                <Box sx={{ background: "#FDE1B933" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            borderBottom: "2px solid #fde189",
                        }}
                    >
                        <Image
                            width="30%"
                            src={Vet}
                            sx={{ position: "absolute", left: 0 }}
                        ></Image>
                        <Text
                            sx={{
                                fontSize: "48px",
                                color: "#fde189",
                                fontWeight: "600",
                            }}
                        >
                            Primitives Definition
                        </Text>
                        <Image
                            src={Vet}
                            width="30%"
                            sx={{ position: "absolute", right: 0 }}
                        ></Image>
                    </Box>

                    <Box
                        sx={{
                            borderBottom: "2px solid #fde189",
                            paddingBottom: "40px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "40px",
                            }}
                        >
                            <Content textImg={Rectangles}></Content>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: "200px",
                                marginTop: "60px",
                            }}
                        >
                            <Content textImg={TextImg2}></Content>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingRight: "80px",
                                marginTop: "40px",
                            }}
                        >
                            <Content textImg={TextImg3}></Content>
                        </Box>
                    </Box>

                    <Box sx={{ paddingBottom: "26px" }}>
                        <Box
                            sx={{
                                background: `url(${Vet})`,
                                height: "30px",
                                marginTop: "16px",
                            }}
                        ></Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ConceptBanner;
