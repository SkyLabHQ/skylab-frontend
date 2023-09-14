import { Box, Button, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackIcon from "@/components/TacToe/assets/back-arrow.svg";
import Logo from "@/assets/logo.svg";
import BttIcon from "@/assets/btt-icon.png";
import XIcon from "./assets/x.svg";
import qs from "query-string";

import { BoardItem, Info, initBoard, UserMarkType } from "@/pages/TacToe";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeGameContract,
} from "@/hooks/useMutilContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import Board from "../TacToe/Board";

const BttPlayBackPage = () => {
    const navigate = useNavigate();
    const { account } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const ethcallProvider = useMultiProvider();
    const [allSelectedGrids, setAllSelectedGrids] = useState<any[]>([]);
    const [bttGameAddress, setBttGameAddress] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bttGameAddress);

    const [resultList, setResultList] = useState<BoardItem[]>(initBoard()); // init board
    const [myInfo, setMyInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        point: 0,
        img: "",
        mark: UserMarkType.Empty,
    });
    const [opInfo, seOpInfo] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        point: 0,
        img: "",
        mark: UserMarkType.Empty,
    });

    const handleGetGameInfo = async () => {
        if (!multiSkylabBidTacToeGameContract || !account) return;

        await ethcallProvider.init();
        const [boardGrids, player1, player2] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.getGrid(),
            multiSkylabBidTacToeGameContract.player1(),
            multiSkylabBidTacToeGameContract.player2(),
        ]);

        const [player1Bids, player2Bids] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.getRevealedBids(player1),
            multiSkylabBidTacToeGameContract.getRevealedBids(player2),
        ]);

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
            } else if (boardGrids[i] === player1) {
                _list[i].mark = UserMarkType.Circle;
            } else if (boardGrids[i] === player2) {
                _list[i].mark = UserMarkType.Cross;
            }
            _list[i].myValue = player1Bids[i].toNumber();
            _list[i].opValue = player2Bids[i].toNumber();
            _list[i].myMark = UserMarkType.Circle;
            _list[i].opMark = UserMarkType.Cross;
        }

        setAllSelectedGrids(
            _gridOrder.map((item: any) => {
                return item.toNumber();
            }),
        );
        setResultList(_list);
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

    const showList = useMemo(() => {
        const list = initBoard();
        if (allSelectedGrids[currentStep] !== undefined) {
            list[allSelectedGrids[currentStep]].mark = UserMarkType.Square;
        }
        for (let i = 0; i < currentStep; i++) {
            const grid = allSelectedGrids[i];
            list[grid].mark = resultList[grid].mark;
        }
        return list;
    }, [allSelectedGrids, currentStep, resultList]);

    const handlePreStep = () => {
        if (currentStep === 0) return;
        setCurrentStep(currentStep - 1);
    };
    const handleNextStep = () => {
        if (currentStep >= allSelectedGrids.length) return;
        setCurrentStep(currentStep + 1);
    };

    useEffect(() => {
        console.log(multiSkylabBidTacToeGameContract, "进来啊");
        handleGetGameInfo();
    }, [multiSkylabBidTacToeGameContract, account]);
    return (
        <Box>
            <Image
                src={BackIcon}
                onClick={() => navigate("/activities")}
                sx={{
                    position: "absolute",
                    left: "20px",
                    top: "20px",
                }}
            ></Image>

            <Box
                sx={{
                    maxWidth: "1430px",
                    margin: "0 auto",
                    border: "2px solid #fff",
                    boxShadow: "5px 4px 8px 0px rgba(255, 255, 255, 0.50);",
                }}
            >
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
                            sx={{ width: "74px", height: "74px" }}
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
                    <Image src={XIcon} sx={{ margin: "0 20px" }}></Image>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src={BttIcon}
                            sx={{ width: "74px", height: "74px" }}
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
                <Board list={showList}></Board>
                <Button onClick={handlePreStep}>上个</Button>
                <Button onClick={handleNextStep}>下个</Button>
            </Box>
        </Box>
    );
};

export default BttPlayBackPage;
