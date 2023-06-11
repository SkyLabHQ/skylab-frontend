import { Box, Text, Image, Img, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import GameBackground from "../../../assets/game-win-background.png";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { shortenAddress } from "@/utils";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import useBurnerWallet, {
    ApproveGameState,
    BalanceState,
} from "@/hooks/useBurnerWallet";
import { calculateGasMargin } from "@/utils/web3Utils";
import useGameState from "@/hooks/useGameState";
import ShareBottom from "./shareBottom";
import TwCode from "@/assets/twcode.png";

type Props = {};

const Footer: FC<{ onNext: () => void }> = ({ onNext }) => {
    const navigate = useNavigate();

    return (
        <Box userSelect="none">
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="40px"
                left="1vw"
                top="14.5vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    navigate("/mercury?step=2");
                }}
            >
                Home
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="0.5vw"
                top="14.5vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    onNext();
                }}
            >
                Share
            </Text>
        </Box>
    );
};

export const GameWin: FC<Props> = ({}) => {
    const { onNext, map, myInfo, opInfo, tokenId, level } = useGameContext();
    const {
        approveForGame,
        getApproveGameState,
        getBalanceState,
        transferGas,
        burner,
    } = useBurnerWallet(tokenId);
    const [share, setShare] = useState(false);
    const toast = useToast();
    const [myPath, setMyPath] = useState<GridPosition[]>([]);
    const [myTime, setMyTime] = useState(0);
    const [opTime, setOpTime] = useState(0);
    const [opPath, setOpPath] = useState<GridPosition[]>([]);
    const [opGameState, setOpGameState] = useState(0);
    const [opUsedResources, setOpUsedResources] = useState({
        fuel: 0,
        battery: 0,
    });
    const [myUsedResources, setMyUsedResources] = useState({
        fuel: 0,
        battery: 0,
    });
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const getGameState = useGameState();

    const handleCleanUp = async () => {
        const state = await getGameState(tokenId);
        if (state === 5 || state === 6 || state === 7) {
            try {
                const balanceState = await getBalanceState();
                if (balanceState === BalanceState.LACK) {
                    await transferGas();
                }

                const approveState = await getApproveGameState();
                if (approveState === ApproveGameState.NOT_APPROVED) {
                    await approveForGame();
                }
                console.log("start postGameCleanUp");
                const gas = await skylabGameFlightRaceContract
                    .connect(burner)
                    .estimateGas.postGameCleanUp(tokenId);
                const res = await skylabGameFlightRaceContract
                    .connect(burner)
                    .postGameCleanUp(tokenId, {
                        gasLimit: calculateGasMargin(gas),
                    });
                await res.wait();
                console.log("success postGameCleanUp");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleGetOpponentPath = async () => {
        const opGameState = await getGameState(opInfo.tokenId);
        setOpGameState(opGameState);
        const time = await skylabGameFlightRaceContract.getOpponentFinalTime(
            tokenId,
        );
        const path = await skylabGameFlightRaceContract.getOpponentPath(
            tokenId,
        );
        const usedResources =
            await skylabGameFlightRaceContract.getOpponentUsedResources(
                tokenId,
            );
        setOpTime(time.toNumber());
        const opPath = [];
        const opUsedResources = {
            fuel: 0,
            battery: 0,
        };
        if (time.toNumber() !== 0) {
            for (let i = 1; i < path.length; i += 2) {
                opPath.push({
                    x: path[i].toNumber(),
                    y: path[i + 1].toNumber(),
                });
                opUsedResources.fuel += usedResources[i].toNumber();
                opUsedResources.battery += usedResources[i + 1].toNumber();
            }
            setOpPath(opPath);
            setOpUsedResources(opUsedResources);
        }

        const tokenInfo = localStorage.getItem("tokenInfo")
            ? JSON.parse(localStorage.getItem("tokenInfo"))
            : {};

        tokenInfo[tokenId].opTime = time;
        tokenInfo[tokenId].opPath = opPath;
        tokenInfo[tokenId].opUsedResources = opUsedResources;
        localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === "Enter" && event.shiftKey) {
                onNext();
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => document.removeEventListener("keydown", keyboardListener);
    }, []);

    useEffect(() => {
        handleCleanUp();
    }, []);

    // 获取我的信息
    useEffect(() => {
        try {
            const tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
            if (!tokenInfo[tokenId]) {
                return;
            }
            const usedResourcesList = tokenInfo[tokenId].used_resources
                ? tokenInfo[tokenId].used_resources
                : [];
            const myUsedResources = {
                fuel: 0,
                battery: 0,
            };
            usedResourcesList.forEach((item: number) => {
                myUsedResources.fuel += item[0];
                myUsedResources.battery += item[1];
            });
            setMyUsedResources(myUsedResources);
            const myTime = tokenInfo[tokenId].time
                ? tokenInfo[tokenId].time
                : 0;
            setMyTime(myTime);
            const mapPath = tokenInfo[tokenId].path
                ? tokenInfo[tokenId].path
                : [];
            const path = [];
            for (let i = 0; i < mapPath.length; i++) {
                if (mapPath[i][0] === 7 && mapPath[i][1] === 7) {
                    path.push({ x: 7, y: 7 });
                    break;
                } else {
                    path.push({ x: mapPath[i][0], y: mapPath[i][1] });
                }
            }

            setMyPath(path);
        } catch (error: any) {
            toast({
                position: "top",
                render: () => <SkyToast message={error + ""}></SkyToast>,
            });
        }
    }, []);

    // 获取对手的信息
    useEffect(() => {
        if (!opInfo.tokenId || !skylabGameFlightRaceContract) {
            return;
        }
        handleGetOpponentPath();
    }, [opInfo.tokenId, skylabGameFlightRaceContract]);

    return (
        <>
            {share ? (
                <Box
                    onClick={() => {
                        setShare(false);
                    }}
                    height="100vh"
                    padding="50px 50px 83px"
                    bg={"linear-gradient(180deg, #000000 0%, #7A6FAD 100%)"}
                >
                    <Box
                        id="share-content"
                        pos="relative"
                        bgImage={GameBackground}
                        bgRepeat="no-repeat"
                        height="100%"
                        bgSize="100% 100%"
                        overflow="hidden"
                    >
                        <Image
                            w="450px"
                            pos="absolute"
                            left="15vw"
                            bottom="35vh"
                            src={MetadataPlaneImg(myInfo?.level)}
                        />
                        <Box pos="absolute" left="6vw" bottom="20vh">
                            <Info
                                win={true}
                                mine={{
                                    id: shortenAddress(myInfo?.address, 4, 4),
                                    time: myTime,
                                    avatar: MetadataPlaneImg(myInfo?.level),
                                    usedResources: myUsedResources,
                                }}
                                opponent={{
                                    id: shortenAddress(opInfo?.address, 4, 4),
                                    time: opTime,
                                    avatar: MetadataPlaneImg(opInfo?.level),
                                    usedResources: opUsedResources,
                                }}
                            />
                        </Box>

                        <Box
                            pos="absolute"
                            right="12vw"
                            bottom="8vh"
                            userSelect="none"
                        >
                            <ResultMap
                                map={map}
                                myPath={myPath}
                                opPath={opPath}
                                width={32}
                            />
                        </Box>
                        <Image
                            src={TwCode}
                            sx={{ width: "6.25vw" }}
                            pos="absolute"
                            right="2vw"
                            bottom={"8vh"}
                        ></Image>
                    </Box>
                    <ShareBottom
                        myLevel={level + 1}
                        myBattery={myUsedResources.battery}
                        myFuel={myUsedResources.fuel}
                        opLevel={level - 1}
                        opBattery={opUsedResources.battery}
                        opFuel={opUsedResources.fuel}
                        win={true}
                    ></ShareBottom>
                </Box>
            ) : (
                <Box
                    pos="relative"
                    bgImage={GameBackground}
                    bgRepeat="no-repeat"
                    height="100vh"
                    bgSize="100% 100%"
                    overflow="hidden"
                >
                    <Image
                        w="45vw"
                        pos="absolute"
                        left="2vw"
                        bottom="8vh"
                        src={MetadataPlaneImg(level)}
                    />

                    <Box pos="absolute" left="43vw" top="30vh">
                        <Info
                            showRetreat={opGameState === 7}
                            win={true}
                            mine={{
                                id: shortenAddress(myInfo?.address, 4, 4),
                                time: myTime,
                                avatar: MetadataPlaneImg(level),
                                usedResources: myUsedResources,
                            }}
                            opponent={{
                                id: shortenAddress(opInfo?.address, 4, 4),
                                time: opTime,
                                avatar: MetadataPlaneImg(level),
                                usedResources: opUsedResources,
                            }}
                        />
                    </Box>

                    <Footer
                        onNext={() => {
                            setShare(true);
                        }}
                    />

                    <Box
                        pos="absolute"
                        left="52vw"
                        bottom="8vh"
                        userSelect="none"
                    >
                        <ResultMap map={map} myPath={myPath} opPath={opPath} />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default GameWin;
