import React, { FC, useEffect, useReducer, useRef } from "react";
import { Box, Img, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import GameLoadingBackground from "../assets/game-loading-background.png";
import { Info, useGameContext } from "../pages/Game";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
} from "../hooks/useContract";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapInfo } from "./GameContent";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import GameFooter from "../assets/game-footer.png";
import MetadataPlaneImg from "@/skyConstants/metadata";
import LoadingIcon from "@/assets/loading.svg";
type Props = {};

const initMap = (mapInfo: any) => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            if (i === 7 && j === 7) {
                map[i].push({
                    role: "end",
                });
            } else {
                map[i].push({
                    role: "normal",
                    distance: mapInfo[i][j][0],
                    fuelScaler: mapInfo[i][j][1],
                    batteryScaler: mapInfo[i][j][2],
                    fuelLoad: 0,
                    batteryLoad: 0,
                });
            }
        }
    }
    return map;
};

const Footer: FC<{ onNext: () => void; onQuit: () => void }> = ({
    onNext,
    onQuit,
}) => {
    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "Escape":
                    onQuit();
                    break;
            }
            if (event.shiftKey && key === "Enter") {
                onNext();
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);
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
                Quit
            </Text>
            <Box
                sx={{
                    position: "absolute",
                    left: "14vw",
                    bottom: "4.5vh",
                    width: "3.4vw",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "10px",
                }}
            >
                <Text sx={{ fontSize: "14px", fontWeight: 600 }}>Esc</Text>
            </Box>
            <Box
                pos="absolute"
                left="50%"
                bottom="4vh"
                transform="translateX(-50%)"
            >
                <Text
                    textAlign="center"
                    minWidth="80vw"
                    fontSize="40px"
                    color="white"
                    fontFamily="Orbitron"
                >
                    Matching opponent
                </Text>
                <Text
                    textAlign="center"
                    minWidth="80vw"
                    fontSize="40px"
                    color="white"
                    fontFamily="Orbitron"
                >
                    Make sure to QUIT before closing this window
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
                Next
            </Text>
            <Box
                sx={{
                    position: "absolute",
                    right: "15vw",
                    bottom: "6.5vh",
                    width: "55px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "10px",
                }}
            >
                <Text sx={{ fontSize: "14px", fontWeight: 600 }}>Shift</Text>
            </Box>
            <Text
                sx={{
                    position: "absolute",
                    right: "15.2vw",
                    bottom: "4.5vh",
                    fontSize: "14px",
                    fontWeight: 600,
                }}
            >
                +
            </Text>
            <Box
                sx={{
                    position: "absolute",
                    right: "13.2vw",
                    bottom: "2.5vh",
                    width: "55px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "10px",
                }}
            >
                <Text sx={{ fontSize: "14px", fontWeight: 600 }}>Enter</Text>
            </Box>
        </Box>
    );
};

const PlaneImg = ({ detail, flip }: { detail: Info; flip: boolean }) => {
    return (
        <>
            {detail?.tokenId ? (
                <Box>
                    <Img
                        src={MetadataPlaneImg(detail.tokenId)}
                        sx={{
                            width: "280px",

                            transform: flip ? "scaleX(-1)" : "",
                            /*兼容IE*/
                            filter: "FlipH",
                        }}
                    ></Img>
                </Box>
            ) : (
                <motion.img
                    src={LoadingIcon}
                    style={{
                        width: "120px",
                        rotate: 0,
                    }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 2,
                    }}
                    animate={{ rotate: 360 }}
                />
            )}
        </>
    );
};

export const GameLoading: FC<Props> = ({}) => {
    const { account } = useActiveWeb3React();

    const navigate = useNavigate();

    const {
        onNext,
        tokenId,
        onMapChange,
        onMyInfo,
        onOpInfo,
        onOpen,
        myInfo,
        opInfo,
    } = useGameContext();
    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    const onQuit = () => {
        onOpen();
    };

    // 跟合约交互 获取地图
    const handleGetMap = async () => {
        const res = await skylabGameFlightRaceContract.getMap(tokenId);
        await res.wait();
        const seed = Math.floor(Math.random() * 1000000) + 1;
        localStorage.setItem("seed", String(seed));
    };

    // 读取mapId
    const handleGetMapId = async () => {
        try {
            const mapId = await skylabGameFlightRaceContract.mapId(tokenId);
            const f = (mapId.toNumber() / 10).toFixed(0);
            const res = await axios.get(
                `https://red-elegant-wasp-428.mypinata.cloud/ipfs/Qmaf7vhNyd7VudLPy2Xbx2K6waQdydj8KnExU2SdqNMogp/batch_fullmap_${f}.json`,
            );
            const map = res.data[mapId];
            const initialMap = initMap(map.map_params);
            onMapChange(initialMap);
        } catch (error) {
            console.log(error);
        }
    };

    // 获取游戏状态
    const getGameState = async () => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        return state.toNumber();
    };

    const getMyInfo = async () => {
        const [myTank, myAccount] = await Promise.all([
            skylabGameFlightRaceContract.gameTank(tokenId),
            skylabBaseContract.ownerOf(tokenId),
        ]);
        onMyInfo({
            tokenId: tokenId,
            address: account,
            fuel: myTank.fuel.toString(),
            battery: myTank.battery.toString(),
        });
    };

    const getOpponentInfo = async (opTokenId: number) => {
        const [opTank, opAccount] = await Promise.all([
            skylabGameFlightRaceContract.gameTank(opTokenId),
            skylabBaseContract.ownerOf(opTokenId),
        ]);

        // const tokenURL = await skylabBaseContract.tokenURI(opTokenId);
        // console.log(tokenURL, "tokenURL");
        onOpInfo({
            tokenId: opTokenId,
            address: opAccount,
            fuel: opTank.fuel.toString(),
            battery: opTank.battery.toString(),
        });
    };

    const waitingForOpponent = async () => {
        const state = await getGameState();
        // 用户未参加游戏
        if (state === 0) {
            // navigate(`/spendresource?tokenId=${tokenId}`);
        }

        const opTokenId =
            await skylabGameFlightRaceContract?.matchedAviationIDs(tokenId);

        // 已经匹配到对手
        if (opTokenId.toNumber() !== 0) {
            await getOpponentInfo(opTokenId);

            // 用户已经参加游戏 未获取地图
            if (state === 1) {
                await handleGetMap();
                await handleGetMapId();
                onNext(1);
            }
            // 用户已经参加游戏 已经获取地图 开始游戏
            else if (state === 2) {
                await handleGetMapId();
                onNext(1);
            } else if (state === 5) {
                onNext(5);
            } else if (state === 7) {
                onNext(7);
            }
        } else {
            setTimeout(() => {
                waitingForOpponent();
            }, 2000);
        }
    };

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !account || !tokenId) {
            return;
        }
        getMyInfo();
        waitingForOpponent();
    }, [skylabGameFlightRaceContract, account, tokenId]);

    return (
        <Box
            pos="relative"
            bgImage={GameLoadingBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "30vh",
                }}
            >
                <PlaneImg detail={myInfo} flip={false}></PlaneImg>
                <Text sx={{ fontSize: "48px", margin: "0 30px" }}>VS</Text>
                <PlaneImg detail={opInfo} flip={true}></PlaneImg>
            </Box>
            <Footer onQuit={onQuit} onNext={onNext} />
        </Box>
    );
};
