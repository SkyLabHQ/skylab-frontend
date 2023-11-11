import {
    Box,
    Text,
    Image,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
} from "@chakra-ui/react";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import MileageIcon from "./assets/mileage-icon.svg";
import styled from "@emotion/styled";
import RulesIcon from "./assets/rules-icon.svg";
import DownArrow from "./assets/down-arrow.svg";
import LeaderboardIcon from "./assets/leaderboard-icon.svg";
import CosmeticGray from "./assets/cosmetic-gray.svg";
import PilotIcon from "./assets/pilot-icon.svg";
import BabyMercIcon from "./assets/babymerc-icon.svg";
import { useNavigate } from "react-router-dom";
import { ImgButton, PrimaryButton } from "../Button/Index";
import { PilotInfo } from "@/hooks/usePilotInfo";
import Nav2NFT from "./Nav2NFT";
import RequestNextButton from "../RequrestNextButton";
import NoPlane from "./assets/no-plane.png";
import GrayTipIcon from "./assets/gray-tip.svg";
import { PlaneInfo } from "@/pages/Activities";
import PlaneShadow from "./assets/plane-shadow.png";
import InGame from "./assets/ingame.svg";
import PlaneBg from "./assets/plane-bg.png";
import BlackArrowRight from "./assets/black-arrow-right.svg";
import RoundTime from "@/skyConstants/roundTime";
import BlackArrowLeft from "./assets/black-arrow-left.svg";
import GameLeaderboard from "./GameLeaderboard";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";

const NoPlaneContent = () => {
    return (
        <Box
            sx={{
                background: `url(${NoPlane})`,
                width: "19.0104vw",
                height: "6.3021vw",
                backgroundSize: "100% 100%",
                padding: "1.0417vw 0.6vw 0 0.6vw",
                marginBottom: "1.875vw",
            }}
            className="first-step"
        >
            <Box sx={{ fontSize: "1.0417vw" }}>
                You currently do not have any aviation for this round.
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

const Mileage = ({ value }: { value: number }) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "2.0833vw",
                borderRadius: "2.5vw",
                background: "rgba(255, 255, 255, 0.50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2.6042vw 0 4.1667vw",
            }}
        >
            <Image
                src={MileageIcon}
                sx={{
                    width: "3.125vw",
                    height: "3.125vw",
                    position: "absolute",
                    left: "-0.5208vw",
                    top: "50%",
                    transform: "translateY(-50%)",
                }}
            ></Image>
            <Text
                sx={{
                    color: "#4A4A4A",
                    fontSize: "0.8333vw",
                    fontWeight: 500,
                }}
            >
                Mileage
            </Text>
            <Text
                sx={{
                    color: "#2B2B2B",
                    fontSize: "0.8333vw",
                    fontWeight: 500,
                }}
            >
                {value}
            </Text>
        </Box>
    );
};

