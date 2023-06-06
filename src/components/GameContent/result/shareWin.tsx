import { Box, Text, Image, Img, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import TwCode from "@/assets/twcode.png";

import GameBackground from "../assets/share_win.png";
import Aviation from "../../../assets/aviation-4.svg";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { shortenAddress } from "@/utils";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";
import ShareBottom from "./shareBottom";

type Props = {};

export const ShareGameWin: FC<Props> = ({}) => {
    const { onNext, map, myInfo, opInfo, tokenId, level } = useGameContext();
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

    const handleGetOpponentPath = async () => {
        const time = await skylabGameFlightRaceContract.getOpponentFinalTime(
            opInfo.tokenId,
        );
        if (time.toNumber() === 0) {
            return;
        }
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
                    src={Aviation}
                />

                <Box pos="absolute" left="6vw" bottom="20vh">
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

                <Box pos="absolute" right="12vw" bottom="8vh" userSelect="none">
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
    );
};

export default ShareGameWin;
