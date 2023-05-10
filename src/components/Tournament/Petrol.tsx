import {
    Box,
    Grid,
    GridItem,
    HStack,
    Img,
    Input,
    Slider,
    SliderFilledTrack,
    SliderTrack,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react";
import React, {
    ReactElement,
    Fragment,
    useState,
    useRef,
    useEffect,
} from "react";
import { css } from "@emotion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import FuelIcon from "@/assets/icon-fuel.svg";
import BatteryIcon from "@/assets/icon-battery.svg";
import AttackIcon from "@/components/Tournament/assets/attack-button.svg";
import BBg from "@/components/Resource/assets/button-bg.svg";
import BlueArrow from "@/components/Tournament/assets/blue-arrow.svg";
import CloseIcon from "./assets/close-icon.svg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { PlaneInfo } from "@/pages/Mercury";
import useDebounce from "@/utils/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
    useSkylabResourcesContract,
} from "@/hooks/useContract";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { SubmitButton } from "../Button/Index";

const SwiperSlideContent = ({
    planeDetail,
    onNextRound,
}: {
    planeDetail: PlaneInfo;
    onNextRound: (nextStep: number) => void;
}) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { search } = useLocation();
    const [tokenId, setTokenId] = useState<number>();
    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabResourcesContract = useSkylabResourcesContract();
    const { chainId, account } = useActiveWeb3React();
    const inputFuelRef = useRef<any>(null);
    const inputBatteryRef = useRef<any>(null);

    const [fuelError, setFuelError] = useState("");
    const [batteryError, setBatteryError] = useState("");

    const [fuelValue, setFuelValue] = useState("0"); //汽油输入的值
    const [batteryValue, setBatteryValue] = useState("0");

    const [fuelSlider, setFuelSlider] = useState(0); //汽油输入的值
    const [batterySlider, setBatterySlider] = useState(0);

    const [fuelBalance, setFuelBalance] = useState("");
    const [batteryBalance, setBatteryBalance] = useState("");

    const [fuelShow, setFuelShow] = useState("");
    const [batteryShow, setBatteryShow] = useState("");

    const [planeFuelBalance, setPlaneFuelBalance] = useState("");
    const [planeBatteryBalance, setPlaneBatteryBalance] = useState("");

    const fuelDebounce = useDebounce(fuelError, 1000);
    const batteryDebounce = useDebounce(batteryError, 1000);

    const navigate = useNavigate();

    const handleKeyboard = () => {
        navigate("/game/Keyboard");
    };

    const handleDistance = () => {
        navigate("/game/distance");
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
            setFuelShow("0");
        } else {
            const balance = String(Number(fuelBalance) - Number(fuelValue));
            setFuelShow(balance);
        }
    };

    const handleBatteryBlur = () => {
        if (Number(batteryValue) > Number(batteryBalance)) {
            setBatteryValue(batteryBalance);
            setBatteryShow("0");
        } else {
            const balance = String(
                Number(batteryBalance) - Number(batteryValue),
            );
            setBatteryShow(balance);
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
        const fuelBalance = await skylabResourcesContract._balances(0, account);
        const batteryBalance = await skylabResourcesContract._balances(
            1,
            account,
        );
        setFuelBalance(fuelBalance.toNumber());
        setBatteryBalance(batteryBalance.toNumber());

        const _planeFuelBalance =
            await skylabBaseContract._aviationResourcesInTanks(
                planeDetail.tokenId,
                0,
            );
        const planeBatteryBalance =
            await skylabBaseContract._aviationResourcesInTanks(
                planeDetail.tokenId,
                1,
            );

        setPlaneFuelBalance(_planeFuelBalance.toNumber());
        setPlaneBatteryBalance(planeBatteryBalance.toNumber());
    };

    const handleFillResourcesToAviation = async () => {
        // navigate(`/spendResource?tokenId=${planeDetail.tokenId}`);

        try {
            setLoading(true);
            const res = await skylabBaseContract.fillResourcesToAviation(
                planeDetail.tokenId,
                [0, 1],
                [fuelValue, batteryValue],
            );
            await res.wait();
            getResourcesBalance();
            toast({
                position: "top",
                render: () => (
                    <Box
                        color="white"
                        p={3}
                        bg="#ABABAB"
                        borderRadius="20px"
                        fontSize="36px"
                    >
                        Resource successfully loaded
                    </Box>
                ),
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "k":
                    handleKeyboard();
                    break;
                case "f":
                    handleFFocus();
                    break;
                case "b":
                    handleBFocus();
                    break;
                case "c":
                    handleDistance();
                    break;
            }
        };
        document.addEventListener("keydown", keyboardListener);
        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);

    useEffect(() => {
        setFuelError("");
    }, [fuelDebounce]);
    useEffect(() => {
        setBatteryError("");
    }, [batteryDebounce]);

    useEffect(() => {
        if (!skylabResourcesContract || !account || !planeDetail.tokenId) {
            return;
        }
        getResourcesBalance();
    }, [account, skylabResourcesContract, planeDetail.tokenId]);

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                padding: 0,
                zIndex: 110,
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    height: "100%",
                    position: "absolute",
                    overflow: "visible",
                    left: "5vw",
                    background: "rgba(217, 217, 217, 0.2)",
                    border: "3px solid #FFF761",
                    backdropFilter: "blur(7.5px)",
                    borderRadius: "40px",
                }}
            >
                <Img
                    onClick={() => {
                        onNextRound(2);
                    }}
                    src={CloseIcon}
                    sx={{
                        position: "absolute",
                        bottom: "-60px",
                        right: 0,
                        cursor: "pointer",
                    }}
                ></Img>
                <Box
                    sx={{
                        height: "8.9vh",
                        background:
                            "linear-gradient(180deg, rgba(88, 112, 120, 0) 18.56%, #FFF761 126.29%)",
                    }}
                >
                    <Text
                        sx={{
                            lineHeight: "8.9vh",
                            paddingLeft: "44px",
                            fontSize: "36px",
                            fontWeight: 500,
                        }}
                    >
                        Petrol Station
                    </Text>
                </Box>
                <Box
                    sx={{
                        paddingLeft: "40px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ marginRight: "50px", paddingTop: "5vh" }}>
                        {" "}
                        {/* 汽油部分 */}
                        <Box>
                            <HStack
                                sx={{
                                    width: "680px",
                                    height: "24vh",
                                    background:
                                        "linear-gradient(270deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);",
                                    border: "5px solid #FFF761",
                                    borderRadius: "40px",
                                    paddingLeft: "23px",
                                }}
                            >
                                <VStack
                                    sx={{
                                        marginRight: "20px",
                                        minWidth: "178px",
                                    }}
                                >
                                    <Img src={FuelIcon} w="86px"></Img>
                                    <Text sx={{ fontSize: "40px" }}>
                                        Fuel
                                    </Text>{" "}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            background: "#D9D9D9",
                                            alignItems: "center",
                                            borderRadius: "40px",
                                            padding: "5px",
                                        }}
                                    >
                                        <Text
                                            sx={{
                                                fontSize: "20px",
                                            }}
                                        >
                                            {fuelBalance} In Wallet
                                        </Text>
                                    </Box>
                                </VStack>
                                <Box
                                    sx={{
                                        width: "355px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            border: "2px dashed #FFF761",
                                            height: "85px",
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
                                        sx={{ justifyContent: "space-between" }}
                                    >
                                        {[25, 50, 75, 100].map((item) => {
                                            return (
                                                <Box
                                                    key={item}
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        handleFuelSlider(item);
                                                    }}
                                                >
                                                    <Box
                                                        key={item}
                                                        sx={{
                                                            width: "80px",
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
                                </Box>
                            </HStack>
                        </Box>
                        {/* 电池部分 */}
                        <Box>
                            <HStack
                                sx={{
                                    width: "680px",
                                    height: "24vh",
                                    background:
                                        "linear-gradient(270deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);",
                                    border: "5px solid #FFF761",
                                    borderRadius: "40px",
                                    marginTop: "5vh",
                                    paddingLeft: "40px",
                                }}
                            >
                                <VStack
                                    sx={{
                                        marginRight: "20px",
                                        minWidth: "178px",
                                    }}
                                >
                                    <Img src={BatteryIcon} w="100px"></Img>
                                    <Text
                                        sx={{
                                            fontSize: "40px",
                                            fontWeight: 400,
                                        }}
                                    >
                                        Battery
                                    </Text>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            background: "#D9D9D9",
                                            alignItems: "center",
                                            borderRadius: "40px",
                                            padding: "5px",
                                        }}
                                    >
                                        <Text
                                            sx={{
                                                fontSize: "20px",
                                            }}
                                        >
                                            {batteryBalance} In Wallet
                                        </Text>
                                    </Box>
                                </VStack>
                                <Box
                                    sx={{
                                        width: "355px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            border: "2px dashed #FFF761",
                                            height: "85px",
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
                                        sx={{ justifyContent: "space-between" }}
                                    >
                                        {[25, 50, 75, 100].map((item) => {
                                            return (
                                                <Box
                                                    key={item}
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        handleBatterySlider(
                                                            item,
                                                        );
                                                    }}
                                                >
                                                    <Box
                                                        key={item}
                                                        sx={{
                                                            width: "80px",
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
                                </Box>
                            </HStack>
                        </Box>
                        {/* 攻击部分 */}
                        <SubmitButton
                            isLoading={loading}
                            loadingText="Loading"
                            style={{ margin: "4vh 0 0 20px" }}
                            onClick={handleFillResourcesToAviation}
                        >
                            Load
                        </SubmitButton>
                    </Box>
                    <Img src={BlueArrow}></Img>
                    <Box sx={{ paddingTop: "48px", width: "45%" }}>
                        <Text sx={{ fontSize: "64px", fontWeight: 600 }}>
                            Level {planeDetail.level}
                        </Text>
                        <Box sx={{ position: "relative" }}>
                            <Img
                                src={MetadataPlaneImg(planeDetail.tokenId)}
                                w="100%"
                                width={"500px"}
                            ></Img>
                            <Box
                                sx={{
                                    border: "3px solid #FFF761",
                                    minWidth: "220px",
                                    height: "94px",
                                    borderRadius: "100px",
                                    padding: "3px",
                                    position: "absolute",
                                    right: "20px",
                                    bottom: "150px",
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
                                        <Img
                                            src={FuelIcon}
                                            sx={{ width: "93px" }}
                                        ></Img>
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
                                            {planeFuelBalance}
                                        </Text>
                                        <Text
                                            sx={{
                                                color: "#BCBBBE",
                                                fontSize: "20px",
                                                fontWeight: 400,
                                                lineHeight: "29px",
                                            }}
                                        >
                                            Loaded
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                            <Box
                                sx={{
                                    border: "3px solid #FFF761",
                                    minWidth: "220px",
                                    height: "94px",
                                    borderRadius: "100px",
                                    padding: "3px",
                                    position: "absolute",
                                    right: "100px",
                                    bottom: "20px",
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
                                        <Img
                                            src={BatteryIcon}
                                            sx={{ width: "93px" }}
                                        ></Img>
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
                                            {planeBatteryBalance}
                                        </Text>
                                        <Text
                                            sx={{
                                                color: "#BCBBBE",
                                                fontSize: "20px",
                                                fontWeight: 400,
                                                lineHeight: "29px",
                                            }}
                                        >
                                            Loaded
                                        </Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

interface ChildProps {
    currentImg: number;
    planeList: PlaneInfo[];
    onNextRound: (nextStep: number) => void;
}

export const Petrol = ({
    currentImg,
    onNextRound,
    planeList,
}: ChildProps): ReactElement => {
    return (
        <Box
            w="100vw"
            h="100vh"
            overflow="hidden"
            pos="absolute"
            sx={{
                ".swiper-pagination": {
                    width: "auto",
                    left: "50%",
                    height: "33px",
                    transform: "translateX(-50%)",
                    background: "rgba(217, 217, 217, 0.1)",
                    borderRadius: "40px",
                    padding: "0px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ".swiper-pagination-bullet": {
                        width: "9px",
                        height: "9px",
                    },
                    ".swiper-pagination-bullet.swiper-pagination-bullet-active":
                        {
                            background: "#D9D9D9",
                        },
                },

                ".swiper-button-next": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                    right: "2%",
                    zIndex: 100,
                },
                ".swiper-button-next:after": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                },
                ".swiper-button-prev": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                    left: "2%",
                    zIndex: 100,
                },
                ".swiper-button-prev:after": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                },
            }}
        >
            <Swiper
                navigation={true}
                pagination={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                style={{
                    width: "100vw",
                    height: "97vh",
                    position: "relative",
                    left: "0vw",
                    borderRadius: "16px",
                    padding: 0,
                    zIndex: 8,
                    top: "0vh",
                }}
            >
                {planeList.map((item, index) => {
                    return (
                        <SwiperSlide
                            key={index}
                            style={{
                                background: "transparent",
                                height: "84vh",
                                overflow: "visible",
                                zIndex: 110,
                                top: "8vh",
                            }}
                        >
                            <SwiperSlideContent
                                onNextRound={onNextRound}
                                planeDetail={item}
                            ></SwiperSlideContent>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Box>
    );
};
