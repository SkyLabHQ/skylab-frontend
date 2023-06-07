import React, { FC, useEffect, useReducer, useRef, useState } from "react";
import {
    Box,
    Button,
    Img,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
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
import SkyToast from "./Toast";
import { handleError } from "@/utils/error";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import CloseIcon from "../assets/icon-close.svg";
import TipIcon from "@/assets/tip.svg";
import { calculateGasMargin } from "@/utils/web3Utils";
import useGameState from "@/hooks/useGameState";
type Props = {};

const MapLoading = ({ loadMapId }: { loadMapId: number }) => {
    const countRef = useRef<number>(0);

    const [_, forceRender] = useReducer((x) => x + 1, 0);
    useEffect(() => {
        let timer = setInterval(() => {
            if (loadMapId === 1) {
                if (countRef.current < 30) {
                    countRef.current += 10;
                } else if (countRef.current < 49) {
                    countRef.current += 1;
                }
            }

            if (loadMapId === 2) {
                countRef.current = 50;
            }

            if (loadMapId === 3) {
                if (countRef.current <= 50) {
                    countRef.current = 60;
                } else if (countRef.current < 80) {
                    countRef.current += 10;
                } else if (countRef.current < 99) {
                    countRef.current += 1;
                }
            }

            if (loadMapId === 4) {
                countRef.current = 100;
                clearInterval(timer);
            }

            forceRender();
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, [loadMapId]);

    return (
        <Box
            sx={{
                background: "#ABABAB",
                width: "30vw",
                position: "absolute",
                left: "50%",
                top: "10vh",
                transform: "translateX(-50%)",
                borderRadius: "20px",
                padding: "1vh 2.6vw",
            }}
        >
            {!!loadMapId && (
                <Box>
                    <Text sx={{ fontSize: "36px" }}>
                        {(loadMapId === 1 || loadMapId === 2) &&
                            `Getting map Id...`}
                        {(loadMapId === 3 || loadMapId === 4) &&
                            `Fetching map...`}
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                background: "rgba(217, 217, 217, 0.8)",
                                border:
                                    countRef.current === 100
                                        ? "2px solid #70EB25"
                                        : "2px solid #E8EF41",
                                borderRadius: "20px",
                                overflow: "hidden",
                                height: "2.2vh",
                                flex: 1,
                                marginRight: "2.2vw",
                            }}
                        >
                            <Box
                                sx={{
                                    background:
                                        countRef.current === 100
                                            ? "#70EB25"
                                            : "#FFF761",
                                    width: countRef.current + "%",
                                    height: "100%",
                                    borderRadius: "20px",
                                    transition: "width 0.5s ease-in-out",
                                }}
                            ></Box>
                        </Box>
                        <Text sx={{ fontSize: "28px" }}>
                            {countRef.current}%
                        </Text>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

const initMap = (mapInfo: any) => {
    const map: MapInfo[][] = [];
    for (let i = 0; i < 15; i++) {
        map.push([]);
        for (let j = 0; j < 15; j++) {
            map[i].push({
                role:
                    [0, 14].includes(i) && [0, 14].includes(j)
                        ? "start"
                        : i === 7 && j === 7
                        ? "end"
                        : "normal",
                distance: mapInfo[i][j][0],
                fuelScaler: mapInfo[i][j][1],
                batteryScaler: mapInfo[i][j][2],
                fuelLoad: 0,
                batteryLoad: 0,
            });
        }
    }
    return map;
};

const Footer: FC<{ onNext: () => void }> = ({}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { tokenId } = useGameContext();
    const toast = useToast();
    const navigate = useNavigate();

    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    const handleQuit = async () => {
        try {
            const res = await skylabGameFlightRaceContract.withdrawFromQueue(
                tokenId,
            );
            await res.wait();
            toast({
                position: "top",
                render: () => (
                    <SkyToast
                        message={"Successfiul withdraw from queue"}
                    ></SkyToast>
                ),
            });
            setTimeout(() => {
                navigate(`/spendresource?tokenId=${tokenId}`);
            }, 1000);
        } catch (error) {
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "Escape":
                    onOpen();
                    break;
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
                onClick={onOpen}
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
                    fontSize="32px"
                    color="white"
                    fontFamily="Orbitron"
                >
                    Matching opponent
                </Text>
                <Box
                    textAlign="center"
                    minWidth="80vw"
                    fontSize="32px"
                    color="white"
                    fontFamily="Orbitron"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text>
                        Make sure to{" "}
                        <span style={{ color: "#8DF6F5" }}>QUIT</span> before
                        closing this window
                    </Text>
                    <Popover>
                        <PopoverTrigger>
                            <Img cursor={"pointer"} ml="2" src={TipIcon}></Img>
                        </PopoverTrigger>
                        <PopoverContent
                            sx={{
                                width: "619px",
                                background: "#fff",
                                color: "#000",
                            }}
                        >
                            <PopoverBody>
                                <Text sx={{ fontWeight: 600 }}>
                                    If you close the window without clicking{" "}
                                    <span style={{ color: "#4da6ff" }}>
                                        QUIT
                                    </span>{" "}
                                    , the game continues on the backend. Once an
                                    opponent is found and they completes the
                                    game, you lose.
                                </Text>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
                <ModalOverlay />
                <ModalContent
                    bg="rgba(255, 255, 255, 0.7)"
                    border="3px solid #FDDC2D"
                    borderRadius="20px"
                >
                    <Img
                        pos="absolute"
                        top="16px"
                        right="16px"
                        w="32px"
                        src={CloseIcon}
                        cursor="pointer"
                        onClick={() => onClose()}
                    />
                    <ModalBody pb="0" pt="36px">
                        <Box sx={{ display: "flex" }}>
                            <Text sx={{ fontSize: "36px", color: "#000" }}>
                                Quit the game and keep all your resources
                            </Text>
                        </Box>
                    </ModalBody>

                    <ModalFooter
                        display="flex"
                        justifyContent="space-between"
                        pt="14"
                    >
                        <Button
                            bg="white"
                            colorScheme="white"
                            onClick={handleQuit}
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                            w="40%"
                            padding="32px 0"
                            borderRadius="20px"
                        >
                            Quit
                        </Button>
                        <Button
                            colorScheme="yellow"
                            onClick={onClose}
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                            w="50%"
                            padding="32px 0"
                            borderRadius="20px"
                        >
                            Continue to wait
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const PlaneImg = ({ detail, flip }: { detail: Info; flip: boolean }) => {
    const { level } = useGameContext();
    return (
        <>
            {detail?.tokenId ? (
                <Box>
                    <Img
                        src={MetadataPlaneImg(level)}
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
    const toast = useToast();
    const { account } = useActiveWeb3React();
    const navigate = useNavigate();
    const intervalRef = useRef(null);
    const [loadMapId, setLoadMapId] = useState<number>(0);
    const {
        onMapParams,
        onNext,
        tokenId,
        onMapChange,
        onMyInfo,
        onOpInfo,
        myInfo,
        opInfo,
    } = useGameContext();
    const { approveForGame, burner } = useBurnerWallet(tokenId);
    const getGameState = useGameState();

    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    // 跟合约交互 获取地图
    const handleGetMap = async () => {
        try {
            window.clearInterval(intervalRef.current);

            console.log("start getMap");
            const gas = await skylabGameFlightRaceContract
                .connect(burner)
                .estimateGas.getMap(tokenId);
            const res = await skylabGameFlightRaceContract
                .connect(burner)
                .getMap(tokenId, {
                    gasLimit: calculateGasMargin(gas),
                });
            setLoadMapId(1);
            await res.wait();
            setLoadMapId(2);
            console.log("success getMap");
            const seed = Math.floor(Math.random() * 1000000) + 1;
            const tokenInfo = localStorage.getItem("tokenInfo")
                ? JSON.parse(localStorage.getItem("tokenInfo"))
                : {};
            tokenInfo[tokenId] = {
                seed,
            };
            localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={"Successfully get map"}></SkyToast>
                ),
            });
        } catch (error) {
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };

    // 读取mapId
    const handleGetMapId = async () => {
        try {
            setLoadMapId(3);
            const mapId = await skylabGameFlightRaceContract.mapId(tokenId);
            const f = Math.floor(mapId.toNumber() / 10);
            const res = await axios({
                method: "get",
                url: `https://red-elegant-wasp-428.mypinata.cloud/ipfs/Qmaf7vhNyd7VudLPy2Xbx2K6waQdydj8KnExU2SdqNMogp/batch_fullmap_${f}.json`,
            });
            setLoadMapId(4);
            const map = res.data[mapId];
            onMapParams(map.map_params);
            const initialMap = initMap(map.map_params);
            onMapChange(initialMap);
        } catch (error) {
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
            onOpInfo({
                tokenId: tokenId,
                address: "",
                fuel: "0",
                battery: "0",
            });
        }
    };

    // 获取我的信息
    const getMyInfo = async () => {
        try {
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
        } catch (error) {
            console.log(error);
        }
    };

    // 获取对手信息
    const getOpponentInfo = async (opTokenId: number) => {
        try {
            const [opTank, opAccount] = await Promise.all([
                skylabGameFlightRaceContract.gameTank(opTokenId),
                skylabBaseContract.ownerOf(opTokenId),
            ]);

            onOpInfo({
                tokenId: opTokenId,
                address: opAccount,
                fuel: opTank.fuel.toString(),
                battery: opTank.battery.toString(),
            });
        } catch (error) {
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
            onOpInfo({
                tokenId: opTokenId,
                address: "",
                fuel: "0",
                battery: "0",
            });
        }
    };

    const waitingForOpponent = async () => {
        try {
            const state = await getGameState(tokenId);
            console.log(state, "state");
            // 用户未参加游戏
            if (state === 0) {
                navigate(`/spendresource?tokenId=${tokenId}`);
            }

            const opTokenId =
                await skylabGameFlightRaceContract?.matchedAviationIDs(tokenId);
            console.log(opTokenId.toNumber(), "opTokenId");
            // 已经匹配到对手
            if (opTokenId.toNumber() !== 0) {
                await getOpponentInfo(opTokenId);
                // 用户已经参加游戏 未获取地图
                if (state === 1) {
                    await handleGetMap();
                    await handleGetMapId();
                    setTimeout(() => {
                        onNext(1);
                    }, 1000);
                }
                // 用户已经参加游戏 已经获取地图 开始游戏
                else if (state === 2) {
                    await handleGetMapId();
                    setTimeout(() => {
                        onNext(1);
                    }, 1000);
                }
                // 3是游戏已经commitPath 等待revealPath
                else if (state === 3 || state === 4) {
                    await handleGetMapId();
                    setTimeout(() => {
                        onNext(6);
                    }, 1000);
                }
                // 5是游戏胜利
                else if (state === 5) {
                    await handleGetMapId();

                    setTimeout(() => {
                        onNext(5);
                    }, 1000);
                }
                // 6是游戏失败
                else if (state === 6) {
                    await handleGetMapId();
                    setTimeout(() => {
                        onNext(7);
                    }, 1000);
                }
                // 7是游戏投降 失败
                else if (state === 7) {
                    await handleGetMapId();
                    setTimeout(() => {
                        onNext(7);
                    }, 1000);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInterval = async () => {
        intervalRef.current = setInterval(() => {
            waitingForOpponent();
        }, 5000);
    };

    useEffect(() => {
        if (
            !skylabBaseContract ||
            !skylabGameFlightRaceContract ||
            !account ||
            !tokenId
        ) {
            return;
        }

        getMyInfo();
        handleInterval();

        return () => {
            window.clearInterval(intervalRef.current);
        };
    }, [skylabBaseContract, skylabGameFlightRaceContract, account, tokenId]);

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
            {!!loadMapId && <MapLoading loadMapId={loadMapId}></MapLoading>}
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
            <Footer onNext={waitingForOpponent} />
        </Box>
    );
};
