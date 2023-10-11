import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Image,
    useDisclosure,
    Button,
    ButtonProps,
    Tooltip,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

import LeftArrow from "./assets/left-arrow.svg";
import RightArrow from "./assets/right-arrow.svg";
import GrayTipIcon from "./assets/gray-tip.svg";
import BlackTwIcon from "./assets/black-tw.svg";
import SectionActivities from "@/components/Tournament/assets/ring.svg";
import BluePlanet from "@/components/Tournament/assets/blue-planet.png";
import GrayPlanet from "@/components/Tournament/assets/gray-planet.png";
import ButtonBg from "@/components/Tournament/assets/button-bg.png";
import { PlaneInfo } from "@/pages/Activities";
import { useNavigate } from "react-router-dom";
import { useSkylabTestFlightContract } from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { handleError } from "@/utils/error";
import { twitterUrl } from "@/skyConstants";
import { ChainId, DEAFAULT_CHAINID } from "@/utils/web3Utils";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import useSkyToast from "@/hooks/useSkyToast";
import BluePlanetTutorial from "./BluePlanetTutorial";
import BidTacToeTutorial from "@/components/TacToe/BidTacToeTutorial";
import FaucetModal from "./FaucetModal";
import ButtonDefault from "./assets/button-default.png";
import ButtonHover from "./assets/button-hover.png";
import ButtonPressed from "./assets/button-pressed.png";
import ButtonTip from "./assets/tutorial-button.svg";
import BttPlayBackButton from "./BttPlayBackButton";
import Loading from "../Loading";

