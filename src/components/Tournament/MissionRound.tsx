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
import ActivityTitle from "./assets/activity-title.svg";
import PlaneBg from "./assets/plane-bg.png";
import NoPlane from "./assets/no-plane.png";
import LongBt from "./assets/long-bt.png";
import BlackArrowLeft from "./assets/black-arrow-left.svg";
import BlackArrowRight from "./assets/black-arrow-right.svg";
import { PlaneInfo } from "@/pages/Mercury";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import RoundTime from "@/skyConstants/roundTime";
import { useTour } from "@reactour/tour";
import PlanetList from "./PlanetList";
import FuelIcon from "./assets/fuel.svg";
import BatteryIcon from "./assets/battery.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import {
    skylabGameFlightRaceTournamentAddress,
    skylabTournamentAddress,
    skylabResourcesAddress,
} from "@/hooks/useContract";
import handleIpfsImg from "@/utils/ipfsImg";
import { DEAFAULT_CHAINID, RPC_URLS } from "@/utils/web3Utils";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import { Contract, Provider } from "ethers-multicall";
import { ethers } from "ethers";
import RightNav from "./RightNav";

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
                marginBottom: "60px",
                width: "500px",
                height: "200px",
                position: "relative",
            }}
            className="first-step"
        >
            {currentImg + 1 <= list.length - 1 && (
                <Box
                    sx={{
                        width: "200px",
                        position: "absolute",
                        left: "-130px",
                        top: "-20px",
                        background: `url(${PlaneShadow})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "25px 155px",
                        backgroundSize: "120px 28px",
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
                    width: "340px",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "-120px",
                }}
            >
                <Image sx={{}} src={list[currentImg].img}></Image>
                {currentIsExpired && (
                    <Image
                        src={Expired}
                        w="120px"
                        height={"120px"}
                        sx={{
                            position: "absolute",
                            top: "180px",
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
                            w="120px"
                            height={"120px"}
                            sx={{
                                position: "absolute",
                                top: "180px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                cursor: "pointer",
                            }}
                        ></Image>
                    )}
            </Box>

            <Box
                sx={{
                    zIndex: 1000,
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
                        width: "39px",
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
                                    width: "150px",
                                    left: "-50px",
                                    bottom: "-20px",
                                    fontSize: "14px",
                                }}
                            >
                                Change Plane
                            </Text>
                        </>
                    )}
                </Box>

                <Image
                    sx={{
                        width: "370px",
                        height: "200px",
                    }}
                    src={PlaneBg}
                ></Image>
                <Box
                    sx={{
                        width: "39px",
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
                                    width: "150px",
                                    left: "-20px",
                                    bottom: "-20px",
                                    fontSize: "14px",
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
                        bottom: "-46px",
                        background: `url(${PlaneShadow})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center 10px",
                        backgroundSize: "300px 70px",
                        paddingTop: "20px",
                    }}
                    w="100%"
                >
                    <Text fontSize="16px" fontWeight={600} textAlign="center">
                        {RoundTime[list[currentImg].round]?.startTime}-
                        {RoundTime[list[currentImg].round]?.endTime}
                    </Text>
                    <Text fontSize="24px" fontWeight={600} textAlign="center">
                        Lvl.0{list[currentImg].level}
                        {/* #{list[currentImg].tokenId} */}
                    </Text>
                    {list.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "0px",
                            }}
                        >
                            <Box
                                sx={{
                                    padding: "5px 10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(217, 217, 217, 0.10)",
                                    borderRadius: "40px",
                                    height: "25px",
                                }}
                            >
                                {list.map((item, index) => {
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: "9px",
                                                height: "9px",
                                                background:
                                                    index === currentImg
                                                        ? "#D9D9D9"
                                                        : "rgba(217, 217, 217, 0.50)",
                                                borderRadius: "50%",
                                                margin: "0 5px",
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
                width: "311px",
                height: "121px",
                backgroundSize: "100% 100%",
                padding: "20px 0 0 20px",
                marginBottom: "36px",
            }}
            className="first-step"
        >
            <Box sx={{ fontSize: "24px" }}>
                You currently do not have any plane
                <Popover placement="end-start">
                    <PopoverTrigger>
                        <Image
                            src={GrayTipIcon}
                            sx={{
                                display: "inline-block",
                                verticalAlign: "middle",
                                marginLeft: "5px",
                                cursor: "pointer",
                            }}
                        ></Image>
                    </PopoverTrigger>
                    <PopoverContent
                        sx={{
                            background: "#D9D9D9",
                            borderRadius: "10px",
                            border: "none",
                            color: "#000",
                            width: "272px",
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
                                    fontSize: "14px",
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

const Resources = () => {
    const { account } = useActiveWeb3React();
    const [fuelBalance, setFuelBalance] = useState(0);
    const [batteryBalance, setBatteryBalance] = useState(0);

    const getResourcesBalance = async () => {
        const provider = new ethers.providers.JsonRpcProvider(
            RPC_URLS[DEAFAULT_CHAINID][0],
        );
        const ethcallProvider = new Provider(provider);
        await ethcallProvider.init();

        const skylabResourcesContract = new Contract(
            skylabResourcesAddress[DEAFAULT_CHAINID],
            SKYLABRESOURCES_ABI,
        );

        const [fuelBalance, batteryBalance] = await ethcallProvider.all([
            skylabResourcesContract.balanceOf(account, 0),
            skylabResourcesContract.balanceOf(account, 1),
        ]);

        setBatteryBalance(batteryBalance.toNumber());
        setFuelBalance(fuelBalance.toNumber());
    };

    useEffect(() => {
        if (!account) {
            return;
        }
        getResourcesBalance();
    }, [account]);

    return (
        <Box
            sx={{
                display: "flex",
                marginTop: "40px",
                marginRight: "80px",
            }}
        >
            <Box
                sx={{
                    width: "203px",
                    height: "42px",
                    background: "#ffffffcc",
                    borderRadius: "50px",
                    position: "relative",
                    display: "flex",
                    marginRight: "45px",
                }}
            >
                <Box>
                    <Image src={FuelIcon} height="42px"></Image>
                    <Text
                        sx={{
                            fontSize: "16px",
                            color: "#4a4a4a",
                            position: "absolute",
                            bottom: "-20px",
                        }}
                    >
                        Fuel
                    </Text>
                </Box>
                <Text
                    sx={{
                        fontSize: "20px",
                        fontWeight: 500,
                        fontFamily: "Orbitron",
                        color: "#0080ff",
                        textShadow: "0px 6px 4px #00000040",
                        lineHeight: "42px",
                        marginLeft: "10px",
                    }}
                >
                    {fuelBalance.toLocaleString()}
                </Text>
            </Box>
            <Box
                sx={{
                    width: "203px",
                    height: "42px",
                    background: "#ffffffcc",
                    borderRadius: "50px",
                    position: "relative",
                    display: "flex",
                }}
            >
                <Box>
                    <Image src={BatteryIcon} height="42px"></Image>
                    <Text
                        sx={{
                            fontSize: "16px",
                            color: "#4a4a4a",
                            position: "absolute",
                            bottom: "-20px",
                        }}
                    >
                        Battery
                    </Text>
                </Box>
                <Text
                    sx={{
                        fontSize: "20px",
                        fontWeight: 500,
                        fontFamily: "Orbitron",
                        color: "#0080ff",
                        textShadow: "0px 6px 4px #00000040",
                        lineHeight: "42px",
                        marginLeft: "10px",
                    }}
                >
                    {batteryBalance.toLocaleString()}
                </Text>
            </Box>
        </Box>
    );
};

interface ChildProps {
    currentRound: number;
    onBack: () => void;
}

const MissionRound = ({ currentRound, onBack }: ChildProps) => {
    const { account } = useActiveWeb3React();
    const [planeList, setPlaneList] = useState<PlaneInfo[]>([]);
    const [currentImg, setCurrentImg] = useState(0);

    const { setIsOpen, setCurrentStep } = useTour();

    const [active, setActive] = useState(0);
    const [showAllActivities, setShowAllActivities] = useState(false);

    const currentIsExpired = useMemo(() => {
        if (planeList.length === 0) {
            return false;
        }
        return currentRound > planeList[currentImg].round;
    }, [currentRound, planeList, currentImg]);

    const handleOpenTutorial = () => {
        setCurrentStep(0);
        setIsOpen(true);
    };

    const handleCurrentImg = (index: number) => {
        setCurrentImg(index);
    };

    const handleGetPlaneBalance = async () => {
        setCurrentImg(0);
        setPlaneList([]);
        const provider = new ethers.providers.JsonRpcProvider(
            RPC_URLS[DEAFAULT_CHAINID][0],
        );
        const ethcallProvider = new Provider(provider);
        await ethcallProvider.init();
        const tournamentContract = new Contract(
            skylabTournamentAddress[DEAFAULT_CHAINID],
            SKYLABTOURNAMENT_ABI,
        );
        const skylabGameFlightRaceContract = new Contract(
            skylabGameFlightRaceTournamentAddress[DEAFAULT_CHAINID],
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
            <Box
                pos="absolute"
                left="0vw"
                top="0"
                width={"100%"}
                zIndex={20}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Image
                    src={ActivityTitle}
                    sx={{
                        width: "300px",
                    }}
                ></Image>
                <Resources></Resources>
            </Box>
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
                    left: "120px",
                    bottom: "60px",
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

                <Box
                    sx={{
                        width: "500px",
                        height: "79px",
                        background: `url(${LongBt})`,
                        backgroundSize: "100% 100%",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        window.open("https://twitter.com/skylabHQ", "_blank");
                    }}
                >
                    <Text
                        sx={{
                            textAlign: "center",
                            lineHeight: "79px",
                            fontWeight: 600,
                            fontSize: "28px",
                        }}
                    >
                        Request access for next round
                    </Text>
                </Box>
                <Image></Image>
            </Box>
            <RightNav
                onShowAllActivities={() => {
                    setShowAllActivities(!showAllActivities);
                }}
                onBack={onBack}
                onOpenTutorial={handleOpenTutorial}
            ></RightNav>
        </Box>
    );
};

export default MissionRound;
