import { Box, Center, Heading, Image } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import MintTimeline from "../components/MintTimeline";
import plane from "../assets/plane.svg";

const Mint = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <Box mt="100px" minH="100vh">
            <Center>
                <Heading
                    pt="3vw"
                    as="h1"
                    fontSize="7.5vw"
                    letterSpacing="wider"
                >
                    {t("timeline")}
                </Heading>
            </Center>
            <Box pos="relative" top="-8vw">
                <MintTimeline />
                {/* <Box pos="relative" top="3vw">
                    <Box
                        w="50vw"
                        pos="absolute"
                        left="5%"
                        top="-26vw"
                        transform="rotate(-6.5deg)"
                    >
                        <Image src={plane} />
                    </Box>
                    <Center
                        pos="absolute"
                        top="8vw"
                        left="35%"
                        w="20vw"
                        transform="rotate(-6.5deg)"
                    >
                        <Heading fontSize="5vw">
                            <Trans
                                i18nKey="level"
                                values={{ num: t("eight") }}
                            />
                        </Heading>
                    </Center>
                </Box>
                <Box pos="relative" top="15vw">
                    <Box
                        w="15vw"
                        pos="absolute"
                        left="1%"
                        transform="rotate(9deg)"
                    >
                        <Image src={plane} />
                    </Box>
                    <Center
                        pos="absolute"
                        top="11.4vw"
                        left="7%"
                        w="10vw"
                        transform="rotate(9deg)"
                    >
                        <Heading fontSize="2vw">
                            <Trans
                                i18nKey="level"
                                values={{ num: t("seven") }}
                            />
                        </Heading>
                    </Center>
                </Box>
                <Box pos="relative" top="20vw">
                    <Box pos="absolute" left="60%">
                        <Box
                            w="15vw"
                            pos="absolute"
                            transform="rotate(-5deg)"
                        >
                            <Image src={plane} />
                        </Box>
                        <Center
                            pos="relative"
                            top="10.5vw"
                            left="70%"
                            w="10vw"
                            transform="rotate(-5deg)"
                        >
                            <Heading fontSize="2vw">
                                <Trans
                                    i18nKey="level"
                                    values={{ num: t("seven") }}
                                />
                            </Heading>
                        </Center>
                    </Box>
                </Box> */}
            </Box>
        </Box>
    );
};

export default Mint;
