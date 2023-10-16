import {
    Box,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Image,
} from "@chakra-ui/react";
import GrayTipIcon from "./assets/gray-tip.svg";
import InGame from "./assets/ingame.svg";
import Expired from "./assets/expired.svg";
import PlaneShadow from "./assets/plane-shadow.png";
import PlaneBg from "./assets/plane-bg.png";
import NoPlane from "./assets/no-plane.png";
import BlackArrowLeft from "./assets/black-arrow-left.svg";
import BlackArrowRight from "./assets/black-arrow-right.svg";
import { PlaneInfo } from "@/pages/Activities";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import RoundTime from "@/skyConstants/roundTime";
import PlanetList from "./PlanetList";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import {
    skylabGameFlightRaceTournamentAddress,
    skylabTournamentAddress,
} from "@/hooks/useContract";
import handleIpfsImg from "@/utils/ipfsImg";
import { ChainId } from "@/utils/web3Utils";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import { Contract } from "ethers-multicall";
import RightNav from "./RightNav";
import { useMultiProvider } from "@/hooks/useMultiContract";
import RequestNextButton from "../RequrestNextButton";
import Header from "./Header";
import { usePilotInfo } from "@/hooks/usePilotInfo";

// My plane list component
const PlaneList = ({
    currentIsExpired,
    currentRound,
    list,
    currentImg,
    onCurrentImg,
}: {
    currentIsExpired: boolean;
    currentRound: number;
    list: PlaneInfo[];
    currentImg: number;
    onCurrentImg: (index: number) => void;
}) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                marginBottom: "3.125vw",
                width: "26.0417vw",
                height: "10.4167vw",
                position: "relative",
            }}
            className="first-step"
        >
            {currentImg + 1 <= list.length - 1 && (
                <Box
                    sx={{
                        width: "10.4167vw",
                        position: "absolute",
                        left: "-6.7708vw",
                        top: "-1.0417vw",
                        background: `url(${PlaneShadow})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "1.3021vw 8.0729vw",
                        backgroundSize: "6.25vw 1.4583vw",
                    }}
                >
                    <Image
                        sx={{
                            opacity: "0.3",
                        }}
                        src={list[currentImg + 1].img}
                    ></Image>
                </Box>
            )}

            <Box
                sx={{
                    width: "17.7083vw",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "-6.25vw",
                }}
            >
                <Image sx={{}} src={list[currentImg].img}></Image>
                {currentIsExpired && (
                    <Image
                        src={Expired}
                        w="6.25vw"
                        height={"6.25vw"}
                        sx={{
                            position: "absolute",
                            top: "9.375vw",
                            left: "50%",
                            transform: "translateX(-50%)",
                            cursor: "pointer",
                        }}
                    ></Image>
                )}
                {currentRound == list[currentImg].round &&
                    list[currentImg].state != 0 && (
                        <Image
                            onClick={() => {
                                navigate(
                                    `/game?tokenId=${list[currentImg].tokenId}`,
                                );
                            }}
                            src={InGame}
                            w="6.25vw"
                            height={"6.25vw"}
                            sx={{
                                position: "absolute",
                                top: "9.375vw",
                                left: "50%",
                                transform: "translateX(-50%)",
                                cursor: "pointer",
                            }}
                        ></Image>
                    )}
            </Box>

            <Box
                sx={{
                    zIndex: 30,
                    position: "absolute",
                    left: "0",
                    top: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Box
                    sx={{
                        width: "2.0313vw",
                        cursor: "pointer",
                        position: "relative",
                    }}
                >
                    {currentImg !== 0 && (
                        <>
                            <Image
                                src={BlackArrowLeft}
                                sx={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    onCurrentImg(currentImg - 1);
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    position: "absolute",
                                    width: "7.8125vw",
                                    left: "-2.6042vw",
                                    bottom: "-1.0417vw",
                                    fontSize: "0.7292vw",
                                }}
                            >
                                Change Plane
                            </Text>
                        </>
                    )}
                </Box>

                <Image
                    sx={{
                        width: "19.2708vw",
                        height: "10.4167vw",
                    }}
                    src={PlaneBg}
                ></Image>
                <Box
                    sx={{
                        width: "2.0313vw",
                        cursor: "pointer",
                        position: "relative",
                    }}
                >
                    {currentImg !== list.length - 1 && (
                        <>
                            <Image
                                src={BlackArrowRight}
                                sx={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    onCurrentImg(currentImg + 1);
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    position: "absolute",
                                    width: "7.8125vw",
                                    left: "-1.0417vw",
                                    bottom: "-1.0417vw",
                                    fontSize: "0.7292vw",
                                }}
                            >
                                Change Plane
                            </Text>
                        </>
                    )}
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "-2.3958vw",
                        background: `url(${PlaneShadow})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center 0.5208vw",
                        backgroundSize: "15.625vw 3.6458vw",
                        paddingTop: "1.0417vw",
                    }}
                    w="100%"
                >
                    <Text
                        fontSize="0.8333vw"
                        fontWeight={600}
                        textAlign="center"
                    >
                        {RoundTime[list[currentImg].round]?.startTime}-
                        {RoundTime[list[currentImg].round]?.endTime}
                    </Text>
                    <Text fontSize="1.25vw" fontWeight={600} textAlign="center">
                        Lvl.0{list[currentImg].level}
                        {/* #{list[currentImg].tokenId} */}
                    </Text>
                    {list.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    padding: "0.2604vw 0.5208vw",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(217, 217, 217, 0.10)",
                                    borderRadius: "2.0833vw",
                                    height: "1.3021vw",
                                }}
                            >
                                {list.map((item, index) => {
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: "0.4688vw",
                                                height: "0.4688vw",
                                                background:
                                                    index === currentImg
                                                        ? "#D9D9D9"
                                                        : "rgba(217, 217, 217, 0.50)",
                                                borderRadius: "50%",
                                                margin: "0 0.2604vw",
                                                transition: "all 0.3s",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                onCurrentImg(index);
                                            }}
                                        ></Box>
                                    );
                                })}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const NoPlaneContent = () => {
    return (
        <Box
            sx={{
                background: `url(${NoPlane})`,
                width: "16.1979vw",
                height: "6.3021vw",
                backgroundSize: "100% 100%",
                padding: "1.0417vw 0 0 1.0417vw",
                marginBottom: "1.875vw",
            }}
            className="first-step"
        >
            <Box sx={{ fontSize: "1.25vw" }}>
                You currently do not have any plane
                <Popover placement="end-start">
                    <PopoverTrigger>
                        <Image
                            src={GrayTipIcon}
                            sx={{
                                display: "inline-block",
                                verticalAlign: "middle",
                                marginLeft: "0.2604vw",
                                cursor: "pointer",
                                width: "1.7708vw",
                                height: "1.7708vw",
                            }}
                        ></Image>
                    </PopoverTrigger>
                    <PopoverContent
                        sx={{
                            background: "#D9D9D9",
                            borderRadius: "0.5208vw",
                            border: "none",
                            color: "#000",
                            width: "14.1667vw",
                            lineHeight: 1,
                            "&:focus": {
                                outline: "none !important",
                                boxShadow: "none !important",
                            },
                        }}
                    >
                        <PopoverBody>
                            <span
                                style={{
                                    fontSize: "0.7292vw",
                                    fontWeight: 600,
                                    fontFamily: "Orbitron",
                                }}
                            >
                                Without a plane, you only have access to
                                playtest.
                            </span>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Box>
        </Box>
    );
};

