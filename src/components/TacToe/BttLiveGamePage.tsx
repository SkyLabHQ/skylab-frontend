import { Box, Button, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BttIcon from "@/assets/btt-icon.png";
import qs from "query-string";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import { BoardItem, GameInfo, initBoard, UserMarkType } from "@/pages/TacToe";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMutilContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import Board from "../TacToe/Board";
import { GameState, getWinState, winPatterns } from "../TacToe";
import { UserCard } from "../BttPlayBack/UserCard";
import Loading from "../Loading";
import RightArrow from "@/components/TacToe/assets/right-arrow.svg";
import { EMOTES, MESSAGES } from "./Chat";
import { useBlockNumber } from "@/contexts/BlockNumber";
import LiveGameTimer from "./LiveGameTimer";
import LiveStatusTip from "./LiveStatusTip";
import { shortenAddressWithout0x } from "@/utils";

interface Info {
    burner?: string;
    address?: string;
    level: number;
    mark: UserMarkType;
}

const StartJourney = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                background: "#fff",
                borderRadius: "18px",
                color: "#000",
                padding: "4px 6px",
                fontFamily: "Orbitron",
                cursor: "pointer",
                marginTop: "30px",
                width: "400px",
            }}
            onClick={() => {
                navigate("/activities");
            }}
        >
            <Image
                src={BttIcon}
                sx={{ height: "74px", marginRight: "15px" }}
            ></Image>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Text
                        sx={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            marginRight: "15px",
                        }}
                    >
                        Bid Tac Toe
                    </Text>
                    <Box
                        sx={{
                            borderLeft: "1px solid #000",
                            paddingLeft: "10px",
                        }}
                    >
                        <Image src={RightArrow} sx={{ height: "32px" }}></Image>
                    </Box>
                </Box>
                <Text sx={{ fontWeight: "bold", fontSize: "20px" }}>
                    Start your journey
                </Text>
            </Box>
        </Box>
    );
};

