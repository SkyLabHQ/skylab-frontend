import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Img, Select, Text } from "@chakra-ui/react";
import GatherTimeResult from "@/components/GameContent/assets/gatherTimeResult.svg";
import GatherTimeResult1 from "@/components/GameContent/assets/gatherTimeResult1.svg";
import GatherTimeResult2 from "@/components/GameContent/assets/gatherTimeResult2.svg";
import GatherTimeResult3 from "@/components/GameContent/assets/gatherTimeResult3.svg";
import { Info, UserMarkType, useGameContext } from "@/pages/TacToe";
import { motion } from "framer-motion";
import LoadingIcon from "@/assets/loading.svg";
import {
    useBidTacToeFactoryRetry,
    useBidTacToeGameRetry,
} from "@/hooks/useRetryContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import {
    useMultiProvider,
    useMultiSkylabTestFlightContract,
} from "@/hooks/useMutilContract";
import { useBlockNumber } from "@/contexts/BlockNumber";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useNavigate } from "react-router-dom";
import ToolBar from "./Toolbar";

const PlaneImg = ({ detail, flip }: { detail: Info; flip?: boolean }) => {
    return (
        <>
            {detail?.level ? (
                <Box>
                    <Img
                        src={detail?.img}
                        sx={{
                            width: "280px",
                            height: "280px",
                            transform: flip ? "scaleX(-1)" : "",
                            /*兼容IE*/
                            filter: "FlipH",
                        }}
                    ></Img>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: "280px",
                        height: "280px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <motion.img
                        src={LoadingIcon}
                        style={{
                            width: "120px",
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
}: {
    onChangeInfo: (position: "my" | "op", info: Info) => void;
}) => {
    const navigate = useNavigate();
    const { account } = useActiveWeb3React();
    const { blockNumber } = useBlockNumber();
    const ethcallProvider = useMultiProvider();
    const multiSkylabTestFlightContract = useMultiSkylabTestFlightContract();

    const { myInfo, opInfo, bidTacToeGameAddress, onStep, tokenId } =
        useGameContext();

    const [zone, setZone] = useState("-4");
    const [player1, setPlayer1] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        point: 0,
        img: "",
        mark: UserMarkType.Circle,
    });
    const [player2, setPlayer2] = useState<Info>({
        burner: "",
        address: "",
        level: 0,
        point: 0,
        img: "",
        mark: UserMarkType.Cross,
    });
    const { tacToeGameRetryCall } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );

    const { tacToeFactoryRetryCall } = useBidTacToeFactoryRetry(tokenId);

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

    const handleGetPlayerInfo = async (player: string) => {
        if (player === "0x0000000000000000000000000000000000000000") {
            return {
                burner: "",
                address: "",
                level: 0,
                img: "",
                point: 0,
            };
        }

        const tokenId = await tacToeFactoryRetryCall("burnerAddressToTokenId", [
            player,
        ]);
        if (tokenId.toNumber() === 0) {
            return {
                burner: player,
                address: "",
                level: 0,
                img: "",
                point: 0,
            };
        }

        await ethcallProvider.init();
        const [account, level, mtadata, point] = await ethcallProvider.all([
            multiSkylabTestFlightContract.ownerOf(tokenId),
            multiSkylabTestFlightContract._aviationLevels(tokenId),
            multiSkylabTestFlightContract.tokenURI(tokenId),
            multiSkylabTestFlightContract._aviationPoints(tokenId),
        ]);

        return {
            burner: player,
            address: account,
            point: point.toNumber(),
            level: level.toNumber(),
            img: getMetadataImg(mtadata),
        };
    };

    const handleGetPlayer1Info = async () => {
        const playerAddress = await tacToeGameRetryCall("player1");
        const playInfo = await handleGetPlayerInfo(playerAddress);
        setPlayer1({ ...playInfo, mark: UserMarkType.Circle });
        if (playInfo.address === account) {
            onChangeInfo("my", { ...playInfo, mark: UserMarkType.Circle });
        } else {
            onChangeInfo("op", { ...playInfo, mark: UserMarkType.Circle });
        }
    };

    const handleGetPlayer2Info = async () => {
        const playerAddress = await tacToeGameRetryCall("player2");
        const playInfo = await handleGetPlayerInfo(playerAddress);
        setPlayer2({ ...playInfo, mark: UserMarkType.Cross });
        if (playInfo.address === account) {
            onChangeInfo("my", { ...playInfo, mark: UserMarkType.Cross });
        } else {
            onChangeInfo("op", { ...playInfo, mark: UserMarkType.Cross });
        }
    };

    useEffect(() => {
        if (
            !tacToeGameRetryCall ||
            !tacToeFactoryRetryCall ||
            player1.level !== 0
        )
            return;
        handleGetPlayer1Info();
    }, [blockNumber, tacToeGameRetryCall, tacToeFactoryRetryCall]);

    useEffect(() => {
        if (
            !tacToeGameRetryCall ||
            !tacToeFactoryRetryCall ||
            player2.level !== 0
        )
            return;
        handleGetPlayer2Info();
    }, [blockNumber, tacToeGameRetryCall, tacToeFactoryRetryCall]);

    useEffect(() => {
        if (player1.address && player2.address) {
            if (player1.address !== account && player2.address !== account) {
                navigate("/activities");
                return;
            }
            onStep(1);
        }
    }, [player1, player2, account]);

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
            paddingTop={"1vh"}
        >
            <ToolBar></ToolBar>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "1vh",
                }}
            >
                <PlaneImg detail={myInfo}></PlaneImg>
                <Text sx={{ fontSize: "48px", margin: "0 30px" }}>VS</Text>
                <PlaneImg detail={opInfo} flip={true}></PlaneImg>
            </Box>
            <Box
                sx={{
                    borderRadius: "20px",
                    border: "3px solid #FDDC2D",
                    background: "rgba(255, 255, 255, 0.20)",
                    backdropFilter: "blur(18.5px)",
                    width: "60vw",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1vh",
                    padding: "1vh 1vw",
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Text sx={{ fontSize: "24px" }}>
                        Join the game during{" "}
                        <span style={{ color: "#FFF761" }}>gathering time</span>{" "}
                        for faster component matching! Calculate your
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
                        <Text sx={{ fontSize: "24px" }}>Your time zone</Text>
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
                                    borderRadius: "10px",
                                    marginRight: "10px",
                                    height: "50px",
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
                            <Text sx={{ fontSize: "36px" }}> UTC</Text>
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
                    <Img src={zoneImg} w="80%" />
                </Box>
            </Box>
        </Box>
    );
};

export default MatchPage;
