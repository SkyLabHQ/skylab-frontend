import { Box, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, RefObject, useEffect, useRef, useState } from "react";

import BasicAviation from "../assets/basic-aviation.svg";

type Props = {
    bottomRef: RefObject<HTMLDivElement>;
    setShowAviationOverlay: (level: number) => void;
};

const Arrow: FC<{ color: string }> = ({ color }) => (
    <svg width="46" height="39" viewBox="0 0 46 39" fill="none">
        <path
            d="M20.8787 38.1213C22.0503 39.2929 23.9497 39.2929 25.1213 38.1213L44.2132 19.0294C45.3848 17.8579 45.3848 15.9584 44.2132 14.7868C43.0416 13.6152 41.1421 13.6152 39.9706 14.7868L23 31.7574L6.02944 14.7868C4.85787 13.6152 2.95837 13.6152 1.7868 14.7868C0.615224 15.9584 0.615224 17.8579 1.7868 19.0294L20.8787 38.1213ZM20 1.40709e-07L20 36L26 36L26 -1.40709e-07L20 1.40709e-07Z"
            fill={color}
        />
        <defs>
            <linearGradient
                id="linear"
                x1="23.5"
                y1="-2.34514e-08"
                x2="23.5"
                y2="36"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#13FFDA" />
                <stop offset="0.494792" stopColor="#39ACFF" />
                <stop offset="1" stopColor="#FF2784" />
            </linearGradient>
        </defs>
    </svg>
);

export const BeginJourney: FC<Props> = ({
    bottomRef,
    setShowAviationOverlay,
}) => {
    const [showBasicButton, setShowBasicButton] = useState(true);
    const [hasScrollToBottom, setHasScrollToBottom] = useState(false);
    const [arrowColor, setArrowColor] = useState("white");
    const buttonClickedRef = useRef(false);

    const onClick = () => {
        setShowBasicButton(false);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        buttonClickedRef.current = true;
    };

    useEffect(() => {
        const listener = () => {
            setShowBasicButton(document.documentElement.scrollTop < 150);
            setHasScrollToBottom(
                document.documentElement.scrollHeight -
                    document.documentElement.scrollTop -
                    window.innerHeight <
                    150,
            );
            if (
                buttonClickedRef.current &&
                document.documentElement.scrollTop >
                    document.body.scrollHeight - window.innerHeight - 100
            ) {
                setTimeout(() => {
                    setShowAviationOverlay(1);
                    buttonClickedRef.current = false;
                }, 100);
            }
        };
        window.addEventListener("scroll", listener);
        return () => {
            window.removeEventListener("scroll", listener);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {showBasicButton ? (
                    <motion.div
                        style={{
                            position: "absolute",
                            width: "40vw",
                            left: "30vw",
                            top: "34vw",
                            cursor: "pointer",
                        }}
                        onClick={onClick}
                        initial={{ x: -500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box
                            padding="40px"
                            w="100%"
                            textAlign="center"
                            pos="absolute"
                            border="8px solid #13FFDA"
                            borderRadius="50px"
                            mixBlendMode="lighten"
                        >
                            <Text
                                color="#13FFDA"
                                fontSize="48px"
                                fontFamily="Orbitron"
                                fontWeight="600"
                                mixBlendMode="lighten"
                            >
                                Begin Journey
                            </Text>
                        </Box>
                        <Box
                            padding="40px"
                            w="100%"
                            textAlign="center"
                            pos="absolute"
                            border="8px solid #39ACFF"
                            borderRadius="50px"
                            mixBlendMode="lighten"
                            transform="matrix(1, 0.01, -0.01, 1, 0, 0);"
                        >
                            <Text
                                color="#39ACFF"
                                fontSize="48px"
                                fontFamily="Orbitron"
                                fontWeight="600"
                                mixBlendMode="lighten"
                            >
                                Begin Journey
                            </Text>
                        </Box>
                        <Box
                            padding="40px"
                            w="100%"
                            textAlign="center"
                            pos="absolute"
                            border="8px solid #FF2784"
                            borderRadius="50px"
                            mixBlendMode="lighten"
                            transform="matrix(1, -0.01, 0.01, 1, 0, 0);"
                        >
                            <Text
                                color="#FF2784"
                                fontSize="48px"
                                fontFamily="Orbitron"
                                fontWeight="600"
                                mixBlendMode="lighten"
                            >
                                Begin Journey
                            </Text>
                        </Box>
                    </motion.div>
                ) : null}
            </AnimatePresence>
            <AnimatePresence>
                {!showBasicButton && !hasScrollToBottom ? (
                    <motion.div
                        style={{
                            cursor: "pointer",
                            position: "fixed",
                            bottom: "2vh",
                            right: 0,
                        }}
                        initial={{ x: -500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ y: -300, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={onClick}
                    >
                        <motion.img
                            src={BasicAviation}
                            whileHover={{ transform: "rotate(45deg)" }}
                            onHoverStart={() => setArrowColor("url(#linear)")}
                            onHoverEnd={() => setArrowColor("white")}
                        />
                        <Box pos="absolute" top="94px" left="88px">
                            <Arrow color={arrowColor} />
                        </Box>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
};
