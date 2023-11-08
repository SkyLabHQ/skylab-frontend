import React, { useEffect, useRef, useState } from "react";
import SpendTitle from "./assets/spend-title.svg";
import FuelIcon from "@/assets/icon-fuel.svg";
import BatteryIcon from "@/assets/icon-battery.svg";
import BBg from "./assets/button-bg.svg";
import Bg from "./assets/bg.png";
import WarnIcon from "./assets/icon-warn.svg";
import DArrowIcon from "./assets/d-arrow.svg";
import UniswapIcon from "./assets/uniswap.svg";
import TipIcon from "@/assets/tip.svg";
import PolygonIcon from "../Tournament/assets/polygon.svg";
import qs from "query-string";
import {
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Box,
    HStack,
    Img,
    Slider,
    SliderFilledTrack,
    SliderTrack,
    Text,
    VStack,
    Input,
    Button,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import useDebounce from "@/utils/useDebounce";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { SubmitButton } from "../Button/Index";
import { handleError } from "@/utils/error";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import { ChainId } from "@/utils/web3Utils";
import useGameState from "@/hooks/useGameState";
import LoadingIcon from "@/assets/loading.svg";
import { motion } from "framer-motion";
import { TutorialGroup } from "../GameContent/tutorialGroup";
import handleIpfsUrl from "@/utils/ipfsImg";
import useSkyToast from "@/hooks/useSkyToast";
import useBurnerContractCall, {
    ContractType,
    useRetryContractCall,
} from "@/hooks/useRetryContract";
import { faucetUrl } from "@/skyConstants";

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
            <Text sx={{ fontSize: "36px", fontWeight: 600 }}>
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
    const toast = useSkyToast();
    const { search } = useLocation();
    const burnerCall = useBurnerContractCall();
    const retryContractCall = useRetryContractCall();

    const params = qs.parse(search) as any;
    const istest = params.testflight === "true";
    const [gameLevel, setGameLevel] = useState(null); // plane level
    const [tokenId, setTokenId] = useState<number>();
    const [planeImg, setPlaneImg] = useState<string>(""); // plane img
    const getGameState = useGameState();
    const { account, chainId } = useActiveWeb3React();
    const inputFuelRef = useRef<any>(null);
    const inputBatteryRef = useRef<any>(null);
    const [loading, setLoading] = useState(0);
    const { handleCheckBurner } = useBurnerWallet(tokenId);
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
        const fuelBalance = await retryContractCall(
            ContractType.RESOURCES,
            "balanceOf",
            [account, 0],
        );

        const batteryBalance = await retryContractCall(
            ContractType.RESOURCES,
            "balanceOf",
            [account, 1],
        );
        setBatteryBalance(batteryBalance.toString());
        setFuelBalance(fuelBalance.toString());
    };

    // 开始玩游戏
    const handlePlayGame = async () => {
        if (!!loading) {
            return;
        }
        try {
            setLoading(5);
            const state = await getGameState(tokenId);
            if (state === 0) {
                const result = await handleCheckBurner(
                    () => setLoading(1),
                    () => setLoading(2),
                );
                if (!result) {
                    setLoading(0);
                    return;
                }
                const resources = await retryContractCall(
                    ContractType.RACETOURNAMENT,
                    "gameTank",
                    [tokenId],
                );

                if (
                    resources.fuel.toNumber() == 0 &&
                    resources.battery.toNumber() == 0 &&
                    (Number(fuelValue) || Number(batteryValue))
                ) {
                    setLoading(3);
                    console.log("start loadFuel battery to gameTank");
                    await burnerCall(
                        ContractType.RACETOURNAMENT,
                        "loadFuelBatteryToGameTank",
                        [
                            tokenId,
                            fuelValue ? fuelValue : 0,
                            batteryValue ? batteryValue : 0,
                        ],
                    );
                    console.log("success loadFuel battery to gameTank");
                }

                getResourcesBalance();

                console.log("start search opponent");
                setLoading(4);
                await burnerCall(
                    ContractType.RACETOURNAMENT,
                    "searchOpponent",
                    [tokenId],
                );
                localStorage.setItem("lastplane", tokenId.toString());
                console.log("success search opponent");
                setLoading(0);
                navigate(`/game?tokenId=${tokenId}&testflight=${istest}`, {
                    replace: true,
                });
            } else {
                navigate(`/game?tokenId=${tokenId}`, { replace: true });
            }
        } catch (error) {
            console.log(error);
            setLoading(0);
            toast(handleError(error));
        }
    };

    // 获取飞机等级
    const handleGetGameLevel = async () => {
        try {
            const owner = await retryContractCall(
                ContractType.TOURNAMENT,
                "ownerOf",
                [tokenId],
            );
            if (owner.toLowerCase() !== account.toLowerCase()) {
                navigate(`/activities`);
            }
        } catch (error) {
            navigate(`/activities`);
        }

        const gameLevel = await retryContractCall(
            ContractType.TOURNAMENT,
            "aviationLevels",
            [tokenId],
        );

        const hasWin = await retryContractCall(
            ContractType.TOURNAMENT,
            "_aviationHasWinCounter",
            [tokenId],
        );
        const level = gameLevel.toNumber() + (hasWin ? 0.5 : 0);
        const metadata = await retryContractCall(
            ContractType.TOURNAMENT,
            "tokenURI",
            [tokenId],
        );
        const base64String = metadata;
        const jsonString = window.atob(
            base64String.substr(base64String.indexOf(",") + 1),
        );
        const jsonObject = JSON.parse(jsonString);
        setPlaneImg(handleIpfsUrl(jsonObject.image));
        setGameLevel(level);
        const state = await getGameState(tokenId);
        if (state !== 0) {
            const url = istest
                ? `/game?tokenId=${tokenId}&testflight=true`
                : `/game?tokenId=${tokenId}`;
            navigate(url, { replace: true });
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
        if (!retryContractCall || !account || !tokenId) {
            return;
        }
        getResourcesBalance();
    }, [account, retryContractCall, tokenId]);

    useEffect(() => {
        if (!account) {
            navigate(`/activities`);
            return;
        }
        if (!retryContractCall || !tokenId) {
            return;
        }
        handleGetGameLevel();
    }, [retryContractCall, tokenId, account]);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (!params.tokenId) {
            navigate(`/activities`);
            return;
        }
        setTokenId(params.tokenId);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (tutorial) {
                const event = new KeyboardEvent("keydown", {
                    key: "t",
                    code: "KeyT",
                    keyCode: 84,
                });
                console.log(event, "event");
                const event1 = new KeyboardEvent("keyup", {
                    key: "t",
                    code: "KeyT",
                    keyCode: 84,
                });
            }
        }, 1000);
    }, []);

    return (
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
                                    duration: 3,
                                }}
                                animate={{ rotate: 360 }}
                            />
                        </Box>
                        {[1, 2, 3, 4].includes(loading) && (
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
                        )}
                    </Box>
                </>
            )}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <Text fontSize="64px" fontWeight={800} top="10px" left={"50px"}>
                    Trailblazer
                </Text>
                {
                    <Box
                        sx={{
                            background: "#ABABAB",
                            padding: "10px 20px",
                            fontWeight: 600,
                            borderRadius: "10px",
                            margin: "10px",
                            maxWidth: "620px",
                        }}
                    >
                        <Box sx={{}}>
                            <span
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "10px",
                                }}
                            >
                                {ChainId.MUMBAI === chainId &&
                                    "If you do not have tokens in wallet, get free ones here"}

                                {ChainId.POLYGON === chainId &&
                                    "Have at least 3 matic in your wallet to transfer to your burner wallet for complete game experience"}
                            </span>
                            <Popover>
                                <PopoverTrigger>
                                    <Img
                                        w={"20px"}
                                        src={TipIcon}
                                        display="inline-block"
                                        verticalAlign={"middle"}
                                        cursor={"pointer"}
                                    ></Img>
                                </PopoverTrigger>
                                <PopoverContent
                                    sx={{
                                        background: "#fff",
                                        borderRadius: "10px",
                                        border: "none",
                                        color: "#000",
                                        textAlign: "center",
                                        "&:focus": {
                                            outline: "none !important",
                                            boxShadow: "none !important",
                                        },
                                    }}
                                >
                                    <PopoverBody>
                                        <span
                                            style={{
                                                fontSize: "24px",
                                                fontWeight: 600,
                                                color: "#ABABAB",
                                            }}
                                        >
                                            Burnet wallet automates some
                                            on-chain procedures to make your
                                            game flow simple. The remaining
                                            MATICs will be refunded once you
                                            finish the game
                                        </span>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            cursor="pointer"
                            onClick={() => {
                                const url =
                                    ChainId.POLYGON === chainId
                                        ? "https://bridge.connext.network/ETH-from-ethereum-to-polygon?amount=0.01&symbol=ETH"
                                        : faucetUrl;

                                window.open(url);
                            }}
                        >
                            <Text>Get Matic Here</Text>
                            <Img
                                w={"126px"}
                                src={
                                    ChainId.POLYGON === chainId
                                        ? UniswapIcon
                                        : PolygonIcon
                                }
                            ></Img>
                        </Box>
                    </Box>
                }
                <Box right={"27px"} top="21px">
                    <TutorialGroup showCharacter={true} horizontal={false} />
                </Box>
            </Box>

            <Box
                pos={"absolute"}
                top="13vh"
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
                                fontSize="40px"
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
                                    marginTop: "10px",
                                }}
                            >
                                <VStack sx={{ width: "10vw" }}>
                                    <Img src={FuelIcon} w="86px"></Img>
                                    <Text sx={{ fontSize: "32px" }}>Fuel</Text>
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
                                                fontSize: "36px",
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
                                            marginTop: "10px",
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
                                    marginTop: "10px",
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
                                    marginTop: "12px",
                                }}
                            >
                                <VStack sx={{ width: "10vw" }}>
                                    <Img src={BatteryIcon} w="100px"></Img>
                                    <Text
                                        sx={{
                                            fontSize: "32px",
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
                                                fontSize: "36px",
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
                                        margin: "12px 0 0 0",
                                    }}
                                    onClick={handlePlayGame}
                                >
                                    <Text
                                        sx={{
                                            color: "#fff",
                                            fontSize: "36px",
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
                                        navigate("/activities");
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
