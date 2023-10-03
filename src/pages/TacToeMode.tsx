import useBurnerWallet from "@/hooks/useBurnerWallet";
import { Box, Button, Text, Image, useClipboard } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { useBidTacToeFactoryRetry } from "@/hooks/useRetryContract";
import Loading from "@/components/Loading";
import BasicVideo from "@/components/TacToe/assets/basic.mp4";
import BackIcon from "@/components/TacToe/assets/back-arrow.svg";
import BulbIcon from "@/components/TacToe/assets/bulb.svg";
import { useTacToeSigner } from "@/hooks/useSigner";
import { handleError } from "@/utils/error";
import useSkyToast from "@/hooks/useSkyToast";
import BidTacToeTutorial from "@/components/TacToe/BidTacToeTutorial";
import FaucetLinkIcon from "@/components/TacToe/assets/faucet-link.svg";

const TacToeMode = () => {
    const toast = useSkyToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const tokenId = params.tokenId;
    const istest = params.testflight ? params.testflight === "true" : false;
    const [tacToeBurner] = useTacToeSigner(tokenId);

    const { tacToeFactoryRetryCall, tacToeFactoryRetryWrite } =
        useBidTacToeFactoryRetry(tokenId);

    const { handleCheckBurnerBidTacToe } = useBurnerWallet(tokenId);

    const handleCreateOrJoinDefault = async () => {
        try {
            if (loading) return;
            setLoading(true);
            const result = await handleCheckBurnerBidTacToe();
            if (!result) {
                setLoading(false);
                return;
            }
            await tacToeFactoryRetryWrite("createOrJoinDefault", [], 1000000);

            setTimeout(() => {
                setLoading(false);
                const url = istest
                    ? `/tactoe/game?tokenId=${tokenId}&testflight=true`
                    : `/tactoe/game?tokenId=${tokenId}`;
                navigate(url);
            }, 1000);
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast(handleError(e));
        }
    };

    const handleGetGameAddress = async () => {
        const bidTacToeGameAddress = await tacToeFactoryRetryCall(
            "gamePerPlayer",
            [tacToeBurner.address],
        );

        console.log(bidTacToeGameAddress, "bidTacToeGameAddress");
        if (
            bidTacToeGameAddress ===
            "0x0000000000000000000000000000000000000000"
        ) {
            const defaultGameQueue = await tacToeFactoryRetryCall(
                "defaultGameQueue",
            );
            console.log(defaultGameQueue, "defaultGameQueue");
            if (tacToeBurner.address === defaultGameQueue) {
                const url = istest
                    ? `/tactoe/game?tokenId=${tokenId}&testflight=true`
                    : `/tactoe/game?tokenId=${tokenId}`;
                navigate(url);
                return;
            }
        } else {
            const url = istest
                ? `/tactoe/game?tokenId=${tokenId}&testflight=true`
                : `/tactoe/game?tokenId=${tokenId}`;
            navigate(url);
        }
    };

    useEffect(() => {
        if (!tacToeFactoryRetryCall || !tokenId || !tacToeBurner) return;
        handleGetGameAddress();
    }, [tacToeFactoryRetryCall, tokenId, tacToeBurner]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "column",
                height: "100vh",
                background: "rgb(54,54,54)",
                fontFamily: "Orbitron",
                paddingBottom: "15vh",
            }}
        >
            <Image
                src={BackIcon}
                onClick={() => navigate("/activities")}
                sx={{
                    position: "absolute",
                    left: "20px",
                    top: "20px",
                }}
            ></Image>
            <Box
                sx={{
                    borderRadius: "10px",
                    height: "46px",
                    width: "46px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                    position: "absolute",
                    right: "60px",
                    top: "27px",
                    cursor: "pointer",
                }}
                onClick={() => {
                    window.open("https://faucet.polygon.technology", "_blank");
                }}
            >
                <Image
                    src={FaucetLinkIcon}
                    sx={{
                        width: "36px",
                        height: "36px",
                    }}
                ></Image>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", marginTop: "35px" }}>
                    <Box
                        sx={{
                            width: "320px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Button
                                onClick={handleCreateOrJoinDefault}
                                sx={{
                                    border: "3px solid #BCBBBE !important",
                                    borderRadius: "18px",
                                    height: "60px",
                                    fontSize: "24px",
                                    textAlign: "left",
                                    justifyContent: "space-between",
                                    outline: "none",
                                    marginRight: "16px",
                                    boxShadow:
                                        "4px 4px 0px 0px rgba(255, 255, 255, 0.50)",
                                    "&:focus": {
                                        boxShadow: "none",
                                    },
                                    "& .chakra-button__icon": {
                                        position: "absolute",
                                        right: "15px",
                                    },
                                }}
                                variant="outline"
                            >
                                <Text>Enter Game</Text>
                            </Button>
                            <BidTacToeTutorial>
                                <Box
                                    sx={{
                                        border: "3px solid #BCBBBE !important",
                                        borderRadius: "18px",
                                        width: "60px",
                                        height: "60px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow:
                                            "4px 4px 0px 0px rgba(255, 255, 255, 0.50)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Image
                                        sx={{ width: "40px", height: "40px" }}
                                        src={BulbIcon}
                                    ></Image>
                                </Box>
                            </BidTacToeTutorial>
                        </Box>
                        <video
                            width="109px"
                            controls={false}
                            autoPlay={true}
                            style={{ marginTop: "140px" }}
                            muted
                            loop
                        >
                            <source src={BasicVideo} type="video/mp4" />
                            Your browser does not support HTML5 video.
                        </video>
                        {
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10vh",
                                    height: "44px",
                                }}
                            >
                                {loading && (
                                    <>
                                        <Text
                                            sx={{
                                                fontSize: "24px",
                                                marginRight: "20px",
                                            }}
                                        >
                                            Entering lobby
                                        </Text>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                width: "44px",
                                                height: "44px",
                                            }}
                                        >
                                            <Loading size={44}></Loading>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        }
                    </Box>
                    {/* <Box
                        sx={{
                            width: "320px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginRight: "66px",
                        }}
                    >
                        <video
                            width="250px"
                            controls={false}
                            autoPlay={true}
                            muted
                            loop
                        >
                            <source src={BasicVideo} type="video/mp4" />
                            Your browser does not support HTML5 video.
                        </video>
                        <Button
                            onClick={handleCreateOrJoinDefault}
                            sx={{
                                border: "3px solid #BCBBBE !important",
                                borderRadius: "18px",
                                width: "100%",
                                height: "65px",
                                fontSize: "24px",
                                textAlign: "left",
                                padding: "0 15px 0 42px",
                                marginTop: "10px",
                                justifyContent: "space-between",
                                outline: "none",
                                "&:focus": {
                                    boxShadow: "none",
                                },
                                "& .chakra-button__icon": {
                                    position: "absolute",
                                    right: "15px",
                                },
                            }}
                            variant="outline"
                        >
                            <Text>Basic Lobby</Text>
                            <Image src={ButtonTipIcon}></Image>
                        </Button>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "40px",
                            }}
                        >
                            <Image
                                src={GrayX}
                                sx={{ marginRight: "16px" }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    fontFamily: "Quantico",
                                    color: "#d9d9d9",
                                }}
                            >
                                Grid Reselection
                            </Text>
                        </Box>
                    </Box> */}
                    {/* <Box
                        sx={{
                            width: "320px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <video
                            width="250px"
                            controls={false}
                            autoPlay={true}
                            muted
                            loop
                        >
                            <source src={PlayVideo} type="video/mp4" />
                            Your browser does not support HTML5 video.
                        </video>
                        <Button
                            sx={{
                                border: "3px solid #BCBBBE !important",
                                borderRadius: "18px",
                                width: "100%",
                                height: "65px",
                                fontSize: "24px",
                                textAlign: "left",
                                marginTop: "10px",
                                justifyContent: "space-between",
                                outline: "none",
                                padding: "0 10px 0 5px",
                                "&:focus": {
                                    boxShadow: "none",
                                },
                                "& .chakra-button__icon": {
                                    position: "absolute",
                                    right: "15px",
                                },
                            }}
                            variant="outline"
                        >
                            <Text>Reselection Lobby</Text>
                            <Image
                                src={ButtonTipIcon}
                                sx={{ marginLeft: "5px" }}
                            ></Image>
                        </Button>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "40px",
                                width: "100%",
                                paddingLeft: "15px",
                            }}
                        >
                            <Image
                                src={YesIcon}
                                sx={{ marginRight: "16px" }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    fontFamily: "Quantico",
                                    color: "#d9d9d9",
                                }}
                            >
                                Grid Reselection
                            </Text>
                        </Box>
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                marginTop: "13px",
                                paddingLeft: "15px",
                            }}
                        >
                            <Image
                                src={YesIcon}
                                sx={{ marginRight: "16px" }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "24px",
                                    fontFamily: "Quantico",
                                    color: "#d9d9d9",
                                }}
                            >
                                Discount Rate
                            </Text>
                        </Box>
                    </Box> */}
                </Box>
            </Box>
        </Box>
    );
};

export default TacToeMode;
