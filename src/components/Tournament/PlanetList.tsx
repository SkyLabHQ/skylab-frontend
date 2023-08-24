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
import ButtonDefault from "./assets/button-default.png";
import ButtonHover from "./assets/button-hover.png";
import ButtonPressed from "./assets/button-pressed.png";

const StyledPrimaryButton = styled(Button)((props) => ({
    background: `url(${ButtonDefault})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    width: "200px",
    height: "74px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    color: "#000",
    borderRadius: "18px",
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

// 创建包装组件，将样式应用到按钮，并传递其他props
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
        </PrimaryButton>
    );
};

const CanNotPlayButton = () => {
    return (
        <PrimaryButton
            disabled={true}
            sx={{
                borderRadius: "20px",
                border: "3px solid #616161",
                background: "#ABABAB",
                width: "200px",
                height: "74px",
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
            <Popover placement="end-start">
                <PopoverTrigger>
                    <Image
                        src={GrayTipIcon}
                        sx={{
                            width: "22px",
                            position: "absolute",
                            right: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
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
                                fontSize: "24px",
                                fontWeight: 600,
                                marginRight: "10px",
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
                width: "200px",
                height: "74px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
            onClick={onClick}
        >
            <Text
                sx={{
                    fontSize: "24px",
                    fontWeight: 600,
                }}
            >
                Play
            </Text>
            <Text
                sx={{
                    fontSize: "14px",
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

    const handleMintPlayTest = async (path: string) => {
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
                    `${path}?tokenId=${planeTokenIds1[
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
            left: ["50vw", "-200"],
            bottom: ["0", "0"],
            width: ["30vw", "20vw"],
            maxWidth: "650px",
            transform: ["translateX(-50%)", ""],
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
            path: "/spendresource",
            className: "second-step",
            tutorialIconShow: true,
            tutorialComponent: BluePlanetTutorial,
            comingSoon: false,
        },
        {
            img: GrayPlanet,
            left: ["100%", "50vw"],
            bottom: ["8vh", "4vh"],
            width: ["20vw", "32vw"],
            maxWidth: "650px",
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
            playTest: handleMintPlayTest,
            path: "/tactoe/mode",
            tutorialIconShow: false,
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
                            }}
                            className={item.className}
                        >
                            <Box
                                sx={{
                                    transition: "all 0.2s",
                                    "&:hover .planet": {
                                        transform:
                                            delayActive === index &&
                                            "scale(1.2)",
                                    },
                                    "&:hover .text": {
                                        width: delayActive === index && "95%",
                                        paddingBottom:
                                            delayActive === index && "29.2%",
                                    },
                                    "&:hover .play": {
                                        display:
                                            delayActive === index && "block",
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
                                        transition: "all 0.2s",
                                        maxWidth: item.maxWidth,
                                    }}
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
                                                width: "90%",
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
                                                    fontSize: "64px",
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
                                                bottom: "-100px",
                                                left: "50%",
                                                width: "90%",
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
                                                        fontSize: "24px",
                                                        padding: "4px 10px",
                                                        borderRadius: "4px",
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
                                                        justifyContent:
                                                            "space-around",
                                                        transition: "all 0.2s",
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

                                                    {currentIsExpired ||
                                                    planeList.length === 0 ? (
                                                        <CanNotPlayButton></CanNotPlayButton>
                                                    ) : (
                                                        <PlayButton
                                                            onClick={item.play}
                                                        ></PlayButton>
                                                    )}
                                                    {item.tutorialIconShow && (
                                                        <TutorialGroup></TutorialGroup>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                            {active !== 0 && (
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
                            {active !== planetList.length - 1 && (
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
