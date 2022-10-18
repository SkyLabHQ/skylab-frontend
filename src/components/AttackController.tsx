import { Box, Img, Input, Text } from "@chakra-ui/react";
import React, { FC, ChangeEventHandler, useState } from "react";
import { motion } from "framer-motion";

import IconAttack from "../assets/icon-attack.svg";
import IconRight from "../assets/icon-right.svg";
import IconCross from "../assets/icon-cross.svg";
import Bomb from "../assets/bomb.png";
import BombInAttack from "../assets/bomb-in-attack.png";
import AttackItem1 from "../assets/attack-item-1.svg";
import AttackItem2 from "../assets/attack-item-2.svg";
import AttackVector1 from "../assets/attack-vector-1.svg";
import AttackVector2 from "../assets/attack-vector-2.svg";

type Props = {
    onLevelChange: (level: number) => void;
    onAttackConfirm: () => void;
};

export const AttackController: FC<Props> = ({
    onLevelChange,
    onAttackConfirm,
}) => {
    const [level, setLevel] = useState<number | "">("");
    const [bombNum, setBombNum] = useState<number | "">("");
    const [startAttack, setStartAttack] = useState(false);

    const handleLevelChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event.target.value) {
            setLevel("");
            return;
        }

        const number = parseInt(event.target.value, 10);
        if (number > 0 && number < 9) {
            onLevelChange(number);
            setLevel(number);
        }
    };

    const handleBombNumChange: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        if (!event.target.value) {
            setBombNum("");
            return;
        }

        const number = parseInt(event.target.value, 10);
        if (number > 0 && number < 7) {
            setBombNum(number);
        }
    };

    const onAttack = () => {
        if (!level || !bombNum) {
            return;
        }
        onAttackConfirm();
        setStartAttack(true);
    };

    return (
        <Box>
            <Box
                pos="absolute"
                top="22vh"
                left="8vw"
                display="flex"
                alignItems="center"
            >
                <Img src={AttackItem1} marginRight="32px" />
                <Text>Attack</Text>
                <Img src={IconAttack} margin="0 10px" />
                <Text marginRight="14px">Level</Text>
                <Input
                    variant="unstyled"
                    borderBottom="2px solid white"
                    borderRadius="none"
                    w="3vw"
                    minW="3vw"
                    fontSize="32px"
                    textAlign="center"
                    value={level}
                    onChange={handleLevelChange}
                />
            </Box>
            <Box
                pos="absolute"
                top="33vh"
                left="8vw"
                display="flex"
                alignItems="center"
            >
                <Img src={AttackItem2} marginRight="32px" />
                <Text>Choose</Text>
                <Img src={IconRight} margin="0 10px" />
                <Box pos="relative">
                    <Input
                        variant="unstyled"
                        borderRadius="none"
                        w="3vw"
                        fontSize="32px"
                        textAlign="center"
                        value={bombNum}
                        onChange={handleBombNumChange}
                    />
                    <Box
                        pos="absolute"
                        left="0"
                        bottom="0"
                        w="3vw"
                        h="2vh"
                        bg="linear-gradient(180deg, rgba(255, 39, 124, 0) 39.58%, #FF2784 100%)"
                        pointerEvents="none"
                    />
                </Box>

                <Img src={IconCross} margin="0 10px" />
                <Img src={startAttack ? BombInAttack : Bomb} />
                <Img
                    src={startAttack ? AttackVector2 : AttackVector1}
                    w="20vw"
                    h="11vh"
                    maxW="inherit"
                    pos="absolute"
                    right="-35vw"
                    bottom="-4vh"
                />
            </Box>
            <motion.div
                style={{
                    position: "absolute",
                    left: "14vw",
                    top: "47vh",
                    borderRadius: 15,
                    border: "4px solid #FFFFFF",
                    padding: "20px 40px",
                    fontWeight: 500,
                    fontSize: 48,
                    lineHeight: 1.25,
                    fontFamily: "Orbitron",
                    cursor: level && bombNum ? "pointer" : "not-allowed",
                }}
                variants={{
                    active: {
                        borderColor: "#FF2784",
                        color: "#FF2784",
                    },
                    inactive: {
                        borderColor: "#FFFFFF",
                        color: "#FFFFFF",
                        transition: { duration: 2 },
                    },
                }}
                animate={startAttack ? "active" : "inactive"}
                onClick={onAttack}
            >
                Attack
            </motion.div>
        </Box>
    );
};
