import { Box, Img, Text } from "@chakra-ui/react";
import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";

import MetadataPlaneImg from "@/skyConstants/metadata";
import { PlaneInfo } from "@/pages/Mercury";
import { SubmitButton } from "../Button/Index";
import { useNavigate } from "react-router-dom";

interface ChildProps {
    currentImg: number;
    planeList: PlaneInfo[];
    onNextRound: (nextStep: number) => void;
    onCurrentImg: (index: number) => void;
}

const MissionRound = ({
    currentImg,
    planeList,
    onNextRound,
    onCurrentImg,
}: ChildProps) => {
    const navigate = useNavigate();

    const handleToSpend = () => {
        navigate(`/spendResource?tokenId=${planeList[currentImg].tokenId}`);
    };
    return (
        <Box zIndex={100}>
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
                    position="relative"
                    onClick={(e) => {
                        onNextRound(6);
                    }}
                >
                    {currentImg !== 0 && (
                        <Img
                            src={LeftArrow}
                            pos="absolute"
                            left="0"
                            top="50%"
                            transform="translateY(-50%)"
                            cursor="pointer"
                            zIndex={100}
                            onClick={() => {
                                if (currentImg === 0) {
                                    onCurrentImg(planeList.length - 1);
                                    return;
                                }
                                onCurrentImg(currentImg - 1);
                            }}
                        ></Img>
                    )}
                    {currentImg !== planeList.length - 1 && (
                        <Img
                            src={RightArrow}
                            pos="absolute"
                            right="0"
                            top="50%"
                            transform="translateY(-50%)"
                            cursor="pointer"
                            zIndex={100}
                            onClick={() => {
                                onCurrentImg(currentImg - 1);
                            }}
                        ></Img>
                    )}
                    <Img
                        src={MetadataPlaneImg(planeList[currentImg].tokenId)}
                        pos="absolute"
                        left="50%"
                        top="50%"
                        transform="translate(-50%,-50%)"
                        w="334px"
                        h="241px"
                        cursor={"pointer"}
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
                        Level {planeList[currentImg].level}
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
            <SubmitButton
                style={{
                    width: "820px",
                    cursor: "pointer",
                    pos: "absolute",
                    bottom: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                }}
                onClick={handleToSpend}
            >
                Request access for next round
            </SubmitButton>
        </Box>
    );
};

export default MissionRound;
