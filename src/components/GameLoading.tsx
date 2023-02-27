import { Box, Img, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { FC, useEffect, useReducer, useRef } from "react";
import { motion } from "framer-motion";

import GameLoadingBackground from "../assets/game-loading-background.png";
import Helicopter from "../assets/helicopter.svg";
import { useGameContext } from "../pages/Game";

type Props = {};

const Progress = styled.div`
    flex: 1;
    margin-right: 5vw;
    height: 10px;
    background: linear-gradient(
        to right,
        rgb(19, 255, 218),
        rgb(35, 126, 255) 50%,
        rgb(255, 57, 140)
    );
`;

const duration = 5;
const step = 5;
const interval = Math.floor((duration * 1000) / (100 / step));

export const GameLoading: FC<Props> = ({}) => {
    const progress = useRef(0);
    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const { onNext } = useGameContext();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextValue = progress.current + step;
            if (nextValue >= 100) {
                clearInterval(intervalId);
                onNext();
            }
            progress.current = nextValue;
            forceRender();
        }, interval);
    }, []);

    return (
        <Box
            pos="relative"
            bgImage={GameLoadingBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            <motion.div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "41vh",
                    position: "relative",
                }}
                initial={{ width: "34vw" }}
                animate={{ width: "100vw" }}
                transition={{ duration }}
            >
                <Progress />
                <Img
                    pos="absolute"
                    right="310px"
                    top="-2vh"
                    src={Helicopter}
                    width="18vw"
                />
                <Text width="388px" fontSize="128px" color="white">
                    {progress.current}%
                </Text>
            </motion.div>
        </Box>
    );
};
