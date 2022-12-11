import {
    Box,
    Container,
    Flex,
    HStack,
    Img,
    Text,
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
} from "react";

import GardenBackground from "../assets/garden-background.png";
import GardenFront from "../assets/garden-front.png";
import Shield from "../assets/shield.svg";
import Bomb from "../assets/bomb.png";
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
import Factory1 from "../assets/factory-garden-1.svg";
import Factory2 from "../assets/factory-garden-2.svg";
import Factory3 from "../assets/factory-garden-3.svg";
import Factory4 from "../assets/factory-garden-4.svg";
import Factory5 from "../assets/factory-garden-5.svg";
import Factory6 from "../assets/factory-garden-6.svg";
import Factory7 from "../assets/factory-7.svg";
import Factory8 from "../assets/factory-8.svg";
import { AviationGardenOverlay } from "../components/AviationGardenOverlay";
import { FactoryGardenOverlay } from "../components/FactoryGardenOverlay";
import { BrickGardenOverlay } from "../components/BrickGardenOverlay";
import { useNavigate } from "react-router-dom";

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
    const preventClickAfterDragging = useRef(false);
    const dragInfo = useRef<{ startX?: number; scrollLeft?: number }>({});
    const factoryListRef = useRef<HTMLDivElement>(null);
    const aviationListRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const onAviationClick = (level: number) => {
        if (preventClickAfterDragging.current) {
            preventClickAfterDragging.current = false;
            return;
        }
        setShowAviationModal(level);
    };

    const onFactoryClick = (level: number) => {
        if (preventClickAfterDragging.current) {
            preventClickAfterDragging.current = false;
            return;
        }
        setShowFactoryModal(level);
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
                    {AVIATION_LIST.map((aviation, index) => (
                        <Img
                            onClick={() => onAviationClick(index + 1)}
                            src={aviation}
                            maxW="10vw"
                            mr="40px"
                        />
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
                    <Img
                        onClick={() => onFactoryClick(1)}
                        src={Factory1}
                        maxW="11.5vw"
                        maxH="40vh"
                        mt="-4vh"
                        ml="1vw"
                    />
                    <Img
                        onClick={() => onFactoryClick(2)}
                        src={Factory2}
                        maxW="11vw"
                        maxH="40vh"
                        ml="-3vw"
                        mt="4vh"
                    />
                    <Img
                        onClick={() => onFactoryClick(3)}
                        src={Factory3}
                        maxW="11.5vw"
                        maxH="40vh"
                        ml="1vw"
                        mt="-10vh"
                    />
                    <Img
                        onClick={() => onFactoryClick(4)}
                        src={Factory4}
                        maxW="15vw"
                        maxH="40vh"
                        ml="-1vw"
                        mt="-4vh"
                    />
                    <Img
                        onClick={() => onFactoryClick(5)}
                        src={Factory5}
                        maxW="23vw"
                        maxH="40vh"
                        ml="0vw"
                        mt="-5vh"
                    />
                    <Img
                        onClick={() => onFactoryClick(6)}
                        src={Factory6}
                        maxW="31vw"
                        maxH="40vh"
                        ml="0vw"
                        mt="-8vh"
                    />
                    <Img
                        onClick={() => onFactoryClick(7)}
                        src={Factory7}
                        maxW="30vw"
                        maxH="40vh"
                        ml="0vw"
                    />
                    <Img
                        onClick={() => onFactoryClick(8)}
                        src={Factory8}
                        maxW="21vw"
                        maxH="35vh"
                        ml="-5w"
                    />
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
            <HStack spacing="50px" pos="absolute" left="12vw" bottom="2vh">
                <VStack>
                    <Title>Bricks</Title>
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
                level={showFactoryModal}
                onOverlayClose={() => setShowFactoryModal(undefined)}
            />
            <BrickGardenOverlay
                visible={showBrickModal}
                onOverlayClose={() => setShowBrickModal(false)}
            />
        </Container>
    );
};

export default Garden;
