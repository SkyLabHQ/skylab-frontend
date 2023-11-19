import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { handleError } from "@/utils/error";
import { Box } from "@chakra-ui/react";
import { GameState } from ".";
import BttTimer, { BufferTimer, SixtySecond, ThirtySecond } from "./BttTimer";
import getNowSecondsTimestamp from "@/utils/nowTime";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";

const Timer = ({
    loading,
    myGameInfo,
    opGameInfo,
    autoBid,
}: {
    myGameInfo?: GameInfo;
    opGameInfo?: GameInfo;
    autoBid?: () => void;
    loading?: boolean;
}) => {
    const toast = useSkyToast();
    const { chainId } = useActiveWeb3React();
    const { bidTacToeGameAddress, tokenId } = useGameContext();

    const [bufferTime, setBufferTime] = useState(0); // [ms
    const [autoCommitTimeoutTime, setAutoCommitTimeoutTime] = useState(0);
    const tacToeGameRetryWrite = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
    const autoBidRef = useRef(autoBid);

    const handleCallTimeOut = async () => {
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
            await tacToeGameRetryWrite("claimTimeoutPenalty", [], {
                gasLimit: 300000,
            });
        } catch (e) {
            console.log(e);
            toast(handleError(e));
        }
    };

    useEffect(() => {
        autoBidRef.current = autoBid;
    }, [autoBid]);

    useEffect(() => {
        if (
            myGameInfo.gameState !== GameState.WaitingForBid ||
            !tokenId ||
            !chainId ||
            !bidTacToeGameAddress
        ) {
            return;
        }
        const commitWorkerRef = new Worker(
            new URL("../../utils/timerWorker.ts", import.meta.url),
        );
        const time = myGameInfo.timeout * 1000;
        const now = getNowSecondsTimestamp();
        commitWorkerRef.onmessage = async (event) => {
            const timeLeft = event.data;
            setAutoCommitTimeoutTime(timeLeft);

            if (timeLeft === 0) {
                autoBidRef.current();
            }
        };

        const remainTime = time - now;

        if (remainTime > ThirtySecond) {
            const bufferKey =
                bidTacToeGameAddress + "-" + tokenId + "-" + chainId;
            let bufferTime = sessionStorage.getItem(bufferKey) ?? 0;
            sessionStorage.setItem(bufferKey, "");

            if (Number(bufferTime) === 0 || remainTime > bufferTime) {
                if (remainTime > SixtySecond) {
                    bufferTime = remainTime - SixtySecond;
                } else if (remainTime > ThirtySecond) {
                    bufferTime = remainTime - ThirtySecond;
                } else {
                    bufferTime = remainTime;
                }
            } else {
                bufferTime = remainTime;
            }

            setBufferTime(Number(bufferTime));
            commitWorkerRef.postMessage({
                action: "start",
                timeToCount: remainTime - ThirtySecond,
            });
        } else {
            commitWorkerRef.postMessage({
                action: "stop",
            });
        }

        return () => {
            commitWorkerRef.terminate();
        };
    }, [myGameInfo.timeout, myGameInfo.gameState]);

    useEffect(() => {
        if (!tacToeGameRetryWrite) return;
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

            if (timeLeft === 0) {
                handleCallTimeOut();
            }
        };
        if (autoCallTimeoutTime === 0) {
            handleCallTimeOut();
        } else {
            commitWorkerRef.postMessage({
                action: "start",
                timeToCount: autoCallTimeoutTime,
            });
        }

        return () => {
            commitWorkerRef.terminate();
        };
    }, [
        opGameInfo.timeout,
        opGameInfo.gameState,
        myGameInfo.gameState,
        tacToeGameRetryWrite,
    ]);

    const {
        minutes,
        second,
        time: fisrtTimeout,
        show: bttShow,
    } = useMemo(() => {
        let time = 0;
        let show = false;
        if (autoCommitTimeoutTime > bufferTime) {
            time = autoCommitTimeoutTime - bufferTime;
            show = true;
        }

        let minutes: string | number = Math.floor(time / 60000);
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        let second: string | number = Math.floor((time / 1000) % 60);
        if (second < 10) {
            second = `0${second}`;
        }
        return { minutes, second, time, show };
    }, [autoCommitTimeoutTime, bufferTime]);

    const { time: secondTimeout, show: showBuffer } = useMemo(() => {
        let time = 0;
        let show = false;
        if (autoCommitTimeoutTime > bufferTime) {
            time = bufferTime;
        } else {
            time = autoCommitTimeoutTime;
            show = true;
        }

        return { time, show };
    }, [autoCommitTimeoutTime, bufferTime]);

    useEffect(() => {
        if (!bidTacToeGameAddress || !tokenId || !chainId) {
            return;
        }
        const handleBufferTime = () => {
            const bufferKey =
                bidTacToeGameAddress + "-" + tokenId + "-" + chainId;
            let remainBufferTime = 0;
            if (autoCommitTimeoutTime > bufferTime) {
                remainBufferTime = bufferTime;
            } else {
                remainBufferTime = autoCommitTimeoutTime;
            }

            sessionStorage.setItem(bufferKey, String(remainBufferTime));
        };

        window.addEventListener("beforeunload", handleBufferTime);

        return () => {
            window.removeEventListener("beforeunload", handleBufferTime);
        };
    }, [
        bidTacToeGameAddress,
        autoCommitTimeoutTime,
        bufferTime,
        tokenId,
        chainId,
    ]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                opacity: myGameInfo.gameState < GameState.Commited ? 1 : 0,
            }}
        >
            <BttTimer
                width={(fisrtTimeout / ThirtySecond) * 100 + "%"}
                time={`${minutes}:${second}`}
                show={bttShow}
                gray={myGameInfo.gameState === GameState.Commited || loading}
            ></BttTimer>
            <BufferTimer
                width={(secondTimeout / bufferTime) * 100 + "%"}
                show={showBuffer}
            ></BufferTimer>
        </Box>
    );
};

export default Timer;
