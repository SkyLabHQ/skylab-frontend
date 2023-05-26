import { Box, Text, Image, Img, Toast, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

import GameBackground from "../../../assets/game-background.png";
import GameFooter from "../../../assets/game-footer.png";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { generateLoseText } from "../utils";
import { Info } from "./info";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { shortenAddress } from "@/utils";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";

type Props = {};

const Footer: FC<{ onNext: (nextStep: number) => void }> = ({ onNext }) => {
    const text = generateLoseText({
        myLevel: 4,
        myBattery: 15,
        myFuel: 100000,
        opponentLevel: 3,
        opponentBattery: 10,
        opponentFuel: 12,
    });
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
                    onNext(9);
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
    const { onNext, map, myInfo, opInfo, tokenId } = useGameContext();
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
    const [loading, setLoading] = useState(false);
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    // 获取游戏状态
    const getGameState = async (tokenId: number) => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        return state.toNumber();
    };
    const handleCleanUp = async () => {
        const state = await getGameState(tokenId);
        if (state === 5 || state === 6 || state === 7) {
            try {
                setLoading(true);
                const res = await skylabGameFlightRaceContract.postGameCleanUp(
                    tokenId,
                );
                await res.wait();
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const handleGetOpponentPath = async () => {
        const time = await skylabGameFlightRaceContract.getOpponentFinalTime(
            opInfo.tokenId,
        );
        const path = await skylabGameFlightRaceContract.getOpponentPath(
            opInfo.tokenId,
        );

        const usedResources =
            await skylabGameFlightRaceContract.getOpponentUsedResources(
                opInfo.tokenId,
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

            <Box pos="absolute" right="6vw" top="21vh">
                <Info
                    win={true}
                    mine={{
                        id: shortenAddress(myInfo?.address, 4, 4),
                        time: myTime,
                        avatar: MetadataPlaneImg(myInfo?.tokenId),
                        usedResources: myUsedResources,
                    }}
                    opponent={{
                        id: shortenAddress(opInfo?.address, 4, 4),
                        time: opTime,
                        avatar: MetadataPlaneImg(opInfo?.tokenId),
                        usedResources: opUsedResources,
                    }}
                />
            </Box>

            <Image
                w="36vw"
                pos="absolute"
                left="0"
                top="18vh"
                src={MetadataPlaneImg(myInfo.tokenId)}
            />

            <Footer onNext={onNext} />

            <Box pos="absolute" left="63vw" top="45vh" userSelect="none">
                <ResultMap map={map} myPath={myPath} opPath={opPath} />
            </Box>
        </Box>
    );
};

export default GameLose;
