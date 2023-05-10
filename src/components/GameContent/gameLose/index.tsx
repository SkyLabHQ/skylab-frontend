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
                Home
            </Text>

            <Box
                pos="absolute"
                left="50%"
                bottom="4vh"
                transform="translateX(-50%)"
            >
                <Text
                    textAlign="center"
                    minWidth="850px"
                    fontSize="40px"
                    color="white"
                    fontFamily="Orbitron"
                >
                    Try it next time!
                </Text>
            </Box>

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
                Share
            </Text>
        </Box>
    );
};

const GameLose: FC<Props> = ({}) => {
    const [win, isWin] = useState(true);
    const { account } = useActiveWeb3React();

    const navigate = useNavigate();

    const {
        onNext,
        tokenId,
        onMapChange,
        onUserAndOpInfo,
        onOpen,
        myInfo,
        opInfo,
    } = useGameContext();
    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    const onQuit = () => {
        onOpen();
    };
    // 获取游戏状态
    const getGameState = async () => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        return state.toNumber();
    };

    const handlePostGameCleanUp = async () => {
        const state = await getGameState();
        try {
            console.log(state, "state");
            if (state === 6 || state === 7) {
                const res = await skylabGameFlightRaceContract.postGameCleanUp(
                    tokenId,
                );
                await res.wait();
            }
        } catch (error) {}
    };

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !account) {
            return;
        }
        handlePostGameCleanUp();
    }, [skylabGameFlightRaceContract, account]);
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
                    right: 0,
                    top: "10px",
                    position: "absolute",
                    height: "117px",
                    width: "1361px",
                    textAlign: "right",
                    paddingRight: "60px",
                    fontSize: "96px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    background:
                        "linear-gradient(90deg, rgba(66, 0, 255, 0) -6.14%, rgba(82, 0, 255, 0.46) 106.26%)",
                }}
            >
                YOU LOSE
            </Box>
            <Footer onQuit={onQuit} onNext={onNext} />
        </Box>
    );
};

export default GameLose;
