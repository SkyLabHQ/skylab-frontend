import { Box, Text, Image, Img, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import GameBackground from "../../../assets/game-win-background.png";
import Aviation from "../../../assets/aviation-4.svg";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { shortenAddress } from "@/utils";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import useBurnerWallet from "@/hooks/useBurnerWallet";

type Props = {};

const Footer: FC<{ onNext: (nextStep: number) => void }> = ({ onNext }) => {
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
                    onNext(10);
                }}
            >
                Share
            </Text>
        </Box>
    );
};

export const GameWin: FC<Props> = ({}) => {
    const { onNext, map, myInfo, opInfo, tokenId, level } = useGameContext();
    const { burner, approveForGame } = useBurnerWallet(tokenId);
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
                await approveForGame();

                const res = await skylabGameFlightRaceContract
                    .connect(burner)
                    .postGameCleanUp(tokenId);
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
            <Image
                w="45vw"
                pos="absolute"
                left="2vw"
                bottom="8vh"
                src={Aviation}
            />

            <Box pos="absolute" left="43vw" top="36vh">
                <Info
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

            <Footer onNext={onNext} />

            <Box pos="absolute" left="52vw" bottom="8vh" userSelect="none">
                <ResultMap map={map} myPath={myPath} opPath={opPath} />
            </Box>
        </Box>
    );
};

export default GameWin;
