import { MyUserCard, OpUserCard } from "@/components/TacToe/UserCard";
import { Box, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import Board from "@/components/TacToe/Board";
import Timer from "@/components/TacToe/Timer";
import ToolBar from "./Toolbar";
import { useBlockNumber } from "@/contexts/BlockNumber";
import { useBttGameRetry } from "@/hooks/useRetryContract";
import {
    GameInfo,
    GameType,
    MyNewInfo,
    useGameContext,
    UserMarkType,
} from "@/pages/TacToe";
import { ethers } from "ethers";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeGameContract,
    useMultiMercuryBaseContract,
} from "@/hooks/useMultiContract";
import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";
import {
    useAddBttTransaction,
    useDeleteTokenIdCommited,
    useGridCommited,
} from "@/hooks/useTacToeStore";
import StatusTip from "./StatusTip";
import ResultUserCard from "./ResultUserCard";
import Chat from "./Chat";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useTacToeSigner } from "@/hooks/useSigner";
import { getRandomProvider, TESTFLIGHT_CHAINID } from "@/utils/web3Utils";
import { ZERO_DATA } from "@/skyConstants";
import A0Testflight from "@/assets/aviations/a0-testflight.png";
import A2Testflight from "@/assets/aviations/a2-testflight.png";

export const getWinState = (gameState: GameState) => {
    return [
        GameState.WinByConnecting,
        GameState.WinByGridCount,
        GameState.WinBySurrender,
        GameState.WinByTimeout,
    ].includes(gameState);
};

// 定义所有可能的获胜组合
export const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // 横排
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // 竖排
    [0, 4, 8],
    [2, 4, 6], // 对角线
];

interface TacToeProps {
    onChangeGame: (position: "my" | "op", info: GameInfo) => void;
    onChangeNewInfo: (info: MyNewInfo) => void;
}

export enum GameState {
    Unknown = 0,
    WaitingForBid = 1,
    Commited = 2,
    Revealed = 3,
    WinByConnecting = 4,
    LoseByConnecting = 5,
    WinByTimeout = 6,
    LoseByTimeout = 7,
    WinBySurrender = 8,
    LoseBySurrender = 9,
    WinByGridCount = 10,
    LoseByGridCount = 11,
}

export enum MessageStatus {
    Unknown = 0,
    Sending = 1,
    Sent = 2,
}

