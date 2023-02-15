import { Heading, Image, Stack, Text } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import diamondBullet from "../assets/diamond-bullet.svg";

const ConceptBanner = (): ReactElement => {
    return (
        <Stack spacing="40px" alignItems="center" pt="10%" pb="10%">
            <Image src={diamondBullet} />
            <Heading
                fontSize={{
                    base: "25px",
                    md: "35px",
                    lg: "50px",
                    xl: "60px",
                }}
                textAlign="center"
            >
                The Concept
            </Heading>
            <Stack spacing="20px" maxW="1000px">
                <Text
                    textAlign="justify"
                    fontSize={{
                        base: "14px",
                        md: "20px",
                        xl: "25px",
                    }}
                >
                    Apollo Game is an autonomous system that humans (players &
                    developers) interact with.
                </Text>
                <Text
                    textAlign="justify"
                    fontSize={{
                        base: "14px",
                        md: "20px",
                        xl: "25px",
                    }}
                >
                    From hunters and gatherers days till today, humanity has
                    been striving for that 'one step further': We are alive
                    because of our aspirations. We are alive for the next big
                    thing, for the better, for figuring out what we can possibly
                    achieve.
                </Text>
                <Text
                    textAlign="justify"
                    fontSize={{
                        base: "14px",
                        md: "20px",
                        xl: "25px",
                    }}
                >
                    Apollo Game mimics this core spirit as well as the
                    fundamental struggle of humanity. Every player, developer,
                    decision, and step shape how this eternal system evolves. In
                    Apollo Game, everyone starts from the bottom (Level 1). Our
                    free will determines how far we can go.
                </Text>
                <Text
                    textAlign="justify"
                    fontSize={{
                        base: "14px",
                        md: "20px",
                        xl: "25px",
                    }}
                >
                    Of course - the higher, the better.
                </Text>
            </Stack>
        </Stack>
    );
};

export default ConceptBanner;
