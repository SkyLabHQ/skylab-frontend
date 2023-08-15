import React from "react";
import {
    Box,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Image,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    Checkbox,
} from "@chakra-ui/react";
import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";
import GrayTipIcon from "./assets/gray-tip.svg";
import BlackTwIcon from "./assets/black-tw.svg";
import SectionActivities from "@/components/Tournament/assets/ring.svg";
import BluePlanet from "@/components/Tournament/assets/blue-planet.png";
import GrayPlanet from "@/components/Home/assets/gray-planet.svg";
import ButtonBg from "@/components/Tournament/assets/button-bg.png";
import ButoonBgGray from "@/components/Tournament/assets/button-bg-gray.png";
import { PlaneInfo } from "@/pages/Mercury";
import { useNavigate } from "react-router-dom";
import { useSkylabTestFlightContract } from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { handleError } from "@/utils/error";
import { twitterUrl } from "@/skyConstants";
import { ChainId, DEAFAULT_CHAINID } from "@/utils/web3Utils";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import useSkyToast from "@/hooks/useSkyToast";
import BluePlanetTutorial from "./BluePlanetTutorial";
import FaucetModal from "./FaucetModal";

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
    const { isOpen, onOpen, onClose } = useDisclosure();
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

            const balanceTip = localStorage.getItem("balanceTip");
            if (!balanceTip) {
                onOpen();
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

    const handleFaucetClose = (checked: boolean) => {
        if (checked) {
            localStorage.setItem("balanceTip", "true");
        }
        onClose();
    };

    const planetList = [
        {
            img: BluePlanet,
            left: ["18vw", "-2vw"],
            bottom: ["0", "0"],
            width: "20vw",
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
            className: "second-step",
            tutorialIconShow: true,
            tutorialComponent: BluePlanetTutorial,
            comingSoon: false,
            hoverWidth: "28vw",
        },
        {
            img: GrayPlanet,
            left: ["55vw", "50vw"],
            bottom: ["8vh", "4vh"],
            width: "22vw",
            transform: ["", "translateX(-50%)"],
            showAll: {
                left: "55vw",
                bottom: "3vh",
                width: "200px",
                transform: "",
            },
            text: "Bid tac toe",
            playTestEnable: false,
            playEnable: false,
            tutorialIconShow: false,
            comingSoon: true,
            hoverWidth: "32vw",
        },
    ];

    return (
        <>
            <Box
                sx={{
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "55vh",
                    position: "relative",
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
                    const playTestEnable = item.playTestEnable;
                    const TutorialGroup = item.tutorialComponent;
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
                                    : item.width,
                                transform: showAllActivities
                                    ? item.showAll.transform
                                    : item.transform[active],
                                cursor: "pointer",
                                "&:hover": {
                                    width: showAllActivities
                                        ? item.showAll.width
                                        : active === index
                                        ? item.hoverWidth
                                        : item.width,
                                },
                                "&:hover .text": {
                                    opacity: 1,
                                },
                            }}
                            className={item.className}
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
                                        opacity: 0,
                                        transition: "all 0.5s",
                                    }}
                                    className="text"
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

                                    {item.comingSoon ? (
                                        <Box
                                            sx={{
                                                background: "#000",
                                                color: "#fff",
                                                width: "fit-content",
                                                margin: "0 auto",
                                                fontSize: "24px",
                                                padding: "4px 10px",
                                                borderRadius: "4px",
                                                transition: "all 0.5s",
                                            }}
                                        >
                                            Coming soon
                                        </Box>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                transition: "all 0.5s",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    background: `url(${
                                                        playTestEnable
                                                            ? ButtonBg
                                                            : ButoonBgGray
                                                    })`,
                                                    backgroundRepeat:
                                                        "no-repeat",
                                                    backgroundSize: "100% 100%",
                                                    width: "200px",
                                                    height: "74px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flexDirection: "column",
                                                    color: playTestEnable
                                                        ? "#fff"
                                                        : "#616161",
                                                }}
                                                onClick={item.playTest}
                                            >
                                                <Text
                                                    sx={{
                                                        fontSize: "24px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Playtest
                                                </Text>
                                                <Text
                                                    sx={{
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    W/o plane
                                                </Text>
                                            </Box>

                                            {currentIsExpired ||
                                            planeList.length === 0 ? (
                                                <Box
                                                    onClick={item.play}
                                                    sx={{
                                                        background: `url(${ButoonBgGray})`,
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundSize:
                                                            "100% 100%",
                                                        width: "200px",
                                                        height: "74px",
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        position: "relative",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            flexDirection:
                                                                "column",
                                                        }}
                                                    >
                                                        <Text
                                                            sx={{
                                                                color: "#616161",
                                                                fontSize:
                                                                    "24px",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Play
                                                        </Text>
                                                        <Text
                                                            sx={{
                                                                color: "#616161",
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            With plane
                                                        </Text>
                                                    </Box>

                                                    <Popover placement="end-start">
                                                        <PopoverTrigger>
                                                            <Image
                                                                src={
                                                                    GrayTipIcon
                                                                }
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
                                                                background:
                                                                    "#D9D9D9",
                                                                borderRadius:
                                                                    "10px",
                                                                border: "none",
                                                                color: "#000",
                                                                textAlign:
                                                                    "center",
                                                                "&:focus": {
                                                                    outline:
                                                                        "none !important",
                                                                    boxShadow:
                                                                        "none !important",
                                                                },
                                                            }}
                                                        >
                                                            <PopoverBody
                                                                onClick={(
                                                                    e,
                                                                ) => {
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
                                                                    Request
                                                                    access for
                                                                    next round
                                                                    to join the
                                                                    tournament
                                                                </span>
                                                                <img
                                                                    src={
                                                                        BlackTwIcon
                                                                    }
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
                                                        backgroundRepeat:
                                                            "no-repeat",
                                                        backgroundSize:
                                                            "100% 100%",
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
                                            {item.tutorialIconShow && (
                                                <TutorialGroup></TutorialGroup>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
            <FaucetModal
                open={isOpen}
                onClose={handleFaucetClose}
            ></FaucetModal>
        </>
    );
};

export default PlanetList;
