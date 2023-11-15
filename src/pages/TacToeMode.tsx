import useBurnerWallet, {
    useCheckBurnerBalanceAndApprove,
} from "@/hooks/useBurnerWallet";
import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";
import {
    useBidTacToeFactoryRetry,
    useBurnerRetryContract,
} from "@/hooks/useRetryContract";
import Loading from "@/components/Loading";
import BackIcon from "@/components/TacToe/assets/back-arrow.svg";
import { handleError } from "@/utils/error";
import {
    botAddress,
    skylabTestFlightAddress,
    skylabTournamentAddress,
    useMercuryBaseContract,
    useMercuryBotTournamentContract,
    useSkylabBidTacToeContract,
} from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import BttHelmet from "@/components/Helmet/BttHelmet";
import {
    getMultiSkylabBidTacToeGameContract,
    useMultiMercuryBaseContract,
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
} from "@/hooks/useMultiContract";
import { ChainId, DEAFAULT_CHAINID } from "@/utils/web3Utils";
import RequestNextButton from "@/components/RequrestNextButton";
import { Contract } from "ethers-multicall";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import { getMetadataImg } from "@/utils/ipfsImg";
import PlaneList, { NoPlaneContent } from "@/components/TacToeMode/PlaneList";
import { LiveGame } from "@/components/TacToeMode/LiveGameList";
import { PlayButtonGroup } from "@/components/TacToeMode/PlayButtonGroup";
import { motion } from "framer-motion";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import useSkyToast from "@/hooks/useSkyToast";
import { Toolbar } from "@/components/TacToeMode/Toolbar";
import { getTestflightWithProvider } from "@/hooks/useSigner";
import { ethers } from "ethers";
import { waitForTransaction } from "@/utils/web3Network";
import FaucetModal from "@/components/TacToeMode/FaucetModal";

export interface PlaneInfo {
    tokenId: number;
    level: number;
    img: string;
    round: number;
    state: boolean;
}

export interface onGoingGame {
    gameAddress: string;
    player1: string;
    player2: string;
    tokenId1: number;
    tokenId2: number;
    level1: number;
    level2: number;
}

