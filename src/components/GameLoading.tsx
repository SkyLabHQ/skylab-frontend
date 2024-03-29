import React, {
    FC,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
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
    Select,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import GameLoadingBackground from "../assets/game-loading-background.png";
import { Info, useGameContext } from "../pages/Game";
import { useSkylabGameFlightRaceContract } from "../hooks/useContract";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapInfo } from "./GameContent";
import GameFooter from "../assets/game-footer.png";
import GatherTimeResult from "./GameContent/assets/gatherTimeResult.svg";
import GatherTimeResult1 from "./GameContent/assets/gatherTimeResult1.svg";
import GatherTimeResult2 from "./GameContent/assets/gatherTimeResult2.svg";
import GatherTimeResult3 from "./GameContent/assets/gatherTimeResult3.svg";

import LoadingIcon from "@/assets/loading.svg";
import { handleError } from "@/utils/error";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import CloseIcon from "../assets/icon-close.svg";
import TipIcon from "@/assets/tip.svg";
import { getTokenInfoValue, initTokenInfoValue } from "@/utils/tokenInfo";
import Loading from "./Loading";
import useSkyToast from "@/hooks/useSkyToast";
import useBurnerContractCall, {
    ContractType,
    useRetryContractCall,
} from "@/hooks/useRetryContract";

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
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        onOpen: onPoOpen,
        onClose: onPoClose,
        isOpen: isPoOpen,
    } = useDisclosure();
    const { tokenId } = useGameContext();
    const { handleCheckBurner, burner } = useBurnerWallet(tokenId);
    const toast = useSkyToast();
    const navigate = useNavigate();
    const burnerCall = useBurnerContractCall();

    const handleQuit = async () => {
        try {
            setLoading(true);
            if (loading) return;
            const result = await handleCheckBurner();
            if (!result) {
                setLoading(false);
                return;
            }
            console.log("start withdrawFromQueue");
            await burnerCall(ContractType.RACETOURNAMENT, "withdrawFromQueue", [
                tokenId,
            ]);
            console.log("successful withdrawFromQueue");
            setLoading(false);
            toast("Successful withdraw from queue");
            navigate(`/activities`);
        } catch (error) {
            setLoading(false);
            toast(`Please refresh page, ${handleError(error)}`);
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
        <Box pos="absolute" left="0" bottom="0" w="100vw" sx={{}}>
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="36px"
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
                    fontSize="28px"
                    color="white"
                    fontFamily="Orbitron"
                >
                    Matching opponent
                </Text>
                <Box
                    textAlign="center"
                    minWidth="80vw"
                    fontSize="28px"
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
                    <Popover
                        placement="top"
                        isOpen={isPoOpen}
                        onOpen={onPoOpen}
                        onClose={onPoClose}
                    >
                        <PopoverTrigger>
                            <Img cursor={"pointer"} ml="2" src={TipIcon}></Img>
                        </PopoverTrigger>
                        {isPoOpen && (
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
                                        , the game continues on the backend.
                                        Once an opponent is found and they
                                        completes the game, you lose.
                                    </Text>
                                </PopoverBody>
                            </PopoverContent>
                        )}
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
                        {loading && <Loading size={50}></Loading>}
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
    return (
        <>
            {detail?.level ? (
                <Box>
                    <Img
                        src={detail?.img}
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
                        duration: 3,
                    }}
                    animate={{ rotate: 360 }}
                />
            )}
        </>
    );
};

const zoneList = [
    { value: -12, label: "-12 Baker Island, Howland Island" },
    { value: -11, label: "-11 Pago Pago, Alofi, Midway Atoll" },
    { value: -10, label: "-10 Honolulu, Papeete" },
    { value: -9, label: "-9" },
    { value: -8, label: "-8 Anchorage, Fairbanks" },
    { value: -7, label: "-7 Seattle, Los Angeles, Vancouver " },
    { value: -6, label: "-6 Mexico City,  Guatemala City " },
    { value: -5, label: "-5 Lima, Chicago" },
    { value: -4, label: "-4 New York, Toronto" },
    { value: -3, label: "-3 Buenos Aires, Rio de Janeiro, Montevideo " },
    { value: -2, label: "-2 Nuuk" },
    { value: -1, label: "-1 Praia" },
    { value: 1, label: "+1 Paris, Rome, Berlin" },
    { value: 2, label: "+2 Oslo, Monaco" },
    { value: 3, label: "+3 Moscow, Athens, Cairo, Istanbul " },
    { value: 4, label: "+4 Dubai, Baku, Tbilisi" },
    { value: 5, label: "+5 Yekaterinburg" },
    { value: 6, label: "+6 Almaty, Dhaka, Omsk" },
    { value: 7, label: "+7 Bangkok, Jakarta, Hanoi " },
    { value: 8, label: "+8 Beijing, Hongkong, SIngapore" },
    { value: 9, label: "+9 Tokyo, Seoul, Chita " },
    { value: 10, label: "+10 Sydney, Brisbane, Port Moresby" },
    { value: 11, label: "+11 Honiara, Noumea" },
    { value: 12, label: "+12 Auckland, Anadyr" },
];

