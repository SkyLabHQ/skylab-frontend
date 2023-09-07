import UserCard from "@/components/TacToe/UserCard";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import Board from "@/components/TacToe/Board";
import Timer from "@/components/TacToe/Timer";
import LevelInfo from "./LevelInfo";
import ToolBar from "./Toolbar";
import { useBlockNumber } from "@/contexts/BlockNumber";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import { GameInfo, useGameContext, UserMarkType } from "@/pages/TacToe";
import { ethers } from "ethers";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMutilContract";
import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";
import useTacToeSalt from "@/hooks/useTacToeSalt";
import StatusTip from "./StatusTip";
import ResultUserCard from "./ResultUserCard";
import ResultButton from "./ResultButton";

// 定义所有可能的获胜组合
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // 横排
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // 竖排
    [0, 4, 8],
    [2, 4, 6], // 对角线
];

interface MyGridInfo {
    [gridNumber: number]: number;
}

interface TacToeProps {
    onChangeGame: (position: "my" | "op", info: GameInfo) => void;
}

export enum GameState {
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

const TacToePage = ({ onChangeGame }: TacToeProps) => {
    const toast = useSkyToast();
    const {
        myInfo,
        opInfo,
        myGameInfo,
        opGameInfo,
        bidTacToeGameAddress,
        tokenId,
        list,
        onList,
    } = useGameContext();
    const { blockNumber } = useBlockNumber();
    const myGridInfo = useRef<MyGridInfo>({});
    const [currentGrid, setCurrentGrid] = useState<number>(-1);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [nextDrawWinner, setNextDrawWinner] = useState<string>("");
    const { getSalt, addBidAmountAndSalt, deleteSalt } = useTacToeSalt(
        tokenId,
        currentGrid,
    );
    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bidTacToeGameAddress);
    const ethcallProvider = useMultiProvider();
    const [loading, setLoading] = useState<boolean>(false);

    const handleGetCurrentSelectGrid = async () => {
        if (myGameInfo.gameState > GameState.Revealed) {
            return;
        }
        await ethcallProvider.init();
        const [
            currentGrid,
            grid0,
            myBalance,
            myGameState,
            myRevealedBid,
            myTimeout,
            opBalance,
            opGameState,
            opRevealedBid,
            opTimeout,
            nextDrawWinner,
        ] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.currentSelectedGrid(),
            multiSkylabBidTacToeGameContract.getGrid(),
            multiSkylabBidTacToeGameContract.balances(myInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(myInfo.burner),
            multiSkylabBidTacToeGameContract.getRevealedBids(myInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(myInfo.burner),
            multiSkylabBidTacToeGameContract.balances(opInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(opInfo.burner),
            multiSkylabBidTacToeGameContract.getRevealedBids(opInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(opInfo.burner),
            multiSkylabBidTacToeGameContract.nextDrawWinner(),
        ]);

        const _list = JSON.parse(JSON.stringify(list));
        const gameState = myGameState.toNumber();
        if (
            [
                GameState.WaitingForBid,
                GameState.Commited,
                GameState.Revealed,
            ].includes(gameState)
        ) {
            _list[currentGrid.toNumber()].mark = UserMarkType.Square;
        }

        for (let i = 0; i < grid0.length; i++) {
            if (grid0[i] === "0x0000000000000000000000000000000000000000") {
                _list[i].mark = UserMarkType.Empty;
            } else if (grid0[i] === myInfo.burner) {
                _list[i].mark = myInfo.mark;
            } else if (grid0[i] === opInfo.burner) {
                _list[i].mark = opInfo.mark;
            }
            _list[i].myValue = myRevealedBid[i].toNumber();
            _list[i].opValue = opRevealedBid[i].toNumber();
        }

        // game over result
        if (gameState > GameState.Revealed) {
            const myIsWin = [
                GameState.WinByConnecting,
                GameState.WinBySurrender,
                GameState.WinByTimeout,
                GameState.WinByGridCount,
            ].includes(gameState);
            const myIsCircle = myInfo.mark === UserMarkType.Circle;
            const burner = myIsWin ? myInfo.burner : opInfo.burner;
            let mark;
            if (myIsWin) {
                mark = myIsCircle
                    ? UserMarkType.YellowCircle
                    : UserMarkType.YellowCross;
            } else {
                mark = myIsCircle ? UserMarkType.Circle : UserMarkType.Cross;
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
                        grid0[index0] === burner &&
                        grid0[index1] === burner &&
                        grid0[index2] === burner
                    ) {
                        _list[index0].mark = mark;
                        _list[index1].mark = mark;
                        _list[index2].mark = mark;
                        break;
                    }
                }
            } else {
                for (let i = 0; i < grid0.length; i++) {
                    if (grid0[i] === burner) {
                        _list[i].mark = mark;
                    }
                }
            }
        }

        setCurrentGrid(currentGrid.toNumber());
        onList(_list);
        onChangeGame("my", {
            balance: myBalance.toNumber(),
            gameState: myGameState.toNumber(),
            timeout: myTimeout.toNumber(),
        });

        onChangeGame("op", {
            balance: opBalance.toNumber(),
            gameState: opGameState.toNumber(),
            timeout: opTimeout.toNumber(),
        });
        setNextDrawWinner(nextDrawWinner);
    };

