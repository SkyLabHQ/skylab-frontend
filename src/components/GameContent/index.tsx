import { Box, Text, Image, VStack, HStack, Img } from "@chakra-ui/react";
import React, { FC, useMemo, useState } from "react";

import GameBackground from "../../assets/game-background.png";
import GameFooter from "../../assets/game-footer.png";
import Helicopter from "../../assets/helicopter.svg";
import { GridInfo } from "../GridInfo";
import { Map } from "./map";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    onNext: () => void;
};

type AviationPanelProps = {
    img: string;
    aviationInfo: {
        level: number;
        fuel: number;
        battery: number;
        color: string;
    };
};

export type MapInfo = {
    role: "normal" | "start" | "end" | "opponent_start";
    level?: number;
    selected?: boolean;
    hover?: boolean;
};

const AviationPanel: FC<AviationPanelProps> = ({
    img,
    aviationInfo: { level, fuel, battery, color },
}) => {
    return (
        <VStack spacing="12vh" width="22vw">
            <Image src={img} w="14vw" h="14vh" />
            <VStack
                bg="rgba(217, 217, 217, 0.2)"
                padding="20px 44px 172px"
                borderRadius="16px"
                alignItems="flex-start"
                width="100%"
            >
                <Text
                    fontFamily="Orbitron"
                    fontWeight="600"
                    color={color}
                    fontSize="64px"
                >
                    Level{level}
                </Text>
                <Text fontFamily="Quantico" color={color} fontSize="36px">
                    fuel: {fuel}
                </Text>
                <Text fontFamily="Quantico" color={color} fontSize="36px">
                    battery: {battery}
                </Text>
                <VStack
                    spacing="24px"
                    marginTop="72px !important"
                    width="100%"
                    alignItems="flex-start"
                >
                    <Box height="36px" width="100%" bg={color} />
                    <Box height="36px" width="100%" bg={color} />
                    <Box height="36px" width="50%" bg={color} />
                </VStack>
            </VStack>
        </VStack>
    );
};

const MapInfoPanel: FC<{ item: MapInfo }> = ({ item }) => {
    const factor = useMemo(() => Math.random() * 20, [item]);

    console.log(factor);

    return (
        <VStack spacing="2vh" width="30vw">
            <VStack
                bg="rgba(217, 217, 217, 0.2)"
                padding="16px 32px 48px"
                borderRadius="16px"
                alignItems="flex-start"
                width="100%"
                spacing="16px"
                color="white"
            >
                <Text fontFamily="Orbitron" fontWeight="600" fontSize="64px">
                    Strategy
                </Text>
                <Text fontFamily="Quantico" fontSize="36px">
                    time taken:
                </Text>
                <Text fontFamily="Quantico" fontSize="36px">
                    load fuel:
                </Text>
                <Text fontFamily="Quantico" fontSize="36px">
                    load battery:
                </Text>
            </VStack>
            <VStack
                bg="rgba(217, 217, 217, 0.2)"
                padding="16px 32px 40px"
                borderRadius="16px"
                alignItems="flex-start"
                width="100%"
                spacing="8px"
                color="white"
            >
                <Text fontFamily="Orbitron" fontWeight="600" fontSize="64px">
                    Grid info
                </Text>
                <HStack spacing="36px" alignItems="flex-start">
                    <GridInfo canvasId={"test"} factor={factor} />
                    <VStack spacing="16px" alignItems="flex-start">
                        <Text fontFamily="Quantico" fontSize="36px">
                            air drag:
                        </Text>
                        <Text fontFamily="Quantico" fontSize="36px">
                            air turbulence:
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        </VStack>
    );
};

const Header = () => {
    return (
        <HStack
            pos="absolute"
            top="0"
            padding="0 20px"
            w="100%"
            userSelect="none"
        >
            <Box
                height="28px"
                width="calc(47vw - 52px)"
                bg="linear-gradient(270deg, #FFFFFF 50%, rgba(255, 255, 255, 0) 107.76%);"
            />
            <Text
                color="white"
                fontWeight="600"
                fontSize="64px"
                padding="0 32px"
                w="10vw"
                textAlign="center"
            >
                VS
            </Text>
            <Box
                height="28px"
                width="calc(47vw - 52px)"
                bg="linear-gradient(90deg, #FF2788 50%, rgba(255, 39, 136, 0) 119.94%);"
            />
        </HStack>
    );
};

const Footer: FC<{ onNext: Props["onNext"]; isReady: boolean }> = ({
    onNext,
    isReady,
}) => {
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
            >
                Return
            </Text>
            <Text
                textAlign="center"
                pos="absolute"
                width="25vw"
                minWidth="480px"
                fontSize="48px"
                left="37.5vw"
                bottom="4vh"
                color="white"
                fontFamily="Orbitron"
                fontWeight="600"
            >
                {isReady ? "Ready" : "Design your route"}
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
                cursor={isReady ? "pointer" : "not-allowed"}
                fontFamily="Orbitron"
                fontWeight="600"
                onClick={isReady ? onNext : undefined}
            >
                Confirm
            </Text>
        </Box>
    );
};

export const GameContent: FC<Props> = ({ onNext }) => {
    const [mapDetail, setMapDetail] = useState<MapInfo | undefined>();
    const [isReady, setIsReady] = useState(false);

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
            <Box pos="absolute" left="2vw" top="9vh" userSelect="none">
                <AviationPanel
                    img={Helicopter}
                    aviationInfo={{
                        level: 2,
                        fuel: 10,
                        battery: 20,
                        color: "#D9D9D9",
                    }}
                />
            </Box>
            <AnimatePresence initial={false}>
                {mapDetail ? null : (
                    <motion.div
                        style={{
                            position: "absolute",
                            right: "2vw",
                            top: "9vh",
                            userSelect: "none",
                        }}
                        initial={{ x: 500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 500, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AviationPanel
                            img={Helicopter}
                            aviationInfo={{
                                level: 2,
                                fuel: 10,
                                battery: 20,
                                color: "#FF2788",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {mapDetail ? (
                    <motion.div
                        style={{
                            position: "absolute",
                            left: "27vw",
                            top: "9vh",
                            userSelect: "none",
                        }}
                        initial={{ x: -500, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -500, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <MapInfoPanel item={mapDetail} />
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <motion.div
                style={{
                    position: "absolute",
                    top: "9vh",
                }}
                initial={{ x: "31.5vw" }}
                animate={{ x: mapDetail ? "61vw" : "31.5vw" }}
                transition={{ duration: 0.5 }}
            >
                <Map setIsReady={setIsReady} onSelect={setMapDetail} />
            </motion.div>
            <Footer onNext={onNext} isReady={isReady} />
        </Box>
    );
};
