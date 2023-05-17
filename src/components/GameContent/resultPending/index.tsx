import React, { FC, useEffect, useRef, useState } from "react";
import {
    Box,
    Text,
    Image,
    VStack,
    HStack,
    Img,
    useDisclosure,
    Button,
} from "@chakra-ui/react";
type Props = {};
import GameFooter from "@/assets/game-footer.png";
import GameLoadingBackground from "@/assets/game-loading-background.png";

import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
} from "@/hooks/useContract";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "@/pages/Game";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { pathHashCalldata } from "@/utils/snark";

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

const ResultPending: FC<Props> = ({}) => {
    const [win, isWin] = useState(true);
    const { account } = useActiveWeb3React();

    const navigate = useNavigate();

    const { onNext, tokenId, onMapChange, onOpen, myInfo, opInfo } =
        useGameContext();
    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const onQuit = () => {
        onOpen();
    };
    // 获取游戏状态
    const getGameState = async (tokenId: number) => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        console.log(state.toNumber(), "state.toNumber()");
        return state.toNumber();
    };

    const handleGetRevealPath = async () => {
        try {
            const seed = localStorage.getItem("seed");
            const path = JSON.parse(localStorage.getItem("path"));
            const used_resources = JSON.parse(
                localStorage.getItem("used_resources"),
            );

            const { a, b, c, Input } = await pathHashCalldata({
                seed,
                input_path: path,
            });

            const {
                a: a1,
                b: b1,
                c: c1,
                Input: Input1,
            } = await pathHashCalldata({
                seed,
                input_path: used_resources,
            });

            const time = localStorage.getItem("time");
            const res = await skylabGameFlightRaceContract.revealPath(
                tokenId,
                Number(seed),
                Number(time),
                a,
                b,
                c,
                Input,
                a1,
                b1,
                c1,
                Input1,
            );
        } catch (error) {
            console.log(error, "res");
        }
    };

    const handleReveal = async () => {
        const res = await skylabGameFlightRaceContract.reset(tokenId, false);

        const state = await getGameState(tokenId);
        const opState = await getGameState(opInfo.tokenId);
        console.log(state, opState);

        if (state === 3 && opState === 3) {
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
            <Img src={MetadataPlaneImg(myInfo?.tokenId)}></Img>
            <Footer onQuit={onQuit} onNext={onNext} />
        </Box>
    );
};

export default ResultPending;
