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
import LeaderboardIcon from "./assets/leaderboard-icon.svg";
import ActivityTitle from "./assets/activity-title.svg";
import PlaneBg from "./assets/plane-bg.png";
import NoPlane from "./assets/no-plane.png";
import LongBt from "./assets/long-bt.png";
import BlackArrowLeft from "./assets/black-arrow-left.svg";
import BlackArrowRight from "./assets/black-arrow-right.svg";
import TutorialIcon from "@/components/Tournament/assets/tutorial-icon.svg";
import AllActivity from "@/components/Tournament/assets/all-activity.svg";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import { PlaneInfo } from "@/pages/Mercury";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import RoundTime from "@/skyConstants/roundTime";
import { useTour } from "@reactour/tour";
import PlanetList from "./PlanetList";

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

    return (
        <Box
            h={"100vh"}
            w={"100vw"}
            sx={{ color: "#000", fontWeight: 600 }}
            onClick={() => {}}
        >
            <Box pos="absolute" left="0vw" top="0" zIndex={20}>
                <Image
                    src={ActivityTitle}
                    sx={{
                        width: "300px",
                    }}
                ></Image>
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
                <Image
                    src={TutorialIcon}
                    sx={{ marginTop: "8px" }}
                    onClick={handleOpenTutorial}
                ></Image>
                <Image
                    onClick={() => {
                        window.open("/?part=primitives", "_blank");
                    }}
                    src={ProMerTab}
                    sx={{ width: "280px", marginTop: "40px" }}
                ></Image>
            </Box>
        </Box>
    );
};

export default MissionRound;
