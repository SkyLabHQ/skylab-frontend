import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import { Box, Button, Text, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import { useBidTacToeFactoryRetry } from "@/hooks/useRetryContract";
import Loading from "@/components/Loading";
import BasicVideo from "@/components/TacToc/assets/basic.mp4";
import PlayVideo from "@/components/TacToc/assets/reselection.mp4";

import ButtonTipIcon from "@/components/TacToc/assets/button-tip.svg";
import GrayX from "@/components/TacToc/assets/gray-x.svg";
import BackIcon from "@/components/TacToc/assets/back-arrow.svg";
import YesIcon from "@/components/TacToc/assets/yes-icon.svg";
import { useBlockNumber } from "@/contexts/BlockNumber";
import { useTacToeSigner } from "@/hooks/useSigner";

const TacToeMode = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState<number>(0);
    const { setIsKnobVisible } = useKnobVisibility();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;
    const [burner] = useTacToeSigner(tokenId);

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
            await tacToeFactoryRetryWrite("createOrJoinDefault", [], 3200000);
            setLoading(false);
            handleGetGameAddress();
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const handleGetGameAddress = async () => {
        const bidTacToeGameAddress = await tacToeFactoryRetryCall(
            "gamePerPlayer",
            [burner.address],
        );
        if (
            bidTacToeGameAddress !==
            "0x0000000000000000000000000000000000000000"
        ) {
            const url = istest
                ? `/tactoe?tokenId=${tokenId}&testflight=true`
                : `/tactoe?tokenId=${tokenId}`;
            navigate(url);
        }
    };

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (tokenId === 0) {
            setTokenId(params.tokenId);
        } else if (!params.tokenId) {
            navigate(`/trailblazer`);
        } else if (tokenId != params.tokenId) {
            navigate(`/trailblazer`);
        }
    }, [search, tokenId]);

    useEffect(() => {
        if (!tacToeFactoryRetryCall || !burner) return;
        handleGetGameAddress();
    }, [burner, tacToeFactoryRetryCall]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
                background: "rgb(54,54,54)",
                fontFamily: "Orbitron",
            }}
        >
            {loading && <Loading></Loading>}
            <Image
                src={BackIcon}
                onClick={() => navigate(-1)}
                sx={{
                    position: "absolute",
                    left: "20px",
                    top: "20px",
                }}
            ></Image>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Text sx={{ fontSize: "24px", fontFamily: "Quantico" }}>
                    Welcome to Bid Tac Toe
                </Text>
                <Text sx={{ fontSize: "24px", fontFamily: "Quantico" }}>
                    Choose the mod you want to play below
                </Text>
                <Box sx={{ display: "flex", marginTop: "35px" }}>
                    <Box
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
                                border: "3px solid #BCBBBE",
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
                    </Box>
                    <Box
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
                                border: "3px solid #BCBBBE",
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
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TacToeMode;
