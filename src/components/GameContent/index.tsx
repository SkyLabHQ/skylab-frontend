import React, { FC, useEffect, useRef, useState } from "react";
import {
    Box,
    Text,
    Image,
    VStack,
    HStack,
    Img,
    useDisclosure,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    useClipboard,
} from "@chakra-ui/react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";
import WarningIcon from "../../assets/icon-warning.svg";
import BatteryIcon from "../../assets/icon-battery.svg";
import FuelIcon from "../../assets/icon-fuel.svg";
import CloseIcon from "../../assets/icon-close.svg";
import { useGameContext } from "../../pages/Game";
import { Map } from "./map";
import { Header } from "./header";
import { getRecordFromLocalStorage, mergeIntoLocalStorage } from "./utils";
import { TutorialGroup } from "./tutorialGroup";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
    useSkylabResourcesContract,
} from "@/hooks/useContract";
import { shortenAddress } from "@/utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";

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

    return (
        <VStack spacing="40px" width="22vw" alignItems={direction}>
            <Box w="180px" h="180px" {...avatarStyle}>
                <Image src={img} w="180px" h="180px" />
            </Box>
            <VStack
                bg="rgba(217, 217, 217, 0.2)"
                padding="20px 44px 100px"
                borderRadius="16px"
                alignItems="flex-start"
                width="100%"
            >
                <Text
                    fontFamily="Quantico"
                    color={color}
                    fontSize="36px"
                    mt="32px"
                    mb="64px"
                    onClick={onCopy}
                    cursor="pointer"
                >
                    {name}
                </Text>
                <HStack w="100%">
                    <Image src={FuelIcon} w="84px" h="84px" />
                    <HStack
                        fontFamily="Quantico"
                        color={textColor}
                        fontSize="36px"
                        justifyContent="space-between"
                        flex="1"
                    >
                        <Text>Fuel</Text>
                        <Text>{fuel}</Text>
                    </HStack>
                </HStack>
                <HStack w="100%">
                    <Image src={BatteryIcon} w="84px" h="84px" />
                    <HStack
                        fontFamily="Quantico"
                        color={textColor}
                        fontSize="36px"
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
                fontSize="40px"
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
                fontSize="48px"
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
                fontSize="40px"
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

const TOTAL_COUNT_DOWN = 30;

interface Info {
    address: string;
    planeImg: string;
    fuel: number;
    battery: number;
}

export const GameContent: FC<Props> = ({}) => {
    const { account } = useActiveWeb3React();

    const [level, setLevel] = useState<number>();
    const [myInfo, setMyInfo] = useState<Info>({
        address: "",
        planeImg: "",
        fuel: 0,
        battery: 0,
    });

    const [opInfo, setOpInfo] = useState<Info>({
        address: "",
        planeImg: "",
        fuel: 0,
        battery: 0,
    });
    const skylabBaseContract = useSkylabBaseContract();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabResourcesContract = useSkylabResourcesContract();
    const [countdown, setCountdown] = useState(() => {
        const gameInfo = getRecordFromLocalStorage("game-confirm");
        if (gameInfo?.countdown) {
            return gameInfo.countdown as number;
        }
        return TOTAL_COUNT_DOWN;
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const countdownIntervalRef = useRef<number>();
    const { onNext: onNextProps, map, tokenId } = useGameContext();

    const onNext = () => {
        onNextProps();
        localStorage.removeItem("game-confirm");
    };

    const onQuit = () => {
        onOpen();
    };
    const getOpponentInfo = async () => {
        try {
            const opTokenId =
                await skylabGameFlightRaceContract.matchedAviationIDs(tokenId);
            const [myLevel, myVisual, myTank, opVisual, opTank, opAccount] =
                await Promise.all([
                    skylabBaseContract._aviationLevels(tokenId),
                    skylabBaseContract.tokenURI(tokenId),
                    skylabGameFlightRaceContract.gameTank(tokenId),
                    skylabBaseContract.tokenURI(opTokenId.toString()),
                    skylabGameFlightRaceContract.gameTank(opTokenId.toString()),
                    skylabBaseContract.ownerOf(opTokenId),
                ]);

            setLevel(myLevel.toNumber());
            const jsonString = window.atob(
                myVisual.substr(myVisual.indexOf(",") + 1),
            );
            const jsonObject = JSON.parse(jsonString);

            const opJsonString = window.atob(
                opVisual.substr(opVisual.indexOf(",") + 1),
            );
            const opJsonObject = JSON.parse(opJsonString);
            setMyInfo({
                address: account,
                planeImg: jsonObject.image,
                fuel: myTank.fuel.toString(),
                battery: myTank.battery.toString(),
            });
            setOpInfo({
                address: opAccount,
                planeImg: opJsonObject.image,
                fuel: opTank.fuel.toString(),
                battery: opTank.battery.toString(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (countdown <= 0) {
            clearInterval(countdownIntervalRef.current);
            // onNext();
        }
        // mergeIntoLocalStorage("game-confirm", {
        //     countdown,
        // });
    }, [countdown]);

    useEffect(() => {
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown((val) => val - 1);
        }, 1000);

        return () => clearInterval(countdownIntervalRef.current);
    }, []);

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
        if (!skylabGameFlightRaceContract || !tokenId || !account) {
            return;
        }
        getOpponentInfo();
    }, [skylabGameFlightRaceContract, tokenId, account]);

    return (
        <Box
            pos="relative"
            bgImage={GameBackground}
            bgRepeat="no-repeat"
            height="100vh"
            bgSize="100% 100%"
            overflow="hidden"
        >
            <Header
                countdown={countdown > 0 ? countdown : 0}
                total={TOTAL_COUNT_DOWN}
                level={level}
            />
            <Box pos="absolute" left="2vw" top="15vh" userSelect="none">
                <AviationPanel
                    img={myInfo.planeImg}
                    direction="flex-start"
                    aviationInfo={{
                        name: shortenAddress(myInfo.address),
                        fuel: myInfo.fuel,
                        battery: myInfo.battery,
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
            </Box>
            <Box pos="absolute" right="2vw" top="15vh" userSelect="none">
                <AviationPanel
                    img={opInfo.planeImg}
                    direction="flex-end"
                    aviationInfo={{
                        name: shortenAddress(opInfo.address),
                        fuel: opInfo.fuel,
                        battery: opInfo.battery,
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

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
                <ModalOverlay />
                <ModalContent
                    bg="rgba(255, 255, 255, 0.7)"
                    border="3px solid #FDDC2D"
                    borderRadius="20px"
                >
                    <Img
                        pos="absolute"
                        top="16px"
                        right="16px"
                        w="32px"
                        src={CloseIcon}
                        cursor="pointer"
                        onClick={() => onClose()}
                    />
                    <ModalBody pb="0" pt="36px">
                        <Box display="flex" justifyContent="space-between">
                            <Img w="220px" src={WarningIcon} />
                            <Text
                                color="black"
                                fontSize="36px"
                                fontFamily="Orbitron"
                                fontWeight="600"
                            >
                                If you quit the game, your aviation will be
                                down-graded, but you get to keep all your
                                resources.
                            </Text>
                        </Box>
                    </ModalBody>

                    <ModalFooter
                        display="flex"
                        justifyContent="space-between"
                        pt="0"
                    >
                        <Button
                            bg="white"
                            colorScheme="white"
                            onClick={onClose}
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                            w="40%"
                            padding="32px 0"
                            borderRadius="20px"
                        >
                            Quit
                        </Button>
                        <Button
                            colorScheme="yellow"
                            onClick={onClose}
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                            w="50%"
                            padding="32px 0"
                            borderRadius="20px"
                        >
                            Continue to collide
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