const StyledPrimaryButton = styled(Button)(() => ({
    background: `url(${ButtonDefault})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    width: "10.4167vw",
    height: "3.8542vw",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    color: "#000",
    borderRadius: "0.9375vw",
    padding: "0",
    lineHeight: "1.5",
    "&:hover": {
        background: `url(${ButtonHover})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
    },
    "&:focus": {
        boxShadow: "none",
    },
    "&:active": {
        background: `url(${ButtonPressed})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
    },
    // 设置disabled样式
    "&[disabled]": {
        opacity: 1,
        border: " 3px solid #616161",
        background: "#ABABAB",
        color: "#616161",
    },
    // 设置disabled hover样式
    "&[disabled]:hover": {
        background: "#ABABAB",
    },
}));

const PrimaryButton = ({ children, ...props }: ButtonProps) => {
    return <StyledPrimaryButton {...props}>{children}</StyledPrimaryButton>;
};

const PlayTestButton = ({
    enable,
    onClick,
}: {
    enable: boolean;
    onClick: () => void;
}) => {
    return (
        <PrimaryButton
            disabled={!enable}
            onClick={() => {
                onClick();
            }}
        >
            <Text
                sx={{
                    fontSize: "1.25vw",
                    fontWeight: 600,
                }}
            >
                Playtest
            </Text>
            <Text
                sx={{
                    fontSize: "0.7292vw",
                    fontWeight: 600,
                }}
            >
                W/o plane
            </Text>
        </PrimaryButton>
    );
};

const CanNotPlayButton = () => {
    return (
        <PrimaryButton
            disabled={true}
            sx={{
                borderRadius: "1.0417vw",
                border: "3px solid #616161",
                background: "#ABABAB",
                width: "10.4167vw",
                height: "3.8542vw",
                display: "flex",
                justifyContent: "center",
                position: "relative",
                cursor: "not-allowed",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Text
                sx={{
                    color: "#616161",
                    fontSize: "1.25vw",
                    fontWeight: 600,
                }}
            >
                Play
            </Text>
            <Text
                sx={{
                    color: "#616161",
                    fontSize: "0.7292vw",
                    fontWeight: 600,
                }}
            >
                With plane
            </Text>
            <Popover placement="end-start">
                <PopoverTrigger>
                    <Image
                        src={GrayTipIcon}
                        sx={{
                            width: "1.1458vw",
                            position: "absolute",
                            right: "1.0417vw",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                        }}
                    ></Image>
                </PopoverTrigger>
                <PopoverContent
                    sx={{
                        background: "#D9D9D9",
                        borderRadius: "0.5208vw",
                        border: "none",
                        color: "#000",
                        textAlign: "center",
                        "&:focus": {
                            outline: "none !important",
                            boxShadow: "none !important",
                        },
                    }}
                >
                    <PopoverBody
                        sx={{
                            cursor: "pointer",
                            whiteSpace: "normal",
                        }}
                        onClick={(e) => {
                            window.open(twitterUrl);
                        }}
                    >
                        <span
                            style={{
                                fontSize: "1.25vw",
                                fontWeight: 600,
                                marginRight: "0.5208vw",
                            }}
                        >
                            Request access for next round to join the tournament
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
        </PrimaryButton>
    );
};

const PlayButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <PrimaryButton
            sx={{
                background: `url(${ButtonBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                width: "10.4167vw",
                height: "3.8542vw",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
            onClick={onClick}
        >
            <Text
                sx={{
                    fontSize: "1.25vw",
                    fontWeight: 600,
                }}
            >
                Play
            </Text>
            <Text
                sx={{
                    fontSize: "0.7292vw",
                    fontWeight: 600,
                }}
            >
                With plane
            </Text>
        </PrimaryButton>
    );
};

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
    const [delayActive, setDelayActive] = useState(active);
    const toast = useSkyToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { account, chainId } = useActiveWeb3React();
    const navigate = useNavigate();
    const skylabTestFlightContract = useSkylabTestFlightContract(true);
    const addNetworkToMetask = useAddNetworkToMetamask();
    const [loading, setLoading] = useState(false);
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

    const handleMintPlayTest = async (
        path: string,
        showBalanceTip: boolean = true,
    ) => {
        try {
            if (chainId !== ChainId.MUMBAI) {
                await addNetworkToMetask(ChainId.MUMBAI);
                return;
            }

            const balanceTip = localStorage.getItem("balanceTip");
            if (!balanceTip && showBalanceTip) {
                onOpen();
                return;
            }
            setLoading(true);
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
            setLoading(false);

            if (planeTokenIds1.length > 0) {
                navigate(
                    `${path}?tokenId=${planeTokenIds1[
                        planeTokenIds1.length - 1
                    ].toNumber()}&testflight=true`,
                );
            }
        } catch (error) {
            setLoading(false);
            toast(handleError(error));
        }
    };

    const handleFaucetClose = (checked: boolean) => {
        if (checked) {
            localStorage.setItem("balanceTip", "true");
        }
        onClose();
        handleMintPlayTest(planetList[active].path, false);
    };

    const planetList = [
        {
            img: BluePlanet,
            left: ["50vw", "-10.4167vw"],
            bottom: ["0", "0"],
            width: ["30vw", "20vw"],
            maxWidth: "31.25vw",
            transform: ["translateX(-50%)", ""],
            showAll: {
                left: "20vw",
                bottom: "0",
                width: "10.4167vw",
                transform: "",
            },
            text: "Trailbalzer",
            playTestEnable: true,
            playEnable: true,
            playTest: handleMintPlayTest,
            play: handleToSpend,
            path: "/spendresource",
            className: "second-step",
            playBackComponent: <></>,
            tutorialComponent: <BluePlanetTutorial></BluePlanetTutorial>,
            comingSoon: false,
        },
        {
            img: GrayPlanet,
            left: ["90vw", "50vw"],
            bottom: ["15vh", "4vh"],
            width: ["20vw", "32vw"],
            maxWidth: "31.25vw",

            transform: ["", "translateX(-50%)"],
            showAll: {
                left: "55vw",
                bottom: "3vh",
                width: "10.4167vw",
                transform: "",
            },
            text: "Bid tac toe",
            playTestEnable: true,
            playEnable: true,
            playTest: handleMintPlayTest,
            path: "/tactoe/mode",
            playBackComponent: <BttPlayBackButton></BttPlayBackButton>,
            tutorialComponent: (
                <BidTacToeTutorial>
                    <Tooltip
                        label="Tutorial"
                        bg="white"
                        color="black"
                        placement="right"
                        sx={{
                            borderRadius: "0.2604vw",
                        }}
                    >
                        <Image
                            src={ButtonTip}
                            sx={{
                                width: "1.8229vw",
                                height: "1.8229vw",
                                cursor: "pointer",
                            }}
                        ></Image>
                    </Tooltip>
                </BidTacToeTutorial>
            ),
            comingSoon: false,
        },
    ];

    useEffect(() => {
        setDelayActive(-1);
        setTimeout(() => {
            setDelayActive(active);
        }, 200);
    }, [active]);

    return (
        <>
            {loading && <Loading></Loading>}
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
                    transition: "all 0.2s",
                }}
            >
                {planetList.map((item, index) => {
                    const TutorialGroup = item.tutorialComponent;
                    const PlayBackButton = item.playBackComponent;
                    return (
                        <Box
                            key={index}
                            sx={{
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
                                transition: "all 0.2s",
                                maxWidth: item.maxWidth,
                            }}
                            className={item.className}
                        >
                            <Box
                                sx={{
                                    transition: "all 0.2s",
                                    width: "100%",
                                    "&:hover .planet": {
                                        transform:
                                            !showAllActivities &&
                                            delayActive === index &&
                                            "scale(1.1)",
                                    },
                                    "&:hover .text": {
                                        width:
                                            !showAllActivities &&
                                            delayActive === index &&
                                            "100%",
                                    },
                                    "&:hover .play": {
                                        display:
                                            !showAllActivities &&
                                            delayActive === index &&
                                            "block",
                                    },
                                }}
                            >
                                <Image
                                    className="planet"
                                    key={index}
                                    src={item.img}
                                    sx={{
                                        width: showAllActivities
                                            ? item.showAll.width
                                            : item.width[active],
                                        maxWidth: item.maxWidth,
                                        transition: "all 0.2s",
                                    }}
                                    onClick={() => {
                                        // onChangeActive(index);
                                        onChangeAllActivities(false);
                                    }}
                                ></Image>

                                {active === index && !showAllActivities && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            transition: "all 0.2s",
                                            width: "100%",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                paddingBottom: "29.2%",
                                                position: "relative",
                                                width: "95%",
                                                margin: "0 auto",
                                                transition: "all 0.2s",
                                            }}
                                            className="text"
                                        >
                                            <Image
                                                src={ButtonBg}
                                                sx={{
                                                    position: "absolute",
                                                    width: "100%",
                                                    left: "50%",
                                                    top: "50%",
                                                    transform:
                                                        "translate(-50%, -50%)",
                                                }}
                                            ></Image>
                                            <Text
                                                sx={{
                                                    color: "#fff",
                                                    fontSize: "3.3333vw",
                                                    fontWeight: 800,
                                                    position: "absolute",
                                                    left: "50%",
                                                    top: "50%",
                                                    transform:
                                                        "translate(-50%, -50%)",
                                                    width: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {item.text}
                                            </Text>
                                        </Box>

                                        <Box
                                            className="play"
                                            sx={{
                                                display: "none",
                                                position: "absolute",
                                                bottom: "-5.2083vw",
                                                left: "50%",
                                                width: "26.0417vw",
                                                transform: "translateX(-50%)",
                                            }}
                                        >
                                            {item.comingSoon ? (
                                                <Box
                                                    sx={{
                                                        background: "#000",
                                                        color: "#fff",
                                                        width: "fit-content",
                                                        margin: "0 auto",
                                                        fontSize: "1.25vw",
                                                        padding:
                                                            "0.2083vw 0.5208vw",
                                                        borderRadius:
                                                            "0.2083vw",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    Coming soon
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        transition: "all 0.2s",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            marginRight: "1vw",
                                                        }}
                                                    >
                                                        <PlayTestButton
                                                            enable={
                                                                item.playTestEnable
                                                            }
                                                            onClick={() => {
                                                                item.playTest(
                                                                    item.path,
                                                                );
                                                            }}
                                                        ></PlayTestButton>
                                                    </Box>

                                                    <Box
                                                        sx={{
                                                            marginRight:
                                                                "0.5vw",
                                                        }}
                                                    >
                                                        {currentIsExpired ||
                                                        planeList.length ===
                                                            0 ? (
                                                            <CanNotPlayButton></CanNotPlayButton>
                                                        ) : (
                                                            <PlayButton
                                                                onClick={
                                                                    item.play
                                                                }
                                                            ></PlayButton>
                                                        )}
                                                    </Box>

                                                    <Box>
                                                        {TutorialGroup}
                                                        {PlayBackButton}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            {/* {!showAllActivities && active !== 0 && (
                                <Image
                                    src={LeftArrow}
                                    sx={{
                                        position: "absolute",
                                        left: "-120px",
                                        top: "50%",
                                        width: "32px",
                                        zIndex: 10,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        onChangeActive(active - 1);
                                    }}
                                ></Image>
                            )}
                            {!showAllActivities &&
                                active !== planetList.length - 1 && (
                                    <Image
                                        src={RightArrow}
                                        sx={{
                                            position: "absolute",
                                            right: "-120px",
                                            top: "50%",
                                            width: "32px",
                                            zIndex: 10,
                                            cursor: "pointer",
                                            transform: "translateY(-50%)",
                                        }}
                                        onClick={() => {
                                            onChangeActive(active + 1);
                                        }}
                                    ></Image>
                                )} */}
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
