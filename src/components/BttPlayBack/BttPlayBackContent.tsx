import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";
import Logo from "@/assets/logo.svg";
import BttIcon from "@/assets/btt-icon.png";
import XIcon from "@/components/TacToe/assets/x.svg";
import { BoardItem, GameInfo, Info } from "@/pages/TacToe";
import Board from "../TacToe/Board";
import { GameState } from "../TacToe";
import { UserCard } from "./UserCard";
import TwLogo from "@/components/TacToe/assets/tw-logo.svg";
import EarthIcon from "@/components/TacToe/assets/earth.svg";
import { aviationImg } from "@/utils/aviationImg";
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
                borderRadius: "1.0417vw",
                background: "#d9d9d9",
                display: "flex",
                width: "6.875vw",
                alignItems: "center",
                justifyContent: "center",
                margin: "2.6042vw auto 0",
                height: "1.875vw",
            }}
        >
            <Text
                sx={{
                    fontSize: "0.8333vw",
                    color: "#303030",
                }}
            >
                Round {currentRound}
            </Text>
            <Text
                sx={{
                    color: "#616161",
                    fontSize: "0.7292vw",
                }}
            >
                {" "}
                /{allRound}
            </Text>
        </Box>
    );
};

const BttPlayBackContent = ({
    myInfo,
    opInfo,
    myBalance,
    opBalance,
    myBid,
    opBid,
    myMark,
    opMark,
    myIsNextDrawWinner,
    currentRound,
    allSelectedGrids,
    gameOver,
    myGameInfo,
    showList,
}: {
    myInfo: Info;
    opInfo: Info;
    myBalance: number;
    opBalance: number;
    myBid: number;
    opBid: number;
    myMark: string;
    opMark: string;
    myIsNextDrawWinner: boolean;
    currentRound: number;
    allSelectedGrids: BoardItem[];
    gameOver: boolean;
    myGameInfo: GameInfo;
    showList: BoardItem[];
}) => {
    return (
        <Box
            id="share-content"
            sx={{
                background: "#303030",
                maxWidth: "74.4792vw",
                margin: "0 auto",
                width: "100%",
                border: "2px solid #fff",
                boxShadow: "5px 4px 8px 0px rgba(255, 255, 255, 0.50)",
                padding: "1.5vh 1.5vw",
                position: "relative",
            }}
        >
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
                        sx={{ marginRight: "0.2083vw" }}
                    ></Image>
                    <Text
                        sx={{
                            fontSize: "1.0417vw",
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
                        marginTop: "0.2083vw",
                    }}
                >
                    <Image
                        src={EarthIcon}
                        sx={{ marginRight: "0.2083vw" }}
                    ></Image>
                    <Text
                        sx={{
                            fontSize: "1.0417vw",
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
                        sx={{
                            width: "2.9167vw",
                            height: "2.9167vw",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                            fontWeight: "700",
                            marginTop: "0.2604vw",
                        }}
                    >
                        Sky Lab
                    </Text>
                </Box>
                <Image
                    src={XIcon}
                    sx={{
                        margin: "0 1.0417vw",
                        width: "1.0417vw",
                        height: "1.0417vw",
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
                        sx={{
                            width: "2.9167vw",
                            height: "2.9167vw",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                            fontWeight: "700",
                            marginTop: "0.2604vw",
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
                    markIcon={myMark}
                    level={myInfo.level}
                    status="my"
                    balance={myBalance}
                    bidAmount={myBid}
                    showAdvantageTip={myIsNextDrawWinner}
                    planeUrl={aviationImg(myInfo.level)}
                    gameState={
                        gameOver
                            ? myGameInfo.gameState
                            : GameState.WaitingForBid
                    }
                ></UserCard>
                <Box>
                    <Board list={showList}></Board>
                    <RoundInfo
                        currentRound={currentRound}
                        allRound={allSelectedGrids.length}
                    ></RoundInfo>
                </Box>
                <UserCard
                    markIcon={opMark}
                    level={opInfo.level}
                    status="op"
                    balance={opBalance}
                    bidAmount={opBid}
                    showAdvantageTip={!myIsNextDrawWinner}
                    planeUrl={aviationImg(opInfo.level)}
                ></UserCard>
            </Box>
        </Box>
    );
};

export default BttPlayBackContent;
