import React, { useEffect, useRef, useState } from "react";
import SpendTitle from "./assets/spend-title.svg";
import FuelIcon from "@/assets/icon-fuel.svg";
import BatteryIcon from "@/assets/icon-battery.svg";
import BBg from "./assets/button-bg.svg";
import Bg from "./assets/bg.png";
import WarnIcon from "./assets/icon-warn.svg";
import DArrowIcon from "./assets/d-arrow.svg";
import qs from "query-string";
import {
    Box,
    HStack,
    Img,
    Slider,
    SliderFilledTrack,
    SliderTrack,
    Text,
    VStack,
    Input,
    useToast,
    Button,
} from "@chakra-ui/react";
import Tutorial from "./Tutorial";
import { useLocation, useNavigate } from "react-router-dom";
import useDebounce from "@/utils/useDebounce";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    useSkylabTestFlightContract,
    useSkylabGameFlightRaceContract,
    useSkylabResourcesContract,
} from "@/hooks/useContract";
import { SubmitButton } from "../Button/Index";
import SkyToast from "../Toast";
import { handleError } from "@/utils/error";
import useBurnerWallet, {
    ApproveGameState,
    BalanceState,
} from "@/hooks/useBurnerWallet";
import { calculateGasMargin } from "@/utils/web3Utils";
import useGameState from "@/hooks/useGameState";
import LoadingIcon from "@/assets/loading.svg";
import { motion } from "framer-motion";
import { TutorialGroup } from "../GameContent/tutorialGroup";

