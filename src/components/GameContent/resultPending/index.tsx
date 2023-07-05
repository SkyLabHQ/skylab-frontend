import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Text, Img, useToast, Button } from "@chakra-ui/react";
import GameFooter from "@/assets/game-footer.png";
import GameLoadingBackground from "@/assets/game-loading-background.png";
import LoadingIcon from "@/assets/loading.svg";

import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import { useGameContext } from "@/pages/Game";
import { motion } from "framer-motion";
import SkyToast from "@/components/Toast";
import { handleError } from "@/utils/error";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import { calculateGasMargin } from "@/utils/web3Utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import useGameState from "@/hooks/useGameState";
import CallTimeOut from "../CallTimeOut";
import {
    getTokenInfo,
    getTokenInfoValue,
    updateTokenInfoValue,
} from "@/utils/tokenInfo";
import useFeeData from "@/hooks/useFeeData";
import useSkyToast from "@/hooks/useSkyToast";

const TextList = [
    "Airdropped Mercs opportunities await the winners(tournament only).",
    "Winner’s aviation will receive upgrades, while defeated ones will be downgraded.",
    "Pilots can be added to aviation in project mercury.",
    "In Trailblazer, fuel is more effective for handling high turbulence, whereas batteries are more efficient for dealing with high air drag.",
    "Factories produces battery and fuels.",
    "There are 32 levels of factory in total.",
    "Only three factories can be staked at the same time for each wallet address.",
    "You can use bomb to attack other’s staked factory and harvest their resources.",
    "There are 10000 Mercs in total.",
    "One of the coolest Merc is the ones with gradient helmet and goggle effect.",
    "In Trailblazer, black hole has the longest distance.",
    "There are 32 levels of aviation in total.",
    "Project Mercury is an open world where participants can explore, build and play User Generated Content with their entities.",
];

const Footer: FC<{ onNext: () => void }> = ({ onNext }) => {
    return (
        <Box userSelect="none">
            <Img
                pos="absolute"
                left="0"
                bottom="0"
                src={GameFooter}
                h="63vh"
                w="100vw"
                pointerEvents="none"
            />
        </Box>
    );
};

