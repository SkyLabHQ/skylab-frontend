import { Heading, Image as ChakraImage, Box, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect } from "react";
import Vet from "@/components/Home/assets/vet.svg";

const airpdImg = (index: number) => {
    const index1 = index + 100;
    const url = require(`@/components/Home/assets/comp/Pre-comp 5_${index1}.png`);
    return url;
};

const Pillars = (): ReactElement => {
    useEffect(() => {
        const picImg = 59;
        const imgList: any = [];
        const canvas = document.querySelector(".airpod") as HTMLCanvasElement;
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        const imgWrapWidth = canvas.offsetWidth;
        const loadEvent = () => {
            for (let i = 0; i < picImg; i++) {
                const img = new Image();
                img.src = airpdImg(i);
                imgList.push(img);
            }
        };
        loadEvent();

        const img = new Image();
        img.src = airpdImg(1);

        img.onload = () => {
            const imgHeight = img.height;
            const imgWidth = img.width;
            const canvasHeight = imgWrapWidth * (imgHeight / imgWidth);
            canvas.width = 1920;
            canvas.height = 990;
            const offset =
                canvasHeight > window.innerHeight - 74
                    ? (canvasHeight - 74 - window.innerHeight) / 2
                    : (window.innerHeight - 74 - canvasHeight) / 2;

            canvas.style.transform = `matrix(1,0,0,1,0,${offset})`;
            context.drawImage(img, 0, 0, 1920, 990);
        };

        window.addEventListener("scroll", () => {
            const wrapItem = document.querySelector(
                ".airpod-wrap",
            ) as HTMLElement;

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
                maxWidth: "1500px",
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
                        maxWidth: "1500px",
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            borderBottom: "2px solid #FDE1B9",
                        }}
                    >
                        <Box
                            sx={{
                                background: `url(${Vet})`,
                                height: "30px",
                                flex: 1,
                            }}
                        ></Box>
                        <Text
                            sx={{
                                fontSize: "48px",
                                color: "#FDE1B9",
                                margin: "0 30px",
                                fontWeight: "bold",
                            }}
                        >
                            Primitives Initialize On-chain Open World
                        </Text>
                        <Box
                            sx={{
                                background: `url(${Vet})`,
                                height: "30px",
                                flex: 1,
                            }}
                        ></Box>
                    </Box>

                    <canvas
                        style={{
                            width: "100%",
                        }}
                        className="airpod"
                    ></canvas>
                </Box>
            </Box>
        </Box>
    );
};

export default Pillars;
