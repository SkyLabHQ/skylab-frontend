import { Box, Text, Image, Img, Toast, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import GameBackground from "../../../assets/game-background.png";
import GameFooter from "../../../assets/game-footer.png";
import BrokenAviation from "../assets/broken-aviation.png";

import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
import { shortenAddress } from "@/utils";
import { useSkylabTestFlightContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import ShareBottom from "./shareBottom";
import TwCode from "@/assets/twcode.png";
import { deleteTokenInfo, getTokenInfo } from "@/utils/tokenInfo";
import Pilot from "../assets/pilot.png";
import handleIpfsImg from "@/utils/ipfsImg";
import { ContractType, useRetryContractCall } from "@/hooks/useRetryContract";

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
                fontSize="36px"
                left="1vw"
                bottom="2vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    navigate("/trailblazer", { replace: true });
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
                fontSize="36px"
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
    const { onNext, map, myInfo, opInfo, tokenId, opTokenId } =
        useGameContext();
    const [init1, setInit1] = useState(false);
    const [init2, setInit2] = useState(false);
    const retryContractCall = useRetryContractCall();
    const [myLevel, setMyLevel] = useState(0);
    const [myPlaneImg, setMyPlaneImg] = useState(null);
    const [opLevel, setOpLevel] = useState(0);
    const [share, setShare] = useState(false);
    const [myPilot, setMyPilot] = useState("");
    const [opPilot, setOpPilot] = useState("");
    const toast = useToast({
        position: "top",
    });
    const [myPath, setMyPath] = useState<GridPosition[]>([]);
    const [myTime, setMyTime] = useState(0);
    const [opTime, setOpTime] = useState(0);
    const [opPath, setOpPath] = useState<GridPosition[]>([]);
    const [opUsedResources, setOpUsedResources] = useState({
        fuel: 0,
        battery: 0,
    });
    const [opAccount, setOpAccount] = useState("");
    const [myUsedResources, setMyUsedResources] = useState({
        fuel: 0,
        battery: 0,
    });
    const skylabTestFlightContract = useSkylabTestFlightContract();

    const handleGetOpponentPath = async () => {
        const tokenInfo = getTokenInfo(tokenId);
        const { opTime, opPath, opUsedResources, opAccount, opLevel } =
            tokenInfo;
        setOpAccount(opAccount);
        setOpTime(opTime);
        setOpLevel(opLevel);
        const path = [];
        const usedResources = {
            fuel: 0,
            battery: 0,
        };
        if (opTime !== 0) {
            for (let i = 1; i < opPath.length; i += 2) {
                path.push({
                    x: opPath[i],
                    y: opPath[i + 1],
                });
                usedResources.fuel += opUsedResources[i];
                usedResources.battery += opUsedResources[i + 1];
            }
            setOpPath(path);
            setOpUsedResources(usedResources);
        }
        setInit2(true);
    };
    const handleGetMyInfo = async () => {
        try {
            const tokenInfo = getTokenInfo(tokenId);

            const { myState, myLevel, myTime, myPath, myUsedResources } =
                tokenInfo;
            setMyLevel(myLevel);

            if (Number(myLevel) >= 2) {
                const myMetadata = await skylabTestFlightContract.tokenURI(
                    tokenId,
                );
                const base64String = myMetadata;
                const jsonString = window.atob(
                    base64String.substr(base64String.indexOf(",") + 1),
                );
                const jsonObject = JSON.parse(jsonString);
                setMyPlaneImg(handleIpfsImg(jsonObject.image));
            } else {
                setMyPlaneImg("");
            }

            const usedResources = {
                fuel: 0,
                battery: 0,
            };
            myUsedResources?.forEach((item: number) => {
                usedResources.fuel += item[0];
                usedResources.battery += item[1];
            });
            setMyUsedResources(usedResources);
            const time = myTime ? myTime : 0;
            setMyTime(time);
            const path = [];

            for (let i = 0; i < myPath?.length; i++) {
                if (myPath[i][0] === 7 && myPath[i][1] === 7) {
                    path.push({ x: 7, y: 7 });
                    break;
                } else {
                    path.push({ x: myPath[i][0], y: myPath[i][1] });
                }
            }

            setMyPath(path);
        } catch (error: any) {
            toast({
                render: () => <SkyToast message={error + ""}></SkyToast>,
            });
        } finally {
            setInit1(true);
        }
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
        handleGetMyInfo();
    }, [tokenId]);

    // 获取对手的信息
    useEffect(() => {
        handleGetOpponentPath();
    }, []);

    useEffect(() => {
        if (!init1 || !init2) {
            return;
        }
        deleteTokenInfo(tokenId);
    }, [init1, init2, tokenId]);

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
                                    id: shortenAddress(opAccount, 4, 4),
                                    time: opTime,
                                    avatar: opPilot ? opPilot : Pilot,
                                    usedResources: opUsedResources,
                                }}
                            />
                        </Box>
                        {myPlaneImg === null ? null : (
                            <Image
                                w="300px"
                                pos="absolute"
                                left="10vw"
                                top="4vh"
                                src={
                                    myPlaneImg === ""
                                        ? BrokenAviation
                                        : myPlaneImg
                                }
                            />
                        )}
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
                        myLevel={myLevel}
                        myBattery={myUsedResources.battery}
                        myFuel={myUsedResources.fuel}
                        opLevel={opLevel}
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
                                id: shortenAddress(opAccount, 4, 4),
                                time: opTime,
                                avatar: opPilot ? opPilot : Pilot,
                                usedResources: opUsedResources,
                            }}
                        />
                    </Box>

                    {myPlaneImg === null ? null : (
                        <Image
                            w="36vw"
                            pos="absolute"
                            left="0"
                            top="18vh"
                            src={
                                myPlaneImg === "" ? BrokenAviation : myPlaneImg
                            }
                        />
                    )}
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
