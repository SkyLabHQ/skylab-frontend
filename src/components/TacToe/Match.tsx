import React, { useEffect, useMemo, useState } from "react";
import { Box, Image, Select, Text } from "@chakra-ui/react";
import GatherTimeResult from "@/components/GameContent/assets/gatherTimeResult.svg";
import GatherTimeResult1 from "@/components/GameContent/assets/gatherTimeResult1.svg";
import GatherTimeResult2 from "@/components/GameContent/assets/gatherTimeResult2.svg";
import GatherTimeResult3 from "@/components/GameContent/assets/gatherTimeResult3.svg";
import { Info, UserMarkType, useGameContext } from "@/pages/TacToe";
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

const zoneList = [
    { value: -12, label: "-12 Baker Island, Howland Island" },
    { value: -11, label: "-11 Pago Pago, Alofi, Midway Atoll" },
    { value: -10, label: "-10 Honolulu, Papeete" },
    { value: -9, label: "-9" },
    { value: -8, label: "-8 Anchorage, Fairbanks" },
    { value: -7, label: "-7 Seattle, Los Angeles, Vancouver " },
    { value: -6, label: "-6 Mexico City,  Guatemala City " },
    { value: -5, label: "-5 Lima, Chicago" },
    { value: -4, label: "-4 New York, Toronto" },
    { value: -3, label: "-3 Buenos Aires, Rio de Janeiro, Montevideo " },
    { value: -2, label: "-2 Nuuk" },
    { value: -1, label: "-1 Praia" },
    { value: 1, label: "+1 Paris, Rome, Berlin" },
    { value: 2, label: "+2 Oslo, Monaco" },
    { value: 3, label: "+3 Moscow, Athens, Cairo, Istanbul " },
    { value: 4, label: "+4 Dubai, Baku, Tbilisi" },
    { value: 5, label: "+5 Yekaterinburg" },
    { value: 6, label: "+6 Almaty, Dhaka, Omsk" },
    { value: 7, label: "+7 Bangkok, Jakarta, Hanoi " },
    { value: 8, label: "+8 Beijing, Hongkong, SIngapore" },
    { value: 9, label: "+9 Tokyo, Seoul, Chita " },
    { value: 10, label: "+10 Sydney, Brisbane, Port Moresby" },
    { value: 11, label: "+11 Honiara, Noumea" },
    { value: 12, label: "+12 Auckland, Anadyr" },
];

