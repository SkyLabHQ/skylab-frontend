import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Text, Img } from "@chakra-ui/react";
import GameFooter from "@/assets/game-footer.png";
import GameLoadingBackground from "@/assets/game-loading-background.png";
import LoadingIcon from "@/assets/loading.svg";
import { useGameContext } from "@/pages/Game";
import { motion } from "framer-motion";
import { handleError } from "@/utils/error";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import CallTimeOut from "../CallTimeOut";
import {
    getTokenInfo,
    getTokenInfoValue,
    updateTokenInfoValue,
} from "@/utils/tokenInfo";
import useSkyToast from "@/hooks/useSkyToast";
import useBurnerContractCall, {
    ContractType,
    useRetryContractCall,
} from "@/hooks/useRetryContract";

const TextList = [
    "Airdropped Mercs opportunities await the winners(tournament only).",
    "Winner’s aviation will receive upgrades, while defeated ones will be downgraded.",
    "Pilots can be added to aviation in project mercury.",
    "In Trailblazer, fuel is more effective for handling high turbulence, whereas batteries are more efficient for dealing with high air drag.",
    "Factories produces battery and fuels.",
    "Only three factories can be staked at the same time for each wallet address.",
    "You can use bomb to attack other’s staked factory and harvest their resources.",
    "There are 10000 Mercs in total.",
    "One of the coolest Merc is the ones with gradient helmet and goggle effect.",
    "In Trailblazer, black hole has the longest distance.",
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
    const startRef = useRef(false);
    const toast = useSkyToast();
    const [loading, setLoading] = useState(false);
    const { myState, opState, opTokenId, onNext, tokenId, myInfo } =
        useGameContext();
    const retryContractCall = useRetryContractCall();
    const burnerCall = useBurnerContractCall();

    const { handleCheckBurner } = useBurnerWallet(tokenId);

    const handleCleanUp = async () => {
        const opGameState = await retryContractCall(
            ContractType.RACETOURNAMENT,
            "gameState",
            [tokenId],
        );

        const time = await retryContractCall(
            ContractType.RACETOURNAMENT,
            "getOpponentFinalTime",
            [tokenId],
        );
        const path = await retryContractCall(
            ContractType.RACETOURNAMENT,
            "getOpponentPath",
            [tokenId],
        );
        const usedResources = await retryContractCall(
            ContractType.RACETOURNAMENT,
            "getOpponentUsedResources",
            [tokenId],
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
            opState: opGameState.toNumber(),
        });

        try {
            setLoading(true);
            const result = await handleCheckBurner();
            if (!result) {
                setLoading(false);
                return;
            }

            console.log("start postGameCleanUp");
            await burnerCall(ContractType.RACETOURNAMENT, "postGameCleanUp", [
                tokenId,
            ]);
            toast("Successful cleanUp");
            console.log("success postGameCleanUp");

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
            toast(`Please refresh page, ${handleError(error)}`);
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
                const { a, b, c, Input } = event.data.result1;
                const {
                    a: a1,
                    b: b1,
                    c: c1,
                    Input: Input1,
                } = event.data.result2;

                const myTime = getTokenInfoValue(tokenId, "myTime");
                const result = await handleCheckBurner();
                if (!result) return;
                console.log("start revealPath");
                await burnerCall(ContractType.RACETOURNAMENT, "revealPath", [
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
                ]);
                console.log("success revealPath");
                toast("Successfully revealPath");
                setLoading(false);
            } catch (error) {
                toast(`Please refresh page, ${handleError(error)}`);
                setLoading(false);
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
        if (myState === 5 || myState === 6 || myState === 7) {
            handleCleanUp();
        } else if (myState === 0) {
            const tokenInfo = getTokenInfo(tokenId);
            const { myState: localMyState } = tokenInfo;
            if (localMyState === 5) {
                onNext(8);
            } else if (localMyState === 6) {
                onNext(7);
            } else if (localMyState === 7) {
                onNext(7);
            }
        }
    }, [myState]);

    useEffect(() => {
        if (
            myState === 3 &&
            (opState === 3 || opState === 4) &&
            startRef.current === false
        ) {
            startRef.current = true;
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
                            duration: 3,
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
                    top: "20vh",
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
                        padding: "2vh 3vw",
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
