import { Box, Button, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BttIcon from "@/assets/btt-icon.png";
import qs from "query-string";
import {
    BoardItem,
    GameInfo,
    initBoard,
    UserMarkIcon,
    UserMarkType,
} from "@/pages/TacToe";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMutilContract";
import Board from "../TacToe/Board";
import { GameState, getWinState, winPatterns } from "../TacToe";
import { UserCard } from "../BttPlayBack/UserCard";
import Loading from "../Loading";
import RightArrow from "@/components/TacToe/assets/right-arrow.svg";
import { useBlockNumber } from "@/contexts/BlockNumber";
import LiveGameTimer from "./LiveGameTimer";
import LiveStatusTip from "./LiveStatusTip";
import { shortenAddressWithout0x } from "@/utils";
import { aviationImg } from "@/utils/aviationImg";

interface Info {
    burner?: string;
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
    const [init, setInit] = useState(false);
    const [list, setList] = useState<BoardItem[]>(initBoard());
    const { search } = useLocation();
    const params = qs.parse(search) as any;

    const ethcallProvider = useMultiProvider(params.chainId);
    const [bttGameAddress, setBttGameAddress] = useState("");
    const [nextDrawWinner, setNextDrawWinner] = useState<string>("");

    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract(params.chainId);
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bttGameAddress);
    const [lastBidIndex, setLastBidIndex] = useState<number>(-1);
    const [myGameInfo, setMyGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: GameState.Unknown,
        timeout: 0,
        message: 0,
        emote: 0,
    });
    const [opGameInfo, setOpGameInfo] = useState<GameInfo>({
        balance: 0,
        gameState: GameState.Unknown,
        timeout: 0,
        message: 0,
        emote: 0,
    });
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        level: 0,
        mark: UserMarkType.Empty,
    });
    const [opInfo, setOpInfo] = useState<Info>({
        burner: "",
        level: 0,
        mark: UserMarkType.Empty,
    });

    const myMark = useMemo(() => {
        if (myInfo.mark === UserMarkType.Circle) {
            if (getWinState(myGameInfo.gameState)) {
                return UserMarkIcon.YellowCircle;
            } else {
                return UserMarkIcon.Circle;
            }
        } else {
            if (getWinState(myGameInfo.gameState)) {
                return UserMarkIcon.YellowCross;
            } else {
                return UserMarkIcon.Cross;
            }
        }
    }, [myInfo, myGameInfo]);

    const opMark = useMemo(() => {
        if (opInfo.mark === UserMarkType.Circle) {
            if (getWinState(opGameInfo.gameState)) {
                return UserMarkIcon.YellowCircle;
            } else {
                return UserMarkIcon.Circle;
            }
        } else {
            if (getWinState(opGameInfo.gameState)) {
                return UserMarkIcon.YellowCross;
            } else {
                return UserMarkIcon.Cross;
            }
        }
    }, [opInfo, opGameInfo]);

    const handleGetGameInfo = async () => {
        if (
            !multiSkylabBidTacToeGameContract ||
            !multiSkylabBidTacToeFactoryContract ||
            !myInfo.burner ||
            !opInfo.burner
        ) {
            return;
        }

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

        const _list = initBoard();
        const gameState = myGameState.toNumber();
        for (let i = 0; i < boardGrids.length; i++) {
            if (
                boardGrids[i] === "0x0000000000000000000000000000000000000000"
            ) {
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
            _list[currentGrid.toNumber()].mark = UserMarkType.Square;
        }

        // game over result
        if (gameState > GameState.Revealed) {
            const myIsWin = getWinState(gameState);
            const myIsCircle = myInfo.mark === UserMarkType.Circle;
            const burner = myIsWin ? myInfo.burner : opInfo.burner;
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
            message: myMessage.toNumber(),
            emote: myEmote.toNumber(),
        });
        setOpGameInfo({
            balance: opBalance.toNumber(),
            gameState: opGameState.toNumber(),
            timeout: opTimeout.toNumber(),
            message: opMessage.toNumber(),
            emote: opEmote.toNumber(),
        });

        setNextDrawWinner(nextDrawWinner);
        if (!init) {
            setInit(true);
        }
    };

    const handleGetPlayer = async () => {
        if (
            !multiSkylabBidTacToeGameContract ||
            !multiSkylabBidTacToeFactoryContract
        )
            return;

        const [metadata, player1, player2] = await ethcallProvider.all([
            multiSkylabBidTacToeFactoryContract.planeMetadataPerGame(
                bttGameAddress,
            ),
            multiSkylabBidTacToeGameContract.player1(),
            multiSkylabBidTacToeGameContract.player2(),
        ]);
        const [level1, points1, level2, points2] = metadata;
        const params = qs.parse(search) as any;
        const burner = params.burner;

        const _myInfo = JSON.parse(JSON.stringify(myInfo));
        const _opInfo = JSON.parse(JSON.stringify(opInfo));

        if (shortenAddressWithout0x(player1) === burner) {
            _myInfo.level = level1.toNumber();
            _opInfo.level = level2.toNumber();
            _myInfo.burner = player1;
            _opInfo.burner = player2;
            _myInfo.mark = UserMarkType.Circle;
            _opInfo.mark = UserMarkType.Cross;
        } else {
            _myInfo.level = level2.toNumber();
            _opInfo.level = level1.toNumber();
            _myInfo.burner = player2;
            _opInfo.burner = player1;
            _myInfo.mark = UserMarkType.Cross;
            _opInfo.mark = UserMarkType.Circle;
        }

        setMyInfo(_myInfo);
        setOpInfo(_opInfo);
    };

    console.log(myInfo, "_myInfo");
    console.log(opInfo, "opInfo");

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
        myInfo.burner,
        opInfo.burner,
        blockNumber,
        multiSkylabBidTacToeGameContract,
        multiSkylabBidTacToeFactoryContract,
    ]);

    useEffect(() => {
        handleGetPlayer();
    }, [multiSkylabBidTacToeFactoryContract, multiSkylabBidTacToeGameContract]);

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
            {!init ? (
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
                            padding: "2vh 1.5vw",
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                height: "58px",
                                position: "relative",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    position: "absolute",
                                    left: "0",
                                    top: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        border: "2px solid #fff",
                                        width: "20px",
                                        height: "20px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: "5px",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50px",
                                            background: "#fff",
                                        }}
                                    ></Box>
                                </Box>
                                <Text
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Live
                                </Text>
                            </Box>
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
                                level={myInfo.level}
                                markIcon={myMark}
                                gameState={myGameInfo.gameState}
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
                                planeUrl={aviationImg(myInfo.level)}
                            ></UserCard>
                            <Box>
                                <LiveStatusTip
                                    myGameState={myGameInfo.gameState}
                                    opGameState={opGameInfo.gameState}
                                ></LiveStatusTip>
                                <Box
                                    sx={{
                                        paddingTop: "15px",
                                    }}
                                >
                                    <Board list={list}></Board>
                                </Box>
                            </Box>
                            <UserCard
                                message={opGameInfo.message}
                                emote={opGameInfo.emote}
                                level={opInfo.level}
                                markIcon={opMark}
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
                                planeUrl={aviationImg(opInfo.level)}
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
