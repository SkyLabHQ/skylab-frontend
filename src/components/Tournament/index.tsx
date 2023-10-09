import {
    Box,
    Grid,
    GridItem,
    HStack,
    Img,
    Text,
    Image,
    VStack,
    useClipboard,
} from "@chakra-ui/react";
import React, {
    ReactElement,
    Fragment,
    useState,
    useEffect,
    useRef,
} from "react";
import { css } from "@emotion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { Contract, Provider } from "ethers-multicall";
import TournamentDivider from "../../assets/tournament-divider.svg";
import RoundWinner from "./assets/round-winner.svg";
import Apr from "./assets/apr.svg";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import TRAILBLAZERLEADERSHIP_ABI from "@/skyConstants/abis/TrailblazerLeadershipDelegation.json";

import RoundTime from "@/skyConstants/roundTime";
import CopyIcon from "./assets/copy.svg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    skylabTournamentAddress,
    trailblazerLeadershipDelegationAddress,
} from "@/hooks/useContract";
import handleIpfsImg from "@/utils/ipfsImg";
import { shortenAddress } from "@/utils";
import Loading from "../Loading";
import { ChainId } from "@/utils/web3Utils";
import CloseIcon from "./assets/close-icon.svg";
import useSkyToast from "@/hooks/useSkyToast";
import {
    useMultiProvider,
    useMultiSkylabTestFlightContract,
} from "@/hooks/useMutilContract";

