import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import GameLoadingBackground from "../assets/game-loading-background.png";
import Planet from "../assets/attack-planet.svg";
import Factory1 from "../assets/factory-1.svg";
import Factory2 from "../assets/factory-2.svg";
import Factory3 from "../assets/factory-3.svg";
import Factory4 from "../assets/factory-4.svg";
import Factory5 from "../assets/factory-5.svg";
import Factory6 from "../assets/factory-6.svg";
import Factory7 from "../assets/factory-7.svg";
import Factory8 from "../assets/factory-8.svg";
import Explode from "../assets/explode.gif";
import { AttackController } from "../components/AttackController";
import { AttackResult } from "../components/AttackResult";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";

const FactoryList = [
    Factory1,
    Factory2,
    Factory3,
    Factory4,
    Factory5,
    Factory6,
    Factory7,
    Factory8,
];

const Attack = () => {
    const [planetDeg, setPlanetDeg] = useState<number>(4.5);
    const [level, setLevel] = useState<number>();
    const [isAttackConfirmed, setIsAttackConfirmed] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isWin, setIsWin] = useState<boolean>();
    const { setIsKnobVisible } = useKnobVisibility();

    const showIntermediateStatus = typeof isWin === "boolean" && !isFinished;

    const onLevelChange = (level: number) => {
        setPlanetDeg(planetDeg - 90);
        setLevel(level);
    };

    const onAttackConfirm = () => {
        setIsAttackConfirmed(true);
        setTimeout(() => {
            setIsWin(true);
        }, 1000);
        setTimeout(() => {
            setIsFinished(true);
        }, 3000);
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    });

    return (
        <Box
            pos="relative"
            bgImg={GameLoadingBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
            fontSize="40px"
            fontFamily="Quantico"
            userSelect="none"
        >
            <AnimatePresence>
                {showIntermediateStatus ? (
                    <motion.div
                        style={{ position: "absolute" }}
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                    >
                        <Box
                            pos="absolute"
                            left="0"
                            top="0"
                            w="100vw"
                            h="100vh"
                            bg="linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 119.26%)"
                        />
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <AnimatePresence>
                {isFinished ? null : (
                    <motion.div
                        style={{ position: "absolute" }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -500, opacity: 0 }}
                    >
                        <AttackController
                            onAttackConfirm={onAttackConfirm}
                            onLevelChange={onLevelChange}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isFinished ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AttackResult win={isWin!} />
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <motion.img
                src={Planet}
                style={{
                    position: "absolute",
                    right: "-21vw",
                    bottom: "-74vh",
                }}
                initial={{ rotate: "4.5deg" }}
                animate={{ rotate: `${planetDeg}deg` }}
            />

            {FactoryList.map((item, index) => (
                <AnimatePresence>
                    {index + 1 === level ? (
                        <motion.img
                            src={item}
                            style={{
                                position: "absolute",
                                right: `${7 - index * 0.5}vw`,
                                bottom: `${40 - index * 0.5}vh`,
                                transformOrigin: "50% 68.5vh",
                                width: `${20 + index}vw`,
                                height: `${26 + index}vh`,
                            }}
                            initial={{ rotate: "150deg" }}
                            animate={{ rotate: "-30deg" }}
                            exit={{ rotate: "150deg" }}
                        />
                    ) : null}
                </AnimatePresence>
            ))}

            {isAttackConfirmed && typeof isWin !== "boolean" ? (
                <motion.img
                    src={Explode}
                    style={{
                        position: "absolute",
                        right: "7vw",
                        bottom: "32vh",
                        transformOrigin: "50% 60vh",
                        width: "20vw",
                        height: "26vh",
                    }}
                    initial={{ rotate: "150deg" }}
                    animate={{ rotate: "-30deg" }}
                    exit={{ rotate: "150deg" }}
                />
            ) : null}

            <AnimatePresence>
                {showIntermediateStatus ? (
                    <motion.div
                        style={{ position: "absolute" }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -500, opacity: 0 }}
                    >
                        <Text
                            pos="absolute"
                            w="50vw"
                            textAlign="center"
                            left="27vw"
                            top="46vh"
                            fontSize="80px"
                            fontFamily="Orbitron"
                            fontWeight="500"
                        >
                            {isWin ? "Successful Attack" : "Failed Attack"}
                        </Text>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </Box>
    );
};

export default Attack;
