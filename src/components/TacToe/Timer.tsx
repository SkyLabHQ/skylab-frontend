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
    const [autoCallTimeoutTime, setAutoCallTimeoutTime] = useState(0);
    const needAutoBid = useRef(false);
    const needAutoCallTimeout = useRef(false);

    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );

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
        };

        const remainTime = time - now;

        if (remainTime > ThirtySecond) {
            needAutoBid.current = false;
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
            await tacToeGameRetryWrite("claimTimeoutPenalty", [], 300000);
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
