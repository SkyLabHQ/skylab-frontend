import { Box, Center, Heading } from "@chakra-ui/react";
import React, { ReactElement, createRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import MintTimeline from "../components/MintTimeline";
import { Aviation } from "../components/Aviation";
import { BeginJourney } from "../components/BeginJourney";
import background from "../assets/mint-background.svg";
import Aviation1 from "../assets/aviation-1.svg";
import Aviation2 from "../assets/aviation-2.svg";
import Aviation3 from "../assets/aviation-3.svg";
import Aviation4 from "../assets/aviation-4.svg";
import Aviation5 from "../assets/aviation-5.svg";
import Aviation6 from "../assets/aviation-6.svg";
import Aviation7 from "../assets/aviation-7.svg";

const Mint = (): ReactElement => {
    const { t } = useTranslation();
    const [containerBackground, setBackground] = useState(
        `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.7) 10%, rgba(5,66,111,0.2) 40%, rgba(255,253,234,0.2)), url(${background})`,
    );
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);
    const bottomRef = createRef<HTMLDivElement>();

    const onPopup = (visible: boolean) => {
        setBackgroundOpacity(1);
        setBackground(
            visible
                ? background
                : `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.7) 10%, rgba(5,66,111,0.2) 40%, rgba(255,253,234,0.2)), url(${background})`,
        );
    };

    const changeBackgroundOnHover = (hover: boolean) => {
        if (hover) {
            setBackgroundOpacity(0.5);
        } else {
            setBackgroundOpacity(1);
        }
    };

    return (
        <motion.div
            style={{
                maxWidth: "100%",
                minHeight: "270vw",
                backgroundImage: containerBackground,
                backgroundSize: "cover",
                backgroundPosition: "top left",
                backgroundRepeat: "no-repeat",
                padding: 0,
            }}
            animate={{ opacity: backgroundOpacity }}
        >
            <Box pt={100} minH="100vh">
                <Center>
                    <Heading
                        pt="3vw"
                        as="h1"
                        fontSize="158px"
                        letterSpacing="wider"
                    >
                        {t("timeline")}
                    </Heading>
                </Center>
                <Box pos="relative" top="-11vw">
                    <MintTimeline />
                    <BeginJourney bottomRef={bottomRef} />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation7}
                        level={7}
                        layout={{
                            container: { top: "7.5vw" },
                            image: { left: "12%", width: "55vw" },
                            text: {
                                fontSize: "5.5vw",
                                top: "27vw",
                                left: "39%",
                            },
                        }}
                    />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation6}
                        level={6}
                        layout={{
                            container: { top: "39vw" },
                            image: {
                                left: "8%",
                                width: "26vw",
                                transform: "rotate(-3deg)",
                            },
                            text: {
                                fontSize: "4vw",
                                top: "17vw",
                                left: "22%",
                                transform: "rotate(-19deg)",
                            },
                        }}
                    />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation5}
                        level={5}
                        layout={{
                            container: { top: "57vw" },
                            image: {
                                left: "31%",
                                width: "33vw",
                            },
                            text: {
                                fontSize: "5vw",
                                top: "26vw",
                                left: "51%",
                                transform: "rotate(-13deg)",
                            },
                        }}
                    />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation4}
                        level={4}
                        layout={{
                            container: { top: "90vw" },
                            image: {
                                left: "8.5%",
                                width: "24vw",
                            },
                            text: {
                                fontSize: "3.5vw",
                                top: "13vw",
                                left: "7.5%",
                                transform: "rotate(-5deg)",
                            },
                        }}
                    />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation3}
                        level={3}
                        layout={{
                            container: { top: "90vw" },
                            image: {
                                left: "37%",
                                width: "43vw",
                            },
                            text: {
                                fontSize: "6vw",
                                top: "34vw",
                                left: "37.5%",
                                transform: "rotate(-5deg)",
                            },
                        }}
                    />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation2}
                        level={2}
                        layout={{
                            container: { top: "137vw" },
                            image: {
                                left: "52%",
                                width: "38.5vw",
                            },
                            text: {
                                fontSize: "4.5vw",
                                top: "26vw",
                                left: "74%",
                                transform: "rotate(3deg)",
                            },
                        }}
                    />
                    <Aviation
                        onPopup={onPopup}
                        changeBackgroundOnHover={changeBackgroundOnHover}
                        img={Aviation1}
                        level={1}
                        layout={{
                            container: { top: "235vw" },
                            image: {
                                left: "32vw",
                                width: "25vw",
                            },
                            text: {
                                fontSize: "2.5vw",
                                top: "17vw",
                                left: "39vw",
                            },
                        }}
                    />
                </Box>
            </Box>
            <Box pos="absolute" bottom="0" ref={bottomRef} />
        </motion.div>
    );
};

export default Mint;