const TacToeMode = () => {
    const { chainId, account, library } = useActiveWeb3React();
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const tokenId = params.tokenId;
    const istest = params.testflight === "true";
    const multiProvider = useMultiProvider(chainId);
    const multiMercuryBaseContract = useMultiMercuryBaseContract();
    const checkBurnerBalanceAndApprove = useCheckBurnerBalanceAndApprove(true);
    const [planeList, setPlaneList] = useState<PlaneInfo[]>([]);
    const contract = useSkylabBidTacToeContract();
    const mercuryBotTournamentContract = useMercuryBotTournamentContract();

    const toast = useSkyToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const addNetworkToMetask = useAddNetworkToMetamask();

    const mercuryBaseContract = useMercuryBaseContract(true);
    const [currentImg, setCurrentImg] = useState(0);
    const [loading, setLoading] = useState(false);
    const ethcallProvider = useMultiProvider(DEAFAULT_CHAINID);
    const [onGoingGames, setOnGoingGames] = useState<any>([]);

    const { handleCheckBurnerBidTacToe } = useBurnerWallet(tokenId);

    const { tacToeFactoryRetryWrite } = useBidTacToeFactoryRetry(tokenId);
    const burnerRetryContract = useBurnerRetryContract(contract);

    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract();

    const handleGetLobbyOnGoingGames = async () => {
        const avaitionAddress = istest
            ? skylabTestFlightAddress[chainId]
            : skylabTournamentAddress[DEAFAULT_CHAINID];

        const [onGoingGames] = await multiProvider.all([
            multiSkylabBidTacToeFactoryContract.getLobbyOnGoingGames(
                avaitionAddress,
            ),
        ]);

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

    const handleGetPlaneBalance = async () => {
        setCurrentImg(0);
        setPlaneList([]);

        const tournamentContract = new Contract(
            skylabTournamentAddress[DEAFAULT_CHAINID],
            SKYLABTOURNAMENT_ABI,
        );

        const [balance, round] = await ethcallProvider.all([
            tournamentContract.balanceOf(account),
            tournamentContract._currentRound(),
        ]);
        const p = new Array(balance.toNumber()).fill("").map((item, index) => {
            return tournamentContract.tokenOfOwnerByIndex(account, index);
        });
        const planeTokenIds = await ethcallProvider.all(p);
        const p1: any = [];
        planeTokenIds.forEach((tokenId) => {
            p1.push(tournamentContract.aviationLevels(tokenId));
            p1.push(tournamentContract.tokenURI(tokenId));
            p1.push(tournamentContract.aviationRounds(tokenId));
            p1.push(tournamentContract.isAviationLocked(tokenId));
        });

        const levels: any = await ethcallProvider.all(p1);

        const list = planeTokenIds.map((item: any, index: number) => {
            const level = levels[index * 4].toNumber();
            const metadata = levels[index * 4 + 1];
            const round = levels[index * 4 + 2];
            const state = levels[index * 4 + 3];
            return {
                tokenId: item.toNumber(),
                level: level,
                img: getMetadataImg(metadata),
                round:
                    round.toNumber() >= 3
                        ? round.toNumber() - 1
                        : round.toNumber(),
                state,
            };
        });

        const _list = list
            .filter((item) => {
                return item.round === round.toNumber();
            })
            .sort((item1, item2) => {
                return item2.level - item1.level; //  大的 level 排在前面
            })
            .reverse();

        setPlaneList(_list);
    };

    const handlePlayTestWithBot = async () => {};

    const handleMintPlayTest = async (
        type: string,
        showBalanceTip: boolean = true,
    ) => {
        try {
            if (chainId !== ChainId.MUMBAI) {
                await addNetworkToMetask(ChainId.MUMBAI);
                return;
            }

            const balanceTip = localStorage.getItem("balanceTip");
            if (!balanceTip && showBalanceTip) {
                onOpen();
                return;
            }
            setLoading(true);

            const { hash } = await mercuryBotTournamentContract.tournamentMint(
                account,
            );

            const receipt = await waitForTransaction(library, hash);
            // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef Transfer(address,address,uint256)事件
            const tokenId = ethers.BigNumber.from(
                receipt.logs[0].topics[3],
            ).toNumber();

            const testflightSinger = getTestflightWithProvider(
                tokenId,
                chainId,
            );

            if (type === "bot") {
                await checkBurnerBalanceAndApprove(
                    mercuryBotTournamentContract.address,
                    tokenId,
                    testflightSinger.address,
                );

                await burnerRetryContract(
                    "createBotGame",
                    [botAddress[chainId]],
                    { gasLimit: 1000000, signer: testflightSinger },
                );
                const url = `/tactoe/game?tokenId=${tokenId}&testflight=true`;
                navigate(url);
            } else if (type === "human") {
                await checkBurnerBalanceAndApprove(
                    mercuryBaseContract.address,
                    tokenId,
                    testflightSinger.address,
                );
                await burnerRetryContract("createOrJoinDefault", [], {
                    gasLimit: 1000000,
                    signer: testflightSinger,
                });

                const url = `/tactoe/game?tokenId=${tokenId}&testflight=true`;
                navigate(url);
            }
        } catch (error) {
            setLoading(false);
            toast(handleError(error));
        }
    };

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
                const url = `/tactoe/game?tokenId=${tokenId}`;
                navigate(url);
            }, 1000);
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast(handleError(e));
        }
    };

    const handleFaucetClose = (checked: boolean) => {
        if (checked) {
            localStorage.setItem("balanceTip", "true");
        }
        onClose();
        handleMintPlayTest("bot", false);
    };

    useEffect(() => {
        if (!chainId) return;
        handleGetLobbyOnGoingGames();
    }, [chainId]);

    useEffect(() => {
        if (!account) return;
        handleGetPlaneBalance();
    }, [account]);

    return (
        <>
            <BttHelmet></BttHelmet>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "10vh",
                    flexDirection: "column",
                    height: "100vh",
                    background: "rgb(54,54,54)",
                    fontFamily: "Orbitron",
                    position: "relative",
                }}
            >
                <Image
                    src={BackIcon}
                    onClick={() => navigate("/activities")}
                    sx={{
                        position: "absolute",
                        left: "1.0417vw",
                        top: "1.0417vw",
                        width: "2.0833vw",
                    }}
                ></Image>
                <Toolbar></Toolbar>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <LiveGame list={onGoingGames}></LiveGame>
                    <Box
                        sx={{
                            marginTop: "35px",
                            height: "8vw",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 100 }} // 初始状态：透明且在原位置右边100px的位置
                            animate={{ opacity: 1, x: 0 }} // 结束状态：完全不透明且在原位置
                            exit={{ opacity: 0, x: -100 }} // 退出状态：透明且在原位置左边100px的位置
                            transition={{ duration: 0.5 }}
                        >
                            <PlayButtonGroup
                                tournamentDisabled={planeList.length === 0}
                                onPlayTournament={handleCreateOrJoinDefault}
                                onPlayTestWithBot={handlePlayTestWithBot}
                                onPlayWithHuman={() => {
                                    handleMintPlayTest("human");
                                }}
                                onPlayWithBot={() => {
                                    handleMintPlayTest("bot");
                                }}
                            ></PlayButtonGroup>
                        </motion.div>
                    </Box>
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "absolute",
                        bottom: "2.6042vw",
                        left: "6.25vw",
                    }}
                >
                    {planeList.length === 0 ? (
                        <NoPlaneContent></NoPlaneContent>
                    ) : (
                        <PlaneList planeList={planeList}></PlaneList>
                    )}

                    <RequestNextButton
                        sx={{
                            background: "transparent !important",
                            borderRadius: "0.9375vw",
                            border: "1px solid #616161",
                            height: "2.6042vw !important",
                            lineHeight: "2.6042vw !important",
                            color: "#D9D9D9 !important",
                            width: "25vw !important",
                            fontSize: "1.25vw !important",
                        }}
                        onClick={() => {
                            window.open(
                                "https://twitter.com/skylabHQ",
                                "_blank",
                            );
                        }}
                    ></RequestNextButton>
                </Box>
            </Box>
            <FaucetModal
                open={isOpen}
                onClose={handleFaucetClose}
            ></FaucetModal>
        </>
    );
};

export default TacToeMode;
