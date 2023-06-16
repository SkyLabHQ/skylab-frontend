import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import useGameState from "@/hooks/useGameState";
import { useGameContext } from "@/pages/Game";
import { handleError } from "@/utils/error";
import { Box, Button, Text, useTab, useToast } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import useCountDown from "react-countdown-hook";
import SkyToast from "../Toast";

const OpState = {
    1: "Not Submitted",
    2: "Not Submitted",
    3: "Not Submitted",
};

const Time = {
    1: 300 * 1000,
    2: 780 * 1000,
    3: 300 * 1000,
};

const CallTimeOut = () => {
    const { onNext, tokenId, opInfo } = useGameContext();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const [timeLeft, { start, pause, resume, reset }] = useCountDown(0, 1000);
    const getGameState = useGameState();
    const [opState, setOpState] = useState(0);

    const toast = useToast();
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
        const opState = await getGameState(opInfo.tokenId);
        setOpState(opState);
        let time = await skylabGameFlightRaceContract.timeout(opInfo.tokenId);
        time = time.toNumber();
        start(
            time * 1000 > Math.floor(Date.now())
                ? time * 1000 - Math.floor(Date.now())
                : 0,
        );
    };

    const handleClaimTimeoutPenalty = async () => {
        try {
            const res = await skylabGameFlightRaceContract.claimTimeoutPenalty(
                tokenId,
            );
            await res.wait();
            toast({
                position: "top",
                render: () => (
                    <SkyToast
                        message={"Successful call time out penalty"}
                    ></SkyToast>
                ),
            });
        } catch (error) {
            setLoading(false);
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };
    useEffect(() => {
        if (!opInfo.tokenId || !skylabGameFlightRaceContract) {
            return;
        }
        getGameTime();
        const timer = setInterval(() => {
            getGameTime();
        }, 3000);
        return () => {
            clearInterval(timer);
        };
    }, [opInfo, skylabGameFlightRaceContract]);

    return [1, 2, 3].includes(opState) ? null : (
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
            <Button
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
            </Button>
        </Box>
    );
};

export default CallTimeOut;
