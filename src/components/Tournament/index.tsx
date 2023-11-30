import { Box, Img, Text, Image, VStack, useClipboard } from "@chakra-ui/react";
import React, {
    ReactElement,
    useState,
    useEffect,
    useRef,
    useMemo,
} from "react";
import { css } from "@emotion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { Contract } from "ethers-multicall";
import Banner from "./assets/banner.svg";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import RoundTime from "@/skyConstants/roundTime";
import DotIcon from "./assets/dot.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { skylabTournamentAddress } from "@/hooks/useContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import { shortenAddress } from "@/utils";
import Loading from "../Loading";
import CloseIcon from "./assets/close-icon.svg";
import useSkyToast from "@/hooks/useSkyToast";
import {
    getMultiProvider,
    useMultiMercuryPilotsContract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import { RankBackground, RankMedal } from "@/skyConstants/rank";
import { ActivePilotRes, handlePilotsInfo } from "@/skyConstants/pilots";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import WinBg from "./assets/galaxy-bg.svg";

const Empty = () => {
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
                    borderRadius: "0.8333vw",
                }}
            >
                <Loading></Loading>
            </Box>
        </Box>
    );
};

const WinItem = ({ rewardItem }: { rewardItem: any }) => {
    return (
        <Box
            sx={{
                width: "11.6667vw",
                height: "11.6667vw",
                borderRadius: "1.0417vw",
                border: "1px dashed #F2D861",
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {rewardItem?.address ? (
                <>
                    <Box>
                        <Img src={rewardItem.img} marginLeft="0.5208vw"></Img>
                    </Box>
                    <Text
                        color="#fff"
                        textAlign="center"
                        sx={{
                            position: "absolute",
                            bottom: "-40px",
                            left: "0",
                            width: "100%",
                            fontSize: "1.25vw",
                            fontWeight: "900",
                        }}
                    >
                        {shortenAddress(rewardItem.address)}
                    </Text>
                </>
            ) : (
                <>
                    <Text
                        sx={{
                            color: "#fff",
                            fontSize: "0.7292vw",
                        }}
                    >
                        coming soon
                    </Text>
                    <Image src={DotIcon}></Image>
                </>
            )}
        </Box>
    );
};

const ListItem = ({ rank, detail }: { rank: number; detail: any }) => {
    const {
        pilotImg,
        aviationImg,
        aviationPoint,
        level,
        aviationOwner,
        pilotOwner,
        actualPilotOwner,
    } = detail;
    const toast = useSkyToast();

    const { onCopy } = useClipboard(aviationOwner);

    const isTop3 = useMemo(() => {
        return [1, 2, 3].includes(rank);
    }, [rank]);

    const handleOnCopy = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        onCopy();
        toast("Copy address success");
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: isTop3 ? "3.6458vw" : "3.125vw",
                alignItems: "center",
                background: RankBackground[rank],
                padding: "0 1.0417vw 0 0.625vw",
                borderRadius: isTop3 ? "0.5208vw" : "0",
                marginBottom: "0.3125vw",
                borderBottom: "1px solid #fff",
            }}
        >
            {isTop3 ? (
                <Image
                    src={RankMedal[rank]}
                    sx={{
                        width: "2.3958vw",
                        height: "2.3958vw",
                        marginRight: "1.1458vw",
                    }}
                ></Image>
            ) : (
                <Text
                    sx={{
                        width: "2.3958vw",
                        marginRight: "1.1458vw",
                        fontSize: "1.25vw",
                        textAlign: "center",
                        color: "#fff",
                    }}
                >
                    {rank}
                </Text>
            )}

            <Box
                sx={{
                    width: isTop3 ? "3.125vw" : "2.5vw",
                    height: isTop3 ? "3.125vw" : "2.5vw",
                    border: "1px solid #fff",
                    borderRadius: "0.5208vw",
                    position: "relative",
                }}
            >
                <Image
                    src={aviationImg}
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                ></Image>

                {pilotImg && (
                    <Box
                        sx={{
                            position: "absolute",
                            left: "2px",
                            bottom: 0,
                            width: "100%",
                        }}
                    >
                        {pilotOwner !== actualPilotOwner && (
                            <Box
                                sx={{
                                    background: "rgb(74,182,67)",
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    transform: "translateY(-50%)",
                                    borderRadius: "0.5208vw",
                                    fontSize: isTop3 ? "0.5208vw" : "0.3646vw",
                                    color: "#fff",
                                    textAlign: "right",
                                    paddingRight: "1px",
                                    width: "100%",
                                }}
                            >
                                Support
                            </Box>
                        )}
                        <Image
                            src={pilotImg}
                            sx={{
                                width: isTop3 ? "1.4583vw" : "1.0417vw",
                                height: isTop3 ? "1.4583vw" : "1.0417vw",
                                transform: isTop3
                                    ? "translate(-0.75vw, -50%)"
                                    : "translate(-0.4vw, -50%)",
                                borderRadius: "50%",
                                border:
                                    pilotOwner !== actualPilotOwner
                                        ? "2px solid rgb(74,182,67)"
                                        : "2px solid #000",
                                position: "absolute",
                                left: 0,
                                top: 0,
                                maxWidth: "none",
                            }}
                        ></Image>
                    </Box>
                )}
            </Box>

            <Text
                sx={{
                    flex: 1,
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "0.8333vw",
                    cursor: "pointer",
                    fontFamily: "Quantico",
                }}
                onClick={handleOnCopy}
            >
                {shortenAddress(aviationOwner)}
            </Text>
            <Box
                sx={{
                    color: "#BCBBBE",
                    textAlign: "right",
                    fontFamily: "Quantico",
                    fontSize: "0.8333vw",
                }}
            >
                <Text>Lvl {level}</Text>
                <Text>{aviationPoint}pt</Text>
            </Box>
        </Box>
    );
};

