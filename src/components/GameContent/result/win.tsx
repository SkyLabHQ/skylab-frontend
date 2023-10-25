import { Box, Text, Image, Img, useToast } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import GameBackground from "../../../assets/game-win-background.png";
import { useGameContext } from "../../../pages/Game";
import { GridPosition, ResultMap } from "../map";
import { Info } from "./info";
import { shortenAddress } from "@/utils";
import { useSkylabTestFlightContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import ShareBottom from "./shareBottom";
import TwCode from "@/assets/twcode.png";
import {
    deleteTokenInfo,
    getTokenInfo,
    getTokenInfoValue,
} from "@/utils/tokenInfo";
import Pilot from "../assets/pilot.png";
import handleIpfsImg from "@/utils/ipfsImg";
import { ContractType, useRetryContractCall } from "@/hooks/useRetryContract";
import { ZERO_DATA } from "@/skyConstants";

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
                fontSize="36px"
                left="1vw"
                top="14.5vh"
                color="rgb(190, 190, 192)"
                cursor="pointer"
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={() => {
                    navigate("/activities", { replace: true });
                }}
            >
                Home
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="13.5vw"
                minWidth="100px"
                fontSize="36px"
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
    const { onNext, map, myInfo, opInfo, tokenId, opTokenId } =
        useGameContext();
    const [init1, setInit1] = useState(false);
    const [init2, setInit2] = useState(false);
    const retryContractCall = useRetryContractCall();
    const [myLevel, setMyLevel] = useState(0);
    const [myPlaneImg, setMyPlaneImg] = useState("");
    const [opLevel, setOpLevel] = useState(0);
    const [myPilot, setMyPilot] = useState("");
    const [opPilot, setOpPilot] = useState("");
    const [share, setShare] = useState(false);
    const toast = useToast({
        position: "top",
    });
    const [myPath, setMyPath] = useState<GridPosition[]>([]);
    const [myTime, setMyTime] = useState(0);
    const [opTime, setOpTime] = useState(0);
    const [opPath, setOpPath] = useState<GridPosition[]>([]);
    const [opGameState, setOpGameState] = useState(0);
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

    const handleGetPilot = async () => {
        const res = await skylabTestFlightContract._aviationPilotAddresses(
            tokenId,
        );
        console.log(res, "pilot");
        if (res !== ZERO_DATA) {
        }
    };

    const handleGetOpponentPath = async () => {
        const tokenInfo = getTokenInfo(tokenId);
        const { opState, opTime, opPath, opUsedResources, opAccount, opLevel } =
            tokenInfo;
        setOpAccount(opAccount);
        setOpGameState(Number(opState));
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
            const [myMetadata] = await Promise.all([
                skylabTestFlightContract.tokenURI(tokenId),
            ]);
            const base64String = myMetadata;
            const jsonString = window.atob(
                base64String.substr(base64String.indexOf(",") + 1),
            );
            const jsonObject = JSON.parse(jsonString);
            setMyPlaneImg(handleIpfsImg(jsonObject.image));

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

    useEffect(() => {
        handleGetPilot();
    }, []);

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
                        {myPlaneImg && (
                            <Image
                                w="450px"
                                pos="absolute"
                                left="15vw"
                                bottom="35vh"
                                src={myPlaneImg}
                            />
                        )}
                        <Box pos="absolute" left="6vw" bottom="20vh">
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
                        myLevel={myLevel}
                        myBattery={myUsedResources.battery}
                        myFuel={myUsedResources.fuel}
                        opLevel={opLevel}
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
                    {myPlaneImg && (
                        <Image
                            w="45vw"
                            pos="absolute"
                            left="2vw"
                            bottom="8vh"
                            src={myPlaneImg}
                        />
                    )}
                    <Box pos="absolute" left="43vw" top="30vh">
                        <Info
                            showRetreat={opGameState === 7}
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
