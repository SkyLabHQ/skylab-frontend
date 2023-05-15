import { BatteryScalerBg, FuelScalerImg } from "@/skyConstants/gridInfo";
import { HStack, VStack, Text, Box, Img } from "@chakra-ui/react";
import React from "react";
import { MapInfo } from ".";
import { getGridStyle } from "./map";

const MapGridInfo = ({ mapDetail }: { mapDetail: MapInfo }) => {
    return (
        <VStack
            bg="rgba(217, 217, 217, 0.2)"
            border="5px solid #FFF761"
            borderRadius="16px"
            w="100%"
            padding="24px 32px"
            spacing="40px"
        >
            <Text
                fontFamily="Orbitron"
                fontSize="48px"
                lineHeight="1"
                fontWeight="600"
                w="100%"
            >
                Grid Info
            </Text>
            <HStack w="100%" spacing="24px" justifyContent="space-between">
                <Box
                    width="124px"
                    height="124px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    {...getGridStyle(
                        {
                            ...mapDetail,
                            selected: false,
                            hover: false,
                        },
                        false,
                    )}
                >
                    <Box bg={BatteryScalerBg[mapDetail.batteryScaler]}>
                        <Img
                            src={FuelScalerImg[mapDetail.fuelScaler]}
                            w="120px"
                            h="120px"
                        />
                    </Box>
                </Box>
                <VStack
                    alignItems="flex-start"
                    justifyContent="space-between"
                    flex="1"
                    h="124px"
                >
                    <Text
                        fontFamily="Quantico"
                        fontSize="36px"
                        lineHeight="1"
                        color="white"
                    >
                        Air drag {mapDetail.fuelScaler}
                    </Text>
                    <Text
                        fontFamily="Quantico"
                        fontSize="36px"
                        lineHeight="1"
                        color="white"
                    >
                        Air batteryScaler {mapDetail.batteryScaler}
                    </Text>
                    <Text
                        fontFamily="Quantico"
                        fontSize="36px"
                        lineHeight="1"
                        color="white"
                    >
                        Distance {mapDetail.distance}
                    </Text>
                </VStack>
            </HStack>
        </VStack>
    );
};

export default MapGridInfo;
