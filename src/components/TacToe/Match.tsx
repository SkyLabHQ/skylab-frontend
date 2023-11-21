import React, { useEffect, useMemo, useState } from "react";
import { Box, Checkbox, Image, Text, useDisclosure } from "@chakra-ui/react";
import GatherTimeResult from "@/components/GameContent/assets/gatherTimeResult.svg";
import GatherTimeResult1 from "@/components/GameContent/assets/gatherTimeResult1.svg";
import GatherTimeResult2 from "@/components/GameContent/assets/gatherTimeResult2.svg";
import GatherTimeResult3 from "@/components/GameContent/assets/gatherTimeResult3.svg";
import { Info, UserMarkType, useGameContext, GameType } from "@/pages/TacToe";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";
import { getMetadataImg } from "@/utils/ipfsImg";
import {
    useMultiProvider,
    useMultiSkylabBidTacToeFactoryContract,
    useMultiSkylabBidTacToeGameContract,
    useMultiMercuryBaseContract,
} from "@/hooks/useMultiContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import ToolBar from "./Toolbar";
import { PilotInfo } from "@/hooks/usePilotInfo";
import { botAddress } from "@/hooks/useContract";
import { GrayButton } from "../Button/Index";
import QuitModal from "./QuitModal";

export const PlaneImg = ({
    detail,
    flip,
    pilotInfo,
}: {
    detail: Info;
    flip?: boolean;
    pilotInfo: PilotInfo;
}) => {
    return (
        <>
            {detail?.level ? (
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <Image
                        src={detail?.img}
                        sx={{
                            width: "14.5833vw",
                            height: "14.5833vw",
                            transform: flip ? "scaleX(-1)" : "",
                            /*兼容IE*/
                            filter: "FlipH",
                        }}
                    ></Image>
                    {pilotInfo.img && (
                        <Image
                            sx={{
                                width: "3.3333vw",
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%,-50%)",
                                borderRadius: "50%",
                                border: "2px solid #000",
                            }}
                            src={pilotInfo.img}
                        ></Image>
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "14.5833vw",
                        height: "14.5833vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <motion.img
                        src={LoadingIcon}
                        style={{
                            width: "6.25vw",
                            rotate: 0,
                        }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 3,
                        }}
                        animate={{ rotate: 360 }}
                    />
                </Box>
            )}
        </>
    );
};

const StopMatch = ({ onClick }: { onClick: () => void }) => {
    const [checked, setChecked] = React.useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const stopMatchTip = localStorage.getItem("stopMatchTip");
        if (stopMatchTip === "true") {
            setShow(false);
        } else {
            setShow(true);
        }
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <GrayButton
                onClick={onClick}
                sx={{
                    width: "256px !important",
                    height: "64px !important",
                    background: "transparent",
                    marginTop: "20vh",
                }}
            >
                <Text
                    sx={{
                        fontSize: "24px",
                        textAlign: "center !important",
                        flex: 1,
                    }}
                >
                    Stop Matching
                </Text>
            </GrayButton>
            {show && (
                <>
                    <Box
                        sx={{
                            width: 0,
                            height: 0,
                            borderLeft: "0.4427vw solid transparent",
                            borderRight: "0.4427vw solid transparent",
                            borderBottom: "0.7668vw solid #fff",
                            marginTop: "10px",
                        }}
                    ></Box>
                    <Box
                        sx={{
                            width: "688px",
                            height: "132px",
                            border: "1px solid #616161",
                            backdropFilter: "blur(25px)",
                            padding: "20px 60px 0",
                            borderRadius: "16px",
                            marginTop: "20px",
                        }}
                    >
                        <Text
                            sx={{
                                fontSize: "24px",
                                textAlign: "center",
                            }}
                        >
                            Make sure to{" "}
                            <span
                                style={{
                                    fontWeight: "bold",
                                }}
                            >
                                STOP MATCHING
                            </span>{" "}
                            before closing the browser to avoid accidentally
                            losing your aviation
                        </Text>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Checkbox
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setChecked(e.target.checked);
                                    localStorage.setItem(
                                        "stopMatchTip",
                                        checked ? "true" : "false",
                                    );
                                }}
                                checked={checked}
                                size="lg"
                                sx={{
                                    "--chakra-shadows-outline": "none",
                                    marginRight: "0.5208vw",
                                    background: "#d9d9d9",
                                    borderRadius: "4px",
                                    "& span": {
                                        borderRadius: "4px",
                                    },
                                    "& span[data-checked]": {
                                        background: "#d9d9d9 !important",
                                        borderColor: "#d9d9d9 !important",
                                        borderRadius: "4px",
                                    },
                                    "& span:hover": {
                                        background: "#d9d9d9 !important",
                                        borderColor: "#d9d9d9 !important",
                                        borderRadius: "4px",
                                    },
                                }}
                                variant="no-outline"
                            ></Checkbox>
                            <Text
                                sx={{
                                    fontSize: "16px",
                                    fontFamily: "Quantico",
                                }}
                            >
                                {" "}
                                Do not show again
                            </Text>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
};