const BttLiveGamePage = () => {
    const { blockNumber } = useBlockNumber();

    const navigate = useNavigate();
    const { account, chainId } = useActiveWeb3React();
    const [player1, setPlayer1] = useState<string>("");
    const [player2, setPlayer2] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState<BoardItem[]>(initBoard());
    const { search } = useLocation();
    const ethcallProvider = useMultiProvider();
    const [bttGameAddress, setBttGameAddress] = useState("");
    const [nextDrawWinner, setNextDrawWinner] = useState<string>("");

    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract();
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bttGameAddress);
    const [lastBidIndex, setLastBidIndex] = useState<number>(-1);
    const [myGameInfo, setMyGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: GameState.Unknown,
        timeout: 0,
        message: "",
        emote: "",
    });
    const [opGameInfo, setOpGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: GameState.Unknown,
        timeout: 0,
        message: "",
        emote: "",
    });
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        mark: UserMarkType.Circle,
    });
    const [opInfo, setOpInfo] = useState<Info>({
        burner: "",
        level: 0,
        mark: UserMarkType.Cross,
    });

    const handleGetGameInfo = async () => {
        if (
            !multiSkylabBidTacToeGameContract ||
            !multiSkylabBidTacToeFactoryContract ||
            !player1 ||
            !player2
        )
            return;
        await ethcallProvider.init();
        const [
            currentGrid,
            boardGrids,
            myBalance,
            myGameState,
            myRevealedBid,
            myTimeout,
            myMessage,
            myEmote,
            opBalance,
            opGameState,
            opRevealedBid,
            opTimeout,
            opMessage,
            opEmote,
            nextDrawWinner,
        ] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.currentSelectedGrid(),
            multiSkylabBidTacToeGameContract.getGrid(),
            multiSkylabBidTacToeGameContract.balances(player1),
            multiSkylabBidTacToeGameContract.gameStates(player1),
            multiSkylabBidTacToeGameContract.getRevealedBids(player1),
            multiSkylabBidTacToeGameContract.timeouts(player1),
            multiSkylabBidTacToeGameContract.playerMessage(player1),
            multiSkylabBidTacToeGameContract.playerEmote(player1),
            multiSkylabBidTacToeGameContract.balances(player2),
            multiSkylabBidTacToeGameContract.gameStates(player2),
            multiSkylabBidTacToeGameContract.getRevealedBids(player2),
            multiSkylabBidTacToeGameContract.timeouts(player2),
            multiSkylabBidTacToeGameContract.playerMessage(player2),
            multiSkylabBidTacToeGameContract.playerEmote(player2),
            multiSkylabBidTacToeGameContract.nextDrawWinner(),
        ]);

        const _list = initBoard();
        const gameState = myGameState.toNumber();
        for (let i = 0; i < boardGrids.length; i++) {
            if (
                boardGrids[i] === "0x0000000000000000000000000000000000000000"
            ) {
                _list[i].mark = UserMarkType.Empty;
            } else if (boardGrids[i] === player1) {
                _list[i].mark = myInfo.mark;
            } else if (boardGrids[i] === player2) {
                _list[i].mark = opInfo.mark;
            }
            _list[i].myValue = myRevealedBid[i].toNumber();
            _list[i].opValue = opRevealedBid[i].toNumber();
            _list[i].myMark = myInfo.mark;
            _list[i].opMark = opInfo.mark;
        }
        if (
            [
                GameState.WaitingForBid,
                GameState.Commited,
                GameState.Revealed,
            ].includes(gameState)
        ) {
            _list[currentGrid.toNumber()].mark = UserMarkType.Square;
        }

        // game over result
        if (gameState > GameState.Revealed) {
            const myIsWin = getWinState(gameState);
            const myIsCircle = myInfo.mark === UserMarkType.Circle;
            const burner = myIsWin ? player1 : player2;
            let mark;
            if (myIsWin) {
                mark = myIsCircle
                    ? UserMarkType.YellowCircle
                    : UserMarkType.YellowCross;
            } else {
                mark = myIsCircle
                    ? UserMarkType.YellowCross
                    : UserMarkType.YellowCircle;
            }
            if (
                gameState === GameState.WinByConnecting ||
                gameState === GameState.LoseByConnecting
            ) {
                for (let i = 0; i < winPatterns.length; i++) {
                    const index0 = winPatterns[i][0];
                    const index1 = winPatterns[i][1];
                    const index2 = winPatterns[i][2];
                    if (
                        boardGrids[index0] === burner &&
                        boardGrids[index1] === burner &&
                        boardGrids[index2] === burner
                    ) {
                        _list[index0].mark = mark;
                        _list[index1].mark = mark;
                        _list[index2].mark = mark;
                        break;
                    }
                }
            } else {
                for (let i = 0; i < boardGrids.length; i++) {
                    if (boardGrids[i] === burner) {
                        _list[i].mark = mark;
                    }
                }
            }
        }

        let index = -1;
        boardGrids.forEach((item: any) => {
            if (item !== "0x0000000000000000000000000000000000000000") {
                index++;
            }
        });

        if (index !== -1) {
            const [_gridOrder] = await ethcallProvider.all([
                multiSkylabBidTacToeGameContract.allSelectedGrids(index),
            ]);
            setLastBidIndex(_gridOrder.toNumber());
        }

        setList(_list);
        setMyGameInfo({
            balance: myBalance.toNumber(),
            gameState: myGameState.toNumber(),
            timeout: myTimeout.toNumber(),
            message:
                myMessage.toNumber() > 0 &&
                myMessage.toNumber() <= MESSAGES.length
                    ? MESSAGES[myMessage.toNumber() - 1]
                    : "",
            emote:
                myEmote.toNumber() > 0 && myEmote.toNumber() <= EMOTES.length
                    ? EMOTES[myEmote.toNumber() - 1]
                    : "",
        });
        setOpGameInfo({
            balance: opBalance.toNumber(),
            gameState: opGameState.toNumber(),
            timeout: opTimeout.toNumber(),
            message:
                opMessage.toNumber() > 0 &&
                opMessage.toNumber() <= MESSAGES.length
                    ? MESSAGES[opMessage.toNumber() - 1]
                    : "",
            emote:
                opEmote.toNumber() > 0 && opEmote.toNumber() <= EMOTES.length
                    ? EMOTES[opEmote.toNumber() - 1]
                    : "",
        });

        setNextDrawWinner(nextDrawWinner);
    };

    const handleGetPlayer = async () => {
        if (!multiSkylabBidTacToeGameContract) return;
        await ethcallProvider.init();
        const [player1, player2] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.player1(),
            multiSkylabBidTacToeGameContract.player2(),
        ]);

        const params = qs.parse(search) as any;
        const burner = params.burner;
        const _myInfo = JSON.parse(JSON.stringify(myInfo));
        const _opInfo = JSON.parse(JSON.stringify(opInfo));

        if (shortenAddressWithout0x(player1) === burner) {
            _myInfo.burner = player1;
            _opInfo.burner = player2;
            _myInfo.mark = UserMarkType.Circle;
            _opInfo.mark = UserMarkType.Cross;
        } else {
            _myInfo.burner = player2;
            _opInfo.burner = player1;
            _myInfo.mark = UserMarkType.Cross;
            _opInfo.mark = UserMarkType.Circle;
        }
        setMyInfo(myInfo);
        setOpInfo(opInfo);
    };

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (bttGameAddress === "") {
            setBttGameAddress(params.gameAddress);
        } else if (!params.gameAddress) {
            navigate(`/activities`);
        } else if (bttGameAddress != params.gameAddress) {
            navigate(`/activities`);
        }
    }, [search, bttGameAddress]);

    useEffect(() => {
        handleGetGameInfo();
    }, [
        player1,
        player2,
        blockNumber,
        multiSkylabBidTacToeGameContract,
        multiSkylabBidTacToeFactoryContract,
    ]);

    useEffect(() => {
        handleGetPlayer();
    }, [multiSkylabBidTacToeGameContract]);

    useEffect(() => {}, [
        player1,
        player2,
        multiSkylabBidTacToeFactoryContract,
    ]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                justifyContent: "center",
                background: "#303030",
                padding: "0px 80px 0",
            }}
        >
            {loading ? (
                <Loading></Loading>
            ) : (
                <>
                    <Box
                        id="share-content"
                        sx={{
                            background: "#303030",
                            maxWidth: "1430px",
                            margin: "0 auto",
                            width: "100%",
                            border: "2px solid #fff",
                            boxShadow:
                                "5px 4px 8px 0px rgba(255, 255, 255, 0.50)",
                            padding: "1.5vh 1.5vw",
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                height: "58px",
                                position: "relative",
                            }}
                        >
                            <LiveGameTimer
                                myGameInfo={myGameInfo}
                                opGameInfo={opGameInfo}
                            ></LiveGameTimer>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <UserCard
                                message={myGameInfo.message}
                                emote={myGameInfo.emote}
                                markIcon={
                                    myInfo.mark === UserMarkType.Circle
                                        ? CircleIcon
                                        : XIcon
                                }
                                status="my"
                                balance={myGameInfo.balance}
                                bidAmount={
                                    lastBidIndex !== -1
                                        ? list[lastBidIndex].myValue
                                        : 0
                                }
                                showAdvantageTip={
                                    myInfo.burner === nextDrawWinner
                                }
                            ></UserCard>
                            <Box>
                                <LiveStatusTip
                                    myGameState={myGameInfo.gameState}
                                    opGameState={opGameInfo.gameState}
                                ></LiveStatusTip>
                                <Box
                                    sx={{
                                        paddingTop: "30px",
                                    }}
                                >
                                    <Board list={list}></Board>
                                </Box>
                            </Box>
                            <UserCard
                                message={opGameInfo.message}
                                emote={opGameInfo.emote}
                                markIcon={
                                    opInfo.mark === UserMarkType.Circle
                                        ? CircleIcon
                                        : XIcon
                                }
                                status="op"
                                balance={opGameInfo.balance}
                                bidAmount={
                                    lastBidIndex !== -1
                                        ? list[lastBidIndex].opValue
                                        : 0
                                }
                                showAdvantageTip={
                                    opInfo.burner === nextDrawWinner
                                }
                            ></UserCard>
                        </Box>
                    </Box>
                    <StartJourney></StartJourney>
                </>
            )}
        </Box>
    );
};

export default BttLiveGamePage;
