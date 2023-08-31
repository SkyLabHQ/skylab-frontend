import UserCard from "@/components/TacToc/UserCard";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import CircleIcon from "@/components/TacToc/assets/circle.svg";
import XIcon from "@/components/TacToc/assets/x.svg";
import Board from "@/components/TacToc/Board";
import Timer from "@/components/TacToc/Timer";
import LevelInfo from "./LevelInfo";
import ToolBar from "./Toolbar";
import { useBlockNumber } from "@/contexts/BlockNumber";
import { useBidTacToeGameRetry } from "@/hooks/useRetryContract";
import { useGameContext } from "@/pages/TacToe";
import { ethers } from "ethers";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMutilContract";
import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";
import useTacToeSalt from "@/hooks/useTacToeSalt";

export enum MarkType {
    Square = 0,
    Circle = 1,
    Cross = 2,
    YellowCircle = 3,
    YellowCross = 4,
}

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

export interface GameInfo {
    balance: number;
    gameState: number;
    timeout: number;
    revealedBid: number;
}

interface MyGridInfo {
    [gridNumber: number]: number;
}

interface TacTocProps {}
const TacTocPage = ({}: TacTocProps) => {
    const toast = useSkyToast();
    const { myInfo, opInfo, bidTacToeGameAddress, tokenId } = useGameContext();
    const { blockNumber } = useBlockNumber();
    const myGridInfo = useRef<MyGridInfo>({});
    const [currentGrid, setCurrentGrid] = useState<number>(-1);
    const [bidAmount, setBidAmount] = useState<string>("0");
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
    const [myGameInfo, setMyGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: 0,
        timeout: 0,
        revealedBid: 0,
    });
    const [opGameInfo, setOpGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: 0,
        timeout: 0,
        revealedBid: 0,
    });
    const [loading, setLoading] = useState<boolean>(false);

    const [list, setList] = useState([
        {
            mark: -1,
            myValue: 0,
            salt: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,

            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,

            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
            salt: 0,
        },
        {
            mark: -1,
            myValue: 0,
            salt: 0,
            opValue: 0,
        },
    ]);

    const handleGetCurrentSelectGrid = async () => {
        if (myGameInfo.gameState > 3) {
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
        ] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.currentSelectedGrid(),
            multiSkylabBidTacToeGameContract.getGrid(),
            multiSkylabBidTacToeGameContract.balances(myInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(myInfo.burner),
            multiSkylabBidTacToeGameContract.revealedBids(myInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(myInfo.burner),
            multiSkylabBidTacToeGameContract.balances(opInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(opInfo.burner),
            multiSkylabBidTacToeGameContract.revealedBids(opInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(opInfo.burner),
        ]);

        const _list = JSON.parse(JSON.stringify(list));
        _list[currentGrid.toNumber()].mark = 0;
        const gameState = myGameState.toNumber();

        for (let i = 0; i < grid0.length; i++) {
            if (grid0[i] === "0x0000000000000000000000000000000000000000") {
                continue;
            }
            if (grid0[i] === myInfo.burner) {
                _list[i].mark = 1;
            }
            if (grid0[i] === opInfo.burner) {
                _list[i].mark = 2;
            }
        }

        if (gameState === 4 || gameState === 5) {
            for (let i = 0; i < winPatterns.length; i++) {
                const myIsWin = gameState === 4;
                const burner = myIsWin ? myInfo.burner : opInfo.burner;
                const mark = myIsWin
                    ? MarkType.YellowCircle
                    : MarkType.YellowCross;
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
        }

        if ([6, 7, 8, 9, 10, 11].includes(gameState)) {
            const myIsWin = [6, 8, 10].includes(gameState);
            const burner = myIsWin ? myInfo.burner : opInfo.burner;
            const mark = myIsWin ? MarkType.YellowCircle : MarkType.YellowCross;
            for (let i = 0; i < grid0.length; i++) {
                if (grid0[i] === burner) {
                    _list[i].mark = mark;
                }
            }
        }
        setCurrentGrid(currentGrid.toNumber());
        setList(_list);

        setMyGameInfo({
            balance: myBalance.toNumber(),
            gameState: myGameState.toNumber(),
            timeout: myTimeout.toNumber(),
            revealedBid: myRevealedBid.toNumber(),
        });

        setOpGameInfo({
            balance: opBalance.toNumber(),
            gameState: opGameState.toNumber(),
            timeout: opTimeout.toNumber(),
            revealedBid: opRevealedBid.toNumber(),
        });
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
            await tacToeGameRetryWrite("commitBid", [hash], 120000);
            setMyGameInfo((info) => {
                return { ...info, gameState: 2 };
            });
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
            setLoading(true);
            const { salt, amount } = getSalt();
            await tacToeGameRetryWrite(
                "revealBid",
                [amount, Number(salt)],
                300000,
            );
            myGridInfo.current[currentGrid] = 2;
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
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
            myGameInfo.gameState === 2 &&
            (opGameInfo.gameState === 2 || opGameInfo.gameState === 3)
        ) {
            handleRevealedBid();
            myGridInfo.current[currentGrid] = 1;
        }
    }, [myGameInfo.gameState, opGameInfo.gameState]);

    return (
        <Box
            sx={{
                padding: "27px 90px",
                position: "relative",
                width: "100vw",
                height: "100vh",
            }}
        >
            <LevelInfo></LevelInfo>
            <Timer myGameInfo={myGameInfo} opGameInfo={opGameInfo}></Timer>{" "}
            <Text
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: "100px",
                    transform: "translateX(-50%)",
                }}
            >
                {loading && "On chain submission..."}
                {!loading &&
                    myGameInfo?.gameState === 2 &&
                    opGameInfo?.gameState === 1 &&
                    "waiting for opponent to confirm"}
            </Text>
            <ToolBar></ToolBar>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "10vh",
                }}
            >
                <UserCard
                    loading={loading}
                    showAdvantageTip
                    showButton
                    gameInfo={myGameInfo}
                    markIcon={CircleIcon}
                    address={myInfo.address}
                    balance={myGameInfo.balance}
                    currentBid={bidAmount}
                    onConfirm={handleBid}
                    showInput={true}
                    onInputChange={(value) => {
                        setBidAmount(value);
                    }}
                ></UserCard>
                <Board list={list}></Board>

                <UserCard
                    showButton={false}
                    markIcon={XIcon}
                    gameInfo={opGameInfo}
                    address={opInfo.address}
                    balance={opGameInfo?.balance}
                    currentBid={""}
                ></UserCard>
            </Box>
        </Box>
    );
};

export default TacTocPage;
