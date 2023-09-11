import React, { useEffect, useMemo, useState } from "react";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { handleError } from "@/utils/error";
import { Box, Text } from "@chakra-ui/react";
import useCountDown from "react-countdown-hook";
import { GameState } from ".";

const Timeout = 30 * 1000;

const Timer = ({
    myGameInfo,
    opGameInfo,
    autoBid,
}: {
    myGameInfo?: GameInfo;
    opGameInfo?: GameInfo;
    autoBid?: (bidAmount: number) => void;
}) => {
    const toast = useSkyToast();
    const [init, setInit] = useState(false);
    const { bidTacToeGameAddress, tokenId } = useGameContext();
    const [timeLeft, { start }] = useCountDown(0, 1000);
    const [opTimeLeft, { start: opStart }] = useCountDown(0, 1000);
    const [actullyTimeLeft, { start: actullyStart }] = useCountDown(0, 1000);

    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
    useEffect(() => {
        const time =
            myGameInfo.timeout >= opGameInfo.timeout
                ? myGameInfo.timeout
                : opGameInfo.timeout;

        const actullyTimeLeft =
            time * 1000 > Math.floor(Date.now())
                ? time * 1000 - Math.floor(Date.now())
                : 0;

        const delTime =
            actullyTimeLeft > Timeout ? actullyTimeLeft - Timeout : 0;
        start(delTime);
        actullyStart(delTime);
        setInit(true);
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
        if (!init) {
            return;
        }
        if (opTimeLeft !== 0) {
            return;
        }

        if (
            myGameInfo.gameState === GameState.Unknown ||
            opGameInfo.gameState === GameState.Unknown
        ) {
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

    const handleAutoCommit = async () => {
        if (
            timeLeft === 0 &&
            myGameInfo.gameState === GameState.WaitingForBid
        ) {
            // 自动提交0
            console.log("auto bid");
            autoBid(0);
        }
    };

    useEffect(() => {
        // handleCallTimeOut();
    }, [myGameInfo.gameState, opGameInfo.gameState, opTimeLeft]);

    useEffect(() => {
        handleAutoCommit();
    }, [myGameInfo.gameState]);

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
