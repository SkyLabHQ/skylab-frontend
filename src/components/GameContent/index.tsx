import React, { FC, useEffect, useRef, useState } from "react";
import {
    Box,
    Text,
    Image,
    VStack,
    HStack,
    Img,
    useClipboard,
    useToast,
} from "@chakra-ui/react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";
import BatteryIcon from "../../assets/icon-battery.svg";
import FuelIcon from "../../assets/icon-fuel.svg";
import { useGameContext } from "../../pages/Game";
import { Map } from "./map";
import { Header } from "./header";
import { TutorialGroup } from "./tutorialGroup";
import { shortenAddress } from "@/utils";
import useGameState from "@/hooks/useGameState";
import SkyToast from "../Toast";
import CallTimeOut from "./CallTimeOut";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";

type Props = {};

type AviationPanelProps = {
    img: string;
    direction: string;
    aviationInfo: {
        name: string;
        fuel: number;
        battery: number;
        color: string;
        textColor: string;
        avatarStyle: Record<string, string>;
    };
};

export type MapInfo = {
    role: "normal" | "start" | "end";
    distance?: number;
    fuelScaler?: number;
    batteryScaler?: number;
    selected?: boolean;
    hover?: boolean;
    fuelLoad?: number;
    batteryLoad?: number;
    time?: number;
};

export type ActualPathInfo = {
    x: number;
    y: number;
    fuelLoad: number;
    batteryLoad: number;
};

const AviationPanel: FC<AviationPanelProps> = ({
    img,
    direction,
    aviationInfo: { name, fuel, battery, color, textColor, avatarStyle },
}) => {
    const { onCopy } = useClipboard(name ?? "");
    const toast = useToast({
        position: "top",
    });
    return (
        <VStack spacing="0.5vw" width="22vw" alignItems={direction}>
            <Box w="8vw" h="8vw" {...avatarStyle}>
                <Image src={img} w="8vw" />
            </Box>
            <VStack
                bg="rgba(217, 217, 217, 0.2)"
                padding="1vh 1vw 2vh"
                borderRadius="16px"
                alignItems="flex-start"
                width="100%"
                spacing={"0"}
            >
                <Text
                    fontFamily="Quantico"
                    color={color}
                    fontSize="30px"
                    mt="0.5vh"
                    mb="0.5vh"
                    onClick={() => {
                        onCopy();
                        toast({
                            render: () => (
                                <SkyToast
                                    message={"Successful copy address"}
                                ></SkyToast>
                            ),
                        });
                    }}
                    cursor="pointer"
                >
                    {shortenAddress(name)}
                </Text>
                <HStack w="100%">
                    <Image src={FuelIcon} w="5vw" h="5vw" />
                    <HStack
                        fontFamily="Quantico"
                        color={textColor}
                        fontSize="30px"
                        justifyContent="space-between"
                        flex="1"
                    >
                        <Text>Fuel</Text>
                        <Text>{fuel}</Text>
                    </HStack>
                </HStack>
                <HStack w="100%">
                    <Image src={BatteryIcon} w="5vw" h="5vw" />
                    <HStack
                        fontFamily="Quantico"
                        color={textColor}
                        fontSize="30px"
                        justifyContent="space-between"
                        flex="1"
                    >
                        <Text>Battery</Text>
                        <Text>{battery}</Text>
                    </HStack>
                </HStack>
            </VStack>
        </VStack>
    );
};

