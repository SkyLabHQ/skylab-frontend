import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { handleError } from "@/utils/error";
import { Box, Text } from "@chakra-ui/react";
import useCountDown from "react-countdown-hook";
import { GameState } from ".";
import BttTimer from "./BttTimer";

const ShowAllTime = 60 * 1000;
const AutoBidTime = 30 * 1000;
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
    const [showTimeLeft, { start: showTimeStart }] = useCountDown(0, 1000);
    const [autoCallTimeoutTime, { start: autoCallTimeoutStart }] = useCountDown(
        0,
        1000,
    );
    const needAutoBid = useRef(false);
    const needAutoCallTimeout = useRef(false);

    const [autoBidTime, { start: autoBidStart }] = useCountDown(0, 1000);
    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
    useEffect(() => {
        const time = myGameInfo.timeout;

        const now = Date.now();

        if (time * 1000 - now > SixtySecond) {
            showTimeStart(ThirtySecond);
        } else if (time * 1000 - now > ThirtySecond) {
            showTimeStart(time * 1000 - now - ThirtySecond);
        } else {
            showTimeStart(0);
        }
    }, [myGameInfo.timeout]);

    useEffect(() => {
        const now = Date.now();
        if (myGameInfo.timeout * 1000 - now > SixtySecond) {
            needAutoBid.current = false;
            autoBidStart(ThirtySecond);
            setTimeout(() => {
                needAutoBid.current = true;
            }, 0);
        } else if (myGameInfo.timeout * 1000 - now > ThirtySecond) {
            needAutoBid.current = false;
            autoBidStart(myGameInfo.timeout * 1000 - now - ThirtySecond);
            setTimeout(() => {
                needAutoBid.current = true;
            }, 0);
        } else {
            needAutoBid.current = false;
            autoBidStart(0);
        }
    }, [myGameInfo.timeout]);

    // set op time left
    useEffect(() => {
        const autoCallTimeoutTime =
            opGameInfo.timeout * 1000 - Math.floor(Date.now()) > 0
                ? opGameInfo.timeout * 1000 - Math.floor(Date.now())
                : 0;

        if (autoCallTimeoutTime === 0) {
            needAutoCallTimeout.current = true;
            handleCallTimeOut();
        } else {
            needAutoCallTimeout.current = false;
            autoCallTimeoutStart(autoCallTimeoutTime);
            setTimeout(() => {
                needAutoCallTimeout.current = true;
            }, 0);
        }
    }, [opGameInfo.timeout]);

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
        if (autoBidTime !== 0) {
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
    }, [autoBidTime]);

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
                width={(showTimeLeft / ThirtySecond) * 100 + "%"}
                time={`${minutes}:${second}`}
            ></BttTimer>
        </Box>
    );
};

export default Timer;
