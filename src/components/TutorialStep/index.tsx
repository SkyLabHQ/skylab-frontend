import { Box, Button, Container, Img, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";

import { Config } from "./config";
import Back from "../../assets/tutorial-back.svg";

export const TutorialStep = ({
    config,
    onOk,
    onBack,
    onSkip,
}: {
    config: Config;
    onOk: () => void;
    onBack: () => void;
    onSkip: () => void;
}): ReactElement => {
    return (
        <Container
            w="100vw"
            maxW="auto"
            h="100vh"
            bgImg={config.bgImg}
            bgSize="100% 100%"
            bgPos="top left"
            bgRepeat="no-repeat"
            p="0"
            display="flex"
            flexDirection="column"
            pos={"absolute"}
            left={0}
            top={0}
            zIndex={1000}
            fontFamily="Orbitron"
        >
            <Img
                src={Back}
                pos="absolute"
                w="150px"
                top={config.back?.position === "bottom" ? "90vh" : "2vh"}
                left="2vw"
                cursor="pointer"
                onClick={onBack}
            />
            {config.container.map((containerItem) => (
                <Box
                    w={`${containerItem.w}vw`}
                    h={`${containerItem.h}vh`}
                    bg={containerItem.mask ? "rgba(0, 0, 0, 0.8)" : "initial"}
                    borderRadius={containerItem.target ? "20px" : "initial"}
                    border={
                        containerItem.target ? "5px dashed #F5CA5C" : "initial"
                    }
                    display="flex"
                >
                    {containerItem.children?.map((child) => (
                        <Box
                            w={`${child.w}vw`}
                            bg={child.mask ? "rgba(0, 0, 0, 0.8)" : "initial"}
                            borderRadius={child.target ? "20px" : "initial"}
                            border={
                                child.target ? "5px dashed #F5CA5C" : "initial"
                            }
                            display="flex"
                            flexDirection="column"
                        >
                            {child.children?.map((secondaryChild) => (
                                <Box
                                    h={`${secondaryChild.h}vh`}
                                    bg={
                                        secondaryChild.mask
                                            ? "rgba(0, 0, 0, 0.8)"
                                            : "initial"
                                    }
                                    borderRadius={
                                        secondaryChild.target
                                            ? "20px"
                                            : "initial"
                                    }
                                    border={
                                        secondaryChild.target
                                            ? "5px dashed #F5CA5C"
                                            : "initial"
                                    }
                                ></Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            ))}
            <Box
                pos="fixed"
                bg="white"
                borderRadius="20px"
                {...config.hint.style}
                css={{
                    ":before": {
                        content: '""',
                        width: "0px",
                        height: "0px",
                        position: "absolute",
                        ...config.hint.mark,
                    },
                    ":after": {
                        content: '""',
                        width: "0px",
                        height: "0px",
                        position: "absolute",
                        ...config.hint.markTwo,
                    },
                }}
                padding={config.hint.padding ?? "32px 40px"}
                display="flex"
                flexDirection={config.hint.flexDirection ?? "column"}
                alignItems="center"
            >
                {config.hint.content}
                <Box display="flex" justifyContent="center">
                    <Button
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        color="black"
                        colorScheme="yellow"
                        borderRadius="20px"
                        w="160px"
                        h="75px"
                        margin="0 auto"
                        onClick={onOk}
                    >
                        OK
                    </Button>
                </Box>
                <Box
                    pos="absolute"
                    w={config.hint.flexDirection === "row" ? "300px" : "100%"}
                    right={config.hint.flexDirection === "row" ? "-300px" : "0"}
                    bottom={config.hint.flexDirection === "row" ? "0" : "-60px"}
                    textAlign="center"
                >
                    <Text
                        display="inline-block"
                        margin="0 auto"
                        cursor="pointer"
                        color="#BCBBBE"
                        textDecorationLine="underline"
                        textAlign="center"
                        fontFamily="Orbitron"
                        fontSize="36px"
                        fontWeight={600}
                        onClick={onSkip}
                    >
                        Skip tutorial
                    </Text>
                </Box>
            </Box>
        </Container>
    );
};