const Footer: FC<{ onNext: () => void; onQuit: () => void }> = ({
    onNext,
    onQuit,
}) => {
    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "Escape":
                    onQuit();
                    break;
            }
            if (event.shiftKey && key === "Enter") {
                onNext();
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);
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
                onClick={onQuit}
            >
                Quit
            </Text>
            <Box
                sx={{
                    position: "absolute",
                    left: "14vw",
                    bottom: "4.5vh",
                    width: "3.4vw",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "10px",
                }}
            >
                <Text sx={{ fontSize: "14px", fontWeight: 600 }}>Esc</Text>
            </Box>
            <Text
                textAlign="center"
                pos="absolute"
                width="30vw"
                minWidth="480px"
                fontSize="36px"
                left="35vw"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                To collide or to quit?
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
                    onNext();
                }}
            >
                Next
            </Text>
            <Box
                sx={{
                    position: "absolute",
                    right: "15vw",
                    bottom: "6.5vh",
                    width: "55px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "10px",
                }}
            >
                <Text sx={{ fontSize: "14px", fontWeight: 600 }}>Shift</Text>
            </Box>
            <Text
                sx={{
                    position: "absolute",
                    right: "15.2vw",
                    bottom: "4.5vh",
                    fontSize: "14px",
                    fontWeight: 600,
                }}
            >
                +
            </Text>
            <Box
                sx={{
                    position: "absolute",
                    right: "13.2vw",
                    bottom: "2.5vh",
                    width: "55px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid #FFFFFF",
                    borderRadius: "10px",
                }}
            >
                <Text sx={{ fontSize: "14px", fontWeight: 600 }}>Enter</Text>
            </Box>
        </Box>
    );
};

export const GameContent: FC<Props> = ({}) => {
    const {
        onNext: onNextProps,
        map,
        myInfo,
        opInfo,
        onOpen,
        tokenId,
    } = useGameContext();
    const getGameState = useGameState();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    const onNext = async () => {
        onNextProps();
    };

    const onQuit = () => {
        onOpen();
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "Escape") {
                onQuit();
            }
            if (key === "Enter" && event.shiftKey) {
                onNext();
            }
        };
        document.addEventListener("keydown", keyboardListener);
        return () => document.removeEventListener("keydown", keyboardListener);
    }, []);

    useEffect(() => {
        const timer = setInterval(async () => {
            const state = await getGameState(tokenId);
            if ([5, 6, 7].includes(state)) {
                onNextProps(6);
            }
        }, 3000);
        return () => clearInterval(timer);
    }, [tokenId, getGameState]);

    return (
        <Box
            pos="relative"
            bgImage={GameBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            <Header />
            <Box
                pos="absolute"
                left="2vw"
                top="15vh"
                userSelect="none"
                zIndex={90}
            >
                <AviationPanel
                    img={myInfo.img}
                    direction="flex-start"
                    aviationInfo={{
                        name: myInfo?.address,
                        fuel: myInfo?.fuel,
                        battery: myInfo?.battery,
                        color: "#FFF761",
                        textColor: "#FFF761",
                        avatarStyle: {
                            bg: "radial-gradient(50% 50% at 50% 50%, #E8EF41 0%, #FF8413 100%)",
                            border: "5px solid #FFF761",
                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                            transform: "matrix(-1, 0, 0, 1, 0, 0)",
                        },
                    }}
                />
                <Box sx={{ marginTop: "15px" }}>
                    <CallTimeOut></CallTimeOut>
                </Box>
            </Box>
            <Box pos="absolute" right="2vw" top="15vh" userSelect="none">
                <AviationPanel
                    img={opInfo.img}
                    direction="flex-end"
                    aviationInfo={{
                        name: opInfo?.address,
                        fuel: opInfo?.fuel,
                        battery: opInfo?.battery,
                        color: "#FF0000",
                        textColor: "#BCBBBE",
                        avatarStyle: {
                            bg: "#BCBBBE",
                            border: "5px solid #AD0000",
                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                            transform: "matrix(-1, 0, 0, 1, 0, 0)",
                        },
                    }}
                />
            </Box>

            <Footer onQuit={onQuit} onNext={onNext} />

            <Box pos="absolute" right="36px" bottom="18vh">
                <TutorialGroup showCharacter={true} horizontal={true} />
            </Box>

            <Box pos="absolute" left="34vw" top="9vh" userSelect="none">
                <Map
                    map={map}
                    setIsReady={() => ({})}
                    onSelect={() => ({})}
                    viewOnly={true}
                    mapPath={[]}
                />
            </Box>
        </Box>
    );
};
