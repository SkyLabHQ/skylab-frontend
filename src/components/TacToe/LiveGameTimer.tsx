import React, { useEffect, useMemo, useRef, useState } from "react";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { Box, Text } from "@chakra-ui/react";
import useCountDown from "react-countdown-hook";
import { GameState } from ".";
import BttTimer from "./BttTimer";

const ShowAllTime = 60 * 1000;
const AutoBidTime = 30 * 1000;

const LiveGameTimer = ({
    myGameInfo,
    opGameInfo,
}: {
    myGameInfo?: GameInfo;
    opGameInfo?: GameInfo;
}) => {
    const [showTimeLeft, { start: showTimeStart }] = useCountDown(0, 1000);

    useEffect(() => {
        const time =
            myGameInfo.timeout >= opGameInfo.timeout
                ? myGameInfo.timeout
                : opGameInfo.timeout;

        const showTime =
            time * 1000 - Math.floor(Date.now()) - AutoBidTime > 0
                ? time * 1000 - Math.floor(Date.now()) - AutoBidTime
                : 0;

        showTimeStart(showTime);
    }, [myGameInfo.timeout, opGameInfo.timeout]);

    const { minutes, second } = useMemo(() => {
        let minutes: string | number = Math.floor(showTimeLeft / 60000);
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        let second: string | number = Math.floor((showTimeLeft / 1000) % 60);
        if (second < 10) {
            second = `0${second}`;
        }

        return { minutes, second };
    }, [showTimeLeft]);

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
                width={(showTimeLeft / ShowAllTime) * 100 + "%"}
                time={`${minutes}:${second}`}
            ></BttTimer>
        </Box>
    );
};

export default LiveGameTimer;
