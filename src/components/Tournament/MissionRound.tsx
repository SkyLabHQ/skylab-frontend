import useSwitchProfiles from "../../hooks/useSwitchProfiles";
import {
    Box,
    Grid,
    GridItem,
    HStack,
    Img,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";
import Plane from "./assets/plane.svg";

import MissionNextRoundBg from "./assets/mission-next-round.svg";

interface ChildProps {
    onNextRound: () => void;
}

const MissionRound = ({ onNextRound }: ChildProps) => {
    return (
        <Box>
            <Box pos="absolute" zIndex={100} left="3.1vw" top="1.2vh">
                <Text fontSize="36px" fontWeight={600}>
                    1st Mission
                </Text>
                <Text fontSize="48px" fontWeight={800}>
                    Project Mercury
                </Text>
            </Box>
            <Box pos="absolute" right="3.2vw" top="1.2vh" zIndex={100}>
                <Text fontSize="24px" fontWeight={600}>
                    Your Collection
                </Text>
                <Box
                    w="334px"
                    h="241px"
                    bg="rgba(217, 217, 217, 0.2)"
                    border="3px solid #FFAD29"
                    backdropFilter="blur(7.5px)"
                    borderRadius="40px"
                >
                    <Img
                        src={LeftArrow}
                        pos="absolute"
                        left="0"
                        top="50%"
                        transform="translateY(-50%)"
                    ></Img>
                    <Img
                        src={RightArrow}
                        pos="absolute"
                        right="0"
                        top="50%"
                        transform="translateY(-50%)"
                    ></Img>
                    <Img
                        src={Plane}
                        pos="absolute"
                        left="50%"
                        top="40%"
                        transform="translate(-50%,-50%)"
                    ></Img>
                    <Text
                        fontSize="36px"
                        fontWeight={600}
                        pos="absolute"
                        bottom="0"
                        left="0"
                        textAlign="center"
                        w="100%"
                    >
                        Level 1
                    </Text>
                </Box>
            </Box>
            <Text
                pos="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%,-50%)"
                fontWeight={800}
                fontSize="88px"
            >
                Trailblazer
            </Text>
            <Box
                onClick={(e) => {
                    console.log(111);
                    onNextRound();
                }}
                bg={`url(${MissionNextRoundBg})`}
                bgSize="100% 100%"
                w="464px"
                h="102px"
                paddingTop="20px"
                cursor="pointer"
                pos="absolute"
                bottom="100px"
                left="50%"
                transform="translateX(-50%)"
            >
                <Text
                    color="#000"
                    fontSize="24px"
                    fontWeight="600"
                    textAlign="center"
                >
                    Request access for next round
                </Text>
            </Box>
        </Box>
    );
};

export default MissionRound;
