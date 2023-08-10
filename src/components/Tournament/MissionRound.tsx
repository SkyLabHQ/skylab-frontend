import {
    Box,
    Img,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useToast,
    Image,
} from "@chakra-ui/react";
import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";
import PolygonIcon from "./assets/polygon.svg";
import ButtonTip from "./assets/tutorial-button.svg";
import GrayTipIcon from "./assets/gray-tip.svg";
import BlackTwIcon from "./assets/black-tw.svg";
import InGame from "./assets/ingame.svg";
import Expired from "./assets/expired.svg";
import PlaneShadow from "./assets/plane-shadow.png";
import LeaderboardIcon from "./assets/leaderboard-icon.svg";
import ActivityTitle from "./assets/activity-title.svg";
import PlaneBg from "./assets/plane-bg.png";
import NoPlane from "./assets/no-plane.png";
import LongBt from "./assets/long-bt.png";
import BlackArrowLeft from "./assets/black-arrow-left.svg";
import BlackArrowRight from "./assets/black-arrow-right.svg";
import SectionActivities from "@/components/Tournament/assets/ring.svg";
import BluePlanet from "@/components/Tournament/assets/blue-planet.png";
import TutorialIcon from "@/components/Tournament/assets/tutorial-icon.svg";
import AllActivity from "@/components/Tournament/assets/all-activity.svg";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import GrayPlanet from "@/components/Home/assets/gray-planet.svg";
import ButtonBg from "@/components/Tournament/assets/button-bg.png";
import ButoonBgGray from "@/components/Tournament/assets/button-bg-gray.png";
import { PlaneInfo } from "@/pages/Mercury";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSkylabTestFlightContract } from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { handleError } from "@/utils/error";
import { LOGOS, twitterUrl } from "@/skyConstants";
import RoundTime from "@/skyConstants/roundTime";
import { ChainId, DEAFAULT_CHAINID } from "@/utils/web3Utils";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import useSkyToast from "@/hooks/useSkyToast";

