import useBurnerWallet from "@/hooks/useBurnerWallet";
import { Box, Button, Text, Image } from "@chakra-ui/react";
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
import {
    skylabTestFlightAddress,
    skylabTournamentAddress,
} from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import BttHelmet from "@/components/Helmet/BttHelmet";
import { faucetUrl, ZERO_DATA } from "@/skyConstants";
import {
    getMultiSkylabBidTacToeGameContract,
    useMultiMercuryBaseContract,
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
} from "@/hooks/useMultiContract";
import { ChainId } from "@/utils/web3Utils";
import { PrimaryButton } from "@/components/Button/Index";
import YellowArrowIcon from "@/assets/yellow-arrow.svg";
import { shortenAddressWithout0x } from "@/utils";

interface onGoingGame {
    gameAddress: string;
    player1: string;
    player2: string;
    tokenId1: number;
    tokenId2: number;
    level1: number;
    level2: number;
}

const LiveGame = ({ list }: { list: onGoingGame[] }) => {
    const { chainId } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight === "true";
    const handleWatch = (gameAddress: string) => {
        const testflight = istest ? "&testflight=true" : "";
        const url = `${window.location.origin}/#/tactoe/live?gameAddress=${gameAddress}&chainId=${chainId}${testflight}`;
        window.open(url, "_blank");
    };
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1.0417vw",
                        height: "1.0417vw",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        marginRight: "0.7813vw",
                    }}
                >
                    <Box
                        sx={{
                            width: "0.625vw",
                            height: "0.625vw",
                            background: "#fff",
                            borderRadius: "50%",
                        }}
                    ></Box>
                </Box>
                <Box>
                    <Text
                        sx={{
                            fontFamily: "Quantico",
                            fontSize: "1.25vw",
                            fontWeight: 700,
                            lineHeight: "1.0417vw",
                        }}
                    >
                        Live Games
                    </Text>
                    <Text
                        sx={{
                            fontFamily: "Quantico",
                            fontSize: "1.25vw",
                            fontWeight: 700,
                            lineHeight: "1.0417vw",
                            marginTop: "0.5208vw",
                        }}
                    >
                        {list.length * 2} in Games
                    </Text>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "2.5926vh",
                    height: "20vh",
                    overflow: "auto",
                }}
            >
                {list.map((item) => {
                    return (
                        <Box
                            key={item.gameAddress}
                            sx={{
                                fontSize: "0.8333vw",
                                fontFamily: "Quantico",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "0.5208vw",
                            }}
                        >
                            <Text>
                                Lvl.{item.level1} vs Lvl.{item.level2}
                            </Text>
                            <PrimaryButton
                                onClick={() => {
                                    handleWatch(item.gameAddress);
                                }}
                                sx={{
                                    border: "0.0521vw solid rgba(242, 216, 97, 1)",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "4.4271vw",
                                    height: "1.4583vw",
                                }}
                            >
                                <Text
                                    sx={{
                                        color: "rgba(242, 216, 97, 1)",
                                        fontSize: "0.8333vw",
                                    }}
                                >
                                    Watch
                                </Text>
                                <Image
                                    src={YellowArrowIcon}
                                    sx={{
                                        width: "1.0417vw",
                                    }}
                                ></Image>
                            </PrimaryButton>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

const TacToeMode = () => {
    const { chainId, account } = useActiveWeb3React();
    const toast = useSkyToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const tokenId = params.tokenId;
    const istest = params.testflight === "true";
    const [tacToeBurner] = useTacToeSigner(tokenId);
    const multiProvider = useMultiProvider(chainId);
    const multiMercuryBaseContract = useMultiMercuryBaseContract();

    const [onGoingGames, setOnGoingGames] = useState<any>([]);

    const { tacToeFactoryRetryCall, tacToeFactoryRetryWrite } =
        useBidTacToeFactoryRetry(tokenId);

    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract();

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
        console.log("current burner", tacToeBurner.address);
        const bidTacToeGameAddress = await tacToeFactoryRetryCall(
            "gamePerPlayer",
            [tacToeBurner.address],
        );

        console.log(bidTacToeGameAddress, "bidTacToeGameAddress");
        if (bidTacToeGameAddress === ZERO_DATA) {
            const defaultGameQueue = await tacToeFactoryRetryCall(
                "defaultGameQueue",
                [
                    istest
                        ? skylabTestFlightAddress[chainId]
                        : skylabTournamentAddress[chainId],
                ],
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

    const handleGetLobbyOnGoingGames = async () => {
        const avaitionAddress = istest
            ? skylabTestFlightAddress[chainId]
            : skylabTournamentAddress[chainId];
        const onGoingGames = await tacToeFactoryRetryCall(
            "getLobbyOnGoingGames",
            [avaitionAddress],
        );

        const p: any = [];

        onGoingGames.forEach((gameAddress: string) => {
            const multiSkylabBidTacToeGameContract =
                getMultiSkylabBidTacToeGameContract(gameAddress);
            p.push(
                multiSkylabBidTacToeGameContract.player1(),
                multiSkylabBidTacToeGameContract.player2(),
            );
        });

        const players = await multiProvider.all(p);

        const p1: any = [];

        onGoingGames.forEach((gameAddress: string, index: number) => {
            p1.push(
                multiSkylabBidTacToeFactoryContract.burnerAddressToTokenId(
                    players[index * 2],
                ),
                multiSkylabBidTacToeFactoryContract.burnerAddressToTokenId(
                    players[index * 2 + 1],
                ),
            );
        });
        const tokenIds = await multiProvider.all(p1);

        const p2: any = [];

        onGoingGames.forEach((gameAddress: string, index: number) => {
            p2.push(
                multiMercuryBaseContract.aviationPoints(tokenIds[index * 2]),
                multiMercuryBaseContract.aviationPoints(
                    tokenIds[index * 2 + 1],
                ),
            );
        });

        const levels = await multiProvider.all(p2);

        setOnGoingGames(
            onGoingGames.map((gameAddress: string, index: number) => {
                return {
                    gameAddress,
                    player1: players[index * 2],
                    player2: players[index * 2 + 1],
                    tokenId1: tokenIds[index * 2].toNumber(),
                    tokenId2: tokenIds[index * 2 + 1].toNumber(),
                    level1: levels[index * 2].toNumber(),
                    level2: levels[index * 2 + 1].toNumber(),
                };
            }),
        );
    };

    useEffect(() => {
        if (!tacToeFactoryRetryCall || !tokenId || !tacToeBurner) return;
        handleGetGameAddress();
    }, [tacToeFactoryRetryCall, tokenId, tacToeBurner]);

    useEffect(() => {
        if (!tacToeFactoryRetryCall || !chainId) return;
        handleGetLobbyOnGoingGames();
    }, [tacToeFactoryRetryCall, chainId]);

    return (
        <>
            <BttHelmet></BttHelmet>
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
                <Image
                    src={BackIcon}
                    onClick={() => navigate("/activities")}
                    sx={{
                        position: "absolute",
                        left: "20px",
                        top: "20px",
                    }}
                ></Image>
                {chainId === ChainId.MUMBAI && (
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
                            window.open(faucetUrl, "_blank");
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
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <LiveGame list={onGoingGames}></LiveGame>
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
                                            sx={{
                                                width: "40px",
                                                height: "40px",
                                            }}
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
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default TacToeMode;
