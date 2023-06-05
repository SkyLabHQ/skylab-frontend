import { Box, Img, Text } from "@chakra-ui/react";
import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";

import MetadataPlaneImg from "@/skyConstants/metadata";
import { PlaneInfo } from "@/pages/Mercury";
import { SubmitButton } from "../Button/Index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface ChildProps {
    currentImg: number;
    planeList: PlaneInfo[];
    onNextRound: (nextStep: number) => void;
    onCurrentImg: (index: number) => void;
    onBigger: () => void;
}

const MissionRound = ({
    currentImg,
    planeList,
    onNextRound,
    onCurrentImg,
    onBigger,
}: ChildProps) => {
    const navigate = useNavigate();

    const [next, setNext] = useState(false);

    const handleToSpend = () => {
        navigate(`/spendResource?tokenId=${planeList[currentImg].tokenId}`);
    };

    return (
        <Box
            h={"100vh"}
            w={"100vw"}
            zIndex={100}
            onClick={() => {
                setNext(false);
            }}
        >
            <Box pos="absolute" zIndex={100} left="3.1vw" top="1.2vh">
                <Text fontSize="48px" fontWeight={800}>
                    Activities
                </Text>
            </Box>
            {!next && (
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
                            e.stopPropagation();
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
                                onClick={(e) => {
                                    e.stopPropagation();
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCurrentImg(currentImg - 1);
                                }}
                            ></Img>
                        )}
                        <Img
                            src={MetadataPlaneImg(planeList[currentImg].level)}
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
            )}

            <Box
                pos="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%,-50%)"
            >
                <Text
                    fontWeight={800}
                    fontSize={next ? "128px" : "88px"}
                    cursor={"pointer"}
                    textAlign={"center"}
                    transition={"all 0.3s ease-in-out"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onBigger();
                        setNext(true);
                    }}
                >
                    Trailblazer
                </Text>
                {next && (
                    <Box
                        width="963px"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontWeight: 600,
                        }}
                    >
                        <Box
                            sx={{
                                background: "#8DF6F5",
                                border: "3px solid #FFAD29",
                                backdropFilter: "blur(7.5px)",
                                borderRadius: "20px",
                                width: "426px",
                                height: "102px",
                                color: "#000",
                                textAlign: "center",
                                cursor: "pointer",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToSpend();
                            }}
                        >
                            <Text sx={{ fontSize: "36px" }}>Test flght</Text>
                            <Text sx={{ fontSize: "20px" }}>
                                Freemium version
                            </Text>
                        </Box>
                        <Box
                            sx={{
                                background:
                                    "linear-gradient(270deg, #8DF6F5 0%, #FFAD29 49.48%, #8DF6F5 100%)",
                                border: "3px solid #FFAD29",
                                backdropFilter: "blur(7.5px)",
                                borderRadius: "20px",
                                width: "426px",
                                height: "102px",
                                color: "#000",
                                textAlign: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Text sx={{ fontSize: "36px" }}>Set Off</Text>
                            <Text sx={{ fontSize: "20px" }}>Real version</Text>
                        </Box>
                    </Box>
                )}
            </Box>

            {!next && (
                <SubmitButton
                    style={{
                        width: "820px",
                        cursor: "pointer",
                        pos: "absolute",
                        bottom: "100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();

                        window.open(
                            "https://twitter.com/skylabhq?s=21&t=3tvwVYYbX3FtWjnf7IBmAA",
                        );
                    }}
                >
                    Request access for next round
                </SubmitButton>
            )}
        </Box>
    );
};

export default MissionRound;