    const handleBid = async () => {
        try {
            if (loading || !bidAmount) return;
            setLoading(true);
            // 获得一个随机数，最小大于100000的
            const salt = Math.floor(Math.random() * 10000000) + 100000;
            const hash = ethers.utils.solidityKeccak256(
                ["uint256", "uint256"],
                [bidAmount, salt],
            );

            addBidAmountAndSalt(bidAmount, salt);
            await tacToeGameRetryWrite("commitBid", [hash], 150000);
            onChangeGame("my", { ...myGameInfo, gameState: 2 });
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
            toast(handleError(e));
        }
    };

    const handleRevealedBid = async () => {
        try {
            // 获得一个随机数，最小大于100000的
            const { salt, amount } = getSalt();
            await tacToeGameRetryWrite(
                "revealBid",
                [amount, Number(salt)],
                400000,
            );
            myGridInfo.current[currentGrid] = 2;
        } catch (e) {
            console.log(e);
            toast(handleError(e));
        }
    };

    useEffect(() => {
        if (!multiSkylabBidTacToeGameContract || !blockNumber) return;
        handleGetCurrentSelectGrid();
    }, [blockNumber, multiSkylabBidTacToeGameContract]);

    useEffect(() => {
        if (
            !myGridInfo.current[currentGrid] &&
            myGameInfo.gameState === GameState.Commited &&
            (opGameInfo.gameState === GameState.Commited ||
                opGameInfo.gameState === GameState.Revealed)
        ) {
            handleRevealedBid();
            myGridInfo.current[currentGrid] = GameState.WaitingForBid;
        }
    }, [myGameInfo.gameState, opGameInfo.gameState]);

    return (
        <Box
            sx={{
                padding: "27px 60px",
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            {/* <LevelInfo></LevelInfo> */}
            <Timer myGameInfo={myGameInfo} opGameInfo={opGameInfo}></Timer>{" "}
            <StatusTip
                loading={loading}
                myGameState={myGameInfo.gameState}
                opGameState={opGameInfo.gameState}
            ></StatusTip>
            <ToolBar></ToolBar>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12vh",
                }}
            >
                {myGameInfo.gameState > GameState.Revealed ? (
                    <ResultUserCard
                        showResult
                        win={[4, 6, 8, 10].includes(myGameInfo.gameState)}
                        userInfo={myInfo}
                    ></ResultUserCard>
                ) : (
                    <UserCard
                        loading={loading}
                        showAdvantageTip={myInfo.burner === nextDrawWinner}
                        myGameState={myGameInfo.gameState}
                        opGameState={opGameInfo.gameState}
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
                            setBidAmount(value);
                        }}
                        status="my"
                        planeUrl={myInfo.img}
                    ></UserCard>
                )}

                <Box>
                    <Board list={list}></Board>
                    {myGameInfo.gameState > 3 && <ResultButton></ResultButton>}
                </Box>
                {opGameInfo.gameState > GameState.Revealed ? (
                    <ResultUserCard
                        win={[5, 7, 9, 11].includes(opGameInfo.gameState)}
                        userInfo={opInfo}
                    ></ResultUserCard>
                ) : (
                    <UserCard
                        markIcon={
                            opInfo.mark === UserMarkType.Circle
                                ? CircleIcon
                                : XIcon
                        }
                        showAdvantageTip={opInfo.burner === nextDrawWinner}
                        myGameState={myGameInfo.gameState}
                        opGameState={opGameInfo.gameState}
                        address={opInfo.address}
                        balance={opGameInfo?.balance}
                        bidAmount={
                            list.length > 0 && currentGrid >= 0
                                ? list[currentGrid].opValue
                                : 0
                        }
                        status="op"
                        planeUrl={opInfo.img}
                    ></UserCard>
                )}
            </Box>
        </Box>
    );
};

export default TacToePage;
