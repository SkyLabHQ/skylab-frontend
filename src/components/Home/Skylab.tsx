import { Box, Image, useMediaQuery } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import Title from "@/components/Home/assets/skylab-title.png";
import LeftLine from "@/components/Home/assets/left-line.svg";
import RightLine from "@/components/Home/assets/right-line.svg";
import DiamondSolid from "@/components/Home/assets/diamond-solid.svg";
import DiamondDash from "@/components/Home/assets/diamond-dash.svg";

const TextItem = ({ value }: { value: string }) => {
    const [isLargerThan1900] = useMediaQuery("(min-width: 1900px)");
    const [isLargerThan1400] = useMediaQuery([
        "(min-width: 1400px)",
        "max-width: 1900px",
    ]);
    return (
        <Box
            sx={{
                height: "96px",
                fontSize: isLargerThan1900
                    ? "32px"
                    : isLargerThan1400
                    ? "28px"
                    : "24px",
                fontWeight: 700,
                color: "#FBD161",
                backgroundImage: `url(${LeftLine}), url(${RightLine})`,
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "0 0, right",
                backgroundSize: "contain, contain",
                padding: "0 20px",
                lineHeight: "96px",
                display: "inline-block",
            }}
        >
            {value}
        </Box>
    );
};

const Skylab = () => {
    const [isLargerThan1400] = useMediaQuery(["(min-width: 1400px)"]);
    const [status, setStatus] = React.useState({
        state: 0,
        progress: 0,
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            const wrapItem = document.querySelector(
                ".skylab-wrap",
            ) as HTMLElement;

            const offsetTop = wrapItem.offsetTop;
            const offsetHeight = wrapItem.offsetHeight;
            const avageHeight = (offsetHeight - window.innerHeight) / 2;
            if (scrollTop >= offsetTop && scrollTop < offsetTop + avageHeight) {
                setStatus({
                    state: 1,
                    progress: Math.floor(
                        ((scrollTop - offsetTop) * 100) / avageHeight,
                    ),
                });
            } else if (
                scrollTop >= offsetTop + avageHeight &&
                scrollTop < offsetTop + avageHeight * 2
            ) {
                setStatus({
                    state: 2,
                    progress: Math.floor(
                        ((scrollTop - offsetTop - avageHeight) * 100) /
                            avageHeight,
                    ),
                });
            } else if (scrollTop >= offsetTop + avageHeight * 2) {
                setStatus({
                    state: 2,
                    progress: 100,
                });
            } else {
                setStatus({
                    state: 0,
                    progress: 0,
                });
            }

            requestAnimationFrame(() => {});
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const buildTextPos = useMemo(() => {
        if (status.state === 0) {
            return {
                left: "50%",
                top: "210px",
                opacity: 1,
                transform: "translateX(-100%)",
            };
        } else if (status.state === 1) {
            return {
                left: "50%",
                transform: `translateX(-${
                    100 + (10 * status.progress) / 100
                }%)`,
                top: 216 + (30 * status.progress) / 100 + "px",
                opacity: 1 - (0.5 * status.progress) / 100,
            };
        } else if (status.state === 2) {
            return {
                left: "50%",
                transform: `translateX(-${
                    110 + (10 * status.progress) / 100
                }%)`,
                top: 246 + (50 * status.progress) / 100 + "px",
                opacity: 0.5,
            };
        }
    }, [status]);

    const supportTextPos = useMemo(() => {
        if (status.state === 0) {
            return {
                opacity: 0,
            };
        } else if (status.state === 1) {
            return {
                left: "50%",
                transform: `translateX(-${100 + (5 * status.progress) / 100}%)`,
                top: "116px",
                opacity: (10 * status.progress) / 100,
            };
        } else if (status.state === 2) {
            return {
                left: "50%",
                transform: `translateX(-${
                    105 + (10 * status.progress) / 100
                }%)`,
                top: 116 + (50 * status.progress) / 100 + "px",
                opacity: 1 - (0.5 * status.progress) / 100,
            };
        }
    }, [status]);

    const worldTextPos = useMemo(() => {
        if (status.state === 0) {
            return {
                opacity: 0,
            };
        } else if (status.state === 1) {
            return {
                left: 40 - (10 * status.progress) / 100 + "%",
                top: 0 + (50 * status.progress) / 100 + "px",
                opacity: 0,
            };
        } else if (status.state === 2) {
            return {
                left: "50%",
                transform: `translateX(-${60 + (10 * status.progress) / 100}%)`,
                top: "20px",
                opacity: (1 * status.progress) / 100,
            };
        }
    }, [status]);

    const firstDiamondPos = useMemo(() => {
        if (status.state === 1) {
            return {
                left: "0px",
                top: (-88 * status.progress) / 100 + "px",
            };
        } else if (status.state === 2) {
            return {
                left: "0px",
                top: "-88px",
                opacity: 1 - (0.5 * status.progress) / 100,
            };
        } else {
            return {
                left: "0px",
                top: "0px",
            };
        }
    }, [status]);

    const secondDiamondPos = useMemo(() => {
        if (status.state === 1) {
            return {
                left: "0px",
                top: 0,
            };
        } else if (status.state === 2) {
            return {
                left: "0px",
                top: 0,
                opacity: 1 - (0.2 * status.progress) / 100,
            };
        } else {
            return {
                left: "0px",
                top: "0px",
            };
        }
    }, [status]);

    const thirdDiamondPos = useMemo(() => {
        if (status.state === 1) {
            return {
                left: "0px",
                top: (88 * status.progress) / 100 + "px",
            };
        } else if (status.state === 2) {
            return {
                left: "0px",
                top: "88px",
            };
        } else {
            return {
                left: "0px",
                top: "0px",
            };
        }
    }, [status]);

    return (
        <Box
            id="skylab"
            sx={{
                height: "450vh",
            }}
            className="skylab-wrap"
        >
            <Box
                sx={{
                    position: "sticky",
                    top: "0%",
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ width: "100%", paddingTop: "20vh" }}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Image src={Title} sx={{ height: "80px" }}></Image>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            position: "relative",
                            marginTop: "90px",
                        }}
                    >
                        <Box sx={{ width: "100%", top: 0 }}>
                            <Box
                                sx={{
                                    position: "absolute",
                                    ...worldTextPos,
                                }}
                            >
                                <TextItem value="To form an engaging open world"></TextItem>
                            </Box>
                            <Box
                                sx={{
                                    position: "absolute",
                                    ...supportTextPos,
                                }}
                            >
                                <TextItem value="Support game creators"></TextItem>
                            </Box>
                            <Box
                                sx={{
                                    position: "absolute",
                                    ...buildTextPos,
                                }}
                            >
                                <TextItem value="Build Primitives and Initial Games"></TextItem>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                left: "60%",
                                top: "100px",
                                transform: "translateX(50%)",
                                width: isLargerThan1400 ? "377px" : "300px",
                            }}
                        >
                            <Image
                                src={
                                    status.state === 2
                                        ? DiamondDash
                                        : DiamondSolid
                                }
                                sx={{
                                    position: "absolute",

                                    ...firstDiamondPos,
                                }}
                            ></Image>
                            <Image
                                src={
                                    status.state === 2
                                        ? DiamondDash
                                        : DiamondSolid
                                }
                                sx={{
                                    position: "absolute",
                                    ...secondDiamondPos,
                                }}
                            ></Image>
                            <Image
                                src={DiamondSolid}
                                sx={{
                                    position: "absolute",
                                    ...thirdDiamondPos,
                                }}
                            ></Image>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Skylab;
