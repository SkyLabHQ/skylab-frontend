import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { handleError } from "@/utils/error";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";
import useCountDown from "react-countdown-hook";
import { GameState } from ".";

const Timeout = 300 * 1000;

const Timer = ({
    myGameInfo,
    opGameInfo,
}: {
    myGameInfo?: GameInfo;
    opGameInfo?: GameInfo;
}) => {
    const toast = useSkyToast();
    const { myInfo, opInfo, bidTacToeGameAddress, tokenId } = useGameContext();
    const [timeLeft, { start }] = useCountDown(0, 1000);
    const [opTimeLeft, { start: opStart }] = useCountDown(0, 1000);
    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
    useEffect(() => {
        const time =
            myGameInfo.timeout >= opGameInfo.timeout
                ? myGameInfo.timeout
                : opGameInfo.timeout;
        start(
            time * 1000 > Math.floor(Date.now())
                ? time * 1000 - Math.floor(Date.now())
                : 0,
        );
    }, [myGameInfo.timeout, opGameInfo.timeout]);

    useEffect(() => {
        const time = myGameInfo.timeout;
        opStart(
            time * 1000 > Math.floor(Date.now())
                ? time * 1000 - Math.floor(Date.now())
                : 0,
        );
    }, [opGameInfo.timeout]);

    const { minutes, second } = useMemo(() => {
        let minutes: string | number = Math.floor(timeLeft / 60000);
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        let second: string | number = Math.floor((timeLeft / 1000) % 60);
        if (second < 10) {
            second = `0${second}`;
        }

        return { minutes, second };
    }, [timeLeft]);

    const handleCallTimeOut = async () => {
        if (opTimeLeft !== 0) {
            return;
        }

        if (myGameInfo.gameState > GameState.Revealed) {
            return;
        }
        if (myGameInfo.gameState < opGameInfo.gameState) {
            return;
        }

        try {
            await tacToeGameRetryWrite("claimTimeoutPenalty", [], 200000);
        } catch (e) {
            console.log(e);
            toast(handleError(e));
        }
    };

    useEffect(() => {
        handleCallTimeOut();
    }, [myGameInfo.gameState, opGameInfo.gameState, opTimeLeft]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                width: "fit-content",
                left: "50%",
                transform: "translateX(-50%)",
            }}
        >
            <Box
                sx={{
                    border: "3px solid #FFF",
                    width: "412px",
                    background: "transparent",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "0 7px",
                }}
            >
                <Box
                    sx={{
                        height: "25px",
                        width: (timeLeft / Timeout) * 100 + "%",
                        background: "#fff",
                    }}
                ></Box>
            </Box>
            <Text
                sx={{
                    fontSize: "36px",
                    position: "absolute",
                    right: "-140px",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            >
                {minutes}:{second}
            </Text>
        </Box>
    );
};

export default Timer;
