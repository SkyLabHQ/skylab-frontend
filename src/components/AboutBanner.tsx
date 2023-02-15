import {
    Box,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import diamondBullet from "../assets/diamond-bullet.svg";
import infiniteYetRare from "../assets/Infinite-yet-rare.svg";

const AboutBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center" pt="10%" pb="10%">
            <Image src={diamondBullet} />
            <Stack spacing="50px">
                <Heading
                    fontSize={{
                        base: "25px",
                        md: "35px",
                        lg: "50px",
                        xl: "60px",
                    }}
                    textAlign="center"
                >
                    Hey Friends, Welcome to Sky Lab
                </Heading>
                <Flex
                    alignItems="start"
                    justifyContent="space-between"
                    maxW="1400px"
                >
                    <VStack
                        spacing="32px"
                        maxW="45%"
                        mt="10%"
                        fontSize={{
                            base: "12px",
                            sm: "14px",
                            md: "20px",
                            xl: "25px",
                        }}
                        textAlign="justify"
                    >
                        <Text>
                            To explore the interoperability and composability of
                            on-chain games, Sky Lab is an experimental attempt
                            to build fun and autonomous systems that players and
                            developers are incentivized to happily interact with
                            -- autonomous systems that go on forever.
                        </Text>
                        <Text>
                            After full deployment, it's out of our hands. While
                            we support the system on the side as a foundation,
                            we look forward to seeing how things unfold :)
                        </Text>
                    </VStack>
                    <Box pos="relative" w="full">
                        <Box pos="absolute" boxSize="100vw" left="-50vw">
                            <Image
                                src={infiniteYetRare}
                                objectFit="cover"
                                w="full"
                            />
                        </Box>
                    </Box>
                </Flex>
            </Stack>
        </Stack>
    );
};

export default AboutBanner;
