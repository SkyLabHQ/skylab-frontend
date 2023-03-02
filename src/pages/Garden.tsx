import {
    Box,
    Container,
    Flex,
    HStack,
    Img,
    Modal,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, {
    FC,
    MouseEvent,
    RefObject,
    ReactElement,
    ReactNode,
    useRef,
    useState,
    Fragment,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import GardenBackground from "../assets/garden-background.png";
import GardenFront from "../assets/garden-front.png";
import IndustryPark from "../assets/garden-industry-park.svg";
import Shield from "../assets/shield.svg";
import Bomb from "../assets/bomb.png";
import AviationLine from "../assets/garden-aviation-line.svg";
import AviationMark from "../assets/garden-aviation-mark.svg";
import Aviation1 from "../assets/aviation-1.svg";
import Aviation2 from "../assets/aviation-2.svg";
import Aviation3 from "../assets/aviation-3.svg";
import Aviation4 from "../assets/aviation-4.svg";
import Aviation5 from "../assets/aviation-5.svg";
import Aviation6 from "../assets/aviation-6.svg";
import Aviation7 from "../assets/aviation-7.svg";
import Aviation8 from "../assets/aviation-8.svg";
import Aviation9 from "../assets/aviation-9.svg";
import Aviation10 from "../assets/aviation-10.svg";
import Aviation11 from "../assets/aviation-11.svg";
import Aviation12 from "../assets/aviation-12.svg";
import Aviation13 from "../assets/aviation-13.svg";
import Aviation14 from "../assets/aviation-14.svg";
import Aviation15 from "../assets/aviation-15.svg";
import Aviation16 from "../assets/aviation-16.svg";
import Factory1 from "../assets/factory-1.svg";
import Factory2 from "../assets/factory-2.svg";
import Factory3 from "../assets/factory-3.svg";
import Factory4 from "../assets/factory-4.svg";
import Factory5 from "../assets/factory-5.svg";
import Factory6 from "../assets/factory-6.svg";
import Factory7 from "../assets/factory-7.svg";
import Factory8 from "../assets/factory-8.svg";
import { AviationGardenOverlay } from "../components/AviationGardenOverlay";
import { FactoryGardenOverlay } from "../components/FactoryGardenOverlay";
import { BrickGardenOverlay } from "../components/BrickGardenOverlay";
import ConnectWallet from "../components/ConnectWallet";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

const Title: FC<{ children: ReactNode }> = ({ children }) => (
    <Text fontFamily="Orbitron" fontWeight="500" fontSize="48px" color="black">
        {children}
    </Text>
);

const AVIATION_LIST = [
    Aviation1,
    Aviation2,
    Aviation3,
    Aviation4,
    Aviation5,
    Aviation6,
    Aviation7,
    Aviation8,
    Aviation9,
    Aviation10,
    Aviation11,
    Aviation12,
    Aviation13,
    Aviation14,
    Aviation15,
    Aviation16,
].map((img, index) => ({
    img,
    level: index + 1,
    amount: 170,
    ownNumber: index < 5 ? Math.floor(Math.random() * 50) + 1 : 0,
}));

const FACTORY_LIST = [
    {
        img: Factory1,
        style: {
            maxWidth: "11.5vw",
            maxHeight: "40vh",
            marginTop: "-4vh",
            marginLeft: "1vw",
        },
    },
    {
        img: Factory2,
        style: {
            maxWidth: "11vw",
            maxHeight: "40vh",
            marginTop: "4vh",
            marginLeft: "-3vw",
        },
    },
    {
        img: Factory3,
        style: {
            maxWidth: "11.5vw",
            maxHeight: "40vh",
            marginTop: "-10vh",
            marginLeft: "1vw",
        },
    },
    {
        img: Factory4,
        style: {
            maxWidth: "15vw",
            maxHeight: "40vh",
            marginTop: "-4vh",
            marginLeft: "-1vw",
        },
    },
    {
        img: Factory5,
        style: {
            maxWidth: "23vw",
            maxHeight: "40vh",
            marginTop: "-5vh",
            marginLeft: "0",
        },
    },
    {
        img: Factory6,
        style: {
            maxWidth: "31vw",
            maxHeight: "40vh",
            marginTop: "-8vh",
            marginLeft: "0",
        },
    },
    {
        img: Factory7,
        style: {
            maxWidth: "30vw",
            maxHeight: "40vh",
            marginTop: "0",
            marginLeft: "0",
        },
    },
    {
        img: Factory8,
        style: {
            maxWidth: "21vw",
            maxHeight: "35vh",
            marginTop: "-8vh",
            marginLeft: "0",
        },
    },
];

const Garden = (): ReactElement => {
    const [showAviationModal, setShowAviationModal] = useState<
        number | undefined
    >();
    const [showFactoryModal, setShowFactoryModal] = useState<
        number | undefined
    >();
    const [showBrickModal, setShowBrickModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [toCave, setToCave] = useState(false);
    const preventClickAfterDragging = useRef(false);
    const dragInfo = useRef<{ startX?: number; scrollLeft?: number }>({});
    const factoryListRef = useRef<HTMLDivElement>(null);
    const aviationListRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { account } = useActiveWeb3React();

    const onAviationClick = (level: number) => {
        if (preventClickAfterDragging.current) {
            preventClickAfterDragging.current = false;
            return;
        }
        if (!account) {
            return onOpen();
        }
        setShowAviationModal(level);
    };

    const onFactoryClick = (level: number) => {
        if (preventClickAfterDragging.current) {
            preventClickAfterDragging.current = false;
            return;
        }
        if (!account) {
            return onOpen();
        }
        setShowFactoryModal(level);
    };

    const onIndustryParkClick = () => {
        if (!account) {
            return onOpen();
        }
        setShowFactoryModal(FACTORY_LIST.length - 1);
        setToCave(true);
    };

    const onListMouseDown = (
        e: MouseEvent<HTMLDivElement>,
        ref: RefObject<HTMLDivElement>,
    ) => {
        setIsDragging(true);
        dragInfo.current.startX = e.pageX - (ref.current?.offsetLeft ?? 0);
        dragInfo.current.scrollLeft = ref.current!.scrollLeft;
    };

    const onListMouseMove = (
        e: MouseEvent<HTMLDivElement>,
        ref: RefObject<HTMLDivElement>,
    ) => {
        if (!isDragging) return;
        e.preventDefault();
        preventClickAfterDragging.current = true;
        const x = e.pageX - (ref.current?.offsetLeft ?? 0);
        const walk = x - dragInfo.current.startX!;
        ref.current!.scrollLeft = dragInfo.current.scrollLeft! - walk;
    };

    return (
        <Container
            bgImg={GardenBackground}
            bgSize="100% 100%"
            bgRepeat="no-repeat"
            w="100vw"
            h="100vh"
            overflow="hidden"
            maxW="100vw"
            padding="0"
        >
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                position="absolute"
                top="14vh"
                w="100vw"
            >
                <Title>Aviation</Title>
                <Flex
                    ref={aviationListRef}
                    mt="-2vh"
                    overflowX="auto"
                    maxW="100vw"
                    padding="0 80px"
                    css={css`
                        &::-webkit-scrollbar {
                            display: none;
                        }
                        & {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}
                    onMouseDown={(e) => onListMouseDown(e, aviationListRef)}
                    onMouseMove={(e) => onListMouseMove(e, aviationListRef)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                >
                    <Box pos="relative">
                        <HStack
                            pos="absolute"
                            left="90px"
                            top="80px"
                            spacing="0"
                            width="3300px"
                            height="10px"
                        >
                            <Box
                                w="880px"
                                height="10px"
                                bg="linear-gradient(to right, #13FFDA, #39ACFF 30%, #FF2784)"
                            />
                            <Img src={AviationLine} w="2420px" height="10px" />
                        </HStack>
                    </Box>
                    {AVIATION_LIST.map((aviation) => (
                        <Fragment key={aviation.level}>
                            <VStack
                                opacity={aviation.ownNumber === 0 ? 0.5 : 1}
                                w="180px"
                                mr="40px"
                                justifyContent="flex-end"
                                flexShrink="0"
                                pos="relative"
                            >
                                <VStack
                                    spacing="0"
                                    justifyContent="center"
                                    h="160px"
                                >
                                    <motion.img
                                        onClick={() =>
                                            onAviationClick(aviation.level)
                                        }
                                        src={aviation.img}
                                        style={{
                                            width: "160px",
                                            cursor: "pointer",
                                        }}
                                        whileHover={{ scale: 1.2 }}
                                    />
                                </VStack>
                                <VStack spacing="0">
                                    <HStack spacing="0">
                                        <Text
                                            color="#3E3E3E"
                                            fontFamily="Quantico"
                                        >
                                            Amount:
                                        </Text>
                                        <Text
                                            color="rgba(255, 39, 132, 1)"
                                            fontFamily="Quantico"
                                            textDecor="underline"
                                        >
                                            {aviation.amount}
                                        </Text>
                                    </HStack>
                                    <HStack spacing="0">
                                        <Text
                                            color="#3E3E3E"
                                            fontFamily="Quantico"
                                        >
                                            You Own:
                                        </Text>
                                        <Text
                                            color="rgba(255, 39, 132, 1)"
                                            fontFamily="Quantico"
                                            textDecor="underline"
                                        >
                                            {aviation.ownNumber}
                                        </Text>
                                    </HStack>
                                </VStack>
                                {aviation.level === 1 ? (
                                    <VStack
                                        spacing="4px"
                                        pos="absolute"
                                        top="0"
                                    >
                                        <Text
                                            color="#FF2784"
                                            fontFamily="Orbitron"
                                            fontWeight="700"
                                            w="500px"
                                            textAlign="center"
                                        >
                                            Start the Journey here
                                        </Text>
                                        <Img src={AviationMark} w="40px" />
                                    </VStack>
                                ) : null}
                            </VStack>
                        </Fragment>
                    ))}
                </Flex>
            </Box>
            <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                position="absolute"
                top="40vh"
                w="100vw"
            >
                <Title>Factories</Title>
                <Flex
                    ref={factoryListRef}
                    mt="6vh"
                    overflowX="auto"
                    h="40vh"
                    maxW="100vw"
                    css={css`
                        &::-webkit-scrollbar {
                            display: none;
                        }
                        & {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}
                    onMouseDown={(e) => onListMouseDown(e, factoryListRef)}
                    onMouseMove={(e) => onListMouseMove(e, factoryListRef)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                >
                    {FACTORY_LIST.map((item, index) => (
                        <motion.img
                            src={item.img}
                            style={{ ...item.style, cursor: "pointer" }}
                            onClick={() => onFactoryClick(index + 1)}
                            whileHover={{ scale: 1.2 }}
                        />
                    ))}
                </Flex>
            </Box>
            <Img
                src={GardenFront}
                w="100vw"
                h="38vh"
                pos="absolute"
                left="0"
                bottom="0"
                pointerEvents="none"
            />
            <Img
                src={IndustryPark}
                w="15vw"
                h="17vh"
                pos="absolute"
                right="10vw"
                bottom="2vh"
                cursor="pointer"
                onClick={onIndustryParkClick}
            />
            <HStack spacing="50px" pos="absolute" left="12vw" bottom="2vh">
                <VStack>
                    <Title>Shields</Title>
                    <Img
                        w="100px"
                        src={Shield}
                        cursor="pointer"
                        onClick={() => setShowBrickModal(true)}
                    />
                </VStack>
                <VStack>
                    <Title>Bombs</Title>
                    <Img
                        w="100px"
                        src={Bomb}
                        cursor="pointer"
                        onClick={() => navigate("/attack")}
                    />
                </VStack>
            </HStack>
            <AviationGardenOverlay
                level={showAviationModal}
                onOverlayClose={() => setShowAviationModal(undefined)}
            />
            <FactoryGardenOverlay
                toCave={toCave}
                level={showFactoryModal}
                onOverlayClose={() => {
                    setShowFactoryModal(undefined);
                    setToCave(false);
                }}
            />
            <BrickGardenOverlay
                visible={showBrickModal}
                onOverlayClose={() => setShowBrickModal(false)}
            />
            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
                <ModalOverlay
                    backdropFilter="blur(30px)"
                    bg="rgba(0, 0, 0, 0.2)"
                />
                <ModalContent bgColor="whiteAlpha.200">
                    <ConnectWallet onModalClose={onClose} />
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Garden;
