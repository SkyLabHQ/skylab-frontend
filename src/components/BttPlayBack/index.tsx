import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "@/components/TacToe/assets/back-arrow.svg";
import RightArrow from "@/components/TacToe/assets/right-arrow.svg";
import BttIcon from "@/assets/btt-icon.png";
import qs from "query-string";
import {
    BoardItem,
    Info,
    initBoard,
    UserMarkIcon,
    UserMarkType,
} from "@/pages/TacToe";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMultiContract";
import { GameState, getWinState, winPatterns } from "../TacToe";
import Loading from "../Loading";
import { shortenAddressWithout0x } from "@/utils";
import ButtonGroup from "./ButtonGroup";
import { ZERO_DATA } from "@/skyConstants";
import BttPlayBackContent from "./BttPlayBackContent";
import { botAddress } from "@/hooks/useContract";
import { BigNumber } from "ethers";

const StartJourney = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                background: "#fff",
                borderRadius: "0.9375vw",
                color: "#000",
                padding: "0.2083vw 0.3125vw",
                fontFamily: "Orbitron",
                cursor: "pointer",
                marginTop: "1.5625vw",
                width: "20.8333vw",
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
            }}
            onClick={() => {
                navigate("/activities");
            }}
        >
            <Image
                src={BttIcon}
                sx={{ height: "3.8542vw", marginRight: "0.7813vw" }}
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
                            fontSize: "1.6667vw",
                            fontWeight: "bold",
                            marginRight: "0.7813vw",
                        }}
                    >
                        Bid Tac Toe
                    </Text>
                    <Box
                        sx={{
                            borderLeft: "1px solid #000",
                            paddingLeft: "0.5208vw",
                        }}
                    >
                        <Image
                            src={RightArrow}
                            sx={{ height: "1.6667vw" }}
                        ></Image>
                    </Box>
                </Box>
                <Text sx={{ fontWeight: "bold", fontSize: "1.0417vw" }}>
                    Start your journey
                </Text>
            </Box>
        </Box>
    );
};