const PlanetList = ({
    planeList,
    currentImg,
    active,
    currentIsExpired,
    showAllActivities,
    onChangeActive,
    onChangeAllActivities,
}: {
    planeList: PlaneInfo[];
    currentImg: number;
    active: number;
    currentIsExpired: boolean;
    showAllActivities: boolean;
    onChangeActive: (index: number) => void;
    onChangeAllActivities: (showAllActivities: boolean) => void;
}) => {
    const toast = useSkyToast();
    const { account, chainId } = useActiveWeb3React();
    const navigate = useNavigate();
    const skylabTestFlightContract = useSkylabTestFlightContract(true);
    const addNetworkToMetask = useAddNetworkToMetamask();
    const handleToSpend = async () => {
        if (chainId !== Number(DEAFAULT_CHAINID)) {
            await addNetworkToMetask(Number(DEAFAULT_CHAINID));
            return;
        }

        if (planeList[currentImg].state != 0) {
            navigate(`/game?tokenId=${planeList[currentImg].tokenId}`);
        } else {
            navigate(`/spendResource?tokenId=${planeList[currentImg].tokenId}`);
        }
    };

    const handleMintPlayTest = async () => {
        try {
            if (chainId !== ChainId.MUMBAI) {
                await addNetworkToMetask(ChainId.MUMBAI);
                return;
            }

            const res = await skylabTestFlightContract.playTestMint();
            await res.wait();

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
            toast(handleError(error));
        }
    };

    const planetList = [
        {
            img: BluePlanet,
            left: ["20vw", "-2vw"],
            bottom: ["0", "0"],
            width: ["24vw", "20vw"],
            transform: ["", ""],
            showAll: {
                left: "20vw",
                bottom: "0",
                width: "200px",
                transform: "",
            },
            text: "Trailbalzer",
            playTestEnable: true,
            playEnable: true,
            playTest: handleMintPlayTest,
            play: handleToSpend,
        },
        {
            img: GrayPlanet,
            left: ["55vw", "50vw"],
            bottom: ["8vh", "5vh"],
            width: ["20vw", "30vw"],
            transform: ["", "translateX(-50%)"],
            showAll: {
                left: "55vw",
                bottom: "3vh",
                width: "200px",
                transform: "",
            },
            text: "Bid tac toe",
            playTestEnable: true,
            playEnable: true,
        },
    ];
    return (
        <Box
            sx={{
                left: 0,
                top: 0,
                width: "100vw",
                height: "55vh",
                position: "absolute",
                background: `url(${SectionActivities})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: showAllActivities ? "100%" : "220%",
                backgroundPosition: showAllActivities
                    ? "0 bottom"
                    : "-80vw bottom",
                transition: "all 0.5s",
            }}
        >
            {active !== 0 && (
                <Image
                    src={LeftArrow}
                    sx={{
                        position: "absolute",
                        left: "20px",
                        top: "40vh",
                        width: "32px",
                        zIndex: 10,
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        onChangeActive(active - 1);
                    }}
                ></Image>
            )}
            {active !== planetList.length - 1 && (
                <Image
                    src={RightArrow}
                    sx={{
                        position: "absolute",
                        right: "20px",
                        top: "40vh",
                        width: "32px",
                        zIndex: 10,
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        onChangeActive(active + 1);
                    }}
                ></Image>
            )}
            {planetList.map((item, index) => {
                return (
                    <Box
                        key={index}
                        sx={{
                            transition: "all 0.5s",
                            position: "absolute",
                            left: showAllActivities
                                ? item.showAll.left
                                : item.left[active],
                            bottom: showAllActivities
                                ? item.showAll.bottom
                                : item.bottom[active],
                            width: showAllActivities
                                ? item.showAll.width
                                : item.width[active],
                            transform: showAllActivities
                                ? item.showAll.transform
                                : item.transform[active],
                            cursor: "pointer",
                            "&:hover .play": {
                                opacity: 1,
                            },
                        }}
                    >
                        <Image
                            key={index}
                            src={item.img}
                            sx={{ width: "100%" }}
                            onClick={() => {
                                onChangeActive(index);
                                onChangeAllActivities(false);
                            }}
                        ></Image>
                        {active === index && !showAllActivities && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "35%",
                                    transform: "translateX(-50%)",
                                }}
                            >
                                <Box
                                    sx={{
                                        background: `url(${ButtonBg})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "100% 100%",
                                        width: "472px",
                                        height: "138px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        sx={{
                                            color: "#fff",
                                            fontSize: "64px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {item.text}
                                    </Text>
                                </Box>
                                <Box
                                    className="play"
                                    sx={{
                                        display: "flex",
                                        opacity: 0,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        transition: "all 0.5s",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: `url(${ButtonBg})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "100% 100%",
                                            width: "200px",
                                            height: "74px",
                                            display: "flex",
                                            alignItems: "center",
                                            flexDirection: "column",
                                        }}
                                        onClick={item.playTest}
                                    >
                                        <Text
                                            sx={{
                                                color: "#fff",
                                                fontSize: "24px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Playtest
                                        </Text>
                                        <Text
                                            sx={{
                                                color: "#fff",
                                                fontSize: "14px",
                                                fontWeight: 600,
                                            }}
                                        >
                                            W/o plane
                                        </Text>
                                    </Box>

                                    {currentIsExpired ? (
                                        <Box
                                            onClick={item.play}
                                            sx={{
                                                background: `url(${ButoonBgGray})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "100% 100%",
                                                width: "200px",
                                                height: "74px",
                                                display: "flex",
                                                justifyContent: "center",
                                                position: "relative",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <Text
                                                    sx={{
                                                        color: "#616161",
                                                        fontSize: "24px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Play
                                                </Text>
                                                <Text
                                                    sx={{
                                                        color: "#616161",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    With plane
                                                </Text>
                                            </Box>

                                            <Popover placement="end-start">
                                                <PopoverTrigger>
                                                    <Image
                                                        src={GrayTipIcon}
                                                        sx={{
                                                            width: "22px",
                                                            position:
                                                                "absolute",
                                                            right: "20px",
                                                            top: "50%",
                                                            transform:
                                                                "translateY(-50%)",
                                                        }}
                                                    ></Image>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    sx={{
                                                        background: "#D9D9D9",
                                                        borderRadius: "10px",
                                                        border: "none",
                                                        color: "#000",
                                                        textAlign: "center",
                                                        "&:focus": {
                                                            outline:
                                                                "none !important",
                                                            boxShadow:
                                                                "none !important",
                                                        },
                                                    }}
                                                >
                                                    <PopoverBody
                                                        onClick={(e) => {
                                                            window.open(
                                                                twitterUrl,
                                                            );
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "24px",
                                                                fontWeight: 600,
                                                                marginRight:
                                                                    "10px",
                                                            }}
                                                        >
                                                            Request access for
                                                            next round to join
                                                            the tournament
                                                        </span>
                                                        <img
                                                            src={BlackTwIcon}
                                                            style={{
                                                                display:
                                                                    "inline-block",
                                                                verticalAlign:
                                                                    "middle",
                                                            }}
                                                            alt=""
                                                        />
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Popover>
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                background: `url(${ButtonBg})`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "100% 100%",
                                                width: "200px",
                                                height: "74px",
                                                display: "flex",
                                                alignItems: "center",
                                                flexDirection: "column",
                                            }}
                                            onClick={item.play}
                                        >
                                            <Text
                                                sx={{
                                                    color: "#fff",
                                                    fontSize: "24px",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Play
                                            </Text>
                                            <Text
                                                sx={{
                                                    color: "#fff",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                With plane
                                            </Text>
                                        </Box>
                                    )}
                                    <Image src={ButtonTip}></Image>
                                </Box>
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
};

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
        >
            {currentImg + 1 <= list.length - 1 && (
                <Box
                    sx={{
                        width: "200px",
                        position: "absolute",
                        left: "-130px",
                        top: "-50px",
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
                    width: "370px",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "-180px",
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

interface ChildProps {
    currentRound: number;
    currentImg: number;
    planeList: PlaneInfo[];
    onNextRound: (nextStep: number) => void;
    onCurrentImg: (index: number) => void;
    onBack: () => void;
}

const MissionRound = ({
    currentRound,
    currentImg,
    planeList,
    onBack,
    onCurrentImg,
}: ChildProps) => {
    const toast = useSkyToast();
    const { account, chainId } = useActiveWeb3React();
    const navigate = useNavigate();
    const skylabTestFlightContract = useSkylabTestFlightContract(true);
    const addNetworkToMetask = useAddNetworkToMetamask();
    const [next, setNext] = useState(false);
    const [active, setActive] = useState(0);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);

    const currentIsExpired = useMemo(() => {
        if (planeList.length === 0) {
            return false;
        }
        return currentRound > planeList[currentImg].round;
    }, [currentRound, planeList, currentImg]);

    return (
        <Box
            h={"100vh"}
            w={"100vw"}
            sx={{ color: "#000", fontWeight: 600 }}
            onClick={() => {}}
        >
            <Box pos="absolute" left="0vw" top="0">
                <Image src={ActivityTitle}></Image>
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
                    bottom: "100px",
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
                        onCurrentImg={onCurrentImg}
                        currentImg={currentImg}
                    ></PlaneList>
                )}

                <Box
                    sx={{
                        width: "500px",
                        height: "79px",
                        background: `url(${LongBt})`,
                        backgroundSize: "100% 100%",
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

            <Box
                right="2vw"
                bottom="100px"
                pos={"absolute"}
                cursor={"pointer"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                }}
            >
                <Image
                    src={AllActivity}
                    onClick={() => {
                        setShowAllActivities(!showAllActivities);
                    }}
                ></Image>
                <Image
                    src={LeaderboardIcon}
                    onClick={onBack}
                    sx={{ marginTop: "8px" }}
                ></Image>
                <Image src={TutorialIcon} sx={{ marginTop: "8px" }}></Image>
                <Image
                    onClick={() => {
                        navigate("/?part=primitives");
                    }}
                    src={ProMerTab}
                    sx={{ width: "280px", marginTop: "40px" }}
                ></Image>
            </Box>
        </Box>
    );
};

export default MissionRound;
