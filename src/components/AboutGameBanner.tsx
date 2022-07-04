import {
    Box,
    Heading,
    Image,
    ListItem,
    Stack,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import diamondBullet from "../assets/diamond-bullet.svg";
import planesBanner from "../assets/planes-banner.svg";

const AboutGameBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center" pt="10%">
            <Image src={diamondBullet} />
            <Stack
                spacing="70px"
                alignItems="center"
                paddingInlineStart="1rem"
                paddingInlineEnd="1rem"
            >
                <Heading
                    fontSize={{
                        base: "25px",
                        md: "35px",
                        lg: "50px",
                        xl: "60px",
                    }}
                    textAlign="center"
                >
                    Probably Something
                </Heading>
                <Stack
                    spacing="10px"
                    fontSize={{
                        base: "14px",
                        md: "20px",
                        xl: "25px",
                    }}
                    maxW="1000px"
                >
                    <Text textAlign="left" fontWeight={700}>
                        We build games with never-before-seen mechanisms:
                    </Text>
                    <Box pl="10px">
                        <UnorderedList spacing="2px">
                            <ListItem>
                                NFTs that can be collided with each other and
                                initiate a competitive casual game between
                                holders.
                            </ListItem>
                            <ListItem>
                                Staked NFTs that can be attacked or protected by
                                other NFTs.
                            </ListItem>
                            <ListItem>
                                NFTs that generate in-game utility NFTs. The
                                longer you hold, the more generated!
                            </ListItem>
                            <ListItem>
                                NFTs and rewards are dynamically priced to make
                                collisions approximately no-loss, only gains.
                            </ListItem>
                        </UnorderedList>
                    </Box>
                </Stack>
            </Stack>
            <Box w="100%">
                <Image src={planesBanner} objectFit="cover" w="full"/>
            </Box>
        </Stack>
    );
};

export default AboutGameBanner;
