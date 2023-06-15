import { Box, Text, Image, Img, Toast, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

import GameBackground from "../../../assets/game-background.png";
import GameFooter from "../../../assets/game-footer.png";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
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
import getMetaDataImg from "@/skyConstants/metadata";
import { downLevel, upLevel } from "../utils";
import { deleteTokenInfo } from "@/utils/tokenInfo";
import Pilot from "@/assets/player04.png";

type Props = {};

const Footer: FC<{ onNext: (nextStep: number) => void }> = ({ onNext }) => {
    const navigate = useNavigate();

    return (
        <Box userSelect="none">
            <Img
                pos="absolute"
                left="0"
                bottom="0"
                src={GameFooter}
                h="63vh"
                w="100vw"
                pointerEvents="none"
            />
            <Text
                textAlign="center"
                pos="absolute"
                width="12vw"
                minWidth="100px"
                fontSize="40px"
                left="1vw"
                bottom="2vh"
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
                width="30vw"
                minWidth="480px"
                fontSize="48px"
                left="35vw"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                Try it next time!
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="40px"
                right="0.5vw"
                bottom="2vh"
                color="rgb(22, 25, 87)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    onNext(9);
                }}
            >
                Share
            </Text>
        </Box>
    );
};

export const GameLose: FC<Props> = ({}) => {
    const { onNext, map, myInfo, opInfo, tokenId, level } = useGameContext();
    const [share, setShare] = useState(false);
    const {
        approveForGame,
        getApproveGameState,
        getBalanceState,
        transferGas,
        burner,
    } = useBurnerWallet(tokenId);
    const [myPilot, setMyPilot] = useState("");
    const [opPilot, setOpPilot] = useState("");
    const toast = useToast();
    const [myPath, setMyPath] = useState<GridPosition[]>([]);
    const [myTime, setMyTime] = useState(0);
    const [opTime, setOpTime] = useState(0);
    const [opPath, setOpPath] = useState<GridPosition[]>([]);
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
                deleteTokenInfo(tokenId);
                console.log("success postGameCleanUp");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleGetOpponentPath = async () => {
        const time = await skylabGameFlightRaceContract.getOpponentFinalTime(
            tokenId,
        );
        if (time.toNumber() === 0) {
            return;
        }
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
        // handleCleanUp();
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
                    height="100vh"
                    padding="4.6vh 2.6vw 7.6vh"
                    bg={"linear-gradient(180deg, #000000 0%, #7A6FAD 100%)"}
                    pos="relative"
                    onClick={() => {
                        setShare(false);
                    }}
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
                        <Text
                            sx={{
                                position: "absolute",
                                left: "50%",
                                bottom: "3vh",
                                fontSize: "32px",
                                transform: "translateX(-50%)",
                            }}
                            fontFamily="Orbitron"
                        >
                            Trailblazer on Project Mercury
                        </Text>
                        <Box pos="absolute" left="2vw" bottom="34vh">
                            <Info
                                win={true}
                                mine={{
                                    id: shortenAddress(myInfo?.address, 4, 4),
                                    time: myTime,
                                    avatar: myPilot ? myPilot : Pilot,
                                    usedResources: myUsedResources,
                                }}
                                opponent={{
                                    id: shortenAddress(opInfo?.address, 4, 4),
                                    time: opTime,
                                    avatar: opPilot ? opPilot : Pilot,
                                    usedResources: opUsedResources,
                                }}
                            />
                        </Box>
                        <Image
                            w="300px"
                            pos="absolute"
                            left="10vw"
                            top="4vh"
                            src={myInfo.img}
                        />
                        <Box
                            pos="absolute"
                            right="12vw"
                            bottom="22vh"
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
                            bottom="22vh"
                        ></Image>
                    </Box>
                    <ShareBottom
                        myLevel={downLevel(myInfo.level)}
                        myBattery={myUsedResources.battery}
                        myFuel={myUsedResources.fuel}
                        opLevel={upLevel(opInfo.level)}
                        opBattery={opUsedResources.battery}
                        opFuel={opUsedResources.fuel}
                        win={false}
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
                    <Box
                        bg="linear-gradient(90deg, rgba(66, 0, 255, 0) -6.14%, rgba(82, 0, 255, 0.46) 106.26%)"
                        w="65vw"
                        pl="20vw"
                        pos="absolute"
                        right="0"
                        top="0"
                        userSelect="none"
                        textAlign="center"
                    >
                        <Text
                            fontFamily="Orbitron"
                            fontSize="96px"
                            fontWeight="600"
                            color="white"
                        >
                            YOU LOSE
                        </Text>
                    </Box>

                    <Box pos="absolute" right="6vw" top="18vh">
                        <Info
                            win={true}
                            mine={{
                                id: shortenAddress(myInfo?.address, 4, 4),
                                time: myTime,
                                avatar: myPilot ? myPilot : Pilot,
                                usedResources: myUsedResources,
                            }}
                            opponent={{
                                id: shortenAddress(opInfo?.address, 4, 4),
                                time: opTime,
                                avatar: opPilot ? opPilot : Pilot,
                                usedResources: opUsedResources,
                            }}
                        />
                    </Box>

                    <Image
                        w="36vw"
                        pos="absolute"
                        left="0"
                        top="18vh"
                        src={getMetaDataImg(upLevel(myInfo.level))}
                    />

                    <Footer
                        onNext={() => {
                            setShare(true);
                        }}
                    />

                    <Box
                        pos="absolute"
                        left="63vw"
                        top="45vh"
                        userSelect="none"
                    >
                        <ResultMap map={map} myPath={myPath} opPath={opPath} />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default GameLose;