const Airplane = ({
    level,
    planeImg,
    tokenId,
    fuelBalance,
    batteryBalance,
}: {
    planeImg: string;
    level: number;
    tokenId: number;
    fuelBalance: string;
    batteryBalance: string;
}) => {
    return (
        <Box>
            <Text sx={{ fontSize: "40px", fontWeight: 600 }}>
                Level {level}
            </Text>
            <Box sx={{ position: "relative" }} width="26vw" h="26vw">
                {tokenId && (
                    <Img
                        src={planeImg}
                        w="100%"
                        zIndex={800}
                        pos="absolute"
                        top="0"
                        left="0"
                    ></Img>
                )}
                <Box
                    sx={{
                        border: "3px solid #FFF761",
                        width: "216px",
                        height: "94px",
                        borderRadius: "100px",
                        padding: "3px",
                        position: "absolute",
                        right: "100px",
                        top: "20px",
                        zIndex: 850,
                    }}
                >
                    <HStack
                        sx={{
                            background: `url(${BBg}) no-repeat`,
                            backgroundSize: "cover",
                            width: "100%",
                            borderRadius: "100px",
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "50%",
                                height: "82px",
                                width: "82px",
                                background:
                                    "linear-gradient(90deg, #E8EF41 0%, rgba(0, 0, 0, 0.6) 78.22%)",
                                border: "3px solid #FFF761",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Img src={FuelIcon} sx={{ width: "60px" }}></Img>
                        </Box>
                        <VStack
                            sx={{
                                marginInlineStart: '0 !important"',
                            }}
                        >
                            <Text
                                sx={{
                                    color: "#FFF761",
                                    fontSize: "36px",
                                    fontWeight: 500,
                                    lineHeight: "36px",
                                }}
                            >
                                {fuelBalance}
                            </Text>
                            <Text
                                sx={{
                                    color: "#BCBBBE",
                                    fontSize: "20px",
                                    fontWeight: 400,
                                    lineHeight: "29px",
                                }}
                            >
                                Remaining
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
                <Box
                    sx={{
                        border: "3px solid #FFF761",
                        width: "216px",
                        height: "94px",
                        borderRadius: "100px",
                        padding: "3px",
                        position: "absolute",
                        right: "-50px",
                        top: "130px",
                        zIndex: 850,
                    }}
                >
                    <HStack
                        sx={{
                            background: `url(${BBg}) no-repeat`,
                            backgroundSize: "cover",
                            width: "100%",
                            borderRadius: "100px",
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: "50%",
                                height: "82px",
                                width: "82px",
                                background:
                                    "linear-gradient(90deg, #E8EF41 0%, rgba(0, 0, 0, 0.6) 78.22%)",
                                border: "3px solid #FFF761",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Img src={BatteryIcon} sx={{ width: "70px" }}></Img>
                        </Box>
                        <VStack
                            sx={{
                                marginInlineStart: '0 !important"',
                            }}
                        >
                            <Text
                                sx={{
                                    color: "#FFF761",
                                    fontSize: "36px",
                                    fontWeight: 500,
                                    lineHeight: "36px",
                                }}
                            >
                                {batteryBalance}
                            </Text>
                            <Text
                                sx={{
                                    color: "#BCBBBE",
                                    fontSize: "20px",
                                    fontWeight: 400,
                                    lineHeight: "29px",
                                }}
                            >
                                Remaining
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
                <Img
                    src={DArrowIcon}
                    pos="absolute"
                    bottom="-10vh"
                    left="0"
                    w="18.75vw"
                ></Img>
            </Box>
        </Box>
    );
};

const Resource = () => {
    const toast = useToast({
        position: "top",
    });
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;

    const [gameLevel, setGameLevel] = useState(null); // plane level
    const [tokenId, setTokenId] = useState<number>();
    const [planeImg, setPlaneImg] = useState<string>(""); // plane img
    const skylabTestFlightContract = useSkylabTestFlightContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabResourcesContract = useSkylabResourcesContract();
    const getGameState = useGameState();
    const { account } = useActiveWeb3React();
    const inputFuelRef = useRef<any>(null);
    const inputBatteryRef = useRef<any>(null);
    const [loading, setLoading] = useState(0);

    const {
        approveForGame,
        getApproveGameState,
        getBalanceState,
        transferGas,
        burner,
    } = useBurnerWallet(tokenId);

    const [fuelError, setFuelError] = useState("");
    const [batteryError, setBatteryError] = useState("");

    const [fuelValue, setFuelValue] = useState(""); //汽油输入的值
    const [batteryValue, setBatteryValue] = useState("");

    const [fuelSlider, setFuelSlider] = useState(0); //汽油输入的值
    const [batterySlider, setBatterySlider] = useState(0);

    const [fuelBalance, setFuelBalance] = useState("");
    const [batteryBalance, setBatteryBalance] = useState("");

    const fuelDebounce = useDebounce(fuelError, 1000);
    const batteryDebounce = useDebounce(batteryError, 1000);

    const navigate = useNavigate();
    const [tutorial, setTutorial] = useState(
        localStorage.getItem("spendResource") ? false : true,
    );

    const handleCancelTutorial = () => {
        localStorage.setItem("spendResource", "true");
        setTutorial(false);
    };

    const handleFuelSlider = (value: number) => {
        setFuelSlider(value);
        const amount = ((value * Number(fuelBalance)) / 100).toFixed(0);
        setFuelValue(String(amount));
    };

    const handleBatterySlider = (value: number) => {
        setBatterySlider(value);
        const amount = ((value * Number(batteryBalance)) / 100).toFixed(0);
        setBatteryValue(String(amount));
    };

    const handleFuelValue = (value: string) => {
        setFuelValue(value);
        if (Number(value) > Number(fuelBalance)) {
            setFuelError("Insufficient Resource");
            setFuelSlider(100);
        } else {
            setFuelError("");
            setFuelSlider((Number(value) / Number(fuelBalance)) * 100);
        }
    };

    const handleFuelBlur = () => {
        if (Number(fuelValue) > Number(fuelBalance)) {
            setFuelValue(fuelBalance);
        }
    };

    const handleBatteryBlur = () => {
        if (Number(batteryValue) > Number(batteryBalance)) {
            setBatteryValue(batteryBalance);
        } else {
            const balance = String(
                Number(batteryBalance) - Number(batteryValue),
            );
        }
    };

    const handleBatteryValue = (value: string) => {
        setBatteryValue(value);
        if (Number(value) > Number(batteryBalance)) {
            setBatteryError("Insufficient Resource");
            setBatterySlider(100);
        } else {
            setBatteryError("");
            setBatterySlider((Number(value) / Number(batteryBalance)) * 100);
        }
    };

    const handleFFocus = () => {
        setTimeout(() => {
            inputFuelRef?.current?.focus();
        }, 0);
    };

    const handleBFocus = () => {
        setTimeout(() => {
            inputBatteryRef?.current?.focus();
        }, 0);
    };

    const getResourcesBalance = async () => {
        const fuelBalance = await skylabResourcesContract.balanceOf(account, 0);
        const batteryBalance = await skylabResourcesContract.balanceOf(
            account,
            1,
        );
        setBatteryBalance(fuelBalance.toString());
        setFuelBalance(batteryBalance.toString());
    };

    // 开始玩游戏
    const handlePlayGame = async () => {
        try {
            const state = await getGameState(tokenId);
            if (state === 0) {
                const balanceState = await getBalanceState();
                if (balanceState === BalanceState.ACCOUNT_LACK) {
                    toast({
                        position: "top",
                        render: () => (
                            <SkyToast
                                message={
                                    "You have not enough balance to transfer burner wallet"
                                }
                            ></SkyToast>
                        ),
                    });
                    return;
                } else if (balanceState === BalanceState.LACK) {
                    await transferGas();
                }

                const approveState = await getApproveGameState();
                if (approveState === ApproveGameState.NOT_APPROVED) {
                    setLoading(2);
                    await approveForGame();
                }

                setLoading(3);
                console.log("start loadFuel battery to gameTank");

                const gas = await skylabGameFlightRaceContract
                    .connect(burner)
                    .estimateGas.loadFuelBatteryToGameTank(
                        tokenId,
                        fuelValue ? fuelValue : 0,
                        batteryValue ? batteryValue : 0,
                    );

                const loadRes = await skylabGameFlightRaceContract
                    .connect(burner)
                    .loadFuelBatteryToGameTank(
                        tokenId,
                        fuelValue ? fuelValue : 0,
                        batteryValue ? batteryValue : 0,
                        {
                            gasLimit: calculateGasMargin(gas),
                        },
                    );

                await loadRes.wait();
                console.log("success loadFuel battery to gameTank");

                getResourcesBalance();

                console.log("start search opponent");
                setLoading(4);
                const searchGas = await skylabGameFlightRaceContract
                    .connect(burner)
                    .estimateGas.searchOpponent(tokenId);
                const res = await skylabGameFlightRaceContract
                    .connect(burner)
                    .searchOpponent(tokenId, {
                        gasLimit: calculateGasMargin(searchGas),
                    });
                await res.wait();
                console.log("success search opponent");
                setTimeout(() => {
                    setLoading(0);
                    navigate(`/game?tokenId=${tokenId}&testflight=${istest}`);
                }, 1000);
            } else {
                navigate(`/game?tokenId=${tokenId}`);
            }
        } catch (error) {
            console.log(error);
            setLoading(0);
            toast({
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };

    // 获取飞机等级
    const handleGetGameLevel = async () => {
        try {
            const owner = await skylabTestFlightContract.ownerOf(tokenId);
            if (owner.toLowerCase() !== account.toLowerCase()) {
                navigate(`/mercury?step=2`);
            }
        } catch (error) {
            navigate(`/mercury?step=2`);
        }

        const gameLevel = await skylabTestFlightContract._aviationLevels(
            tokenId,
        );
        const hasWin = await skylabTestFlightContract._aviationHasWinCounter(
            tokenId,
        );
        const level = gameLevel.toNumber() + (hasWin ? 0.5 : 0);
        const metadata = await skylabTestFlightContract.tokenURI(tokenId);
        const base64String = metadata;
        const jsonString = window.atob(
            base64String.substr(base64String.indexOf(",") + 1),
        );
        const jsonObject = JSON.parse(jsonString);
        setPlaneImg(jsonObject.image);
        setGameLevel(level);
        const state = await getGameState(tokenId);
        if (state !== 0) {
            const url = istest
                ? `/game?tokenId=${tokenId}&testflight=true`
                : `/game?tokenId=${tokenId}`;
            navigate(url);
        }
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "f":
                    handleFFocus();
                    break;
                case "b":
                    handleBFocus();
                    break;
                case "o": {
                    let value;
                    if (fuelValue && Number(fuelValue) > 0) {
                        value = Number(fuelValue) - 1;
                    } else {
                        value = 0;
                    }
                    handleFuelValue(String(value));
                    break;
                }
                case "p": {
                    let value;
                    if (fuelValue) {
                        value = Number(fuelValue) + 1;
                    } else {
                        value = 1;
                    }
                    handleFuelValue(String(value));
                    break;
                }
                case ",": {
                    let value;
                    if (batteryValue && Number(batteryValue) > 0) {
                        value = Number(batteryValue) - 1;
                    } else {
                        value = 0;
                    }
                    handleBatteryValue(String(value));
                    break;
                }
                case ".": {
                    let value;
                    if (batteryValue) {
                        value = Number(batteryValue) + 1;
                    } else {
                        value = 1;
                    }
                    handleBatteryValue(String(value));
                    break;
                }
            }
        };
        document.addEventListener("keydown", keyboardListener);
        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [fuelValue, batteryValue, fuelBalance, batteryBalance]);

    useEffect(() => {
        setFuelError("");
    }, [fuelDebounce]);
    useEffect(() => {
        setBatteryError("");
    }, [batteryDebounce]);

    useEffect(() => {
        if (
            !skylabTestFlightContract ||
            !skylabResourcesContract ||
            !account ||
            !tokenId
        ) {
            return;
        }
        getResourcesBalance();
    }, [account, skylabTestFlightContract, tokenId]);

    useEffect(() => {
        if (!skylabGameFlightRaceContract || !tokenId) {
            return;
        }
        handleGetGameLevel();
    }, [skylabGameFlightRaceContract, tokenId]);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.tokenId) {
            navigate(`/mercury?step=2`);
            return;
        }
        setTokenId(params.tokenId);
    }, []);

    return tutorial ? (
        <Tutorial handleTutorial={handleCancelTutorial}></Tutorial>
    ) : (
        <Box
            sx={{}}
            fontFamily="Orbitron"
            bg={`url(${Bg}) no-repeat`}
            backgroundSize="100% 100%"
            h="100vh"
            pos="relative"
        >
            {!!loading && (
                <>
                    <Box
                        h="100vh"
                        w={"100vw"}
                        pos="absolute"
                        left="0"
                        top="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection={"column"}
                        zIndex={900}
                    >
                        <Box
                            sx={{
                                height: "100px",
                                width: "100px",
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
                        <Box
                            sx={{
                                background: "#ABABAB",
                                padding: "20px 40px",
                                borderRadius: "20px",
                                marginTop: "1vh",
                            }}
                        >
                            <Text fontSize="36px" fontFamily="Quantico">
                                {loading === 1 &&
                                    "Transferring to burner wallet"}
                                {loading === 2 &&
                                    "Authorizing your plane to burner wallet."}
                                {loading === 3 && "Allocating resource"}
                                {loading === 4 && "Entering game"}
                            </Text>
                        </Box>
                    </Box>
                </>
            )}
            <Text
                fontSize="88px"
                fontWeight={800}
                pos="absolute"
                top="10px"
                left={"50px"}
            >
                Trailblazer
            </Text>
            <Box pos="absolute" right={"27px"} top="21px">
                <TutorialGroup showCharacter={true} horizontal={false} />
            </Box>
            <Box
                pos={"absolute"}
                top="14vh"
                left="15vw"
                sx={{
                    fontFamily: "Quantico",
                }}
            >
                <HStack>
                    <Box w="31vw" sx={{ marginRight: "5vw" }}>
                        <HStack
                            bg={`url(${SpendTitle}) no-repeat`}
                            w="31vw"
                            alignItems={"center"}
                        >
                            <Text
                                fontSize="48px"
                                fontWeight={400}
                                pl="5vw"
                                lineHeight={"50px"}
                            >
                                Spend
                            </Text>
                        </HStack>
                        <Box>
                            <HStack
                                sx={{
                                    width: "31vw",
                                    height: "25vh",
                                    background: "rgba(217, 217, 217, 0.2)",
                                    border: "5px solid #FFF761",
                                    boxShadow:
                                        "10px 4px 4px rgba(0, 0, 0, 0.8)",
                                    borderRadius: "40px",
                                    marginTop: "18px",
                                }}
                            >
                                <VStack sx={{ width: "10vw" }}>
                                    <Img src={FuelIcon} w="86px"></Img>
                                    <Text sx={{ fontSize: "40px" }}>Fuel</Text>
                                </VStack>
                                <Box
                                    sx={{
                                        width: "18vw",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            border: "2px dashed #FFF761",
                                            height: "7.8vh",
                                            position: "relative",
                                        }}
                                    >
                                        <Input
                                            ref={inputFuelRef}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                fontSize: "40px",
                                                textAlign: "center",
                                                ":focus": {
                                                    border: "none",
                                                    boxShadow: "none",
                                                },
                                            }}
                                            placeholder="0"
                                            value={fuelValue}
                                            onChange={(e) => {
                                                handleFuelValue(e.target.value);
                                            }}
                                            onBlur={() => {
                                                handleFuelBlur();
                                            }}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") {
                                                    inputFuelRef?.current?.blur();
                                                }
                                            }}
                                        />
                                        {!!fuelError && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    position: "absolute",
                                                    bottom: "-10px",
                                                    left: "0",
                                                    width: "100%",
                                                }}
                                            >
                                                <Img
                                                    src={WarnIcon}
                                                    sx={{
                                                        height: "40px",
                                                    }}
                                                ></Img>
                                                <Text
                                                    sx={{
                                                        color: "#FF2A0C",

                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {fuelError}
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                    <Slider
                                        aria-label="slider-ex-1"
                                        value={fuelSlider}
                                        sx={{
                                            height: "41px",
                                            marginTop: "11px",
                                        }}
                                        onChange={(e) => {
                                            handleFuelSlider(e);
                                        }}
                                    >
                                        <SliderTrack
                                            height={"33px"}
                                            sx={{
                                                background:
                                                    "rgba(217, 217, 217, 0.8)",
                                                borderRadius: "20px",
                                                border: "2px solid #E8EF41",
                                            }}
                                        >
                                            <SliderFilledTrack
                                                sx={{
                                                    background: "#FFF761",
                                                    borderRadius: "20px",
                                                }}
                                            />
                                        </SliderTrack>
                                    </Slider>
                                    <HStack
                                        sx={{
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        {[25, 50, 75, 100].map((item) => {
                                            return (
                                                <Box
                                                    key={item}
                                                    sx={{
                                                        cursor: "pointer",
                                                        width: "22%",
                                                    }}
                                                    onClick={() => {
                                                        handleFuelSlider(item);
                                                    }}
                                                >
                                                    <Box
                                                        key={item}
                                                        sx={{
                                                            height: "12px",
                                                            background:
                                                                Number(
                                                                    fuelSlider,
                                                                ) >= item
                                                                    ? "#FFF761"
                                                                    : "#D9D9D9",
                                                        }}
                                                    ></Box>
                                                    <Text
                                                        textAlign={"center"}
                                                        fontSize="20px"
                                                        color="#BCBBBE"
                                                    >
                                                        {item}%
                                                    </Text>
                                                </Box>
                                            );
                                        })}
                                    </HStack>
                                    {/* <HStack
                                        justifyContent={"flex-end"}
                                        sx={{ marginTop: "2px" }}
                                    >
                                        <Text
                                            sx={{
                                                color: "#FFF761",
                                                fontSize: "20px",
                                            }}
                                        >
                                            100
                                        </Text>
                                        <Text
                                            sx={{
                                                color: "#ABABAB",
                                                fontSize: "20px",
                                            }}
                                        >
                                            Cap
                                        </Text>
                                    </HStack> */}
                                </Box>
                            </HStack>
                            <HStack
                                sx={{
                                    marginTop: "11px",
                                }}
                            >
                                <Box
                                    sx={{
                                        background: "rgba(255, 255, 255, 0.2)",
                                        border: "1px solid #FFFFFF",
                                        borderRadius: "10px",
                                        width: "42px",
                                        height: "37px",
                                    }}
                                >
                                    <Text
                                        sx={{
                                            fontSize: "24px",
                                            fontWeight: 600,
                                            textAlign: "center",
                                        }}
                                    >
                                        F
                                    </Text>
                                </Box>
                                <Text
                                    sx={{
                                        fontSize: "24px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Focus on the fuel load input
                                </Text>
                            </HStack>
                        </Box>
                        <Box>
                            <HStack
                                sx={{
                                    width: "31vw",
                                    height: "25vh",
                                    background: "rgba(217, 217, 217, 0.2)",
                                    border: "5px solid #FFF761",
                                    boxShadow:
                                        "10px 4px 4px rgba(0, 0, 0, 0.8)",
                                    borderRadius: "40px",
                                    marginTop: "18px",
                                }}
                            >
                                <VStack sx={{ width: "10vw" }}>
                                    <Img src={BatteryIcon} w="100px"></Img>
                                    <Text
                                        sx={{
                                            fontSize: "40px",
                                            fontWeight: 400,
                                        }}
                                    >
                                        Battery
                                    </Text>
                                </VStack>
                                <Box
                                    sx={{
                                        width: "18vw",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            border: "2px dashed #FFF761",
                                            height: "7.8vh",
                                            position: "relative",
                                        }}
                                    >
                                        <Input
                                            ref={inputBatteryRef}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                fontSize: "40px",
                                                textAlign: "center",
                                                ":focus": {
                                                    border: "none",
                                                    boxShadow: "none",
                                                },
                                            }}
                                            placeholder="0"
                                            value={batteryValue}
                                            onChange={(e) => {
                                                handleBatteryValue(
                                                    e.target.value,
                                                );
                                            }}
                                            onBlur={() => {
                                                handleBatteryBlur();
                                            }}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") {
                                                    inputBatteryRef?.current?.blur();
                                                }
                                            }}
                                        />
                                        {!!batteryError && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    position: "absolute",
                                                    bottom: "-10px",
                                                    left: "0",
                                                    width: "100%",
                                                }}
                                            >
                                                <Img
                                                    src={WarnIcon}
                                                    sx={{
                                                        height: "40px",
                                                    }}
                                                ></Img>
                                                <Text
                                                    sx={{
                                                        color: "#FF2A0C",

                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {batteryError}
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>
                                    <Slider
                                        aria-label="slider-ex-1"
                                        value={batterySlider}
                                        sx={{
                                            height: "41px",
                                            marginTop: "11px",
                                        }}
                                        onChange={(e) => {
                                            handleBatterySlider(e);
                                        }}
                                    >
                                        <SliderTrack
                                            height={"33px"}
                                            sx={{
                                                background:
                                                    "rgba(217, 217, 217, 0.8)",
                                                borderRadius: "20px",
                                                border: "2px solid #E8EF41",
                                            }}
                                        >
                                            <SliderFilledTrack
                                                sx={{
                                                    background: "#FFF761",
                                                    borderRadius: "20px",
                                                }}
                                            />
                                        </SliderTrack>
                                    </Slider>
                                    <HStack
                                        sx={{
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        {[25, 50, 75, 100].map((item) => {
                                            return (
                                                <Box
                                                    key={item}
                                                    sx={{
                                                        cursor: "pointer",
                                                        width: "22%",
                                                    }}
                                                    onClick={() => {
                                                        handleBatterySlider(
                                                            item,
                                                        );
                                                    }}
                                                >
                                                    <Box
                                                        key={item}
                                                        sx={{
                                                            height: "12px",
                                                            background:
                                                                batterySlider >=
                                                                item
                                                                    ? "#FFF761"
                                                                    : "#D9D9D9",
                                                        }}
                                                    ></Box>
                                                    <Text
                                                        textAlign={"center"}
                                                        fontSize="20px"
                                                        color="#BCBBBE"
                                                    >
                                                        {item}%
                                                    </Text>
                                                </Box>
                                            );
                                        })}
                                    </HStack>
                                    {/* <HStack
                                        justifyContent={"flex-end"}
                                        sx={{ marginTop: "2px" }}
                                    >
                                        <Text
                                            sx={{
                                                color: "#FFF761",
                                                fontSize: "20px",
                                            }}
                                        >
                                            100
                                        </Text>
                                        <Text
                                            sx={{
                                                color: "#ABABAB",
                                                fontSize: "20px",
                                            }}
                                        >
                                            Cap
                                        </Text>
                                    </HStack> */}
                                </Box>
                            </HStack>
                            <HStack
                                sx={{
                                    marginTop: "11px",
                                }}
                            >
                                <Box
                                    sx={{
                                        background: "rgba(255, 255, 255, 0.2)",
                                        border: "1px solid #FFFFFF",
                                        borderRadius: "10px",
                                        width: "42px",
                                        height: "37px",
                                    }}
                                >
                                    <Text
                                        sx={{
                                            fontSize: "24px",
                                            fontWeight: 600,
                                            textAlign: "center",
                                        }}
                                    >
                                        B
                                    </Text>
                                </Box>
                                <Text
                                    sx={{
                                        fontSize: "24px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Focus on the battery load input
                                </Text>
                            </HStack>
                            <Box
                                sx={{
                                    width: "25vw",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                {/* 玩游戏按钮 */}
                                <SubmitButton
                                    width="25vw"
                                    style={{
                                        margin: "15px 0 0 0",
                                    }}
                                    onClick={handlePlayGame}
                                >
                                    <Text
                                        sx={{
                                            color: "#fff",
                                            fontSize: "40px",
                                            fontFamily: "Orbitron",
                                            fontWeight: 500,
                                            textShadow:
                                                "0px 4px 4px rgba(0, 0, 0, 0.5)",
                                        }}
                                    >
                                        Play
                                    </Text>
                                </SubmitButton>
                                <Button
                                    onClick={() => {
                                        navigate("/mercury?step=2");
                                    }}
                                    colorScheme="teal"
                                    variant="link"
                                    sx={{
                                        fontSize: "36px",
                                        margin: "0 auto",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Back
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Airplane
                        level={gameLevel}
                        planeImg={planeImg}
                        tokenId={tokenId}
                        fuelBalance={fuelBalance}
                        batteryBalance={batteryBalance}
                    ></Airplane>
                </HStack>
            </Box>
        </Box>
    );
};

export default Resource;