const SwiperSlideContent = ({ list, round }: { list: any; round: number }) => {
    const [copyText, setCopyText] = useState("");
    const { value, onCopy } = useClipboard(copyText);
    const rewardList: any = RoundTime[round]?.rewardList || [];
    const toast = useSkyToast();

    useEffect(() => {
        if (!value) {
            return;
        }

        onCopy();
        toast("Copy address success");
    }, [value]);
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                padding: 0,
                zIndex: 110,
            }}
        >
            <Box
                sx={{
                    width: "90%",
                    height: "100%",
                    position: "absolute",
                    overflow: "visible",
                    left: "5vw",
                    background: "rgba(217, 217, 217, 0.2)",
                    border: "3px solid #FFF761",
                    backdropFilter: "blur(7.5px)",
                    borderRadius: "16px",
                }}
            >
                <VStack
                    w="36vw"
                    height="71.5vh"
                    pos="absolute"
                    left="7vw"
                    top="6vh"
                    fontFamily="Orbitron"
                    fontWeight="900"
                    fontSize="48px"
                    color="black"
                >
                    <Box w="34vw">
                        <Img
                            src={RoundWinner}
                            pos="relative"
                            top={0}
                            left="0"
                            width="100%"
                        ></Img>
                        <Text
                            textAlign="center"
                            w="100%"
                            paddingTop="5"
                            zIndex={999}
                            pos="absolute"
                            left="0"
                            top="0"
                        >
                            Round {round} Winner
                        </Text>
                    </Box>
                    <Box style={{ marginTop: "-60px" }}></Box>
                    <Box
                        flex={1}
                        overflowY="auto"
                        css={css`
                            &::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    >
                        {rewardList.length == 2 && (
                            <HStack
                                justifyContent="center"
                                sx={{ height: "100%" }}
                            >
                                <WinnerItem
                                    w="9.5vw"
                                    bg="rgba(0, 0, 0, 0.6)"
                                    border="4px solid #FFF761"
                                    address={rewardList[0].address}
                                    img={rewardList[0].img}
                                    fontSize="24px"
                                ></WinnerItem>
                                <WinnerItem
                                    w="9.5vw"
                                    bg="rgba(0, 0, 0, 0.6)"
                                    border="4px solid #FFF761"
                                    address={rewardList[1].address}
                                    img={rewardList[1].img}
                                    fontSize="24px"
                                ></WinnerItem>
                            </HStack>
                        )}
                        <Text
                            sx={{
                                fontSize: "24px",
                                color: "#fff",
                                marginTop: "50px",
                            }}
                        >
                            {rewardList.length === 0 &&
                                `No data yet, please wait for Round ${round} to end.`}
                        </Text>
                    </Box>
                    <Box w="34vw" pos="relative">
                        <Img
                            src={Apr}
                            pos="relative"
                            top={0}
                            left="0"
                            width="100%"
                        ></Img>
                        <Text
                            textAlign="center"
                            w="100%"
                            paddingTop="5"
                            zIndex={999}
                            pos="absolute"
                            left="0"
                            top="0"
                        >
                            2023 {RoundTime[round]?.endTime}
                        </Text>
                    </Box>
                </VStack>
                <Box
                    fontFamily="Orbitron"
                    fontWeight={500}
                    fontSize="24px"
                    color="#BCBBBE"
                    pos="absolute"
                    right="100px"
                    w="36vw"
                    top="3vh"
                >
                    <Text>Leaderboard</Text>
                    <VStack
                        spacing="4px"
                        pos="absolute"
                        overflowY="auto"
                        height="74vh"
                        bg="rgba(0, 0, 0, 0.6)"
                        border="2px solid #FFF761"
                        borderRadius="20px"
                        padding="30px 0 "
                        css={css`
                            &::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    >
                        {list.map((item: any, index: number) => (
                            <Fragment key={index}>
                                <HStack w="100%" spacing="1.5vw">
                                    <Text
                                        w="80px"
                                        textAlign="right"
                                        fontFamily="Orbitron"
                                        color={index < 3 ? "#FFF761" : "white"}
                                        fontSize="48px"
                                        fontWeight="500"
                                    >
                                        {index + 1}
                                    </Text>
                                    <Box
                                        w="90px"
                                        h="90px"
                                        boxShadow={
                                            index < 3
                                                ? "0px 0px 10px #FFF761"
                                                : undefined
                                        }
                                        bg={
                                            index < 3
                                                ? "radial-gradient(50% 50% at 50% 50%, #7D7144 0%, #000000 100%)"
                                                : "#191823"
                                        }
                                        border={
                                            index < 3
                                                ? "4px solid #FFC110"
                                                : "1px solid #FFFFFF"
                                        }
                                        borderRadius="10px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Img src={item.img} w="90px" h="90px" />
                                    </Box>
                                    <VStack
                                        spacing="4px"
                                        alignItems={"flex-start"}
                                    >
                                        <Text
                                            fontFamily="Orbitron"
                                            color="white"
                                            fontSize="28px"
                                            fontWeight="500"
                                        >
                                            Level {item.level}
                                        </Text>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                            onClick={() => {
                                                setCopyText(item.owner);
                                            }}
                                            cursor={"pointer"}
                                        >
                                            <Text
                                                className="copyAddress"
                                                fontFamily="Orbitron"
                                                color="white"
                                                fontSize="24px"
                                                fontWeight="500"
                                                marginRight={"10px"}
                                            >
                                                owner:{" "}
                                                {shortenAddress(
                                                    item.owner,
                                                    4,
                                                    4,
                                                )}
                                            </Text>
                                            <Image
                                                src={CopyIcon}
                                                className="copyAddress"
                                            ></Image>
                                        </Box>
                                    </VStack>
                                </HStack>
                                {index !== list.length - 1 ? (
                                    <Img src={TournamentDivider} w="100%" />
                                ) : null}
                            </Fragment>
                        ))}
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
};

const WinnerItem = ({
    w,
    bg = "rgba(255, 255, 255, 0.5)",
    border = "4px solid #fff",
    address,
    fontSize = "16px",
    img,
}: {
    w?: string;
    bg?: string;
    border?: string;
    address?: string;
    fontSize?: string;
    img?: string;
}) => {
    return (
        <VStack>
            <Box w={w} h={w} bg={bg} border={border} borderRadius="20px">
                <Img src={img} w={w} marginLeft="10px"></Img>
            </Box>
            <Text color="#fff" fontSize={fontSize} textAlign="center">
                {shortenAddress(address)}
            </Text>
        </VStack>
    );
};