const ResultPending = () => {
    const { getFeeData } = useFeeData();
    const startRef = useRef(true);
    const toast = useSkyToast();
    const [loading, setLoading] = useState(false);
    const { onNext, tokenId, opInfo, myInfo } = useGameContext();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const stateTimer = useRef(null);
    const [myState, setMyState] = useState(3);
    const [opState, setOpState] = useState(1);

    const { handleCheckBurner, burner } = useBurnerWallet(tokenId);
    const getGameState = useGameState();

    const handleCleanUp = async () => {
        const opGameState = await getGameState(opInfo.tokenId);
        const time = await skylabGameFlightRaceContract.getOpponentFinalTime(
            tokenId,
        );
        const path = await skylabGameFlightRaceContract.getOpponentPath(
            tokenId,
        );
        const usedResources =
            await skylabGameFlightRaceContract.getOpponentUsedResources(
                tokenId,
            );
        updateTokenInfoValue(tokenId, {
            opTime: time.toNumber(),
            opPath: path.map((item: any, index: number) => {
                if (index === 0) {
                    return item;
                }
                return item.toNumber();
            }),
            opUsedResources: usedResources.map((item: any, index: number) => {
                if (index === 0) {
                    return item;
                }
                return item.toNumber();
            }),
            myState: myState,
            opState: opGameState,
        });

        try {
            setLoading(true);
            await handleCheckBurner();
            const feeData = await getFeeData();
            console.log("start postGameCleanUp");
            const gas = await skylabGameFlightRaceContract
                .connect(burner)
                .estimateGas.postGameCleanUp(tokenId);
            const res = await skylabGameFlightRaceContract
                .connect(burner)
                .postGameCleanUp(tokenId, {
                    gasLimit: calculateGasMargin(gas),
                    ...feeData,
                });

            await res.wait();
            toast("Successful cleanUp");
            console.log("success postGameCleanUp");

            // console.log("start unapproveForGame");
            // const unapproveForGameGas = await skylabGameFlightRaceContract
            //     .connect(burner)
            //     .estimateGas.unapproveForGame(tokenId);
            // const runapproveForGameRes = await skylabGameFlightRaceContract
            //     .connect(burner)
            //     .unapproveForGame(tokenId, {
            //         gasLimit: calculateGasMargin(unapproveForGameGas),
            //         ...feeData,
            //     });

            // await runapproveForGameRes.wait();
            // console.log("success unapproveForGame");

            // toast({
            //     render: () => (
            //         <SkyToast
            //             message={"Successful unapproveForGame"}
            //         ></SkyToast>
            //     ),
            // });

            setLoading(false);

            if (myState === 5) {
                onNext(8);
            } else if (myState === 6) {
                onNext(7);
            } else if (myState === 7) {
                onNext(7);
            }
        } catch (error) {
            setLoading(false);
            toast(handleError(error));
        }
    };

    const handleGetRevealPath = async () => {
        const tokenInfo = getTokenInfo(tokenId);
        const { seed, myPath, myUsedResources } = tokenInfo;
        setLoading(true);
        // 启动一个worker，用于计算mercury的calldata
        const worker = new Worker(
            new URL(
                "../../../utils/pathHashCalldataWorker.ts",
                import.meta.url,
            ),
        );
        // 接收worker的消息，提交mercury的calldata
        worker.onmessage = async (event) => {
            try {
                startRef.current = false;

                const { a, b, c, Input } = event.data.result1;
                const {
                    a: a1,
                    b: b1,
                    c: c1,
                    Input: Input1,
                } = event.data.result2;

                const myTime = getTokenInfoValue(tokenId, "myTime");
                await handleCheckBurner();
                const feeData = await getFeeData();
                console.log("start revealPath");
                const gas = await skylabGameFlightRaceContract
                    .connect(burner)
                    .estimateGas.revealPath(
                        tokenId,
                        seed,
                        myTime,
                        a,
                        b,
                        c,
                        Input,
                        a1,
                        b1,
                        c1,
                        Input1,
                    );
                const res = await skylabGameFlightRaceContract
                    .connect(burner)
                    .revealPath(
                        tokenId,
                        seed,
                        myTime,
                        a,
                        b,
                        c,
                        Input,
                        a1,
                        b1,
                        c1,
                        Input1,
                        {
                            gasLimit: calculateGasMargin(gas),
                            ...feeData,
                        },
                    );
                await res.wait();
                console.log("success revealPath");
                toast("Successfully revealPath");
                setLoading(false);
                startRef.current = true;
            } catch (error) {
                toast(handleError(error));
                setLoading(false);
                startRef.current = true;
            }
        };
        // 向worker发送消息，计算mercury的calldata

        worker.postMessage({
            seed,
            path: myPath,
            used_resources: myUsedResources,
        });
    };

    useEffect(() => {
        stateTimer.current = setInterval(async () => {
            if (!startRef.current) {
                return;
            }
            const myState = await getGameState(tokenId);
            const opState = await getGameState(opInfo?.tokenId);
            setMyState(myState);
            setOpState(opState);
        }, 3000);
        return () => {
            clearInterval(stateTimer.current);
        };
    }, [tokenId, opInfo]);

    useEffect(() => {
        if (myState === 5 || myState === 6 || myState === 7) {
            handleCleanUp();
        } else if (myState === 3 && (opState === 3 || opState === 4)) {
            handleGetRevealPath();
        }
    }, [myState, opState]);

    return (
        <Box
            pos="relative"
            bgImage={GameLoadingBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
        >
            <Box
                sx={{
                    position: "absolute",
                    left: "2vw",
                    bottom: "25vh",
                    zIndex: 100,
                }}
            >
                <CallTimeOut></CallTimeOut>
            </Box>
            {loading && (
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        height: "100px",
                        width: "100px",
                        zIndex: 999,
                    }}
                >
                    <motion.img
                        src={LoadingIcon}
                        style={{
                            rotate: 0,
                            width: "100px",
                        }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 2,
                        }}
                        animate={{ rotate: 360 }}
                    />
                </Box>
            )}
            <Img
                src={myInfo.img}
                sx={{
                    position: "absolute",
                    left: "10vw",
                    top: "10vh",
                }}
            ></Img>
            <Box
                sx={{
                    width: "50%",
                    left: "50%",
                    top: "30vh",
                    transform: "translateX(-50%)",
                    position: "absolute",
                }}
            >
                <Box
                    sx={{
                        background: "rgba(255, 255, 255, 0.7)",
                        border: "3px solid #FDDC2D",
                        borderRadius: "20px",

                        color: "#000",
                        padding: "40px 83px",
                    }}
                >
                    <Text sx={{ fontSize: "64px", fontWeight: "600" }}>
                        Strategy submitted!
                    </Text>
                    <Text
                        sx={{
                            fontSize: "40px",
                            fontWeight: "600",
                            lineHeight: "50px",
                        }}
                    >
                        {opState === 2 || opState === 1
                            ? "Waiting for opponent to submit."
                            : "Waiting for opponnent to reveal."}
                    </Text>
                </Box>
                <Box sx={{ marginTop: "6vh" }}>
                    <Text sx={{ fontSize: "24px", textAlign: "center" }}>
                        Do you know
                    </Text>
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        className="swiper-no-swiping"
                        style={{ height: "30px", paddingTop: "0" }}
                    >
                        {TextList.map((item, index) => {
                            return (
                                <SwiperSlide
                                    key={index}
                                    style={{
                                        background: "transparent",
                                        textAlign: "center",
                                        fontSize: "24px",
                                    }}
                                >
                                    {item}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </Box>
            </Box>
            <Footer onNext={onNext} />
        </Box>
    );
};

export default ResultPending;