export const MatchPage = ({
    onChangeInfo,
    onChangeMileage,
    onChangePoint,
}: {
    onChangeMileage: (winMileage: number, loseMileage: number) => void;
    onChangePoint: (winPoint: number, losePoint: number) => void;
    onChangeInfo: (position: "my" | "op", info: Info) => void;
}) => {
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

    const handleGetHuamnAndBotInfo = async (playerAddress1: string) => {
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
        onChangeInfo("my", { ...player1Info, mark: UserMarkType.Circle });
        onChangeInfo("op", { ...player1Info, mark: UserMarkType.Cross });
        onChangePoint(player1Move.toNumber(), player1Move.toNumber());
        onChangeMileage(
            player1WinMileage.toNumber(),
            player1LoseMileage.toNumber(),
        );
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
    };

    const handleGetAllPlayerInfo = async () => {
        const [playerAddress1, playerAddress2] = await ethcallProvider.all([
            multiSkylabBidTacToeGameContract.player1(),
            multiSkylabBidTacToeGameContract.player2(),
        ]);

        console.log(
            playerAddress1,
            playerAddress2,
            "playerAddress1, playerAddress2",
        );

        if (playerAddress2 === botAddress[chainId]) {
            handleGetHuamnAndBotInfo(playerAddress1);
        } else {
            handleGetHuamnAndHumanInfo(playerAddress1, playerAddress2);
        }

        // console.log(tokenId1, tokenId2, "tokenId1, tokenId2");

        // const [
        //     account1,
        //     level1,
        //     mtadata1,
        //     point1,
        //     account2,
        //     level2,
        //     mtadata2,
        //     point2,
        //     player1Move,
        //     player2Move,
        //     [player1WinMileage, player1LoseMileage],
        //     [player2WinMileage, player2LoseMileage],
        // ] = await ethcallProvider.all([
        //     multiMercuryBaseContract.ownerOf(tokenId1),
        //     multiMercuryBaseContract.aviationLevels(tokenId1),
        //     multiMercuryBaseContract.tokenURI(tokenId1),
        //     multiMercuryBaseContract.aviationPoints(tokenId1),
        //     multiMercuryBaseContract.ownerOf(tokenId2),
        //     multiMercuryBaseContract.aviationLevels(tokenId2),
        //     multiMercuryBaseContract.tokenURI(tokenId2),
        //     multiMercuryBaseContract.aviationPoints(tokenId2),
        //     multiMercuryBaseContract.estimatePointsToMove(tokenId1, tokenId2),
        //     multiMercuryBaseContract.estimatePointsToMove(tokenId2, tokenId1),
        //     multiMercuryBaseContract.estimateMileageToGain(tokenId1, tokenId2),
        //     multiMercuryBaseContract.estimateMileageToGain(tokenId2, tokenId1),
        // ]);

        // const player1Info = {
        //     burner: playerAddress1,
        //     address: account1,
        //     point: point1.toNumber(),
        //     level: level1.toNumber(),
        //     img: getMetadataImg(mtadata1),
        // };
        // const player2Info = {
        //     burner: playerAddress2,
        //     address: account2,
        //     point: point2.toNumber(),
        //     level: level2.toNumber(),
        //     img: getMetadataImg(mtadata2),
        // };

        // if (player1Info.address === account) {
        //     onChangeInfo("my", { ...player1Info, mark: UserMarkType.Circle });
        //     onChangeInfo("op", { ...player2Info, mark: UserMarkType.Cross });
        //     onChangePoint(player1Move.toNumber(), player2Move.toNumber());
        //     onChangeMileage(
        //         player1WinMileage.toNumber(),
        //         player1LoseMileage.toNumber(),
        //     );
        // } else {
        //     onChangeInfo("my", { ...player2Info, mark: UserMarkType.Cross });
        //     onChangeInfo("op", { ...player1Info, mark: UserMarkType.Circle });
        //     onChangeMileage(
        //         player2WinMileage.toNumber(),
        //         player2LoseMileage.toNumber(),
        //     );
        //     onChangePoint(player2Move.toNumber(), player1Move.toNumber());
        // }
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
            <Box
                sx={{
                    borderRadius: "1.0417vw",
                    border: "3px solid #FDDC2D",
                    background: "rgba(255, 255, 255, 0.20)",
                    backdropFilter: "blur(0.9635vw)",
                    width: "60vw",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1vh",
                    padding: "1vh 1vw",
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Text sx={{ fontSize: "1.25vw" }}>
                        Join the game during{" "}
                        <span style={{ color: "#FFF761" }}>gathering time</span>{" "}
                        for faster opponent matching! Calculate your
                        personalized gathering time based on your time zone
                        here.
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "3vh",
                        }}
                    >
                        <Text sx={{ fontSize: "1.25vw" }}>Your time zone</Text>
                        <Box
                            sx={{
                                display: "flex",
                            }}
                        >
                            <Select
                                variant="unstyled"
                                sx={{
                                    width: "8vw",
                                    border: " 3px solid #FFF761",
                                    borderRadius: "0.5208vw",
                                    marginRight: "0.5208vw",
                                    height: "2.6042vw",
                                }}
                                value={zone}
                                onChange={(e) => {
                                    setZone(e.target.value);
                                }}
                            >
                                {zoneList.map((item) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={item.value}
                                        >
                                            {item.label}
                                        </option>
                                    );
                                })}
                            </Select>
                            <Text sx={{ fontSize: "1.875vw" }}> UTC</Text>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image src={zoneImg} w="80%" />
                </Box>
            </Box>
        </Box>
    );
};

export default MatchPage;
