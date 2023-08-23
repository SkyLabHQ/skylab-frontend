import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useBurnerWallet from "@/hooks/useBurnerWallet";
import {
    useLocalSigner,
    useSkylabBidTacToeContract,
} from "@/hooks/useContract";
import { Box, Button, Text, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import useBurnerContractCall, {
    ContractType,
    useBurnerBidTacToeFactoryContract,
    useRetryContractCall,
} from "@/hooks/useRetryContract";
import Loading from "@/components/Loading";
import PlayVideo from "@/components/TacToc/assets/play.mp4";
import ButtonTipIcon from "@/components/TacToc/assets/button-tip.svg";
import GrayX from "@/components/TacToc/assets/gray-x.svg";
import BackIcon from "@/components/TacToc/assets/back-arrow.svg";
import YesIcon from "@/components/TacToc/assets/yes-icon.svg";

const TacToeMode = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState<number>(0);
    const skylabBidTacToeContract = useSkylabBidTacToeContract();
    const { setIsKnobVisible } = useKnobVisibility();
    const retryContractCall = useRetryContractCall();
    const burnerCall = useBurnerContractCall();
    const burnerBidTacToeFactoryContract = useBurnerBidTacToeFactoryContract();
    const burner = useLocalSigner();

    const { search } = useLocation();
    const { handleCheckBurnerBidTacToe } = useBurnerWallet(tokenId);

    const handleCreateOrJoinDefault = async () => {
        try {
            setLoading(true);
            const result = await handleCheckBurnerBidTacToe();
            if (!result) {
                setLoading(false);
                return;
            }

            await burnerCall(
                ContractType.BIDTACTOEFACTORY,
                "createOrJoinDefault",
                [],
            );

            const bidTacToeGameAddress = await retryContractCall(
                ContractType.BIDTACTOEFACTORY,
                "gamePerPlayer",
                [burner.address],
            );

            setLoading(false);
            console.log(bidTacToeGameAddress, "bidTacToeGameAddress");
        } catch (e) {
            console.log(e);
            setLoading(false);
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

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: "100vh",
                background: "#303030",
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
                            <source src={PlayVideo} type="video/mp4" />
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
