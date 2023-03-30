import {
    Box,
    Button,
    HStack,
    Img,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ChangeEvent, FC, useMemo, useState } from "react";

import Opensea from "../../assets/opensea.svg";
import Fuel from "../../assets/icon-fuel.svg";
import Battery from "../../assets/icon-battery.svg";
import Back from "../../assets/icon-back-yellow.svg";
import Shield from "../../assets/shield.svg";
import DamagedShield from "../../assets/shield-damaged.svg";
import { Factory, useFactoryInfo } from ".";

type Props = {
    caveLevel: number;
    allSelectedFactory: Record<number, Factory[]>;
    setSelectedFactory: (factory: Factory[]) => void;
};

type OverallBoardProps = {
    factoryInfo: Factory[];
    setFactoryLevel: (level: number | undefined) => void;
    isDisabled: (factory: Factory) => boolean;
    allSelectedFactory: Record<number, Factory[]>;
};

type LevelBoardProps = {
    factoryInfo: Factory[];
    factoryLevel: number;
    setFactoryLevel: (level: number | undefined) => void;
    isDisabled: (factory: Factory) => boolean;
    setSelectedFactory: (factory: Factory) => void;
};

type DetailBoardProps = {
    factory: Factory;
    factoryLevel: number;
    onSelectFactory: () => void;
    setFactoryDetail: (factory: Factory | undefined) => void;
};

const getRemainingFactoryNumber = ({
    allSelectedFactory,
    factoryInfo,
    level,
}: {
    allSelectedFactory: Record<number, Factory[]>;
    factoryInfo: Factory[];
    level: number;
}) => {
    const totalNumber = factoryInfo.filter(
        (item) => item.level === level,
    ).length;
    const selectedNumber =
        allSelectedFactory[1].filter((item) => item.level === level).length +
        allSelectedFactory[2].filter((item) => item.level === level).length;
    return totalNumber - selectedNumber;
};

