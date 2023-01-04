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

const Emphasis = ({ children }: { children: string }) => (
    <strong style={{ fontSize: 32 }}>{children}</strong>
);

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
                                <Emphasis>Aviation tokens</Emphasis> that
                                collide with each other and initiate competitive
                                games between holders
                            </ListItem>
                            <ListItem>
                                <Emphasis>Aviation tokens</Emphasis> are
                                upgraded or downgraded based on competitive
                                games' result
                            </ListItem>
                            <ListItem>
                                <Emphasis>Factory tokens</Emphasis> produce{" "}
                                <Emphasis>
                                    in-game resources (Fuel and Propellers)
                                </Emphasis>
                            </ListItem>
                            <ListItem>
                                <Emphasis>Brick tokens</Emphasis> protect{" "}
                                <Emphasis>Factory tokens</Emphasis>
                            </ListItem>
                            <ListItem>
                                <Emphasis>Bomb tokens</Emphasis> attack{" "}
                                <Emphasis>Factory tokens</Emphasis>
                            </ListItem>
                            <ListItem>
                                <Emphasis>Treasury</Emphasis> automatically
                                buy-back and burn{" "}
                                <Emphasis>Aviation tokens</Emphasis> when price
                                drops below pre-set values
                            </ListItem>
                        </UnorderedList>
                    </Box>
                </Stack>
            </Stack>
            <Box w="100%">
                <Image src={planesBanner} objectFit="cover" w="full" />
            </Box>
        </Stack>
    );
};

export default AboutGameBanner;
