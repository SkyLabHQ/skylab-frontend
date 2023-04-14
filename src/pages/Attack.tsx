import { Box, Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useEffect, useState, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AttackBackground from "../assets/attack-background.png";
import Planet from "../assets/attack-planet.svg";
import WinningEffect from "../assets/attack-winning-effect.svg";
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
import { AttackProgress } from "../components/AttackProgress";
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

const FinishButton = styled(Button)({
    position: "absolute",
    width: "12.5vw",
    background: "rgba(141, 246, 245, 0.2)",
    fontFamily: "Orbitron",
    fontWeight: 700,
    fontSize: "40px",
    border: "1px solid #FFFFFF",
    borderRadius: "40px",
    padding: "4px 0",
    height: "auto",
});

const Attack = () => {
    const [planetDeg, setPlanetDeg] = useState<number>(4.5);
    const [level, setLevel] = useState<number>();
    const [isAttackConfirmed, setIsAttackConfirmed] = useState(false);
    const [isWin, setIsWin] = useState<boolean>();
    const { setIsKnobVisible } = useKnobVisibility();
    const navigate = useNavigate();

    const isFinished = typeof isWin === "boolean";

    const onLevelChange = (level: number) => {
        setPlanetDeg(planetDeg - 90);
        setLevel(level);
    };

    const onAttackConfirm = () => {
        setIsAttackConfirmed(true);
        setTimeout(() => {
            setIsWin(true);
        }, 100 * 50);
    };

    const onBack = () => {
        navigate("/garden");
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    });

    return (
        <Box
            pos="relative"
            bgImg={AttackBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
            fontSize="40px"
            fontFamily="Quantico"
            userSelect="none"
        >
            <AnimatePresence>
                {isAttackConfirmed ? null : (
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
                {isAttackConfirmed && !isFinished ? (
                    <motion.div
                        style={{ position: "absolute" }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -500, opacity: 0 }}
                    >
                        <AttackProgress percentage={100} />
                    </motion.div>
                ) : null}
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

            <AnimatePresence>
                {isWin ? (
                    <motion.img
                        style={{
                            position: "absolute",
                            right: "0",
                        }}
                        src={WinningEffect}
                        initial={{ opacity: 0, scale: 0.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                    />
                ) : null}
            </AnimatePresence>

            {isFinished ? (
                <Fragment>
                    <FinishButton bottom="5vh" right="24vw" onClick={onBack}>
                        Home
                    </FinishButton>
                    <FinishButton bottom="5vh" right="7vw">
                        Share
                    </FinishButton>
                </Fragment>
            ) : null}

            {isAttackConfirmed && !isFinished ? (
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
        </Box>
    );
};

export default Attack;
