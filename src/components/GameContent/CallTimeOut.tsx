import {
    ContractType,
    useRetryContractCall,
    useBurnerContractCall,
} from "@/hooks/useRetryContract";
import useSkyToast from "@/hooks/useSkyToast";
import { useGameContext } from "@/pages/Game";
import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useCountDown from "react-countdown-hook";

const OpState = {
    1: "Not Submitted",
    2: "Not Submitted",
    3: "Not Submitted",
};

const Time = {
    1: 300 * 1000,
    2: 900 * 1000,
    3: 300 * 1000,
};

const CallTimeOut = () => {
    const { tokenId, opTokenId, opState, myState } = useGameContext();
    const burnerCall = useBurnerContractCall();
    const [timeLeft, { start }] = useCountDown(-1, 1000);
    const retryContractCall = useRetryContractCall();
    const [started, setStarted] = useState(false);
    const called = useRef(false);

    const toast = useSkyToast();
    const [loading, setLoading] = useState(false);

    const minutes = useMemo(() => {
        const time = Math.floor(timeLeft / 60000);
        if (time < 10) {
            return `0${time}`;
        }
        return time;
    }, [timeLeft]);

    const second = useMemo(() => {
        const time = Math.floor((timeLeft / 1000) % 60);
        if (time < 10) {
            return `0${time}`;
        }
        return time;
    }, [timeLeft]);

    const getGameTime = async () => {
        let time = await retryContractCall(
            ContractType.RACETOURNAMENT,
            "timeout",
            [opTokenId],
        );
        time = time.toNumber();
        start(
            time * 1000 > Math.floor(Date.now())
                ? time * 1000 - Math.floor(Date.now())
                : 0,
        );
        if (!started) {
            setStarted(true);
        }
    };

    const handleClaimTimeoutPenalty = async () => {
        try {
            if (loading) return;
            setLoading(true);
            console.log("start claimTimeoutPenalty");
            await burnerCall(
                ContractType.RACETOURNAMENT,
                "claimTimeoutPenalty",
                [tokenId],
            );
            setLoading(false);
            console.log("successful claimTimeoutPenalty");
            toast("Successful call time out penalty");
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!opTokenId || !retryContractCall || ![1, 2, 3].includes(opState)) {
            return;
        }
        getGameTime();
    }, [opState, opTokenId, retryContractCall]);

    useEffect(() => {
        if (![1, 2, 3].includes(opState)) {
            return;
        }
        if (myState < opState) {
            return;
        }
        if (!started) {
            return;
        }
        if (timeLeft == 0 && !called.current) {
            called.current = true;
            const timer = setTimeout(() => {
                handleClaimTimeoutPenalty();
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [timeLeft, opState, myState, started]);

    return ![1, 2, 3].includes(opState) || myState < opState ? null : (
        <Box
            sx={{
                width: "270px",
                background: "rgba(217, 217, 217, 0.2)",
                border: "3px solid #FFF761",
                borderRadius: "15px",
                padding: "10px 0 10px 20px",
                zIndex: 100,
            }}
        >
            <Text sx={{ fontSize: "24px" }}>Opponent status</Text>
            <Box
                sx={{
                    display: "inline-block",
                    background: "rgba(171, 171, 171, 0.5)",
                    padding: "0 5px",
                    borderRadius: "5px",
                    marginTop: "1vh",
                }}
            >
                {OpState[opState]}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                    sx={{
                        width: "150px",
                        background: "#FFFFFF",
                        marginRight: "6px",
                        border:
                            timeLeft == 0
                                ? "4px solid #FF0D00"
                                : "4px solid rgb(223,223,223)",
                        height: "14px",
                    }}
                >
                    <Box
                        sx={{
                            background: "rgb(223,223,223)",
                            width:
                                Time[opState] &&
                                `${
                                    100 -
                                    Math.floor((timeLeft * 100) / Time[opState])
                                }%`,

                            height: "100%",
                        }}
                    ></Box>
                </Box>
                <Text
                    sx={{
                        color: timeLeft == 0 ? "#ff0d00" : "#fff",
                    }}
                >
                    {minutes}:{second}
                </Text>
            </Box>
            {/* <Button
                isLoading={loading}
                sx={{
                    background: timeLeft == 0 ? "#FDDC2D" : "#BCBBBE",
                    borderRadius: "5px",
                    width: "187px",
                    height: "31px",
                    color: "#000",
                    marginTop: "15px",
                    "&:hover": {
                        background: timeLeft == 0 ? "#FDDC2D" : "#BCBBBE",
                    },
                    "&:disabled": {
                        background: timeLeft == 0 ? "#FDDC2D" : "#BCBBBE",
                    },
                }}
                disabled={timeLeft != 0}
                onClick={handleClaimTimeoutPenalty}
            >
                Call Time out
            </Button> */}
        </Box>
    );
};

export default CallTimeOut;