const OverallBoard: FC<OverallBoardProps> = ({
    factoryInfo,
    setFactoryLevel,
    isDisabled,
    allSelectedFactory,
}) => {
    const getFactoryNumber = (factory: Factory) =>
        getRemainingFactoryNumber({
            allSelectedFactory,
            factoryInfo,
            level: factory.level,
        });

    return (
        <Box
            bg="rgba(104, 62, 53, 0.25)"
            border="5px solid #FFF761"
            borderRadius="20px"
            w="32vw"
            h="60vh"
        >
            <HStack
                padding="24px 32px"
                bg="linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFF761 100%)"
            >
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="32px"
                    color="#FFF761"
                >
                    Your Factories
                </Text>
            </HStack>
            <Box padding="20px">
                <HStack
                    spacing={0}
                    alignItems="flex-start"
                    flexWrap="wrap"
                    overflowY="scroll"
                    h="440px"
                    css={css`
                        &::-webkit-scrollbar {
                            display: none;
                        }
                        & {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}
                >
                    {factoryInfo
                        .reduce((prev: Factory[], curr) => {
                            if (
                                !prev.find((item) => item.level === curr.level)
                            ) {
                                prev.push(curr);
                            }
                            return prev;
                        }, [])
                        .map((item) => (
                            <VStack
                                spacing={0}
                                flexBasis="33.33%"
                                w="100%"
                                key={item.id}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="2px solid rgba(255, 247, 97, 0.3)"
                                    w="100%"
                                    h="160px"
                                    cursor={
                                        isDisabled(item)
                                            ? "not-allowed"
                                            : "pointer"
                                    }
                                    onClick={
                                        isDisabled(item)
                                            ? undefined
                                            : () => setFactoryLevel(item.level)
                                    }
                                >
                                    <Img
                                        maxW="130px"
                                        maxH="110px"
                                        src={item.img}
                                    />
                                    <Text
                                        mt="4px"
                                        fontSize="24px"
                                        fontFamily="Orbitron"
                                    >
                                        Level {item.level}
                                    </Text>
                                </Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontFamily="Orbitron"
                                    fontSize="24px"
                                    border="2px solid rgba(255, 247, 97, 0.3)"
                                    w="100%"
                                    h="60px"
                                >
                                    <Text color="#FFF761">
                                        X{getFactoryNumber(item)}
                                    </Text>
                                </Box>
                            </VStack>
                        ))}
                </HStack>
            </Box>
        </Box>
    );
};

const LevelBoard: FC<LevelBoardProps> = ({
    factoryInfo,
    factoryLevel,
    setFactoryLevel,
    isDisabled,
    setSelectedFactory,
}) => {
    const filteredFactory = useMemo(
        () => factoryInfo.filter((factory) => factory.level === factoryLevel),
        [factoryLevel],
    );

    const onSelectFactory = (factory: Factory) => {
        setSelectedFactory(factory);
    };

    return (
        <Box
            bg="rgba(104, 121, 131, 0.25)"
            border="5px solid #FFFFFF"
            borderRadius="20px"
            w="32vw"
            h="60vh"
        >
            <HStack
                padding="24px 32px"
                bg="linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFFFFF 100%)"
                onClick={() => setFactoryLevel(undefined)}
            >
                <Img src={Back} />
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="32px"
                    color="white"
                >
                    Your Level {factoryLevel} Factories
                </Text>
            </HStack>
            <Box padding="20px">
                <HStack
                    spacing={0}
                    alignItems="flex-start"
                    flexWrap="wrap"
                    overflowY="scroll"
                    h="440px"
                    css={css`
                        &::-webkit-scrollbar {
                            display: none;
                        }
                        & {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}
                >
                    {filteredFactory.map((item) => (
                        <VStack
                            spacing={0}
                            flexBasis="33.33%"
                            w="100%"
                            key={item.id}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                border="2px solid rgba(255, 255, 255, 0.3)"
                                w="100%"
                                h="160px"
                                cursor={
                                    isDisabled(item) ? "not-allowed" : "pointer"
                                }
                                onClick={
                                    isDisabled(item)
                                        ? undefined
                                        : () => onSelectFactory(item)
                                }
                            >
                                <Img maxW="130px" maxH="110px" src={item.img} />
                                <Text
                                    mt="4px"
                                    fontSize="24px"
                                    fontFamily="Orbitron"
                                >
                                    Level {item.level}
                                </Text>
                            </Box>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontFamily="Orbitron"
                                fontSize="16px"
                                border="2px solid rgba(255, 255, 255, 0.3)"
                                w="100%"
                                h="60px"
                            >
                                <VStack spacing="0" alignItems="flex-start">
                                    <Text color="white">Output Per Day:</Text>
                                    <HStack
                                        alignItems="space-between"
                                        justifyContent="center"
                                    >
                                        <HStack spacing="4px">
                                            <Text
                                                color="#FFF761"
                                                textDecor="underline"
                                            >
                                                {item.dailyFuelOutput}
                                            </Text>
                                            <Img w="32px" src={Fuel} />
                                        </HStack>
                                        <HStack spacing="4px">
                                            <Text
                                                color="#FFF761"
                                                textDecor="underline"
                                            >
                                                {item.dailyBatteryOutput}
                                            </Text>
                                            <Img w="32px" src={Battery} />
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </Box>
                        </VStack>
                    ))}
                </HStack>
            </Box>
        </Box>
    );
};

const DetailBoard: FC<DetailBoardProps> = ({
    factory,
    factoryLevel,
    setFactoryDetail,
    onSelectFactory,
}) => {
    const [shieldToAdd, setShieldToAdd] = useState<number>(0);

    const onMint = () => {
        window.open("https://opensea.io");
    };

    const onInputChange: (e: ChangeEvent<HTMLInputElement>) => void = (e) => {
        const val = parseInt(e.currentTarget.value, 10);

        if (Number.isNaN(val)) {
            setShieldToAdd(0);
        } else {
            setShieldToAdd(val);
        }
    };

    const onAddShield = () => {};

    return (
        <Box
            bg="rgba(104, 121, 131, 0.25)"
            border="5px solid #FFFFFF"
            borderRadius="20px"
            w="32vw"
            h="60vh"
        >
            <HStack
                padding="24px 32px"
                bg="linear-gradient(180deg, rgba(88, 112, 120, 0) -7.73%, #FFFFFF 100%)"
                onClick={() => setFactoryDetail(undefined)}
            >
                <Img src={Back} />
                <Text
                    fontFamily="Orbitron"
                    fontWeight="500"
                    fontSize="32px"
                    color="white"
                >
                    Your Level {factoryLevel} Factories
                </Text>
            </HStack>
            <Box padding="20px">
                <HStack spacing="16px" h="440px">
                    <VStack spacing="0" h="100%" flexBasis="45%">
                        <HStack
                            w="100%"
                            h="220px"
                            border="2px solid rgba(255, 255, 255, 0.5)"
                            bg="rgba(0, 0, 0, 0.8)"
                            alignItems="center"
                            justifyContent="center"
                            onClick={onSelectFactory}
                        >
                            <Img maxW="80%" maxH="80%" src={factory.img} />
                        </HStack>
                        <Text
                            w="100%"
                            fontFamily="Orbitron"
                            fontWeight="500"
                            fontSize="18px"
                            color="white"
                            border="2px solid #959595"
                            bg="rgba(0, 0, 0, 0.9)"
                            padding="10px"
                        >
                            Level {factoryLevel} Factory
                        </Text>
                        <Text
                            mt="20px !important"
                            w="100%"
                            fontFamily="Quantico"
                            fontSize="18px"
                            color="white"
                        >
                            ·Use shields to protect your factories from bombs
                        </Text>
                        <Button
                            colorScheme="white"
                            bg="white"
                            w="100%"
                            h="60px"
                            borderRadius="10px"
                            fontSize="28px"
                            mt="30px !important"
                            onClick={onMint}
                            display="flex"
                            justifyContent="center"
                        >
                            <Img src={Opensea} w="56px" h="56px" mr="8px" />{" "}
                            OpenSea
                        </Button>
                    </VStack>
                    <VStack flexBasis="55%" h="100%">
                        <Text
                            w="100%"
                            fontFamily="Orbitron"
                            fontWeight="500"
                            fontSize="18px"
                            color="white"
                            border="2px solid rgba(255, 255, 255, 0.5)"
                            padding="10px"
                        >
                            Production Capacity
                        </Text>
                        <VStack
                            w="100%"
                            spacing="-2px"
                            alignItems="flex-start"
                            border="2px solid rgba(255, 255, 255, 0.5)"
                            padding="10px"
                        >
                            <Text
                                fontFamily="Quantico"
                                fontSize="20px"
                                color="white"
                            >
                                Output Per Day:
                            </Text>
                            <HStack spacing="20px">
                                <HStack spacing="4px">
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#FFF761"
                                        textDecorationLine="underline"
                                    >
                                        {factory.dailyFuelOutput}
                                    </Text>
                                    <Img src={Fuel} w="32px" />
                                </HStack>
                                <HStack spacing="4px">
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#FFF761"
                                        textDecorationLine="underline"
                                    >
                                        {factory.dailyBatteryOutput}
                                    </Text>
                                    <Img src={Battery} w="32px" />
                                </HStack>
                            </HStack>
                            <Text
                                fontFamily="Quantico"
                                fontSize="20px"
                                color="white"
                            >
                                Total Production:
                            </Text>
                            <HStack spacing="20px">
                                <HStack spacing="4px">
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#41FFF5"
                                        textDecorationLine="underline"
                                    >
                                        {factory.totalFuelOutput}
                                    </Text>
                                    <Img src={Fuel} w="32px" />
                                </HStack>
                                <HStack spacing="4px">
                                    <Text
                                        fontFamily="Quantico"
                                        fontSize="20px"
                                        color="#41FFF5"
                                        textDecorationLine="underline"
                                    >
                                        {factory.totalBatteryOutput}
                                    </Text>
                                    <Img src={Battery} w="32px" />
                                </HStack>
                            </HStack>
                        </VStack>
                        <Text
                            w="100%"
                            fontFamily="Orbitron"
                            fontWeight="500"
                            fontSize="18px"
                            color="white"
                            border="2px solid rgba(255, 255, 255, 0.5)"
                            padding="10px"
                        >
                            Security
                        </Text>
                        <VStack
                            spacing="4px"
                            alignItems="flex-start"
                            border="2px solid rgba(255, 255, 255, 0.5)"
                            padding="10px"
                        >
                            <HStack spacing="4px">
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="20px"
                                    color="white"
                                >
                                    Shields In Use:
                                </Text>
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="20px"
                                    color="#FFF761"
                                    textDecorationLine="underline"
                                >
                                    {factory.shieldInUse}
                                </Text>
                                <Img src={Shield} w="24px" />
                            </HStack>
                            <HStack spacing="4px">
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="20px"
                                    color="white"
                                >
                                    Damage:
                                </Text>
                                <Text
                                    fontFamily="Quantico"
                                    fontSize="20px"
                                    color="#FF4F4F"
                                    textDecorationLine="underline"
                                >
                                    {factory.shieldDamaged}
                                </Text>
                                <Img src={DamagedShield} w="24px" />
                            </HStack>
                            <HStack spacing="4px">
                                <VStack spacing="0" alignItems="flex-start">
                                    <HStack>
                                        <Text
                                            fontFamily="Quantico"
                                            fontSize="18px"
                                            color="white"
                                        >
                                            Add Shields:
                                        </Text>
                                        <Input
                                            variant="flushed"
                                            borderRadius="none"
                                            fontSize="20px"
                                            w="40px"
                                            textAlign="center"
                                            color="#FFF761"
                                            value={shieldToAdd}
                                            onChange={onInputChange}
                                        />
                                    </HStack>
                                </VStack>
                                <Button
                                    variant="outline"
                                    colorScheme="yellow"
                                    onClick={onAddShield}
                                >
                                    Confirm
                                </Button>
                            </HStack>
                        </VStack>
                    </VStack>
                </HStack>
            </Box>
        </Box>
    );
};

export const FactoryBoard: FC<Props> = ({
    caveLevel,
    allSelectedFactory,
    setSelectedFactory,
}) => {
    const factoryInfo = useFactoryInfo();
    const [factoryLevel, setFactoryLevel] = useState<number>();
    const [factoryDetail, setFactoryDetail] = useState<Factory>();
    const selectedFactory = allSelectedFactory[caveLevel];

    const isDisabled = (factory: Factory) => {
        const remainingFactoryNumber = getRemainingFactoryNumber({
            allSelectedFactory,
            factoryInfo,
            level: factory.level,
        });
        if (caveLevel === 1) {
            return (
                selectedFactory.length >= 2 ||
                remainingFactoryNumber < 1 ||
                !!selectedFactory.find((item) => item.id === factory.id) ||
                (selectedFactory.length > 0 &&
                    factory.level !== selectedFactory[0]?.level)
            );
        }

        return selectedFactory.length >= 3 || remainingFactoryNumber <= 0;
    };

    const onSelectFactory = () => {
        if (!factoryDetail) {
            return;
        }
        setSelectedFactory([...selectedFactory, factoryDetail]);
    };

    return factoryLevel ? (
        factoryDetail ? (
            <DetailBoard
                factory={factoryDetail}
                factoryLevel={factoryLevel}
                setFactoryDetail={setFactoryDetail}
                onSelectFactory={onSelectFactory}
            />
        ) : (
            <LevelBoard
                factoryInfo={factoryInfo}
                factoryLevel={factoryLevel}
                setFactoryLevel={setFactoryLevel}
                isDisabled={isDisabled}
                setSelectedFactory={setFactoryDetail}
            />
        )
    ) : (
        <OverallBoard
            factoryInfo={factoryInfo}
            setFactoryLevel={setFactoryLevel}
            isDisabled={isDisabled}
            allSelectedFactory={allSelectedFactory}
        />
    );
};
