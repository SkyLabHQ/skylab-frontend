import React, { FC, useEffect, useReducer, useRef } from "react";
import { Box, Img, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

import GameLoadingBackground from "../assets/game-loading-background.png";
import Helicopter from "../assets/helicopter.svg";
import { useGameContext } from "../pages/Game";
import { useSkylabGameFlightRaceContract } from "../hooks/useContract";

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

export const GameLoading: FC<Props> = ({}) => {
    const [_, forceRender] = useReducer((x) => x + 1, 0);
    const { onNext, tokenId } = useGameContext();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const searchIntervalRef = useRef<number>();
    const progress = useRef(0);

    const waitingForOpponent = async () => {
        const res = await skylabGameFlightRaceContract?.matchedAviationIDs(
            tokenId,
        );
        if (res.toString() !== "0") {
            onNext(1);
        }
    };

    const searchOpponent = async () => {
        searchIntervalRef.current = window.setInterval(() => {
            waitingForOpponent();
        }, 5000);
    };

    const calculateStep = () => {
        if (searchIntervalRef.current) {
            if (progress.current < 50) {
                return 5;
            } else if (progress.current < 75) {
                return 2;
            } else if (progress.current < 95) {
                return 1;
            }
            return 0;
        }
        return 5;
    };

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        searchOpponent();
        return () => {
            if (searchIntervalRef.current) {
                clearInterval(searchIntervalRef.current);
            }
        };
    }, [skylabGameFlightRaceContract, tokenId]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // const step = calculateStep();
            // temporarily hardcode step before contract is ready
            const step = 5;
            const nextValue = progress.current + step;
            if (nextValue >= 100) {
                clearInterval(intervalId);
                // onNext();
            } else {
                progress.current = nextValue;
            }
            forceRender();
        }, 250);
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