const PlaneList = ({
    currentRound,
    list,
    currentImg,
    onCurrentImg,
}: {
    currentRound: number;
    list: PlaneInfo[];
    currentImg: number;
    onCurrentImg: (index: number) => void;
}) => {
    const navigate = useNavigate();
    const { chainId } = useActiveWeb3React();
    const addNetworkToMetask = useAddNetworkToMetamask();

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
            {currentImg - 1 >= 0 && (
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
                        src={list[currentImg - 1].img}
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
                zIndex={40}
            >
                {currentRound == list[currentImg].round &&
                    list[currentImg].state && (
                        <Image
                            onClick={async () => {
                                if (chainId !== Number(DEAFAULT_CHAINID)) {
                                    await addNetworkToMetask(
                                        Number(DEAFAULT_CHAINID),
                                    );
                                    return;
                                }
                                navigate(
                                    `/tactoe/game?tokenId=${list[currentImg].tokenId}`,
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
                    width: "17.7083vw",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "-6.25vw",
                }}
                zIndex={30}
            >
                <Image sx={{}} src={list[currentImg].img}></Image>
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
                    {RoundTime[list[currentImg].round]?.startTime && (
                        <Text
                            fontSize="0.8333vw"
                            fontWeight={600}
                            textAlign="center"
                        >
                            {RoundTime[list[currentImg].round]?.startTime}-
                            {RoundTime[list[currentImg].round]?.endTime}
                        </Text>
                    )}
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

const Cosmetics = () => {
    return (
        <Box
            sx={{
                height: "5.5208vw",
                display: "flex",
                borderRadius: "1.0417vw",
                background: "rgba(177, 177, 177, 0.50)",
                padding: "0.5208vw 0 0 0.8333vw",
                marginTop: "0.9375vw",
            }}
        >
            <Image
                src={CosmeticGray}
                sx={{
                    width: "3.3333vw",
                    height: "3.3333vw",
                    marginRight: "0.8333vw",
                }}
            ></Image>
            <Box>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "1.0417vw",
                        fontWeight: 500,
                    }}
                >
                    ^%2&{")"}$19^#v&!_
                </Text>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "0.7292vw",
                    }}
                >
                    coming soon...
                </Text>
            </Box>
        </Box>
    );
};

const NavButtonStyle = styled(PrimaryButton)`
    width: 11.0417vw;
    height: 2.7083vw;
    border-radius: 0.7813vw;
    border: 2px solid #F2D861;
    background: linear-gradient(95deg, rgba(143, 255, 249, 0.00) 29.09%, rgba(0, 0, 0, 0.20) 60.98%, rgba(251, 209, 97, 0.00) 89.72%);
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
    font-size: 1.0417vw;
    display: flex;
    align-items: center;
    color:#F2D861;
    fonw-weight: 700;
    cursor: pointer;
}
`;

const RightNav = ({
    currentRound,
    list,
    currentImg,
    onCurrentImg,
    activePilot,
    onNextRound,
}: {
    currentRound: number;
    list: PlaneInfo[];
    currentImg: number;
    onCurrentImg: (index: number) => void;
    activePilot: PilotInfo;
    onNextRound: (step: number | string) => void;
}) => {
    const navigate = useNavigate();
    const { chainId } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    const addNetworkToMetask = useAddNetworkToMetamask();

    return (
        <Box
            right="1.1979vw"
            top="3.2407vh"
            pos={"absolute"}
            sx={{
                width: "22.3958vw",
            }}
        >
            <Mileage value={activePilot.xp}></Mileage>
            <Box
                sx={{
                    position: "relative",
                    marginTop: "1.8519vh",
                    height: "54.0741vh",
                }}
            >
                <GameLeaderboard show={isOpen}></GameLeaderboard>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.7292vw",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                    }}
                >
                    <Image
                        src={DownArrow}
                        sx={{
                            position: "absolute",
                            left: "50%",
                            top: "-0.7813vw",
                            transform: isOpen
                                ? "translateX(-50%)"
                                : "translateX(-50%) rotate(180deg)",
                            transition: "all 0.3s",
                            transformOrigin: "center center",
                        }}
                    ></Image>
                    <NavButtonStyle
                        onClick={() => {
                            if (isOpen) {
                                onClose();
                            } else {
                                onOpen();
                            }
                        }}
                    >
                        <Image
                            src={LeaderboardIcon}
                            sx={{
                                width: "1.8229vw",
                                marginRight: "0.1042vw",
                            }}
                        ></Image>
                        <Text>Leaderboard</Text>
                    </NavButtonStyle>
                </Box>

                <NavButtonStyle
                    onClick={() => {
                        navigate("/tactoe/rules");
                    }}
                >
                    <Image
                        src={RulesIcon}
                        sx={{
                            width: "1.8229vw",
                            marginRight: "0.1042vw",
                        }}
                    ></Image>
                    <Text>Detailed Rules</Text>
                </NavButtonStyle>
            </Box>
            <Cosmetics></Cosmetics>
            <Box
                sx={{
                    marginTop: "0.7292vw",
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                <Nav2NFT
                    icon={PilotIcon}
                    title={"Pilot"}
                    onClick={async () => {
                        if (chainId !== Number(DEAFAULT_CHAINID)) {
                            await addNetworkToMetask(Number(DEAFAULT_CHAINID));
                            return;
                        }
                        onNextRound("currentPilot");
                    }}
                ></Nav2NFT>
                <Nav2NFT
                    icon={BabyMercIcon}
                    title={"Mint"}
                    disabled={true}
                    value={"Baby Merc"}
                    onClick={() => {
                        onNextRound("babyMerc");
                    }}
                ></Nav2NFT>
                <ImgButton
                    sx={{
                        width: "14.5833vw",
                        left: "-16.8333vw",
                        position: "absolute",
                        bottom: "0",
                        height: "5.7292vw",
                    }}
                >
                    <Image
                        onClick={() => {
                            window.open("/#/?part=primitives", "_blank");
                        }}
                        src={ProMerTab}
                    ></Image>
                </ImgButton>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "absolute",
                        bottom: "0",
                        left: "-70vw",
                    }}
                >
                    {list.length === 0 ? (
                        <NoPlaneContent></NoPlaneContent>
                    ) : (
                        <PlaneList
                            currentRound={currentRound}
                            list={list}
                            onCurrentImg={onCurrentImg}
                            currentImg={currentImg}
                        ></PlaneList>
                    )}
                    <RequestNextButton
                        onClick={() => {
                            window.open(
                                "https://twitter.com/skylabHQ",
                                "_blank",
                            );
                        }}
                    ></RequestNextButton>
                </Box>
            </Box>
        </Box>
    );
};

export default RightNav;
