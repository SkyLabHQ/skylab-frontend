import {
    Box,
    Flex,
    Heading,
    Image,
    ListItem,
    Stack,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import diamondBullet from "../assets/diamond-bullet.svg";
import logo from "../assets/logo.svg";
import infiniteYetRare from "../assets/Infinite-yet-rare.svg";
import infiniteLine from "../assets/InfiniteLine.svg";

const AboutBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center" pt="10%">
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
                    Infinite, yet Rare
                </Heading>
                <Flex
                    alignItems="start"
                    justifyContent="space-between"
                    maxW="1400px"
                >
                    <UnorderedList
                        spacing="15px"
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
                        <ListItem>
                            <Text>
                                Sky Lab builds PFP-themed on-chain strategy
                                games with NFTs that can be collided, upgraded
                                or downgraded, attacked or defended, staked or
                                held etc
                            </Text>
                        </ListItem>
                        <ListItem>
                            <Text>
                                There is an infinite amount of Level 1 token and
                                an infinite number of Levels that pilots can go
                                up to. However, the supply of each level
                                fluctuates as pilots collectively make decisions
                                within the game. But of course, the higher, the
                                rarer.
                            </Text>
                        </ListItem>
                    </UnorderedList>
                    <Box pos="relative" w="full">
                        <Box
                            pos="absolute"
                            boxSize="100vw"
                            left="-50vw"
                        >
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
