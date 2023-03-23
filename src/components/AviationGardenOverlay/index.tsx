import { Box, Text, HStack, Portal } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";

import CloseIcon from "../../assets/close.svg";

import { AviationBoard } from "./AviationBoard";
import { PilotBoard } from "./PilotBoard";
import { ActionBoard, Level1ActionBoard } from "./ActionBoard";

export type AviationGardenOverlayProps = {
    level: number | undefined;
    onOverlayClose: () => void;
};

export type AviationInfo = {
    img: string;
    fuel: number;
    battery: number;
};

const Overlay = styled(Box)`
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(7.5px);
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 900;
`;

const CloseButton = styled(Box)`
    width: 32px;
    height: 32px;
`;

export const AviationGardenOverlay: FC<AviationGardenOverlayProps> = ({
    onOverlayClose,
    level,
}) => {
    const [selectedAviation, setSelectedAviation] = useState<AviationInfo[]>(
        [],
    );

    const isLevel1 = level === 1;

    useEffect(() => {
        if (!level) {
            setSelectedAviation([]);
        }
    }, [level]);

    if (!level) {
        return null;
    }

    return (
        <Portal>
            <Overlay pos="relative">
                <Text
                    fontFamily="Orbitron"
                    fontWeight="700"
                    fontSize="48px"
                    color="#FFF761"
                    pos="relative"
                    top="6vh"
                    left="40px"
                    w="fit-content"
                >
                    Aviation
                </Text>
                <HStack pos="relative" top="6vh" spacing="20px">
                    <Box border="1px solid #FFFFFF" flex="1" />
                    <CloseButton
                        onClick={onOverlayClose}
                        bgImage={CloseIcon}
                        top="0"
                        cursor="pointer"
                    />
                    <Box border="1px solid #FFFFFF" w="2vw" />
                </HStack>
                <HStack
                    spacing="30px"
                    h="68vh"
                    w="90vw"
                    top="10vh"
                    pos="relative"
                    left="5vw"
                >
                    <Box flex="1" h="100%">
                        <AviationBoard
                            level={level}
                            selectedAviation={selectedAviation}
                            setSelectedAviation={setSelectedAviation}
                        />
                    </Box>
                    {isLevel1 ? (
                        <Box w="22vw" h="100%">
                            <PilotBoard />
                        </Box>
                    ) : null}
                    {isLevel1 ? (
                        <Level1ActionBoard
                            level={level}
                            selectedAviation={selectedAviation}
                            setSelectedAviation={setSelectedAviation}
                        />
                    ) : (
                        <ActionBoard
                            level={level}
                            selectedAviation={selectedAviation}
                            setSelectedAviation={setSelectedAviation}
                        />
                    )}
                </HStack>
            </Overlay>
        </Portal>
    );
};
