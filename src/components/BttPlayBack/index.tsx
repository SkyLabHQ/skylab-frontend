import { Box, Button, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "@/components/TacToe/assets/back-arrow.svg";
import Logo from "@/assets/logo.svg";
import BttIcon from "@/assets/btt-icon.png";
import qs from "query-string";
import CircleIcon from "@/components/TacToe/assets/circle.svg";
import XIcon from "@/components/TacToe/assets/x.svg";
import { BoardItem, initBoard, UserMarkType } from "@/pages/TacToe";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMutilContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import Board from "../TacToe/Board";
import { GameState, getWinState, winPatterns } from "../TacToe";
import { UserCard } from "./UserCard";
import StartIcon from "./assets/start.svg";
import PreStepIcon from "./assets/pre-step.svg";
import NextStepIcon from "./assets/next-step.svg";
import PlayIcon from "./assets/play.svg";
import EndIcon from "./assets/end.svg";
import StopIcon from "./assets/stop.svg";
import SaveIcon from "@/components/TacToe/assets/save-icon.svg";
import saveAs from "file-saver";
import html2canvas from "html2canvas";
import TwLogo from "@/components/TacToe/assets/tw-logo.svg";
import Loading from "../Loading";
import { CHAIN_NAMES } from "@/utils/web3Utils";
import { shortenAddress } from "@/utils";
import EarthIcon from "@/components/TacToe/assets/earth.svg";

interface Info {
    burner?: string;
    address?: string;
    level: number;
    mark: UserMarkType;
    gameState: GameState;
}

const RoundInfo = ({
    currentRound,
    allRound,
}: {
    currentRound: number;
    allRound: number;
}) => {
    return (
        <Box
            sx={{
                borderRadius: "20px",
                background: "#d9d9d9",
                display: "flex",
                width: "132px",
                alignItems: "center",
                justifyContent: "center",
                margin: "50px auto 0",
                height: "36px",
            }}
        >
            <Text
                sx={{
                    fontSize: "16px",
                    color: "#303030",
                }}
            >
                Round {currentRound}
            </Text>
            <Text
                sx={{
                    color: "#616161",
                    fontSize: "14px",
                }}
            >
                {" "}
                /{allRound}
            </Text>
        </Box>
    );
};

const ButtonGroup = () => {};

const BttPlayBackPage = () => {
    const navigate = useNavigate();
    const { account, chainId } = useActiveWeb3React();
    const [loading, setLoading] = useState(false);
    const [init, setInit] = useState(false);
    const [startPlay, setStartPlay] = useState(false);
    const { search } = useLocation();
    const ethcallProvider = useMultiProvider();
    const [allSelectedGrids, setAllSelectedGrids] = useState<any[]>([]);
    const [bttGameAddress, setBttGameAddress] = useState("");
    const [currentRound, setCurrentRound] = useState(0);
    const timer = useRef<any>(null);
    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract();
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bttGameAddress);

    const [resultList, setResultList] = useState<BoardItem[]>(initBoard()); // init board
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        mark: UserMarkType.Empty,
        gameState: GameState.Unknown,
    });
    const [opInfo, setOpInfo] = useState<Info>({
        burner: "",
        level: 0,
        mark: UserMarkType.Empty,
        gameState: GameState.Unknown,
    });

    const handleGetGameInfo = async () => {
        if (
            !multiSkylabBidTacToeGameContract ||
            !multiSkylabBidTacToeFactoryContract
        )
            return;

        setLoading(true);
        const params = qs.parse(search) as any;

        const burner = params.burner;
        const account = params.account;
        const round = params.round;

        await ethcallProvider.init();
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

        const myIsPlayer1 = player1 === burner;

        const player1Info = {
            burner: player1,
            level: level1.toNumber(),
            mark: UserMarkType.Circle,
            gameState: player1GameState.toNumber(),
        };

        const player2Info = {
            burner: player2,
            level: level2.toNumber(),
            mark: UserMarkType.Cross,
            gameState: player2GameState.toNumber(),
        };

        const myInfo = myIsPlayer1
            ? {
                  address: account ?? "",
                  ...player1Info,
              }
            : {
                  address: account ?? "",
                  ...player2Info,
              };

        myInfo.address = account ?? "";
        const opInfo = myIsPlayer1 ? player2Info : player1Info;

        setMyInfo(myInfo);
        setOpInfo(opInfo);

        let index = 0;
        const p = boardGrids
            .map((item: any) => {
                if (item === "0x0000000000000000000000000000000000000000") {
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
            if (
                boardGrids[i] === "0x0000000000000000000000000000000000000000"
            ) {
                _list[i].mark = UserMarkType.Empty;
            } else if (boardGrids[i] === myInfo.burner) {
                _list[i].mark = myInfo.mark;
            } else if (boardGrids[i] === opInfo.burner) {
                _list[i].mark = opInfo.mark;
            }
            _list[i].myValue = myIsPlayer1
                ? player1Bids[i].toNumber()
                : player2Bids[i].toNumber();
            _list[i].opValue = myIsPlayer1
                ? player2Bids[i].toNumber()
                : player1Bids[i].toNumber();
            _list[i].myMark = myInfo.mark;
            _list[i].opMark = opInfo.mark;
        }

        setAllSelectedGrids(
            _gridOrder.map((item: any) => {
                return item.toNumber();
            }),
        );

        if (round && round < _gridOrder.length) {
            setCurrentRound(round);
        }

        setResultList(_list);
        setLoading(false);
        setInit(true);
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
                _list[grid].myValue = resultList[grid].myValue;
                _list[grid].opValue = resultList[grid].opValue;
                myBalance -= resultList[grid].myValue;
                opBalance -= resultList[grid].opValue;
            }
            if (currentRound === 0) {
                return [_list, myBalance, opBalance, 0, 0, true];
            }

            if (currentRound === allSelectedGrids.length) {
                const gameState = myInfo.gameState;
                const myIsWin = getWinState(gameState);
                const myIsCircle = myInfo.mark === UserMarkType.Circle;
                const winMark = myIsWin ? myInfo.mark : opInfo.mark;
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
                currentRound === 0 ? 0 : resultList[currentRound - 1].myValue;
            const opBid =
                currentRound === 0 ? 0 : resultList[currentRound - 1].opValue;

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
        if (currentRound >= allSelectedGrids.length) {
            setStartPlay(false);
            return;
        }
        setCurrentRound(currentRound + 1);
    };

    const handleStopPlay = () => {
        setStartPlay(false);
        window.clearTimeout(timer.current);
    };

    const handleStartStep = () => {
        setCurrentRound(0);
    };

    const handleEndStep = () => {
        setCurrentRound(allSelectedGrids.length);
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
                padding: "0px 80px 0",
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
                                position: "absolute",
                                left: "1.5vw",
                                bottom: "1.5vh",
                            }}
                        >
                            {shortenAddress(account, 5, 4)}
                        </Box>
                        <Box
                            sx={{
                                position: "absolute",
                                right: "1.5vw",
                                bottom: "1.5vh",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src={TwLogo}
                                    sx={{ marginRight: "4px" }}
                                ></Image>
                                <Text
                                    sx={{
                                        fontSize: "20px",
                                        color: "rgb(172,172,172)",
                                    }}
                                >
                                    @skylabHQ
                                </Text>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "4px",
                                }}
                            >
                                <Image
                                    src={EarthIcon}
                                    sx={{ marginRight: "4px" }}
                                ></Image>
                                <Text
                                    sx={{
                                        fontSize: "20px",
                                        color: "rgb(172,172,172)",
                                    }}
                                >
                                    skylab.wtf/#/activites
                                </Text>{" "}
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                fontFamily: "Orbitron",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src={Logo}
                                    sx={{ width: "56px", height: "56px" }}
                                ></Image>
                                <Text
                                    sx={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        marginTop: "5px",
                                    }}
                                >
                                    Sky Lab
                                </Text>
                            </Box>
                            <Image
                                src={XIcon}
                                sx={{
                                    margin: "0 20px",
                                    width: "20px",
                                    height: "20px",
                                }}
                            ></Image>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src={BttIcon}
                                    sx={{ width: "56px", height: "56px" }}
                                ></Image>
                                <Text
                                    sx={{
                                        fontSize: "24px",
                                        fontWeight: "700",
                                        marginTop: "5px",
                                    }}
                                >
                                    Bid Tac Toe{" "}
                                </Text>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <UserCard
                                markIcon={
                                    myInfo.mark === UserMarkType.Circle
                                        ? CircleIcon
                                        : XIcon
                                }
                                status="my"
                                address={myInfo.address}
                                balance={myBalance}
                                bidAmount={myBid}
                                showAdvantageTip={myIsNextDrawWinner}
                            ></UserCard>
                            <Box>
                                <Board list={showList}></Board>
                                <RoundInfo
                                    currentRound={currentRound}
                                    allRound={allSelectedGrids.length}
                                ></RoundInfo>
                            </Box>
                            <UserCard
                                markIcon={
                                    opInfo.mark === UserMarkType.Circle
                                        ? CircleIcon
                                        : XIcon
                                }
                                status="op"
                                address={opInfo.address}
                                balance={opBalance}
                                bidAmount={opBid}
                                showAdvantageTip={!myIsNextDrawWinner}
                            ></UserCard>
                        </Box>
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "40px",
                                "& > img": {
                                    cursor: "pointer",
                                },
                            }}
                        >
                            <Image
                                src={StartIcon}
                                sx={{
                                    marginRight: "28px",
                                }}
                                onClick={handleStartStep}
                            ></Image>
                            <Image
                                src={PreStepIcon}
                                sx={{
                                    marginRight: "28px",
                                }}
                                onClick={handlePreStep}
                            ></Image>
                            {startPlay ? (
                                <Image
                                    src={StopIcon}
                                    sx={{
                                        marginRight: "28px",
                                    }}
                                    onClick={handleStopPlay}
                                ></Image>
                            ) : (
                                <Image
                                    src={PlayIcon}
                                    sx={{
                                        marginRight: "28px",
                                    }}
                                    onClick={handleStartPlay}
                                ></Image>
                            )}
                            <Image
                                src={NextStepIcon}
                                sx={{
                                    marginRight: "28px",
                                }}
                                onClick={handleNextStep}
                            ></Image>
                            <Image
                                src={EndIcon}
                                onClick={handleEndStep}
                            ></Image>
                        </Box>
                        <Box
                            sx={{
                                marginTop: "20px",
                            }}
                        >
                            <Button
                                sx={{
                                    border: "3px solid #bcbbbe !important",
                                    borderRadius: "18px",
                                    width: "180px",
                                    height: "52px",
                                    color: "#d9d9d9",
                                    fontSize: "20px",
                                    marginRight: "12px",
                                }}
                                variant={"outline"}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const content =
                                        document.getElementById(
                                            "share-content",
                                        );
                                    const canvas = await html2canvas(content);
                                    canvas.toBlob((blob: any) => {
                                        if (!blob) {
                                            return;
                                        }
                                        saveAs(blob, "result.jpg");
                                    });
                                }}
                            >
                                <Image
                                    src={SaveIcon}
                                    sx={{ marginRight: "5px" }}
                                ></Image>
                                <Text
                                    sx={{
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    Save Image
                                </Text>
                            </Button>
                            <Button
                                sx={{
                                    border: "3px solid #bcbbbe !important",
                                    borderRadius: "18px",
                                    width: "180px",
                                    height: "52px",
                                    color: "#d9d9d9",
                                    fontSize: "20px",
                                }}
                                variant={"outline"}
                                onClick={(e) => {
                                    console.log(
                                        window.location,
                                        "window.location",
                                    );
                                    // e.stopPropagation();
                                    const text = `Introducing Bid Tac Toe, a fully on-chain PvP game of psychology and strategy, on ${CHAIN_NAMES[chainId]} 

                                    Players start with the same amount of gold and place one-shot blind bids for each grid. Player who occupies connected grids OR occupies more grids when the board is full wins.
                                    [link]
                                @skylabHQ
                                    skylab.wtf/#/activites`;
                                    // window.open(text, "_blank");
                                }}
                            >
                                <Image src={TwLogo}></Image>
                                <Text
                                    sx={{
                                        flex: 1,
                                        textAlign: "center",
                                    }}
                                >
                                    Share
                                </Text>
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default BttPlayBackPage;
