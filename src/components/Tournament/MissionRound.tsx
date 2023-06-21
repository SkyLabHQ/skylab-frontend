import {
    Box,
    Img,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";
import PolygonIcon from "./assets/polygon.svg";
import GrayTipIcon from "./assets/gray-tip.svg";
import BlackTwIcon from "./assets/black-tw.svg";

import { PlaneInfo } from "@/pages/Mercury";
import { SubmitButton } from "../Button/Index";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSkylabTestFlightContract } from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import SkyToast from "../Toast";
import { handleError } from "@/utils/error";
import Loading from "../Loading";
import { twitterUrl } from "@/skyConstants";
import RoundTime from "@/skyConstants/roundTime";

interface ChildProps {
    bigger: boolean;
    currentImg: number;
    planeList: PlaneInfo[];
    onNextRound: (nextStep: number) => void;
    onCurrentImg: (index: number) => void;
    onBigger: (status: boolean) => void;
}

const MissionRound = ({
    bigger,
    currentImg,
    planeList,
    onNextRound,
    onCurrentImg,
    onBigger,
}: ChildProps) => {
    const toast = useToast({
        position: "top",
    });
    const [loading, setLoading] = useState(false);
    const { account } = useActiveWeb3React();
    const navigate = useNavigate();
    const skylabTestFlightContract = useSkylabTestFlightContract(true);

    const [next, setNext] = useState(false);

    const handleToSpend = () => {
        navigate(`/spendResource?tokenId=${planeList[currentImg].tokenId}`);
    };

    const handleMintPlayTest = async () => {
        try {
            setLoading(true);
            const res = await skylabTestFlightContract.playTestMint();
            await res.wait();
            setLoading(false);

            const balance1 = await skylabTestFlightContract.balanceOf(account);
            const p1 = new Array(balance1.toNumber())
                .fill("")
                .map((item, index) => {
                    return skylabTestFlightContract.tokenOfOwnerByIndex(
                        account,
                        index,
                    );
                });
            const planeTokenIds1 = await Promise.all(p1);
            if (planeTokenIds1.length > 0) {
                navigate(
                    `/spendResource?tokenId=${planeTokenIds1[
                        planeTokenIds1.length - 1
                    ].toNumber()}&testflight=true`,
                );
            }
        } catch (error) {
            setLoading(false);
            toast({
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
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
            {loading && <Loading></Loading>}
            <Box
                sx={{
                    position: "absolute",
                    left: "50%",
                    top: "3vh",
                    width: "30vw",
                    transform: "translateX(-50%)",
                    background: "#ABABAB",
                    padding: "5px 10px",
                    borderRadius: "10px",
                }}
            >
                <span
                    style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        verticalAlign: "middle",
                    }}
                >
                    Insufficient balance in wallet, go to faucet to get free
                    tokens{" "}
                </span>

                <img
                    onClick={() => {
                        window.open("https://faucet.polygon.technology/");
                    }}
                    src={PolygonIcon}
                    style={{
                        display: "inline-block",
                        height: "50px",
                        verticalAlign: "middle",
                        cursor: "pointer",
                    }}
                    alt=""
                />
            </Box>

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
                    >
                        {planeList.length > 0 ? (
                            <Box>
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
                                                onCurrentImg(
                                                    planeList.length - 1,
                                                );
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
                                            if (
                                                currentImg ===
                                                planeList.length - 1
                                            ) {
                                                onCurrentImg(
                                                    planeList.length - 1,
                                                );
                                                return;
                                            }
                                            e.stopPropagation();
                                            onCurrentImg(currentImg + 1);
                                        }}
                                    ></Img>
                                )}
                                <Img
                                    src={planeList[currentImg].img}
                                    pos="absolute"
                                    left="50%"
                                    top="50%"
                                    transform="translate(-50%,-50%)"
                                    w="334px"
                                    h="241px"
                                    cursor={"pointer"}
                                ></Img>
                                <Text
                                    fontSize="24px"
                                    fontWeight={600}
                                    pos="absolute"
                                    bottom="35px"
                                    left="0"
                                    textAlign="center"
                                    w="100%"
                                    color={"#BCBBBE"}
                                >
                                    {
                                        RoundTime[planeList[currentImg].round]
                                            .startTime
                                    }
                                    -
                                    {
                                        RoundTime[planeList[currentImg].round]
                                            .endTime
                                    }
                                </Text>
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
                        ) : (
                            <Box>
                                <Text
                                    sx={{
                                        fontSize: "24px",
                                        fontWeight: 600,
                                        padding: "30px 5px",
                                    }}
                                >
                                    You currently do not have any plane. Please
                                    claim your plane{" "}
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            <Box
                pos="absolute"
                left="50%"
                top="50%"
                h={"50vh"}
                minW={"40vw"}
                display="flex"
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                transform="translate(-50%,-50%)"
                cursor={"pointer"}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                onMouseOver={(e) => {
                    e.stopPropagation();
                    onBigger(true);
                    setNext(true);
                }}
                onMouseOut={(e) => {
                    e.stopPropagation();
                    onBigger(false);
                    setNext(false);
                }}
            >
                <Text
                    fontWeight={800}
                    fontSize={next ? "128px" : "88px"}
                    cursor={"pointer"}
                    textAlign={"center"}
                    transition={"all 0.3s ease-in-out"}
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
                                handleMintPlayTest();
                            }}
                        >
                            <Text sx={{ fontSize: "36px" }}>Test Flight</Text>
                            <Text sx={{ fontSize: "20px" }}>
                                Freemium version
                            </Text>
                        </Box>
                        <Box
                            sx={{
                                background:
                                    planeList.length === 0
                                        ? "#ABABAB"
                                        : "linear-gradient(270deg, #8DF6F5 0%, #FFAD29 49.48%, #8DF6F5 100%)",
                                border:
                                    planeList.length === 0
                                        ? "3px solid #ABABAB"
                                        : "3px solid #FFAD29",
                                backdropFilter: "blur(7.5px)",
                                borderRadius: "20px",
                                width: "426px",
                                height: "102px",
                                color:
                                    planeList.length === 0 ? "#616161" : "#000",
                                textAlign: "center",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (planeList.length === 0) {
                                    return;
                                }
                                handleToSpend();
                            }}
                        >
                            {planeList.length === 0 ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <Text
                                        sx={{
                                            fontSize: "36px",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Set Off
                                    </Text>

                                    <Popover placement="top">
                                        <PopoverTrigger>
                                            <Img src={GrayTipIcon}></Img>
                                        </PopoverTrigger>{" "}
                                        <PopoverContent
                                            sx={{
                                                background: "#D9D9D9",
                                                borderRadius: "10px",
                                                border: "none",
                                                color: "#000",
                                                textAlign: "center",
                                                "&:focus": {
                                                    outline: "none !important",
                                                    boxShadow:
                                                        "none !important",
                                                },
                                            }}
                                        >
                                            <PopoverBody
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(twitterUrl);
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontSize: "24px",
                                                        fontWeight: 600,
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    Request access for next
                                                    round to join the tournament
                                                </span>
                                                <img
                                                    src={BlackTwIcon}
                                                    style={{
                                                        display: "inline-block",
                                                        verticalAlign: "middle",
                                                    }}
                                                    alt=""
                                                />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                            ) : (
                                <Box>
                                    <Text sx={{ fontSize: "36px" }}>
                                        Set Off
                                    </Text>
                                    <Text sx={{ fontSize: "20px" }}>
                                        Real version
                                    </Text>
                                </Box>
                            )}
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
                        window.open(twitterUrl);
                    }}
                >
                    Request access for next round
                </SubmitButton>
            )}
        </Box>
    );
};

export default MissionRound;