const TacToePage = ({ onChangeGame, onChangeNewInfo }: TacToeProps) => {
    const toast = useSkyToast();

    const {
        istest,
        myInfo,
        opInfo,
        myGameInfo,
        opGameInfo,
        bidTacToeGameAddress,
        tokenId,
        list,
        onList,
        myActivePilot,
        opActivePilot,
        onStep,
        gameType,
        realChainId,
    } = useGameContext();

    const [showAnimateNumber, setShowAnimate] = useState<number>(-1);
    const { account } = useActiveWeb3React();
    const { blockNumber } = useBlockNumber();
    const [revealing, setRevealing] = useState<boolean>(false);
    const [currentGrid, setCurrentGrid] = useState<number>(-1);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [nextDrawWinner, setNextDrawWinner] = useState<string>("");
    const [messageLoading, setMessageLoading] = useState<MessageStatus>(
        MessageStatus.Unknown,
    );

    const [emoteLoading, setEmoteLoading] = useState<MessageStatus>(
        MessageStatus.Unknown,
    );

    const [messageIndex, setMessageIndex] = useState<number>(0);
    const [emoteIndex, setEmoteIndex] = useState<number>(0);

    const [burnerWallet] = useTacToeSigner(tokenId);

    const gameOver = useMemo(() => {
        return myGameInfo.gameState > GameState.Revealed;
    }, [myGameInfo.gameState]);
    const { getGridCommited, addGridCommited } = useGridCommited(
        tokenId,
        currentGrid,
    );

    const addBttTransaction = useAddBttTransaction(tokenId);
    const tacToeGameRetryWrite = useBttGameRetry(bidTacToeGameAddress, tokenId);
    const deleteTokenIdCommited = useDeleteTokenIdCommited(tokenId);
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bidTacToeGameAddress);
    const multiMercuryBaseContract = useMultiMercuryBaseContract();

    const ethcallProvider = useMultiProvider(realChainId);
    const [loading, setLoading] = useState<boolean>(false);

    const handleGetGameInfo = async () => {
        const [
            resCurrentGrid,
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
            multiSkylabBidTacToeGameContract.balances(myInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(myInfo.burner),
            multiSkylabBidTacToeGameContract.getRevealedBids(myInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(myInfo.burner),
            multiSkylabBidTacToeGameContract.playerMessage(myInfo.burner),
            multiSkylabBidTacToeGameContract.playerEmote(myInfo.burner),
            multiSkylabBidTacToeGameContract.balances(opInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(opInfo.burner),
            multiSkylabBidTacToeGameContract.getRevealedBids(opInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(opInfo.burner),
            multiSkylabBidTacToeGameContract.playerMessage(opInfo.burner),
            multiSkylabBidTacToeGameContract.playerEmote(opInfo.burner),
            multiSkylabBidTacToeGameContract.nextDrawWinner(),
        ]);

        if (showAnimateNumber === -1) {
            setShowAnimate(resCurrentGrid.toNumber());
        } else if (resCurrentGrid.toNumber() !== currentGrid) {
            setShowAnimate(currentGrid);
        }

        const _list = JSON.parse(JSON.stringify(list));
        const gameState = myGameState.toNumber();
        for (let i = 0; i < boardGrids.length; i++) {
            if (boardGrids[i] === ZERO_DATA) {
                _list[i].mark = UserMarkType.Empty;
            } else if (boardGrids[i] === myInfo.burner) {
                _list[i].mark = myInfo.mark;
            } else if (boardGrids[i] === opInfo.burner) {
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
            _list[resCurrentGrid.toNumber()].mark = UserMarkType.Square;
        }

        // game over result
        if (gameState > GameState.Revealed) {
            const myIsWin = getWinState(gameState);
            const burner = myIsWin ? myInfo.burner : opInfo.burner;
            let mark;
            if (myIsWin) {
                mark =
                    myInfo.mark === UserMarkType.Circle
                        ? UserMarkType.YellowCircle
                        : myInfo.mark === UserMarkType.Cross
                        ? UserMarkType.YellowCross
                        : UserMarkType.YellowBotX;
            } else {
                mark =
                    opInfo.mark === UserMarkType.Circle
                        ? UserMarkType.YellowCircle
                        : opInfo.mark === UserMarkType.Cross
                        ? UserMarkType.YellowCross
                        : UserMarkType.YellowBotX;
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
        setCurrentGrid(resCurrentGrid.toNumber());
        onList(_list);
        onChangeGame("my", {
            balance: myBalance.toNumber(),
            gameState: myGameState.toNumber(),
            timeout: myTimeout.toNumber(),
            message: myMessage.toNumber(),
            emote: myEmote.toNumber(),
        });

        onChangeGame("op", {
            balance: opBalance.toNumber(),
            gameState: opGameState.toNumber(),
            timeout: opTimeout.toNumber(),
            message: opMessage.toNumber(),
            emote: opEmote.toNumber(),
        });
        setNextDrawWinner(nextDrawWinner);
    };

    const handleGetGas = async () => {
        console.log("start transfer gas");
        const provider = getRandomProvider(realChainId);
        const singer = new ethers.Wallet(burnerWallet, provider);
        const balance = await provider.getBalance(singer.address);
        const gasPrice = await provider.getGasPrice();
        const fasterGasPrice = gasPrice.mul(110).div(100);
        const gasFee = fasterGasPrice.mul(21000);
        const l1Fees = ethers.utils.parseEther("0.0001");

        if (balance.sub(l1Fees).lte(gasFee)) {
            return;
        }

        const value = balance.sub(gasFee).sub(l1Fees);
        const transferResult = await singer.sendTransaction({
            to: account,
            value: value,
            gasLimit: 21000,
            gasPrice: fasterGasPrice,
        });

        console.log("transfer remain balance", transferResult);
    };

    const handleCallTimeOut = async () => {
        const [myGameStateHex, opGameStateHex] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.gameStates(myInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(opInfo.burner),
        ]);

        const myGameState = myGameStateHex.toNumber();
        const opGameState = opGameStateHex.toNumber();

        if (
            myGameState === GameState.Unknown ||
            opGameState === GameState.Unknown
        ) {
            return;
        }

        if (myGameState > GameState.Revealed) {
            return;
        }
        if (myGameState < opGameState) {
            return;
        }

        try {
            await tacToeGameRetryWrite("claimTimeoutPenalty", [], {
                gasLimit: 500000,
                usePaymaster: istest,
            });
            handleGetGameInfo();
        } catch (e) {
            console.log(e);
            toast(handleError(e, istest));
        }
    };

    const handleBid = useCallback(async () => {
        try {
            if (loading) return;
            if (myGameInfo.gameState !== GameState.WaitingForBid) return;

            setLoading(true);
            const localSalt = getGridCommited();
            const salt = localSalt?.salt
                ? localSalt?.salt
                : Math.floor(Math.random() * 10000000) + 100000;
            if (!localSalt?.salt) {
                addGridCommited(bidAmount, salt, false);
            }

            const hash = ethers.utils.solidityKeccak256(
                ["uint256", "uint256"],
                [bidAmount, salt],
            );
            console.log(
                `currentGird: ${currentGrid} bidAmount: ${bidAmount}, salt: ${salt}, hash: ${hash}`,
            );

            await tacToeGameRetryWrite("commitBid", [hash], {
                gasLimit: gameType === GameType.HumanWithBot ? 500000 : 100000,
                usePaymaster: istest,
            });
            handleGetGameInfo();
            onChangeGame("my", {
                ...myGameInfo,
                gameState: GameState.Commited,
            });
            setLoading(false);
            addGridCommited(bidAmount, salt, true);
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast(handleError(e, istest));
        }
    }, [
        loading,
        myGameInfo,
        addGridCommited,
        bidAmount,
        gameType,
        tacToeGameRetryWrite,
        getGridCommited,
    ]);

    const handleRevealedBid = async () => {
        try {
            const localSalt = getGridCommited();
            if (!localSalt) return;
            const { salt, amount } = localSalt;
            setRevealing(true);
            await tacToeGameRetryWrite("revealBid", [amount, Number(salt)], {
                gasLimit: 1000000,
                usePaymaster: istest,
            });
            setRevealing(false);
            setBidAmount(0);
            handleGetGameInfo();
        } catch (e) {
            setRevealing(false);
            console.log(e);
            toast(handleError(e, istest));
        }
    };

    useEffect(() => {
        if (
            !multiSkylabBidTacToeGameContract ||
            !blockNumber ||
            myGameInfo.gameState > GameState.Revealed ||
            loading ||
            revealing
        )
            return;

        handleGetGameInfo();
    }, [blockNumber, multiSkylabBidTacToeGameContract]);

    useEffect(() => {
        if (revealing) return;
        if (
            myGameInfo.gameState === GameState.Commited &&
            (opGameInfo.gameState === GameState.Commited ||
                opGameInfo.gameState === GameState.Revealed)
        ) {
            handleRevealedBid();
        }
    }, [myGameInfo.gameState, opGameInfo.gameState, getGridCommited]);

    // game over
    const handleGameOver = async () => {
        if (myGameInfo.gameState <= GameState.Revealed) return;
        deleteTokenIdCommited();

        const gameResult = getWinState(myGameInfo.gameState);

        if (gameType === GameType.HumanWithBot) {
            if (gameResult) {
                onChangeNewInfo({
                    point: 2,
                    level: 2,
                    img: A2Testflight,
                });
            } else {
                onChangeNewInfo({
                    point: 0,
                    level: 0,
                    img: A0Testflight,
                });
            }
        } else {
            handleGetGas();
            try {
                const [level, point] = await ethcallProvider.all([
                    multiMercuryBaseContract.aviationLevels(tokenId),
                    multiMercuryBaseContract.aviationPoints(tokenId),
                ]);
                onChangeNewInfo({
                    point: point.toNumber(),
                    level: level.toNumber(),
                });
                addBttTransaction({
                    account: myInfo.address,
                    burner: myInfo.burner,
                    gameAddress: bidTacToeGameAddress,
                    oldLevel: myInfo.level,
                    newLevel: level.toNumber(),
                    oldPoint: myInfo.point,
                    newPoint: point.toNumber(),
                    win: gameResult,
                });
            } catch (e) {
                onChangeNewInfo({
                    point: 0,
                    level: 0,
                });
                addBttTransaction({
                    account: myInfo.address,
                    burner: myInfo.burner,
                    gameAddress: bidTacToeGameAddress,
                    oldLevel: myInfo.level,
                    newLevel: 0,
                    oldPoint: myInfo.point,
                    newPoint: 0,
                    win: gameResult,
                });
            }
        }
    };

    useEffect(() => {
        handleGameOver();
    }, [myGameInfo.gameState, deleteTokenIdCommited, addBttTransaction]);

    return (
        <Box
            sx={{
                padding: "1.4063vw 3.125vw",
                position: "relative",
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                    myGameInfo.gameState <= GameState.Revealed
                        ? "space-between"
                        : "flex-start",
            }}
            onClick={() => {
                myGameInfo.gameState > 3 && onStep(3);
            }}
        >
            <Box>
                <Timer
                    myGameInfo={myGameInfo}
                    opGameInfo={opGameInfo}
                    autoBid={handleBid}
                    loading={loading}
                    handleCallTimeOut={handleCallTimeOut}
                ></Timer>
                <StatusTip
                    loading={loading}
                    myGameState={myGameInfo.gameState}
                    opGameState={opGameInfo.gameState}
                ></StatusTip>
            </Box>

            {myGameInfo.gameState <= GameState.Revealed && (
                <ToolBar quitType="game"></ToolBar>
            )}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        width: "15.625vw",
                    }}
                >
                    {gameOver ? (
                        <ResultUserCard
                            showResult
                            win={getWinState(myGameInfo.gameState)}
                            userInfo={myInfo}
                        ></ResultUserCard>
                    ) : (
                        <MyUserCard
                            isBot={myInfo.isBot}
                            pilotInfo={myActivePilot}
                            loading={loading}
                            messageLoading={messageLoading}
                            emoteLoading={emoteLoading}
                            showAdvantageTip={myInfo.burner === nextDrawWinner}
                            myGameState={myGameInfo.gameState}
                            message={myGameInfo.message}
                            emote={myGameInfo.emote}
                            level={myInfo.level}
                            messageIndex={messageIndex}
                            emoteIndex={emoteIndex}
                            markIcon={
                                myInfo.mark === UserMarkType.Circle
                                    ? CircleIcon
                                    : XIcon
                            }
                            address={myInfo.address}
                            balance={myGameInfo.balance}
                            bidAmount={bidAmount}
                            onConfirm={handleBid}
                            onInputChange={(value) => {
                                if (loading) return;
                                if (
                                    myGameInfo.gameState !==
                                    GameState.WaitingForBid
                                )
                                    return;

                                if (value < 0) return;
                                if (value > myGameInfo.balance) return;

                                setBidAmount(value);
                            }}
                            status="my"
                            planeUrl={myInfo.img}
                        ></MyUserCard>
                    )}
                </Box>

                <Box sx={{}}>
                    <Box
                        sx={{
                            paddingTop: "1.5625vw",
                        }}
                    >
                        <Board
                            list={list}
                            showAnimateNumber={showAnimateNumber}
                        ></Board>
                    </Box>
                    {myGameInfo.gameState > 3 && (
                        <Text
                            sx={{
                                textAlign: "center",
                                fontSize: "1.25vw",
                                marginTop: "1.5625vw",
                            }}
                        >
                            Tap anywhere to continue
                        </Text>
                    )}
                </Box>
                <Box
                    sx={{
                        width: "15.625vw",
                    }}
                >
                    {gameOver ? (
                        <ResultUserCard
                            win={getWinState(opGameInfo.gameState)}
                            userInfo={opInfo}
                        ></ResultUserCard>
                    ) : (
                        <OpUserCard
                            isBot={opInfo.isBot}
                            pilotInfo={opActivePilot}
                            markIcon={
                                opInfo.mark === UserMarkType.Circle
                                    ? CircleIcon
                                    : XIcon
                            }
                            level={opInfo.level}
                            showAdvantageTip={opInfo.burner === nextDrawWinner}
                            myGameState={myGameInfo.gameState}
                            opGameState={opGameInfo.gameState}
                            message={opGameInfo.message}
                            emote={opGameInfo.emote}
                            address={opInfo.address}
                            balance={opGameInfo?.balance}
                            bidAmount={
                                list.length > 0 && currentGrid >= 0
                                    ? list[currentGrid].opValue
                                    : 0
                            }
                            status="op"
                            planeUrl={opInfo.img}
                        ></OpUserCard>
                    )}
                </Box>
            </Box>
            {!gameOver && (
                <Chat
                    onLoading={(type, loading, emoteIndex) => {
                        if (type === "setMessage") {
                            setMessageLoading(loading);
                            setMessageIndex(emoteIndex);
                        } else {
                            setEmoteLoading(loading);
                            setEmoteIndex(emoteIndex);
                        }
                    }}
                ></Chat>
            )}
        </Box>
    );
};

export default TacToePage;
