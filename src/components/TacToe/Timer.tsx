import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { handleError } from "@/utils/error";
import { Box, Text } from "@chakra-ui/react";

import { GameState } from ".";
import BttTimer from "./BttTimer";
import getNowSecondsTimestamp from "@/utils/nowTime";

const SixtySecond = 60 * 1000;
const ThirtySecond = 30 * 1000;

const Timer = ({
    myGameInfo,
    opGameInfo,
    autoBid,
}: {
    myGameInfo?: GameInfo;
    opGameInfo?: GameInfo;
    autoBid?: () => void;
}) => {
    const toast = useSkyToast();
    const { bidTacToeGameAddress, tokenId } = useGameContext();

    const [autoCommitTimeoutTime, setAutoCommitTimeoutTime] = useState(0);
    const [autoCallTimeoutTime, setAutoCallTimeoutTime] = useState(0);
    const needAutoBid = useRef(false);
    const needAutoCallTimeout = useRef(false);

    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );

    //
    useEffect(() => {
        if (myGameInfo.gameState !== GameState.WaitingForBid) {
            return;
        }
        const commitWorkerRef = new Worker(
            new URL("../../utils/timerWorker.ts", import.meta.url),
        );
        const time = myGameInfo.timeout;
        const now = getNowSecondsTimestamp();
        commitWorkerRef.onmessage = async (event) => {
            const timeLeft = event.data;
            setAutoCommitTimeoutTime(timeLeft);
        };

        if (time * 1000 - now > SixtySecond) {
            needAutoBid.current = false;
            commitWorkerRef.postMessage({
                action: "start",
                timeToCount: ThirtySecond,
            });
            setTimeout(() => {
                needAutoBid.current = true;
            }, 0);
        } else if (time * 1000 - now > ThirtySecond) {
            needAutoBid.current = false;
            commitWorkerRef.postMessage({
                action: "start",
                timeToCount: time * 1000 - now - ThirtySecond,
            });
            setTimeout(() => {
                needAutoBid.current = true;
            }, 0);
        } else {
            needAutoBid.current = false;
            commitWorkerRef.postMessage({
                action: "stop",
            });
        }

        return () => {
            commitWorkerRef.terminate();
        };
    }, [myGameInfo.timeout, myGameInfo.gameState]);

    useEffect(() => {
        const now = getNowSecondsTimestamp();
        const autoCallTimeoutTime =
            opGameInfo.timeout * 1000 - now > 0
                ? opGameInfo.timeout * 1000 - now
                : 0;

        const commitWorkerRef = new Worker(
            new URL("../../utils/timerWorker.ts", import.meta.url),
        );

        commitWorkerRef.onmessage = async (event) => {
            const timeLeft = event.data;
            setAutoCallTimeoutTime(timeLeft);
        };
        if (autoCallTimeoutTime === 0) {
            needAutoCallTimeout.current = true;
            handleCallTimeOut();
        } else {
            needAutoCallTimeout.current = false;
            commitWorkerRef.postMessage({
                action: "start",
                timeToCount: autoCallTimeoutTime,
            });
            setTimeout(() => {
                needAutoCallTimeout.current = true;
            }, 0);
        }

        return () => {
            commitWorkerRef.terminate();
        };
    }, [opGameInfo.timeout]);

    const { minutes, second } = useMemo(() => {
        let minutes: string | number = Math.floor(
            autoCommitTimeoutTime / 60000,
        );
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        let second: string | number = Math.floor(
            (autoCommitTimeoutTime / 1000) % 60,
        );
        if (second < 10) {
            second = `0${second}`;
        }

        return { minutes, second };
    }, [autoCommitTimeoutTime]);

    const handleCallTimeOut = async () => {
        if (autoCallTimeoutTime !== 0) {
            return;
        }

        if (!needAutoCallTimeout.current) {
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
        if (!needAutoBid.current) {
            return;
        }
        if (autoCommitTimeoutTime !== 0) {
            return;
        }

        if (myGameInfo.gameState !== GameState.WaitingForBid) {
            return;
        }

        autoBid();
    };

    useEffect(() => {
        handleCallTimeOut();
    }, [autoCallTimeoutTime]);

    useEffect(() => {
        handleAutoCommit();
    }, [autoCommitTimeoutTime]);

    return (
        <Box
            sx={{
                display:
                    myGameInfo.gameState < GameState.Commited ||
                    opGameInfo.gameState < GameState.Commited
                        ? "flex"
                        : "none",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
            }}
        >
            <BttTimer
                width={(autoCommitTimeoutTime / ThirtySecond) * 100 + "%"}
                time={`${minutes}:${second}`}
            ></BttTimer>
        </Box>
    );
};

export default Timer;
