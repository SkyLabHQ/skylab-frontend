import {
    HStack,
    Img,
    VStack,
    Box,
    Text,
    Button,
    Input,
} from "@chakra-ui/react";
import React, { ChangeEvent, FC, Fragment, useEffect, useState } from "react";

import Title from "../../assets/cave-cabin-title.svg";
import Container from "../../assets/cave-cabin-item.svg";
import Clear from "../../assets/cave-clear.svg";
import Fuel from "../../assets/icon-fuel.svg";
import Battery from "../../assets/icon-battery.svg";
import Shield from "../../assets/shield.svg";
import DamagedShield from "../../assets/shield-damaged.svg";
import { Factory } from ".";

type Props = {
    selectedFactory: Factory[];
    setSelectedFactory: (factory: Factory[]) => void;
};

type CabinConfig = {
    selected: "security" | "capacity";
};

export const Cabin: FC<Props> = ({ selectedFactory, setSelectedFactory }) => {
    const [cabinConfig, setCabinConfig] = useState<CabinConfig[]>([]);
    const [shieldToAdd, setShieldToAdd] = useState<number[]>([0, 0, 0]);

    const onRemove = (index: number) => {
        const newVal = [...selectedFactory];
        newVal.splice(index, 1);
        setSelectedFactory(newVal);
    };

    const onChangeSelected = (index: number) => {
        const newVal = [...cabinConfig];
        const config = newVal[index];
        config.selected =
            config.selected === "capacity" ? "security" : "capacity";
        setCabinConfig(newVal);
    };

    const onAddShield = (index: number) => {
        if (!shieldToAdd[index]) {
            return;
        }
        const newCabinVal = [...cabinConfig];
        const newShieldVal = [...shieldToAdd];
        const config = newCabinVal[index];
        selectedFactory[index].shieldInUse += shieldToAdd[index];
        newShieldVal[index] = 0;
        setCabinConfig(newCabinVal);
        setShieldToAdd(newShieldVal);
    };

    const onInputChange: (
        e: ChangeEvent<HTMLInputElement>,
        index: number,
    ) => void = (e, index) => {
        const val = parseInt(e.currentTarget.value, 10);
        const newVal = [...shieldToAdd];

        if (Number.isNaN(val)) {
            newVal[index] = 0;
        } else {
            newVal[index] = val;
        }
        setShieldToAdd(newVal);
    };

    useEffect(() => {
        const newCabinVal = [...cabinConfig];
        const newShieldVal = [...shieldToAdd];
        if (cabinConfig.length > selectedFactory.length) {
            newCabinVal.splice(
                selectedFactory.length - 1,
                cabinConfig.length - selectedFactory.length,
            );
            newShieldVal.splice(
                selectedFactory.length - 1,
                cabinConfig.length - selectedFactory.length,
            );
        } else if (cabinConfig.length < selectedFactory.length) {
            for (
                let i = 0;
                i < selectedFactory.length - cabinConfig.length;
                i++
            ) {
                newCabinVal.push({
                    selected: "security",
                });
                newShieldVal.push(0);
            }
        }
        setCabinConfig(newCabinVal);
        setShieldToAdd(newShieldVal);
    }, [selectedFactory]);

    return (
        <VStack spacing={0} pos="relative" ml="8vw">
            <Img src={Title} ml="-15vw" mb="-16px !important" />
            {[0, 1, 2].map((index) => (
                <HStack
                    spacing="24px"
                    w="100%"
                    h="23vh"
                    key={index}
                    alignItems="flex-end"
                >
                    <Box
                        bgImg={Container}
                        bgSize="100% 100%"
                        bgRepeat="no-repeat"
                        h="23vh"
                        flexBasis="60%"
                        pos="relative"
                    >
                        {selectedFactory[index] ? (
                            <Fragment>
                                <Img
                                    pos="absolute"
                                    left="2.3vw"
                                    top="10vh"
                                    src={Clear}
                                    cursor="pointer"
                                    onClick={() => onRemove(index)}
                                />
                                <Img
                                    pos="absolute"
                                    left="12vw"
                                    bottom="5vh"
                                    src={selectedFactory[index].img}
                                    maxW="150px"
                                    maxH="150px"
                                />
                            </Fragment>
                        ) : null}
                    </Box>
                    {selectedFactory[index] ? (
                        <VStack spacing="4px">
                            <Box
                                bg="linear-gradient(180deg, rgba(0, 0, 0, 0.1) 42.71%, rgba(255, 250, 160, 0.35) 100%)"
                                border="5px solid rgba(143, 255, 249, 1)"
                                backdropFilter="blur(5px)"
                                borderRadius="20px"
                                w="17vw"
                                h="18vh"
                            >
                                {cabinConfig[index]?.selected === "security" ? (
                                    <Fragment>
                                        <Box
                                            bg="linear-gradient(180deg, rgba(143, 255, 249, 0) 0%, #8FFFF9 143.24%)"
                                            padding="4px 8px"
                                        >
                                            <Text
                                                fontFamily="Orbitron"
                                                fontWeight="500"
                                                fontSize="24px"
                                                color="#FFF761"
                                            >
                                                Security
                                            </Text>
                                        </Box>
                                        <VStack
                                            spacing="4px"
                                            alignItems="flex-start"
                                            mt="4px"
                                            ml="16px"
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
                                                    {
                                                        selectedFactory[index]
                                                            ?.shieldInUse
                                                    }
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
                                                    {
                                                        selectedFactory[index]
                                                            ?.shieldDamaged
                                                    }
                                                </Text>
                                                <Img
                                                    src={DamagedShield}
                                                    w="24px"
                                                />
                                            </HStack>
                                            <HStack spacing="4px">
                                                <Text
                                                    fontFamily="Quantico"
                                                    fontSize="20px"
                                                    color="white"
                                                >
                                                    Add Shields:
                                                </Text>
                                                <Input
                                                    variant="flushed"
                                                    borderRadius="none"
                                                    fontSize="20px"
                                                    w="60px"
                                                    textAlign="center"
                                                    color="#FFF761"
                                                    value={shieldToAdd[index]}
                                                    onChange={(e) =>
                                                        onInputChange(e, index)
                                                    }
                                                />
                                                <Button
                                                    variant="outline"
                                                    colorScheme="yellow"
                                                    onClick={() =>
                                                        onAddShield(index)
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                            </HStack>
                                        </VStack>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <Box
                                            bg="linear-gradient(180deg, rgba(143, 255, 249, 0) 0%, #8FFFF9 143.24%)"
                                            padding="4px 8px 0"
                                        >
                                            <Text
                                                fontFamily="Orbitron"
                                                fontWeight="500"
                                                fontSize="24px"
                                                color="#FFF761"
                                            >
                                                Production Capacity
                                            </Text>
                                        </Box>
                                        <VStack
                                            spacing="-2px"
                                            alignItems="flex-start"
                                            mt="4px"
                                            ml="16px"
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
                                                        {
                                                            selectedFactory[
                                                                index
                                                            ].dailyFuelOutput
                                                        }
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
                                                        {
                                                            selectedFactory[
                                                                index
                                                            ].dailyBatteryOutput
                                                        }
                                                    </Text>
                                                    <Img
                                                        src={Battery}
                                                        w="32px"
                                                    />
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
                                                        {
                                                            selectedFactory[
                                                                index
                                                            ].totalFuelOutput
                                                        }
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
                                                        {
                                                            selectedFactory[
                                                                index
                                                            ].totalBatteryOutput
                                                        }
                                                    </Text>
                                                    <Img
                                                        src={Battery}
                                                        w="32px"
                                                    />
                                                </HStack>
                                            </HStack>
                                        </VStack>
                                    </Fragment>
                                )}
                            </Box>
                            <HStack
                                bg="rgba(255, 247, 97, 0.25)"
                                borderRadius="10px"
                                w="150px"
                                h="30px"
                                spacing="10px"
                                justifyContent="center"
                            >
                                <Box
                                    cursor={
                                        cabinConfig[index]?.selected ===
                                        "security"
                                            ? "initial"
                                            : "pointer"
                                    }
                                    w={
                                        cabinConfig[index]?.selected ===
                                        "security"
                                            ? "15px"
                                            : "10px"
                                    }
                                    h={
                                        cabinConfig[index]?.selected ===
                                        "security"
                                            ? "15px"
                                            : "10px"
                                    }
                                    bg={
                                        cabinConfig[index]?.selected ===
                                        "security"
                                            ? "#FFF761"
                                            : "#DED8D2"
                                    }
                                    borderRadius="50%"
                                    onClick={() => onChangeSelected(index)}
                                />
                                <Box
                                    cursor={
                                        cabinConfig[index]?.selected ===
                                        "capacity"
                                            ? "initial"
                                            : "pointer"
                                    }
                                    w={
                                        cabinConfig[index]?.selected ===
                                        "capacity"
                                            ? "15px"
                                            : "10px"
                                    }
                                    h={
                                        cabinConfig[index]?.selected ===
                                        "capacity"
                                            ? "15px"
                                            : "10px"
                                    }
                                    bg={
                                        cabinConfig[index]?.selected ===
                                        "capacity"
                                            ? "#FFF761"
                                            : "#DED8D2"
                                    }
                                    borderRadius="50%"
                                    onClick={() => onChangeSelected(index)}
                                />
                            </HStack>
                        </VStack>
                    ) : null}
                </HStack>
            ))}
        </VStack>
    );
};
