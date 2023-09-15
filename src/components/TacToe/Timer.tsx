import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { GameInfo, useGameContext } from "@/pages/TacToe";
import { handleError } from "@/utils/error";
import { Box, Text } from "@chakra-ui/react";
import useCountDown from "react-countdown-hook";
import { GameState } from ".";

const ShowAllTime = 30 * 1000;
const AutoBidTime = 30 * 1000;

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
    const { bidTacToeGameAddress, tokenId } = useGameContext();
    const [showTimeLeft, { start: showTimeStart }] = useCountDown(0, 1000);
    const [autoCallTimeoutTime, { start: autoCallTimeoutStart }] = useCountDown(
        0,
        1000,
    );
    const needAutoBid = useRef(false);
    const [autoBidTime, { start: autoBidStart }] = useCountDown(0, 1000);
    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
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

    useEffect(() => {
        if (
            myGameInfo.timeout * 1000 - Math.floor(Date.now()) - AutoBidTime >
            0
        ) {
            autoBidStart(
                myGameInfo.timeout * 1000 -
                    Math.floor(Date.now()) -
                    AutoBidTime,
            );
            needAutoBid.current = true;
        } else {
            autoBidStart(0);
            needAutoBid.current = false;
        }
    }, [myGameInfo.timeout]);

    // set op time left
    useEffect(() => {
        const autoCallTimeoutTime =
            opGameInfo.timeout * 1000 - Math.floor(Date.now()) > 0
                ? opGameInfo.timeout * 1000 - Math.floor(Date.now())
                : 0;
        if (autoCallTimeoutTime === 0) {
            handleCallTimeOut();
        } else {
            autoCallTimeoutStart(autoCallTimeoutTime);
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

        autoBid(0);
    };

    useEffect(() => {
        // handleCallTimeOut();
    }, [autoCallTimeoutTime]);

    useEffect(() => {
        // handleAutoCommit();
    }, [autoBidTime]);

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
                        width: (showTimeLeft / ShowAllTime) * 100 + "%",
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