interface ChildProps {
    currentRound: number;
    onNextRound: (nextStep: number) => void;
}

export const Leaderboard = ({
    currentRound,
    onNextRound,
}: ChildProps): ReactElement => {
    const { account } = useActiveWeb3React();

    const [leaderboardInfo, setLeaderboardInfo] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [init, setInit] = useState(false);
    const retryTimes = useRef(0);
    const multiSkylabTestFlightContract = useMultiSkylabTestFlightContract(
        ChainId.POLYGON,
    );

    const multiProvider = useMultiProvider(ChainId.POLYGON);

    const handleGetRound = async () => {
        try {
            setLoading(true);

            const ethcallProvider = multiProvider;

            const tournamentContract = new Contract(
                skylabTournamentAddress[ChainId.POLYGON],
                SKYLABTOURNAMENT_ABI,
            );

            const trailblazerLeadershipDelegationContract = new Contract(
                trailblazerLeadershipDelegationAddress[ChainId.POLYGON],
                TRAILBLAZERLEADERSHIP_ABI,
            );

            const p = [];
            const currentRound = 4;
            const recocrdRound = 4;
            const lastTokenId = 648;

            // 请求所有轮次的排行榜tokenId信息
            for (let i = 1; i <= currentRound; i++) {
                if (i === 3) {
                    continue;
                }
                if (i === recocrdRound) {
                    p.push(
                        trailblazerLeadershipDelegationContract.leaderboardInfo(
                            recocrdRound,
                            lastTokenId,
                        ),
                    );
                } else {
                    p.push(tournamentContract.leaderboardInfo(i));
                }
            }

            const infos = await ethcallProvider.all(p);
            // 过滤掉level为0的tokenId 并且整理数据成对象
            const leaderboardInfo = infos.map((item) => {
                const currentRoundInfo = item
                    .filter((cItem: any) => {
                        return cItem.level.toNumber() !== 0;
                    })
                    .map((cItem: any) => {
                        return {
                            level: cItem.level.toNumber(),
                            tokenId: cItem.tokenId.toNumber(),
                        };
                    });
                return currentRoundInfo;
            });

            const allRes: any = [];

            for (let i = 0; i < leaderboardInfo.length; i++) {
                const length = leaderboardInfo[i].length;
                const round = 250; //请求量比较大，每轮请求100*2的请求
                let start = 0;
                let current = Math.min(round, length);
                const tempRes = [];
                while (true) {
                    const p = [];
                    for (let j = start; j < current; j++) {
                        p.push(
                            tournamentContract.tokenURI(
                                leaderboardInfo[i][j].tokenId,
                            ),
                        );
                        p.push(
                            tournamentContract.ownerOf(
                                leaderboardInfo[i][j].tokenId,
                            ),
                        );
                    }
                    const res = await ethcallProvider.all(p);

                    tempRes.push(...res);
                    if (current === length) {
                        break;
                    } else {
                        start += round;
                        current += round;
                        current = Math.min(current, length);
                        start = Math.min(start, current);
                    }
                }

                const ares = [];

                for (let j = 0; j < leaderboardInfo[i].length; j++) {
                    const base64String = tempRes[j * 2];
                    const jsonString = window.atob(
                        base64String.substr(base64String.indexOf(",") + 1),
                    );
                    const jsonObject = JSON.parse(jsonString);
                    ares.push({
                        img: handleIpfsImg(jsonObject.image),
                        owner: tempRes[j * 2 + 1],
                    });
                }
                allRes.push(ares);
            }
            console.timeEnd("ttt");

            const finalRes = leaderboardInfo.map((item, index) => {
                const newItem: any = item
                    .map((cItem: any, cIndex: number) => {
                        return {
                            ...cItem,
                            ...allRes[index][cIndex],
                            level: cItem.level,
                        };
                    })
                    .sort((a: any, b: any) => {
                        return b.level - a.level;
                    })
                    .slice(0, 10);
                return newItem;
            });

            setLeaderboardInfo(finalRes);
            setLoading(false);
            setInit(true);
        } catch (error) {
            if (retryTimes.current > 1) {
                setLoading(false);
            } else {
                retryTimes.current++;
                handleGetRound();
            }
            console.log(error);
        }
    };

    useEffect(() => {
        handleGetRound();
    }, []);

    return (
        <Box
            w="100vw"
            h="100vh"
            overflow="hidden"
            pos="absolute"
            id="background"
            onClick={(e: any) => {
                if (
                    e.target.className.includes("copyAddress") ||
                    e.target.className.includes("swiper-button-next") ||
                    e.target.className.includes("swiper-button-prev")
                ) {
                    return;
                }

                if (!!account) {
                    onNextRound(2);
                } else {
                    onNextRound(1);
                }
            }}
            sx={{
                ".swiper-pagination": {
                    width: "auto",
                    left: "50%",
                    maxHeight: "33px",
                    transform: "translateX(-50%)",
                    background: "rgba(217, 217, 217, 0.1)",
                    borderRadius: "40px",
                    padding: leaderboardInfo.length > 1 ? "0px 16px" : "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: leaderboardInfo.length ? "24px" : "auto",
                    ".swiper-pagination-bullet": {
                        width: "9px",
                        height: "9px",
                    },

                    ".swiper-pagination-bullet.swiper-pagination-bullet-active":
                        {
                            background: "#D9D9D9",
                        },
                },

                ".swiper-button-next": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                    right: "2%",
                    zIndex: 100,
                },
                ".swiper-button-next:after": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                },
                ".swiper-button-prev": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                    left: "2%",
                    zIndex: 100,
                },
                ".swiper-button-prev:after": {
                    fontSize: "56px",
                    color: "#F5CA5C",
                },
            }}
        >
            <Image
                cursor={"pointer"}
                src={CloseIcon}
                bottom="2vh"
                right="5vw"
                pos={"absolute"}
                zIndex={111}
                onClick={(e: any) => {
                    if (!!account) {
                        onNextRound(2);
                    } else {
                        onNextRound(1);
                    }
                    return;
                }}
            />
            <Swiper
                navigation={true}
                pagination={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                style={{
                    width: "100vw",
                    height: "97vh",
                    position: "relative",
                    left: "0vw",
                    borderRadius: "16px",
                    padding: 0,
                    zIndex: 8,
                    top: "0vh",
                }}
            >
                {leaderboardInfo.map((item, index) => {
                    return (
                        <SwiperSlide
                            key={index}
                            style={{
                                background: "transparent",
                                height: "84vh",
                                overflow: "visible",
                                zIndex: 110,
                                top: "8vh",
                            }}
                        >
                            <SwiperSlideContent
                                list={item}
                                round={leaderboardInfo.length - index}
                            ></SwiperSlideContent>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {(!init || leaderboardInfo.length === 0) && (
                <Box
                    sx={{
                        height: "84vh",
                        overflow: "visible",
                        zIndex: 110,
                        top: "8vh",
                        width: "90%",
                        position: "absolute",
                        left: "5vw",
                        background: "rgba(217, 217, 217, 0.2)",
                        border: "3px solid #FFF761",
                        backdropFilter: "blur(7.5px)",
                        borderRadius: "16px",
                    }}
                >
                    {loading && <Loading></Loading>}
                    {init && leaderboardInfo.length === 0 && (
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "48px",
                            }}
                        >
                            No data yet, please wait for Round 1 to end.
                        </Box>
                    )}
                </Box>
            )}
            <Text
                sx={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "24px",
                    fontWeight: "bold",
                }}
            >
                Tap anywhere to continue
            </Text>
        </Box>
    );
};