const SwiperSlideContent = ({
    loadData,
    list,
    round,
    childLoading,
}: {
    childLoading: boolean;
    loadData: boolean;
    list: any;
    round: number;
}) => {
    const scrollRef = useRef(null);
    const [copyText, setCopyText] = useState("");
    const { value, onCopy } = useClipboard(copyText);
    const rewardList: any = RoundTime[round]?.rewardList || [];
    const toast = useSkyToast();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(childLoading);
    const multiMercuryPilotsContract =
        useMultiMercuryPilotsContract(DEAFAULT_CHAINID);

    useEffect(() => {
        if (!value) {
            return;
        }

        onCopy();
        toast("Copy address success");
    }, [value]);

    const handleGetRound = async () => {
        const ethcallProvider = getMultiProvider(DEAFAULT_CHAINID);

        setLoading(true);
        try {
            const tournamentContract = new Contract(
                skylabTournamentAddress[DEAFAULT_CHAINID],
                SKYLABTOURNAMENT_ABI,
            );
            const length = list.length;
            console.time("leaderboard");
            const p = [];
            for (let j = 0; j < length; j++) {
                p.push(tournamentContract.tokenURI(list[j].tokenId));
                p.push(tournamentContract.ownerOf(list[j].tokenId));
                p.push(tournamentContract.aviationPoints(list[j].tokenId));
            }
            const aviationInfoRes = await ethcallProvider.all(p);
            console.timeEnd("leaderboard");

            const aviationPionts: string[] = [];
            const pActivePilot: any = [];
            const allWallet: string[] = [];
            list.forEach((item: any, index: number) => {
                aviationPionts.push(aviationInfoRes[index * 3 + 2].toNumber());
                pActivePilot.push(
                    multiMercuryPilotsContract.getActivePilot(
                        aviationInfoRes[index * 3 + 1],
                    ),
                );
                allWallet.push(aviationInfoRes[index * 3 + 1]);
            });

            const activePilotRes = await ethcallProvider.all(pActivePilot);

            const allPilot: ActivePilotRes[] = activePilotRes.map(
                (item: any) => {
                    return {
                        ...item,
                        pilotId: item.pilotId.toNumber(),
                    };
                },
            );

            const pilotList = await handlePilotsInfo({
                chainId: DEAFAULT_CHAINID,
                allPilot,
                values: aviationPionts,
                pilotOwners: allWallet,
            });

            const finalRes = list.map((cItem: any, index: number) => {
                return {
                    ...cItem,
                    ...pilotList[index],
                    aviationImg: getMetadataImg(aviationInfoRes[index * 3]),
                    aviationOwner: aviationInfoRes[index * 3 + 1],
                    aviationPoint: aviationInfoRes[index * 3 + 2].toNumber(),
                };
            });
            setData(finalRes);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleScrollUp = () => {
        if (!scrollRef?.current) {
            return;
        }

        const scrollHeight = Math.round(scrollRef.current.scrollHeight / 10);
        if (scrollRef.current.scrollTop <= 0) {
            return;
        } else {
            scrollRef.current.scrollTo({
                top: (scrollRef.current.scrollTop -= scrollHeight),
                behavior: "smooth",
            });
        }
    };
    const handleScrollDown = () => {
        if (!scrollRef?.current) {
            return;
        }

        const scrollHeight = Math.round(scrollRef.current.scrollHeight / 10);

        if (
            scrollHeight + scrollRef.current.scrollTop >=
            scrollRef.current.scrollHeight
        ) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        } else {
            scrollRef.current.scrollTo({
                top: (scrollRef.current.scrollTop += scrollHeight),
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (
            !loadData ||
            !multiMercuryPilotsContract ||
            list.length === 0 ||
            data.length > 0
        ) {
            return;
        }

        handleGetRound();
    }, [list, loadData, multiMercuryPilotsContract]);

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "ArrowDown":
                    handleScrollDown();
                    break;

                case "ArrowUp":
                    handleScrollUp();
                    break;
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);

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
                    borderRadius: "0.8333vw",
                }}
            >
                {loading ? (
                    <Loading></Loading>
                ) : (
                    <>
                        <VStack
                            w="55.8333vw"
                            pos="absolute"
                            left="0vw"
                            top="6vh"
                            fontFamily="Orbitron"
                            fontWeight="900"
                            color="black"
                            sx={{
                                padding: "0 10vw",
                            }}
                        >
                            <Box
                                w="31.25vw"
                                height="4.5833vw"
                                sx={{
                                    background: `url(${Banner})`,
                                }}
                            >
                                <Text
                                    textAlign="center"
                                    w="100%"
                                    sx={{
                                        fontSize: "2.5vw",
                                        fontWeight: 900,
                                        lineHeight: "4.5833vw",

                                        background:
                                            "linear-gradient(180deg, #F2D861 0%, #F5D561 41.67%, #FFF761 100%)",
                                        backgroundClip: "text",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Round {round} Winner
                                </Text>
                            </Box>

                            <Box
                                sx={{
                                    height: "35vw",
                                    backgroundPosition: "0 0",
                                }}
                            >
                                <Text
                                    sx={{
                                        textAlign: "center",
                                        fontFamily: "Orbitron",
                                        fontSize: "1.25vw",
                                        fontWeight: 900,
                                        color: "#F2D861",
                                        width: "100%",
                                        height: "35px",
                                    }}
                                >
                                    {RoundTime[round]?.endTime
                                        ? `2023 ${RoundTime[round]?.endTime}`
                                        : ""}
                                </Text>
                                <Box
                                    sx={{
                                        width: "30.9375vw",
                                        height: "30.9375vw",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        background: `url(${WinBg})`,
                                        backgroundSize: "100% 100%",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <Text
                                        sx={{
                                            fontSize: "1.0417vw",
                                            marginTop: "7.2083vw",
                                            color: "#4A4A4A",
                                        }}
                                    >
                                        {rewardList.length === 0 &&
                                            `No data yet, please wait for Round ${round} to end.`}
                                    </Text>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "27.4167vw",
                                            fontSize: "0.7292vw",
                                            color: "#4a4a4a",
                                            fontWeight: 400,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                border: "2px solid #F2D861",
                                                padding: "0.4167vw",
                                                borderRadius: "1.0417vw",
                                            }}
                                        >
                                            <WinItem
                                                rewardItem={rewardList?.[0]}
                                            ></WinItem>
                                        </Box>

                                        <Box
                                            sx={{
                                                border: "2px solid #F2D861",
                                                padding: "0.4167vw",
                                                borderRadius: "1.0417vw",
                                            }}
                                        >
                                            <WinItem
                                                rewardItem={rewardList?.[1]}
                                            ></WinItem>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </VStack>
                        <Box
                            fontFamily="Orbitron"
                            fontWeight={500}
                            fontSize="1.25vw"
                            color="#BCBBBE"
                            pos="absolute"
                            right="5.2083vw"
                            width="22.3958vw"
                            top="3vh"
                        >
                            <Text>Leaderboard</Text>
                            <Box
                                pos="absolute"
                                overflowY="auto"
                                height="74vh"
                                bg="rgba(0, 0, 0, 0.6)"
                                border="2px solid #FFF761"
                                borderRadius="1.0417vw"
                                padding="1.4583vw"
                                width="22.3958vw"
                                css={css`
                                    &::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}
                                ref={scrollRef}
                            >
                                {data.map((item: any, index: number) => (
                                    <ListItem
                                        key={index}
                                        detail={item}
                                        rank={index + 1}
                                    ></ListItem>
                                ))}
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

interface ChildProps {
    currentRound: number;
    onNextRound: (nextStep: number) => void;
}

export const Leaderboard = ({
    onNextRound,
    currentRound,
}: ChildProps): ReactElement => {
    const [controlledSwiper, setControlledSwiper] = useState(null);
    const [childLoading] = useState(false);

    const { account } = useActiveWeb3React();

    const [selectRound, setSelectRound] = useState(currentRound);

    const [tokenIdList, setTokenIdList] = useState<any[]>([]);
    const [idLevelLoading, setIdLevelLoading] = useState(true);

    const ethcallProvider = useMultiProvider(DEAFAULT_CHAINID);

    const handleGetTokenIdList = async () => {
        setIdLevelLoading(true);
        if (currentRound === 0) {
            setIdLevelLoading(false);
            setTokenIdList([[]]);
            return;
        }

        const tournamentContract = new Contract(
            skylabTournamentAddress[DEAFAULT_CHAINID],
            SKYLABTOURNAMENT_ABI,
        );

        const p = [];

        // 请求所有轮次的排行榜tokenId信息
        for (let i = 1; i <= currentRound; i++) {
            p.push(tournamentContract.leaderboardInfo(i));
        }
        const infos = await ethcallProvider.all(p);

        setTokenIdList(
            infos.map((item) => {
                return item
                    .map((cItem: any) => {
                        return {
                            level: cItem.level.toNumber(),
                            tokenId: cItem.tokenId.toNumber(),
                        };
                    })
                    .filter((cItem: any) => {
                        return cItem.level !== 0;
                    })
                    .sort((a: any, b: any) => {
                        return b.level - a.level;
                    });
            }),
        );

        setIdLevelLoading(false);
    };

    const handleNextRound = () => {
        if (!!account) {
            onNextRound(2);
        } else {
            onNextRound(1);
        }
    };

    const handleTurnLeft = () => {
        if (controlledSwiper) {
            controlledSwiper.slidePrev();
        }
    };

    const handleTurnRight = () => {
        if (controlledSwiper) {
            controlledSwiper.slideNext();
        }
    };

    useEffect(() => {
        if (!ethcallProvider || currentRound === -1) {
            return;
        }

        handleGetTokenIdList();
    }, [ethcallProvider, currentRound]);

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            switch (key) {
                case "ArrowLeft":
                    handleTurnLeft();
                    break;
                case "ArrowRight":
                    handleTurnRight();
                    break;
                case " ":
                    handleNextRound();
                    break;
            }
        };
        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, [controlledSwiper]);

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

                handleNextRound();
            }}
            sx={{
                ".swiper-pagination": {
                    width: "auto",
                    left: "50%",
                    maxHeight: "1.7188vw",
                    transform: "translateX(-50%)",
                    background: "rgba(217, 217, 217, 0.1)",
                    borderRadius: "2.0833vw",
                    padding: currentRound > 1 ? "0vw 0.8333vw" : "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: currentRound ? "1.25vw" : "auto",
                    ".swiper-pagination-bullet": {
                        width: "0.4688vw",
                        height: "0.4688vw",
                    },

                    ".swiper-pagination-bullet.swiper-pagination-bullet-active":
                        {
                            background: "#D9D9D9",
                        },
                },

                ".swiper-button-next": {
                    fontSize: "2.9167vw",
                    color: "#F5CA5C",
                    right: "2%",
                    zIndex: 100,
                },
                ".swiper-button-next:after": {
                    fontSize: "2.9167vw",
                    color: "#F5CA5C",
                },
                ".swiper-button-prev": {
                    fontSize: "2.9167vw",
                    color: "#F5CA5C",
                    left: "2%",
                    zIndex: 100,
                },
                ".swiper-button-prev:after": {
                    fontSize: "2.9167vw",
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
                sx={{
                    width: "2.0833vw",
                }}
                onClick={(e: any) => {
                    if (!!account) {
                        onNextRound(2);
                    } else {
                        onNextRound(1);
                    }
                    return;
                }}
            />

            {idLevelLoading ? (
                <Box
                    sx={{
                        width: "100vw",
                        position: "relative",
                        left: "0vw",
                        borderRadius: "0.8333vw",
                        padding: 0,
                        zIndex: 8,
                        height: "84vh",
                        overflow: "visible",
                        top: "8vh",
                    }}
                >
                    <Empty></Empty>
                </Box>
            ) : (
                <Swiper
                    navigation={true}
                    pagination={true}
                    onSwiper={setControlledSwiper}
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    style={{
                        width: "100vw",
                        height: "97vh",
                        position: "relative",
                        left: "0vw",
                        borderRadius: "0.8333vw",
                        padding: 0,
                        zIndex: 8,
                        top: "0vh",
                    }}
                    initialSlide={currentRound}
                    onSlideChange={(swiper) => {
                        const round = swiper.activeIndex + 1;
                        setSelectRound(round);
                    }}
                >
                    {tokenIdList.map((item, index) => {
                        const round = index + 1;
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
                                    loadData={selectRound === round}
                                    list={item.slice(0, 50)}
                                    childLoading={childLoading}
                                    round={round}
                                ></SwiperSlideContent>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            )}

            <Text
                sx={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "1.25vw",
                    fontWeight: "bold",
                }}
            >
                Tap anywhere to continue
            </Text>
        </Box>
    );
};
