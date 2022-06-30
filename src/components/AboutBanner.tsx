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

const AboutBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center">
            <Image src={diamondBullet} />
            <Stack spacing="150px">
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
                    alignItems="center"
                    justifyContent="space-between"
                    maxW="1200px"
                >
                    <UnorderedList spacing="15px" maxW="45%">
                        <ListItem>
                            <Text
                                textAlign="justify"
                                fontSize={{
                                    base: "14px",
                                    md: "20px",
                                    xl: "25px",
                                }}
                            >
                                Sky Lab builds PFP-themed on-chain strategy
                                games with NFTs that can be collided, upgraded
                                or downgraded, attacked or defended, staked or
                                held etc
                            </Text>
                        </ListItem>
                        <ListItem>
                            <Text
                                textAlign="justify"
                                fontSize={{
                                    base: "14px",
                                    md: "20px",
                                    xl: "25px",
                                }}
                            >
                                There is an infinite amount of Level 1 token and
                                an infinite number of Levels that pilots can go
                                up to. However, the supply of each level
                                fluctuates as pilots collectively make decisions
                                within the game. But of course, the higher, the
                                rarer.
                            </Text>
                        </ListItem>
                    </UnorderedList>
                    <Box boxSize="200px" pos="relative">
                        <Image src={logo} objectFit="cover" w="full" />
                    </Box>
                </Flex>
            </Stack>
        </Stack>
    );
};

export default AboutBanner;
