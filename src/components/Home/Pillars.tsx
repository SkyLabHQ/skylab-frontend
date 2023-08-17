import { compImg } from "@/pages/Home";
import { Heading, Image as ChakraImage, Box, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect } from "react";

const Pillars = (): ReactElement => {
    useEffect(() => {
        const picImg = 59;
        const imgList: any = [];
        const canvas = document.querySelector(".airpod") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        const loadEvent = () => {
            for (let i = 0; i < picImg; i++) {
                const img = new Image();
                img.src = compImg(i);
                imgList.push(img);
            }
        };
        loadEvent();

        const img = new Image();
        img.src = compImg(1);

        img.onload = () => {
            const imgWrapWidth = canvas.offsetWidth;
            const imgHeight = img.height;
            const imgWidth = img.width;
            const canvasHeight = imgWrapWidth * (imgHeight / imgWidth);
            canvas.width = 3840;
            canvas.height = 1940;
            const offset = (window.innerHeight - canvasHeight - 148) / 2 + 148;

            canvas.style.transform = `matrix(1,0,0,1,0,${offset})`;
            context.drawImage(img, 0, 0, 3840, 1940);
        };

        window.addEventListener("scroll", () => {
            const wrapItem = document.querySelector(
                ".airpod-wrap",
            ) as HTMLElement;

            if (!wrapItem) return;

            const scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            let index = 1;

            if (scrollTop > wrapItem.offsetTop) {
                const delTop = scrollTop - wrapItem.offsetTop;

                const num = Math.floor(
                    (wrapItem.offsetHeight - window.innerHeight) / picImg,
                );
                index = Math.floor(delTop / num);
            } else {
                index = 1;
            }

            requestAnimationFrame(() => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(
                    imgList[Math.min(index, picImg - 1)],
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );
            });
        });
    }, []);
    return (
        <Box
            sx={{
                margin: "0 auto",
                position: "relative",
                width: "100%",
                padding: "0 200px",
            }}
            className="airpod-wrap"
        >
            <Box
                sx={{
                    height: "250vh",
                    position: "relative",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        position: "sticky",
                        left: "0",
                        top: 0,
                        height: "100vh",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            flexDirection: "column",
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: "48px",
                                color: "#FDE1B9",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderBottom: "2px solid #FDE1B9",
                            }}
                        >
                            Primitives Initialize
                        </Text>
                        <Text
                            sx={{
                                fontSize: "48px",
                                color: "#FDE1B9",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderBottom: "2px solid #FDE1B9",
                            }}
                        >
                            On-chain Open World
                        </Text>
                    </Box>

                    <canvas
                        style={{
                            position: "absolute",
                            right: "-216px",
                            top: 0,
                            width: "100%",
                            maxWidth: "2000px",
                        }}
                        className="airpod"
                    ></canvas>
                </Box>
            </Box>
        </Box>
    );
};

export default Pillars;
