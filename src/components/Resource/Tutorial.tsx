import React, { ReactElement, useEffect, useState } from "react";
import { Box, Button, Container, Img, Text } from "@chakra-ui/react";
import { configs } from "./config";

const Tutorial = ({
    handleTutorial,
}: {
    handleTutorial: () => void;
}): ReactElement => {
    const [step, setStep] = useState(0);

    const config = configs[step];

    const onOk = () => {
        if (step >= configs.length - 1) {
            handleTutorial();
        }
        setStep((val) => val + 1);
    };

    const onSkip = () => {
        handleTutorial();
    };

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "Escape":
                    onSkip();
                    break;
                case "ArrowRight":
                    onOk();
                    break;
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [step]);

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
        >
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
export default Tutorial;
