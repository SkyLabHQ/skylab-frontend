import { Box, Image } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import Download from "@/assets/download.svg";
import Tw from "@/assets/white-tw.svg";
import TwCode from "@/assets/twcode.png";

import GameBackground from "../assets/share_lose.png";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
import MetadataPlaneImg from "@/skyConstants/metadata";
import { shortenAddress } from "@/utils";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";

type Props = {};

export const ShareGameLose: FC<Props> = ({}) => {
    const { onNext, map, myInfo, opInfo, tokenId } = useGameContext();

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

    const onShare = async () => {
        const content = document.getElementById("share-content");
        const canvas = await html2canvas(content);
        canvas.toBlob((blob) => {
            if (!blob) {
                return;
            }
            saveAs(blob, "my_image.jpg");
        });
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

    // 获取我的信息
    useEffect(() => {
        const tokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
        const usedResourcesList = tokenInfo[tokenId].used_resources;
        const myUsedResources = {
            fuel: 0,
            battery: 0,
        };
        usedResourcesList.forEach((item: number) => {
            myUsedResources.fuel += item[0];
            myUsedResources.battery += item[1];
        });
        setMyUsedResources(myUsedResources);
        const myTime = tokenInfo[tokenId].time;
        setMyTime(myTime);
        const mapPath = tokenInfo[tokenId].path;
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
    }, []);

    // 获取对手的信息
    useEffect(() => {
        if (!tokenId || !skylabGameFlightRaceContract) {
            return;
        }
        handleGetOpponentPath();
    }, [tokenId, skylabGameFlightRaceContract]);

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
                <Box pos="absolute" left="2vw" bottom="24vh">
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
                    w="300px"
                    pos="absolute"
                    left="10vw"
                    top="4vh"
                    src={MetadataPlaneImg(myInfo.tokenId)}
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
                    sx={{ width: "120px" }}
                    pos="absolute"
                    right="2vw"
                    bottom="22vh"
                ></Image>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "13px",
                }}
            >
                <Box
                    sx={{
                        width: "95px",
                        height: "56px",
                        background: "rgba(217, 217, 217, 0.5)",
                        border: "1px solid #FFFFFF",
                        borderRadius: "209px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 28px",
                        cursor: "pointer",
                    }}
                    onClick={onShare}
                >
                    <Image src={Download}></Image>
                </Box>
                <Box
                    sx={{
                        width: "95px",
                        height: "56px",
                        background: "rgba(217, 217, 217, 0.5)",
                        border: "1px solid #FFFFFF",
                        borderRadius: "209px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 28px",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        window.open(
                            "https://twitter.com/skylabhq?s=21&t=3tvwVYYbX3FtWjnf7IBmAA",
                        );
                    }}
                >
                    <Image src={Tw}></Image>
                </Box>
            </Box>
        </Box>
    );
};

export default ShareGameLose;