export const MatchPage = ({
    onGameType,
    onChangeInfo,
    onChangeMileage,
    onChangePoint,
}: {
    onGameType: (type: GameType) => void;
    onChangeMileage: (winMileage: number, loseMileage: number) => void;
    onChangePoint: (winPoint: number, losePoint: number) => void;
    onChangeInfo: (position: "my" | "op", info: Info) => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { account, chainId } = useActiveWeb3React();
    const ethcallProvider = useMultiProvider(chainId);
    const {
        myInfo,
        opInfo,
        bidTacToeGameAddress,
        myActivePilot,
        opActivePilot,
    } = useGameContext();

    const multiMercuryBaseContract = useMultiMercuryBaseContract();
    const multiSkylabBidTacToeGameContract =
        useMultiSkylabBidTacToeGameContract(bidTacToeGameAddress);
    const multiSkylabBidTacToeFactoryContract =
        useMultiSkylabBidTacToeFactoryContract();

    const [zone, setZone] = useState("-4");

    const zoneImg = useMemo(() => {
        if (["-1", "-4", "-7", "-10", "2", "5", "8", "11"].includes(zone)) {
            return GatherTimeResult1;
        }

        if (["-3", "-6", "-9", "-12", "0", "3", "6", "9"].includes(zone)) {
            return GatherTimeResult2;
        }

        if (["-2", "-5", "-8", "-11", "1", "4", "7", "10"].includes(zone)) {
            return GatherTimeResult3;
        }
        return GatherTimeResult;
    }, [zone]);

    const handleGetHuamnAndBotInfo = async (
        playerAddress1: string,
        playerAddress2: string,
    ) => {
        const [tokenId1] = await ethcallProvider.all([
            multiSkylabBidTacToeFactoryContract.burnerAddressToTokenId(
                playerAddress1,
            ),
        ]);
        const [
            account1,
            level1,
            mtadata1,
            point1,
            player1Move,
            [player1WinMileage, player1LoseMileage],
        ] = await ethcallProvider.all([
            multiMercuryBaseContract.ownerOf(tokenId1),
            multiMercuryBaseContract.aviationLevels(tokenId1),
            multiMercuryBaseContract.tokenURI(tokenId1),
            multiMercuryBaseContract.aviationPoints(tokenId1),
            multiMercuryBaseContract.estimatePointsToMove(tokenId1, tokenId1),
            multiMercuryBaseContract.estimateMileageToGain(tokenId1, tokenId1),
        ]);
        const player1Info = {
            burner: playerAddress1,
            address: account1,
            point: point1.toNumber(),
            level: level1.toNumber(),
            img: getMetadataImg(mtadata1),
        };
        const botInfo = {
            burner: playerAddress2,
            address: playerAddress2,
            point: point1.toNumber(),
            level: level1.toNumber(),
            img: getMetadataImg(mtadata1),
            isBot: true,
        };
        onChangeInfo("my", { ...player1Info, mark: UserMarkType.Circle });
        onChangeInfo("op", { ...botInfo, mark: UserMarkType.BotX });
        onChangePoint(player1Move.toNumber(), player1Move.toNumber());
        onChangeMileage(
            player1WinMileage.toNumber(),
            player1LoseMileage.toNumber(),
        );
        onGameType(GameType.HumanWithBot);
    };

    const handleGetHuamnAndHumanInfo = async (
        playerAddress1: string,
        playerAddress2: string,
    ) => {
        const [tokenId1, tokenId2] = await ethcallProvider.all([
            multiSkylabBidTacToeFactoryContract.burnerAddressToTokenId(
                playerAddress1,
            ),
            multiSkylabBidTacToeFactoryContract.burnerAddressToTokenId(
                playerAddress2,
            ),
        ]);
        const [
            account1,
            level1,
            mtadata1,
            point1,
            account2,
            level2,
            mtadata2,
            point2,
            player1Move,
            player2Move,
            [player1WinMileage, player1LoseMileage],
            [player2WinMileage, player2LoseMileage],
        ] = await ethcallProvider.all([
            multiMercuryBaseContract.ownerOf(tokenId1),
            multiMercuryBaseContract.aviationLevels(tokenId1),
            multiMercuryBaseContract.tokenURI(tokenId1),
            multiMercuryBaseContract.aviationPoints(tokenId1),
            multiMercuryBaseContract.ownerOf(tokenId2),
            multiMercuryBaseContract.aviationLevels(tokenId2),
            multiMercuryBaseContract.tokenURI(tokenId2),
            multiMercuryBaseContract.aviationPoints(tokenId2),
            multiMercuryBaseContract.estimatePointsToMove(tokenId1, tokenId2),
            multiMercuryBaseContract.estimatePointsToMove(tokenId2, tokenId1),
            multiMercuryBaseContract.estimateMileageToGain(tokenId1, tokenId2),
            multiMercuryBaseContract.estimateMileageToGain(tokenId2, tokenId1),
        ]);

        const player1Info = {
            burner: playerAddress1,
            address: account1,
            point: point1.toNumber(),
            level: level1.toNumber(),
            img: getMetadataImg(mtadata1),
        };
        const player2Info = {
            burner: playerAddress2,
            address: account2,
            point: point2.toNumber(),
            level: level2.toNumber(),
            img: getMetadataImg(mtadata2),
        };

        if (player1Info.address === account) {
            onChangeInfo("my", { ...player1Info, mark: UserMarkType.Circle });
            onChangeInfo("op", { ...player2Info, mark: UserMarkType.Cross });
            onChangePoint(player1Move.toNumber(), player2Move.toNumber());
            onChangeMileage(
                player1WinMileage.toNumber(),
                player1LoseMileage.toNumber(),
            );
        } else {
            onChangeInfo("my", { ...player2Info, mark: UserMarkType.Cross });
            onChangeInfo("op", { ...player1Info, mark: UserMarkType.Circle });
            onChangeMileage(
                player2WinMileage.toNumber(),
                player2LoseMileage.toNumber(),
            );
            onChangePoint(player2Move.toNumber(), player1Move.toNumber());
        }
        onGameType(GameType.HumanWithHuman);
    };

    const handleGetAllPlayerInfo = async () => {
        const [playerAddress1, playerAddress2] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.player1(),
            multiSkylabBidTacToeGameContract.player2(),
        ]);

        console.log("playerAddress1", playerAddress1);
        console.log("playerAddress2", playerAddress2);

        if (playerAddress2 === botAddress[chainId]) {
            handleGetHuamnAndBotInfo(playerAddress1, playerAddress2);
        } else {
            handleGetHuamnAndHumanInfo(playerAddress1, playerAddress2);
        }
    };

    useEffect(() => {
        if (
            !ethcallProvider ||
            !multiMercuryBaseContract ||
            !multiSkylabBidTacToeGameContract ||
            !multiSkylabBidTacToeFactoryContract
        )
            return;

        handleGetAllPlayerInfo();
    }, [
        ethcallProvider,
        multiMercuryBaseContract,
        multiSkylabBidTacToeGameContract,
        multiSkylabBidTacToeFactoryContract,
    ]);

    return (
        <Box
            pos="relative"
            bgRepeat="no-repeat,no-repeat"
            height="100vh"
            bgPos={"center bottom,center center"}
            bgSize={"100%,100% 100%"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
                padding: "1.4063vw 3.125vw",
            }}
        >
            <Box
                sx={{
                    height: "5.3704vh",
                    position: "relative",
                    width: "100%",
                }}
            >
                <ToolBar quitType="wait"></ToolBar>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1vh",
                }}
            >
                <PlaneImg detail={myInfo} pilotInfo={myActivePilot}></PlaneImg>
                <Text sx={{ fontSize: "2.5vw", margin: "0 30px" }}>VS</Text>
                <PlaneImg
                    detail={opInfo}
                    flip={true}
                    pilotInfo={opActivePilot}
                ></PlaneImg>
            </Box>
            <StopMatch
                onClick={() => {
                    onOpen();
                }}
            ></StopMatch>
            <QuitModal
                isOpen={isOpen}
                onClose={onClose}
                quitType={"wait"}
            ></QuitModal>
        </Box>
    );
};

export default MatchPage;