const BttPlayBackPage = () => {
    const navigate = useNavigate();

    const [onlyShow, setOnlyShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [init, setInit] = useState(false);
    const [startPlay, setStartPlay] = useState(false);
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const ethcallProvider = useMultiProvider(params.chainId);
    const [allSelectedGrids, setAllSelectedGrids] = useState<any[]>([]);
    const [bttGameAddress, setBttGameAddress] = useState("");
    const [currentRound, setCurrentRound] = useState(0);

    const timer = useRef<any>(null);
    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract(params.chainId);
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bttGameAddress);
    const [resultList, setResultList] = useState<BoardItem[]>(initBoard()); // init board
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        mark: UserMarkType.Empty,
        point: 0,
        img: "",
    });

    const [myGameInfo, setMyGameInfo] = useState({
        gameState: GameState.Unknown,
        balance: 0,
        timeout: 0,
        message: 0,
        emote: 0,
    });
    const [opGameInfo, setOpGameInfo] = useState({
        gameState: GameState.Unknown,
        balance: 0,
        timeout: 0,
        message: 0,
        emote: 0,
    });
    const [opInfo, setOpInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        mark: UserMarkType.Empty,
        point: 0,
        img: "",
    });

    const gameOver = useMemo(() => {
        return currentRound === allSelectedGrids.length;
    }, [currentRound, allSelectedGrids]);

    const myMark = useMemo(() => {
        if (myInfo.mark === UserMarkType.Circle) {
            if (getWinState(myGameInfo.gameState) && gameOver) {
                return UserMarkIcon.YellowCircle;
            } else {
                return UserMarkIcon.Circle;
            }
        } else {
            if (getWinState(myGameInfo.gameState) && gameOver) {
                return UserMarkIcon.YellowCross;
            } else {
                return UserMarkIcon.Cross;
            }
        }
    }, [myInfo, gameOver, myGameInfo]);

    const opMark = useMemo(() => {
        if (opInfo.mark === UserMarkType.Circle) {
            if (getWinState(opGameInfo.gameState) && gameOver) {
                return UserMarkIcon.YellowCircle;
            } else {
                return UserMarkIcon.Circle;
            }
        } else if (opInfo.mark === UserMarkType.BotX) {
            if (getWinState(opGameInfo.gameState) && gameOver) {
                return UserMarkIcon.YellowBotX;
            } else {
                return UserMarkIcon.BotX;
            }
        } else {
            if (getWinState(opGameInfo.gameState) && gameOver) {
                return UserMarkIcon.YellowCross;
            } else {
                return UserMarkIcon.Cross;
            }
        }
    }, [opInfo, opGameInfo]);

    const handleGetGameInfo = async () => {
        if (
            !multiSkylabBidTacToeGameContract ||
            !multiSkylabBidTacToeFactoryContract
        )
            return;

        setLoading(true);
        const params = qs.parse(search) as any;
        const burner = params.burner;

        const round = params.round;

        const [metadata, boardGrids, player1, player2] =
            await ethcallProvider.all([
                multiSkylabBidTacToeFactoryContract.planeMetadataPerGame(
                    bttGameAddress,
                ),
                multiSkylabBidTacToeGameContract.getGrid(),
                multiSkylabBidTacToeGameContract.player1(),
                multiSkylabBidTacToeGameContract.player2(),
            ]);

        const [player1Bids, player2Bids, player1GameState, player2GameState] =
            await ethcallProvider.all([
                multiSkylabBidTacToeGameContract.getRevealedBids(player1),
                multiSkylabBidTacToeGameContract.getRevealedBids(player2),
                multiSkylabBidTacToeGameContract.gameStates(player1),
                multiSkylabBidTacToeGameContract.gameStates(player2),
            ]);

        const [level1, points1, level2, points2] = metadata;

        const myIsPlayer1 = shortenAddressWithout0x(player1) === burner;
        const player2IsBot = player2 === botAddress[params.chainId];
        let myGameState = GameState.Unknown;
        let opGameState = GameState.Unknown;
        let myBids = [];
        let opBids = [];
        let _myInfo = JSON.parse(JSON.stringify(myInfo));
        let _opInfo = JSON.parse(JSON.stringify(opInfo));

        if (myIsPlayer1) {
            myBids = player1Bids.map((item: BigNumber) => {
                return item.toNumber();
            });
            opBids = player2Bids.map((item: BigNumber) => {
                return item.toNumber();
            });
            myGameState = player1GameState.toNumber();
            opGameState = player2GameState.toNumber();
            _myInfo.level = level1.toNumber();
            _opInfo.level = player2IsBot
                ? level1.toNumber()
                : level2.toNumber();
            _myInfo.mark = UserMarkType.Circle;
            _opInfo.mark = player2IsBot
                ? UserMarkType.BotX
                : UserMarkType.Cross;
            _myInfo.burner = player1;
            _opInfo.burner = player2;
            _opInfo.isBot = player2IsBot;
        } else {
            myBids = player2Bids.map((item: BigNumber) => {
                return item.toNumber();
            });
            opBids = player1Bids.map((item: BigNumber) => {
                return item.toNumber();
            });
            myGameState = player2GameState.toNumber();
            opGameState = player1GameState.toNumber();
            _myInfo.level = player2IsBot
                ? level1.toNumber()
                : level2.toNumber();
            _opInfo.level = level1.toNumber();
            _myInfo.mark = player2IsBot
                ? UserMarkType.BotX
                : UserMarkType.Cross;
            _opInfo.mark = UserMarkType.Circle;
            _myInfo.burner = player2;
            _opInfo.burner = player1;
            _myInfo.isBot = player2IsBot;
        }

        setMyInfo(_myInfo);
        setOpInfo(_opInfo);

        setMyGameInfo({
            balance: 0,
            timeout: 0,
            message: 0,
            emote: 0,
            gameState: myGameState,
        });

        setOpGameInfo({
            balance: 0,
            timeout: 0,
            message: 0,
            emote: 0,
            gameState: opGameState,
        });

        let index = 0;
        const p = boardGrids
            .map((item: any) => {
                if (item === ZERO_DATA) {
                    return null;
                } else {
                    return multiSkylabBidTacToeGameContract.allSelectedGrids(
                        index++,
                    );
                }
            })
            .filter((item: any) => item !== null);

        const _gridOrder = await ethcallProvider.all(p);

        const _list = initBoard();

        for (let i = 0; i < boardGrids.length; i++) {
            if (boardGrids[i] === ZERO_DATA) {
                _list[i].mark = UserMarkType.Empty;
            } else if (boardGrids[i] === _myInfo.burner) {
                _list[i].mark = _myInfo.mark;
            } else if (boardGrids[i] === _opInfo.burner) {
                _list[i].mark = _opInfo.mark;
            }
            _list[i].myValue = myBids[i];
            _list[i].opValue = opBids[i];
            _list[i].myMark = _myInfo.mark;
            _list[i].opMark = _opInfo.mark;
        }

        setAllSelectedGrids(
            _gridOrder.map((item: any) => {
                return item.toNumber();
            }),
        );

        if (round && round <= _gridOrder.length) {
            setCurrentRound(Number(round));
        }

        setResultList(_list);
        setLoading(false);
        setInit(true);
    };

    useEffect(() => {
        const params = qs.parse(search) as any;
        if (bttGameAddress === "") {
            setBttGameAddress(params.gameAddress);
            setOnlyShow(params.show === "true");
        } else if (!params.gameAddress) {
            navigate(`/activities`);
        } else if (bttGameAddress != params.gameAddress) {
            navigate(`/activities`);
        }
    }, [search, bttGameAddress]);

    const [showList, myBalance, opBalance, myBid, opBid, myIsNextDrawWinner] =
        useMemo(() => {
            let myBalance = 100,
                opBalance = 100;
            const _list = initBoard();
            if (allSelectedGrids[currentRound] !== undefined) {
                _list[allSelectedGrids[currentRound]].mark =
                    UserMarkType.Square;
            }

            for (let i = 0; i < currentRound; i++) {
                const grid = allSelectedGrids[i];
                _list[grid].mark = resultList[grid].mark;
                _list[grid].myMark = resultList[grid].myMark;
                _list[grid].opMark = resultList[grid].opMark;
                _list[grid].myValue = resultList[grid].myValue;
                _list[grid].opValue = resultList[grid].opValue;
                myBalance -= resultList[grid].myValue;
                opBalance -= resultList[grid].opValue;
            }
            if (currentRound == 0) {
                return [_list, myBalance, opBalance, 0, 0, true];
            }

            if (currentRound === allSelectedGrids.length) {
                const gameState = myGameInfo.gameState;
                const myIsWin = getWinState(gameState);
                const winMark = myIsWin ? myInfo.mark : opInfo.mark;
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
                            _list[index0].mark === winMark &&
                            _list[index1].mark === winMark &&
                            _list[index2].mark === winMark
                        ) {
                            _list[index0].mark = mark;
                            _list[index1].mark = mark;
                            _list[index2].mark = mark;
                            break;
                        }
                    }
                } else {
                    for (let i = 0; i < _list.length; i++) {
                        if (_list[i].mark === winMark) {
                            _list[i].mark = mark;
                        }
                    }
                }
            }

            const myBid =
                currentRound === 0
                    ? 0
                    : resultList[allSelectedGrids[currentRound - 1]].myValue;
            const opBid =
                currentRound === 0
                    ? 0
                    : resultList[allSelectedGrids[currentRound - 1]].opValue;

            let myIsNextDrawWinner = false;
            if (currentRound === 0) {
                myIsNextDrawWinner =
                    myInfo.mark === UserMarkType.Circle ? true : false;
            } else {
                myIsNextDrawWinner =
                    resultList[currentRound - 1].mark === myInfo.mark
                        ? true
                        : false;
            }

            return [
                _list,
                myBalance,
                opBalance,
                myBid,
                opBid,
                myIsNextDrawWinner,
            ];
        }, [allSelectedGrids, currentRound, resultList, myInfo, opInfo]);

    const handlePreStep = () => {
        if (currentRound === 0) return;
        setCurrentRound(currentRound - 1);
    };
    const handleNextStep = () => {
        setCurrentRound((currentRound) => {
            if (currentRound >= allSelectedGrids.length) {
                handleStopPlay();
                return currentRound;
            }
            return currentRound + 1;
        });
    };

    const handleStopPlay = () => {
        setStartPlay(false);
        window.clearTimeout(timer.current);
    };

    const handleStartStep = () => {
        setCurrentRound(0);
        handleStopPlay();
    };

    const handleEndStep = () => {
        setCurrentRound(allSelectedGrids.length);
        handleStopPlay();
    };

    const handleStartPlay = () => {
        setStartPlay(true);
        handleNextStep();
    };

    const handleAutoPlay = () => {
        if (!startPlay || !init) return;
        timer.current = setTimeout(() => {
            handleNextStep();
        }, 2000);
    };
    useEffect(() => {
        handleGetGameInfo();
    }, [multiSkylabBidTacToeGameContract, multiSkylabBidTacToeFactoryContract]);

    useEffect(() => {
        handleAutoPlay();
    }, [init, startPlay, currentRound]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                justifyContent: "center",
                background: "#303030",
                padding: "0px 4.1667vw 0",
            }}
        >
            <Image
                src={BackIcon}
                onClick={() => navigate("/activities")}
                sx={{
                    position: "absolute",
                    left: "1.0417vw",
                    top: "1.0417vw",
                }}
            ></Image>

            {loading ? (
                <Loading></Loading>
            ) : (
                <>
                    <BttPlayBackContent
                        myInfo={myInfo}
                        opInfo={opInfo}
                        myBalance={myBalance}
                        opBalance={opBalance}
                        myBid={myBid}
                        opBid={opBid}
                        myMark={myMark}
                        opMark={opMark}
                        myIsNextDrawWinner={myIsNextDrawWinner}
                        currentRound={currentRound}
                        allSelectedGrids={allSelectedGrids}
                        gameOver={gameOver}
                        myGameInfo={myGameInfo}
                        opGameInfo={opGameInfo}
                        showList={showList}
                    ></BttPlayBackContent>
                    <Box
                        sx={{
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <ButtonGroup
                            list={showList}
                            myInfo={myInfo}
                            myGameInfo={myGameInfo}
                            bttGameAddress={bttGameAddress}
                            currentRound={currentRound}
                            startPlay={startPlay}
                            handleEndStep={handleEndStep}
                            handleNextStep={handleNextStep}
                            handlePreStep={handlePreStep}
                            handleStartPlay={handleStartPlay}
                            handleStartStep={handleStartStep}
                            handleStopPlay={handleStopPlay}
                            showShareEmoji={false}
                        ></ButtonGroup>
                        {onlyShow && <StartJourney></StartJourney>}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default BttPlayBackPage;
