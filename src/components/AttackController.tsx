import { Box, HStack, Img, Input, Text } from "@chakra-ui/react";
import React, { FC, ChangeEventHandler, useState } from "react";
import { motion } from "framer-motion";

import IconAttack from "../assets/icon-attack.svg";
import Bomb from "../assets/bomb-in-attack.png";
import AttackItem from "../assets/attack-item.svg";
import AttackButton from "../assets/attack-button.svg";
import styled from "@emotion/styled";

type Props = {
    onLevelChange: (level: number) => void;
    onAttackConfirm: () => void;
};

const AttackBox = styled(HStack)({
    background:
        "radial-gradient(60.21% 60.21% at 50% 50%, rgba(233, 175, 55, 0.4) 0%, rgba(99, 238, 205, 0.4) 100%)",
    border: "1px solid #FFFFFF",
    borderRadius: "40px",
    width: "35vw",
    padding: "40px 80px 20px",
    justifyContent: "space-between",
});

const AttackInput = styled(Input)({
    background: "rgba(217, 217, 217, 0.5)",
    border: "3px solid #FFFFFF",
    borderRadius: "10px",
    color: "#8DF6F5",
    width: "200px",
    fontSize: "96px",
    textAlign: "center",
});

export const AttackController: FC<Props> = ({
    onLevelChange,
    onAttackConfirm,
}) => {
    const [level, setLevel] = useState<number | undefined>();
    const [bombNum, setBombNum] = useState<number | undefined>();

    const handleLevelChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event.target.value) {
            setLevel(undefined);
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
        const val = parseInt(event.currentTarget.value, 10);
        if (Number.isNaN(val)) {
            setBombNum(undefined);
        } else {
            setBombNum(val);
        }
    };

    const onAttack = () => {
        if (!level || !bombNum) {
            return;
        }
        onAttackConfirm();
    };

    return (
        <Box>
            <Box pos="absolute" top="14vh" left="10vw">
                <Box
                    bg={`url(${AttackItem}) no-repeat`}
                    bgSize="cover"
                    w="30vw"
                    pl="100px"
                    mb="12px"
                >
                    <Text fontFamily="Quantico" fontSize="32px">
                        Attack
                    </Text>
                </Box>
                <AttackBox>
                    <Box>
                        <Img src={IconAttack} w="100px" mb="8px" />
                        <Text fontFamily="Quantico" fontSize="40px">
                            Level
                        </Text>
                    </Box>

                    <AttackInput
                        variant="unstyled"
                        value={level}
                        onChange={handleLevelChange}
                    />
                </AttackBox>
            </Box>
            <Box pos="absolute" top="45vh" left="10vw">
                <Box
                    bg={`url(${AttackItem}) no-repeat`}
                    bgSize="cover"
                    w="30vw"
                    pl="100px"
                    mb="12px"
                >
                    <Text fontFamily="Quantico" fontSize="32px">
                        Load
                    </Text>
                </Box>
                <AttackBox>
                    <Box>
                        <Img src={Bomb} w="100px" mb="8px" />
                        <Text fontFamily="Quantico" fontSize="40px">
                            Bomb
                        </Text>
                    </Box>

                    <AttackInput
                        variant="unstyled"
                        value={bombNum}
                        onChange={handleBombNumChange}
                    />
                </AttackBox>
            </Box>

            <Box pos="absolute" top="75vh" left="12vw" w="30vw">
                <Img
                    onClick={onAttack}
                    src={AttackButton}
                    cursor={level && bombNum ? "pointer" : "not-allowed"}
                />
            </Box>
        </Box>
    );
};
