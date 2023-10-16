import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameInfo } from "@/pages/TacToe";
import { Box } from "@chakra-ui/react";
import { GameState } from ".";
import BttTimer, { BufferTimer, SixtySecond, ThirtySecond } from "./BttTimer";
import getNowSecondsTimestamp from "@/utils/nowTime";

const LiveGameTimer = ({ myGameInfo }: { myGameInfo?: GameInfo }) => {
    const [bufferTime, setBufferTime] = useState(0); // [ms
    const [autoCommitTimeoutTime, setAutoCommitTimeoutTime] = useState(0);

    useEffect(() => {
        if (myGameInfo.gameState !== GameState.WaitingForBid) {
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
            let bufferTime = 0;

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
            ></BttTimer>
            <BufferTimer
                width={(secondTimeout / bufferTime) * 100 + "%"}
                show={showBuffer}
            ></BufferTimer>
        </Box>
    );
};

export default LiveGameTimer;
