import UserCard from "@/components/TacToc/UserCard";
import { Box, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
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

export interface GameInfo {
    balance: number;
    gameState: number;
    timeout: number;
    revealedBid: number;
}

interface TacTocProps {}
const TacTocPage = ({}: TacTocProps) => {
    const { myInfo, opInfo, bidTacToeGameAddress } = useGameContext();
    const { blockNumber } = useBlockNumber();
    const [currentGrid, setCurrentGrid] = useState<number>(-1);
    const { tacToeGameRetryCall, tacToeGameRetryWrite } =
        useBidTacToeGameRetry(bidTacToeGameAddress);
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bidTacToeGameAddress);
    const ethcallProvider = useMultiProvider();
    const [myGameInfo, setMyGameInfo] = useState<GameInfo>(null);
    const [opGameInfo, setOpGameInfo] = useState<GameInfo>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [list, setList] = useState([
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
        {
            mark: -1,
            myValue: 0,
            opValue: 0,
        },
    ]);

    const handleGetCurrentSelectGrid = async () => {
        const currentGrid = await tacToeGameRetryCall("currentSelectedGrid");
        console.log(currentGrid.toNumber(), "currentGrid");

        const grid0 = await tacToeGameRetryCall("getGrid");

        const _list = JSON.parse(JSON.stringify(list));
        _list[currentGrid.toNumber()].mark = 0;

        setList(_list);
        console.log(grid0, "grid0");
        await ethcallProvider.init();
        const [
            myBalance,
            myGameState,
            myRevealedBid,
            myTimeout,
            opBalance,
            opGameState,
            opRevealedBid,
            opTimeout,
        ] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.balances(myInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(myInfo.burner),
            multiSkylabBidTacToeGameContract.revealedBids(myInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(myInfo.burner),
            multiSkylabBidTacToeGameContract.balances(opInfo.burner),
            multiSkylabBidTacToeGameContract.gameStates(opInfo.burner),
            multiSkylabBidTacToeGameContract.revealedBids(opInfo.burner),
            multiSkylabBidTacToeGameContract.timeouts(opInfo.burner),
        ]);

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
            // 获得一个随机数，最小大于100000的
            const salt = Math.floor(Math.random() * 10000000) + 100000;
            localStorage.setItem("salt", salt.toString());

            const hash = ethers.utils.solidityKeccak256(
                ["uint256", "uint256"],
                [15, salt],
            );
            setLoading(true);
            await tacToeGameRetryWrite("commitBid", [hash]);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!tacToeGameRetryCall) return;
        handleGetCurrentSelectGrid();
    }, [blockNumber, tacToeGameRetryCall]);

    useEffect(() => {}, []);

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
                    showAdvantageTip
                    showButton
                    markIcon={CircleIcon}
                    address={myInfo.address}
                    balance={myGameInfo?.balance}
                    currentBid={"15"}
                    onConfirm={handleBid}
                ></UserCard>
                <Board list={list}></Board>

                <UserCard
                    showButton={false}
                    markIcon={XIcon}
                    address={opInfo.address}
                    balance={opGameInfo?.balance}
                    currentBid={"15"}
                ></UserCard>
            </Box>
        </Box>
    );
};

export default TacTocPage;
