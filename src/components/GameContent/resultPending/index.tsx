import React, { FC, useEffect, useRef, useState } from "react";
import { Box, Text, Img } from "@chakra-ui/react";
import GameFooter from "@/assets/game-footer.png";
import GameLoadingBackground from "@/assets/game-loading-background.png";
import LoadingIcon from "@/assets/loading.svg";

import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/pages/Game";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { motion } from "framer-motion";

const Footer: FC<{ onNext: () => void; onQuit: () => void }> = ({
    onNext,
    onQuit,
}) => {
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
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="40px"
                left="1vw"
                bottom="2vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={onQuit}
            >
                Flee
            </Text>

            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="0.5vw"
                bottom="2vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    onNext();
                }}
            >
                Wait
            </Text>
        </Box>
    );
};

type Props = {};

const ResultPending: FC<Props> = ({}) => {
    const { account } = useActiveWeb3React();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { onNext, tokenId, onOpen, myInfo, opInfo } = useGameContext();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const onQuit = () => {
        onOpen();
    };
    // 获取游戏状态
    const getGameState = async (tokenId: number) => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        return state.toNumber();
    };

    const handleGetRevealPath = async () => {
        const seed = localStorage.getItem("seed");
        const path = JSON.parse(localStorage.getItem("path"));
        const used_resources = JSON.parse(
            localStorage.getItem("used_resources"),
        );
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

                const time = localStorage.getItem("time");
                const res = await skylabGameFlightRaceContract.revealPath(
                    tokenId,
                    seed,
                    time,
                    a,
                    b,
                    c,
                    Input,
                    a1,
                    b1,
                    c1,
                    Input1,
                );
                await res.wait();
                setLoading(false);
                worker.terminate();
            } catch (error) {
                setLoading(false);
            }
        };
        // 向worker发送消息，计算mercury的calldata
        worker.postMessage({ seed, path, used_resources });
    };

    const handleReveal = async () => {
        const state = await getGameState(tokenId);
        const opState = await getGameState(opInfo.tokenId);
        if (state === 3 && (opState === 3 || opState === 4)) {
            await handleGetRevealPath();
        }
    };

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !account || !opInfo || !tokenId) {
            return;
        }
        handleReveal();
    }, [skylabGameFlightRaceContract, account, opInfo, tokenId]);
    return (
        <Box
            pos="relative"
            bgImage={GameLoadingBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
        >
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
            <Img src={MetadataPlaneImg(myInfo?.tokenId)}></Img>
            <Footer onQuit={onQuit} onNext={onNext} />
        </Box>
    );
};

export default ResultPending;
