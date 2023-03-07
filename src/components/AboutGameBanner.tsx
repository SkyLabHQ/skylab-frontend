import { Box, Heading, Image, Stack, Text, Img } from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";

import diamondBullet from "../assets/diamond-bullet.svg";
import Graph from "../assets/home-graph.png";
import Builder0 from "../assets/home-builder-0.svg";
import Builder1 from "../assets/home-builder-1.svg";
import Builder2 from "../assets/home-builder-2.svg";
import Builder3 from "../assets/home-builder-3.svg";
import Developer0 from "../assets/home-developer-0.svg";
import Developer1 from "../assets/home-developer-1.svg";
import Developer2 from "../assets/home-developer-2.svg";
import Developer3 from "../assets/home-developer-3.svg";
import Player0 from "../assets/home-player-0.svg";
import Player1 from "../assets/home-player-1.svg";
import Player2 from "../assets/home-player-2.svg";
import Player3 from "../assets/home-player-3.svg";

const BUILDERS = [Builder0, Builder1, Builder2, Builder3];
const DEVELOPERS = [Developer0, Developer1, Developer2, Developer3];
const PLAYERS = [Player0, Player1, Player2, Player3];

const AboutGameBanner = (): ReactElement => {
    const [builderIndex, setBuilderIndex] = useState(0);
    const [developerIndex, setDeveloperIndex] = useState(0);
    const [playerIndex, setPlayerIndex] = useState(0);

    const onClick = (type: string) => {
        let index = 0;
        switch (type) {
            case "builder":
                index = builderIndex;
                break;
            case "developer":
                index = developerIndex;
                break;
            case "player":
                index = playerIndex;
                break;
        }
        const newIndex = index === 3 ? 0 : index + 1;
        switch (type) {
            case "builder":
                setBuilderIndex(newIndex);
                break;
            case "developer":
                setDeveloperIndex(newIndex);
                break;
            case "player":
                setPlayerIndex(newIndex);
                break;
        }
    };

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
                <Box w="90vw" h="100vh" pos="relative" left="-5vw">
                    <Img w="90vw" h="100vh" pos="absolute" src={Graph} />
                    <Img
                        pos="absolute"
                        right="8vw"
                        top="35vh"
                        src={BUILDERS[builderIndex]}
                        cursor="pointer"
                        onClick={() => onClick("builder")}
                    />
                    <Img
                        pos="absolute"
                        right="7vw"
                        top="5vh"
                        src={DEVELOPERS[developerIndex]}
                        cursor="pointer"
                        onClick={() => onClick("developer")}
                    />
                    <Img
                        pos="absolute"
                        right="33vw"
                        top="37vh"
                        src={PLAYERS[playerIndex]}
                        cursor="pointer"
                        onClick={() => onClick("player")}
                    />
                </Box>
            </Stack>
            <Box w="90vw">
                <Text textAlign="left" fontWeight={700}>
                    *For initial system stability, ECS contracts will not be
                    open for all developers to plug-in PvP games from day one.
                    The system will gradually open to all game developers.
                </Text>
            </Box>
        </Stack>
    );
};

export default AboutGameBanner;