interface ChildProps {
    currentRound: number;
    onBack: () => void;
    onNextRound: (step: number | string) => void;
}

const MissionRound = ({ currentRound, onBack, onNextRound }: ChildProps) => {
    const { account } = useActiveWeb3React();
    const [planeList, setPlaneList] = useState<PlaneInfo[]>([]);
    const [currentImg, setCurrentImg] = useState(0);
    const { activePilot } = usePilotInfo();

    const [active, setActive] = useState(1);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const ethcallProvider = useMultiProvider(ChainId.POLYGON);

    const currentIsExpired = useMemo(() => {
        if (planeList.length === 0) {
            return false;
        }
        return currentRound > planeList[currentImg].round;
    }, [currentRound, planeList, currentImg]);

    const handleCurrentImg = (index: number) => {
        setCurrentImg(index);
    };

    const handleGetPlaneBalance = async () => {
        setCurrentImg(0);
        setPlaneList([]);

        const tournamentContract = new Contract(
            skylabTournamentAddress[ChainId.POLYGON],
            SKYLABTOURNAMENT_ABI,
        );
        const skylabGameFlightRaceContract = new Contract(
            skylabGameFlightRaceTournamentAddress[ChainId.POLYGON],
            SKYLABGAMEFLIGHTRACE_ABI,
        );

        const [balance] = await ethcallProvider.all([
            tournamentContract.balanceOf(account),
        ]);
        const p = new Array(balance.toNumber()).fill("").map((item, index) => {
            return tournamentContract.tokenOfOwnerByIndex(account, index);
        });
        const planeTokenIds = await ethcallProvider.all(p);
        const p1: any = [];
        planeTokenIds.forEach((tokenId) => {
            p1.push(tournamentContract._aviationLevels(tokenId));
            p1.push(tournamentContract.tokenURI(tokenId));
            p1.push(tournamentContract._aviationRounds(tokenId));
            p1.push(skylabGameFlightRaceContract.gameState(tokenId));
        });
        const levels: any = await ethcallProvider.all(p1);
        const list = planeTokenIds.map((item: any, index: number) => {
            const level = levels[index * 4].toNumber();
            const metadata = levels[index * 4 + 1];
            const round = levels[index * 4 + 2];
            const state = levels[index * 4 + 3].toNumber();

            const base64String = metadata;
            const jsonString = window.atob(
                base64String.substr(base64String.indexOf(",") + 1),
            );
            const jsonObject = JSON.parse(jsonString);
            return {
                tokenId: item.toNumber(),
                level: level,
                img: handleIpfsImg(jsonObject.image),
                round:
                    round.toNumber() >= 3
                        ? round.toNumber() - 1
                        : round.toNumber(),
                state,
            };
        });
        list.sort((item1, item2) => {
            if (item1.round !== item2.round) {
                return item2.round - item1.round; // 大的 round 排在前面
            } else {
                return item2.level - item1.level; // 相同 round 中，大的 level 排在前面
            }
        }).reverse();

        setPlaneList(list);
    };

    useEffect(() => {
        if (!account) {
            return;
        }
        handleGetPlaneBalance();
    }, [account]);
    return (
        <Box
            h={"100vh"}
            w={"100vw"}
            sx={{ color: "#000", fontWeight: 600 }}
            onClick={() => {}}
        >
            <Header
                activePilot={activePilot}
                onPilotClick={() => {
                    onNextRound("currentPilot");
                }}
            ></Header>

            <PlanetList
                planeList={planeList}
                currentImg={currentImg}
                active={active}
                showAllActivities={showAllActivities}
                onChangeActive={(index) => {
                    setActive(index);
                }}
                onChangeAllActivities={(flag) => {
                    setShowAllActivities(flag);
                }}
                currentIsExpired={currentIsExpired}
            ></PlanetList>
            <Box
                sx={{
                    position: "absolute",
                    left: "6.25vw",
                    bottom: "3.125vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {planeList.length === 0 ? (
                    <NoPlaneContent></NoPlaneContent>
                ) : (
                    <PlaneList
                        currentIsExpired={currentIsExpired}
                        currentRound={currentRound}
                        list={planeList}
                        onCurrentImg={handleCurrentImg}
                        currentImg={currentImg}
                    ></PlaneList>
                )}

                <RequestNextButton
                    onClick={() => {
                        window.open("https://twitter.com/skylabHQ", "_blank");
                    }}
                ></RequestNextButton>
            </Box>
            <RightNav
                activePilot={activePilot}
                onNextRound={onNextRound}
            ></RightNav>
        </Box>
    );
};

export default MissionRound;