export const GameLoading = () => {
    const [zone, setZone] = useState("-4");
    const stateTimer = useRef(false);
    const navigate = useNavigate();
    const burnerCall = useBurnerContractCall();
    const retryContractCall = useRetryContractCall();
    const toast = useSkyToast();
    const [loadMapId, setLoadMapId] = useState<number>(0);
    const {
        myState,
        opTokenId,
        onMapParams,
        onNext,
        onMapPathChange,
        tokenId,
        onMapChange,
        myInfo,
        opInfo,
    } = useGameContext();
    const { handleCheckBurner } = useBurnerWallet(tokenId);
    const zoneImg = useMemo(() => {
        if (["-1", "-4", "-7", "-10", "2", "5", "8", "11"].includes(zone)) {
            return GatherTimeResult1;
        }

        if (["-3", "-6", "-9", "-12", "0", "3", "6", "9"].includes(zone)) {
            return GatherTimeResult2;
        }

        if (["-2", "-5", "-8", "-11", "1", "4", "7", "10"].includes(zone)) {
            return GatherTimeResult3;
        }
        return GatherTimeResult;
    }, [zone]);

    // 跟合约交互 获取地图
    const handleGetMap = async () => {
        try {
            const result = await handleCheckBurner();
            if (!result) return;
            console.log("start getMap");
            setLoadMapId(1);
            await burnerCall(ContractType.RACETOURNAMENT, "getMap", [tokenId]);
            const seed = Math.floor(Math.random() * 1000000) + 1;
            initTokenInfoValue(tokenId, {
                seed,
            });
            setLoadMapId(2);
            toast("Successfully get map");
            console.log("success getMap");
        } catch (error) {
            toast(`Please refresh page, ${handleError(error)}`);
        }
    };

    // 读取mapId
    const handleGetMapId = async () => {
        try {
            setLoadMapId(3);
            const tokenInfo = localStorage.getItem("tokenInfo")
                ? JSON.parse(localStorage.getItem("tokenInfo"))
                : {};
            const localMap = tokenInfo[tokenId]?.map;
            const localMapPath = tokenInfo[tokenId]?.mapPath;
            if (localMapPath) {
                onMapPathChange(localMapPath);
            }
            const mapId = await retryContractCall(
                ContractType.RACETOURNAMENT,
                "mapId",
                [tokenId],
            );
            const f = Math.floor(mapId.toNumber() / 10);
            const res = await axios({
                method: "get",
                url: `https://red-elegant-wasp-428.mypinata.cloud/ipfs/Qmaf7vhNyd7VudLPy2Xbx2K6waQdydj8KnExU2SdqNMogp/batch_fullmap_${f}.json`,
            });
            setLoadMapId(4);
            const map = res.data[mapId];

            onMapParams(map.map_params);
            const initialMap = initMap(map.map_params);
            if (localMap) {
                for (let i = 0; i < initialMap.length; i++) {
                    for (let j = 0; j < initialMap[i].length; j++) {
                        if (localMap[i][j].selected) {
                            initialMap[i][j].selected = localMap[i][j].selected;
                            initialMap[i][j].time = localMap[i][j].time;
                            initialMap[i][j].fuelLoad = localMap[i][j].fuelLoad;
                            initialMap[i][j].batteryLoad =
                                localMap[i][j].batteryLoad;
                        }
                    }
                }
            }
            onMapChange(initialMap);
        } catch (error) {
            toast(handleError(error));
        }
    };

    const handleGetMapInfo = async () => {
        if (myState === 1) {
            stateTimer.current = true;
            await handleGetMap();
            await handleGetMapId();
            onNext(1);
        } else if (myState > 1) {
            if (stateTimer.current) {
                return;
            }
            await handleGetMapId();
            if (myState === 2) {
                const localMapPath = getTokenInfoValue(tokenId, "mapPath");
                if (localMapPath?.length > 0) {
                    onNext(3);
                } else {
                    onNext(1);
                }
            } else if ([3, 4, 5, 6, 7].includes(myState)) {
                onNext(6);
            }
        }
    };

    useEffect(() => {
        if (myState === 0) {
            navigate(`/activities`);
            return;
        }

        if (!tokenId || !myState || !opTokenId) {
            return;
        }

        handleGetMapInfo();
    }, [myState, tokenId, opTokenId]);

    return (
        <Box
            pos="relative"
            background={`url(${GameFooter}),url(${GameLoadingBackground})`}
            bgRepeat="no-repeat,no-repeat"
            height="100vh"
            bgPos={"center bottom,center center"}
            bgSize={"100%,100% 100%"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop={"1vh"}
        >
            {!!loadMapId && <MapLoading loadMapId={loadMapId}></MapLoading>}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1vh",
                }}
            >
                <PlaneImg detail={myInfo} flip={false}></PlaneImg>
                <Text sx={{ fontSize: "48px", margin: "0 30px" }}>VS</Text>
                <PlaneImg detail={opInfo} flip={true}></PlaneImg>
            </Box>
            <Box
                sx={{
                    borderRadius: "20px",
                    border: "3px solid #FDDC2D",
                    background: "rgba(255, 255, 255, 0.20)",
                    backdropFilter: "blur(18.5px)",
                    width: "60vw",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1vh",
                    padding: "1vh 1vw",
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Text sx={{ fontSize: "24px" }}>
                        Join the game during{" "}
                        <span style={{ color: "#FFF761" }}>gathering time</span>{" "}
                        for faster component matching! Calculate your
                        personalized gathering time based on your time zone
                        here.
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "3vh",
                        }}
                    >
                        <Text sx={{ fontSize: "24px" }}>Your time zone</Text>
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Select
                                variant="unstyled"
                                sx={{
                                    width: "8vw",
                                    border: " 3px solid #FFF761",
                                    borderRadius: "10px",
                                    marginRight: "10px",
                                    height: "50px",
                                }}
                                value={zone}
                                onChange={(e) => {
                                    setZone(e.target.value);
                                }}
                            >
                                {zoneList.map((item) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    );
                                })}
                            </Select>
                            <Text sx={{ fontSize: "36px" }}> UTC</Text>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Img src={zoneImg} w="80%" />
                </Box>
            </Box>
            <Footer onNext={handleGetMapInfo} />
        </Box>
    );
};
