import React, { useEffect, useState } from "react";
import { Box, Text, Image, useDisclosure } from "@chakra-ui/react";
import SectionActivities from "@/components/Tournament/assets/ring.svg";
import BluePlanet from "@/components/Tournament/assets/blue-planet.png";
import GrayPlanet from "@/components/Tournament/assets/gray-planet.png";
import ButtonBg from "@/components/Tournament/assets/button-bg.svg";
import { useNavigate } from "react-router-dom";
import { useMercuryBaseContract } from "@/hooks/useContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { handleError } from "@/utils/error";
import { DEAFAULT_CHAINID, TESTFLIGHT_CHAINID } from "@/utils/web3Utils";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import useSkyToast from "@/hooks/useSkyToast";
import Loading from "../Loading";
import GrayPlanetBg from "./assets/gray-planet-bg.svg";
import { motion, useAnimation } from "framer-motion";
import { PrimaryButton } from "../Button/Index";

const PlayButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <PrimaryButton
            sx={{
                backgroundSize: "100% 100%",
                width: "10.4167vw",
                height: "3.8542vw",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                backdropFilter: "blur(5px)",
                borderRadius: "0.9375vw",
                border: "3px solid #f2d861",
                color: "#f2d861",
            }}
            onClick={onClick}
        >
            <Text
                sx={{
                    fontSize: "1.25vw",
                    fontWeight: 600,
                }}
            >
                Enter
            </Text>
        </PrimaryButton>
    );
};

const PlanetList = ({
    active,
    showAllActivities,
    onChangeActive,
    onChangeAllActivities,
}: {
    active: number;
    showAllActivities: boolean;
    onChangeActive: (index: number) => void;
    onChangeAllActivities: (showAllActivities: boolean) => void;
}) => {
    const imgAnimation = useAnimation();

    const toast = useSkyToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { account, chainId } = useActiveWeb3React();
    const navigate = useNavigate();
    const mercuryBaseContract = useMercuryBaseContract(true);

    const addNetworkToMetask = useAddNetworkToMetamask();
    const [loading, setLoading] = useState(false);
    const handleToSpend = async () => {
        if (chainId !== Number(DEAFAULT_CHAINID)) {
            await addNetworkToMetask(Number(DEAFAULT_CHAINID));
            return;
        }
    };

    const handleToBtt = async () => {
        navigate(`/btt/mode`);
    };

    const handleMintPlayTest = async (
        path: string,
        showBalanceTip: boolean = true,
    ) => {
        try {
            if (chainId !== TESTFLIGHT_CHAINID) {
                await addNetworkToMetask(TESTFLIGHT_CHAINID);
                return;
            }

            const balanceTip = localStorage.getItem("balanceTip");
            if (!balanceTip && showBalanceTip) {
                onOpen();
                return;
            }
            setLoading(true);
            const res = await mercuryBaseContract.playTestMint();
            await res.wait();

            const balance1 = await mercuryBaseContract.balanceOf(account);
            const p1 = new Array(balance1.toNumber())
                .fill("")
                .map((item, index) => {
                    return mercuryBaseContract.tokenOfOwnerByIndex(
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

    const planetList = [
        {
            img: BluePlanet,
            left: ["50vw", "-10.4167vw"],
            top: ["0", "50vh"],
            width: ["30vw", "20vw"],
            maxWidth: "31.25vw",
            transform: ["translate(-50%,-50%)", "translateY(-50%)"],
            showAll: {
                left: "20vw",
                top: "50%",
                width: "10.4167vw",
                transform: "",
            },
            text: "Trailbalzer",

            playTest: handleMintPlayTest,
            play: handleToSpend,
            path: "/spendresource",
        },
        {
            img: GrayPlanet,
            left: ["90vw", "50vw"],
            top: ["15vh", "50vh"],
            width: ["20vw", "32vw"],
            maxWidth: "52vh",
            transform: ["", "translate(-50%,-50%)"],
            showAll: {
                left: "55vw",
                top: "3vh",
                width: "10.4167vw",
                transform: "",
            },
            text: "Bid Tac Toe",
            playTest: handleMintPlayTest,
            play: handleToBtt,
            path: "/btt/mode",
        },
    ];

    useEffect(() => {
        imgAnimation.start("rotation");
    }, []);

    return (
        <>
            {loading && <Loading></Loading>}
            <Box
                sx={{
                    left: 0,
                    top: 0,
                    width: "100vw",
                    height: "70vh",
                    position: "relative",
                    background: `url(${SectionActivities})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: showAllActivities ? "100%" : "300vw",
                    backgroundPosition: showAllActivities
                        ? "0 bottom"
                        : "-80vw bottom",
                    transition: "all 0.2s",
                }}
            >
                {planetList.map((item, index) => {
                    const isCurrent = index === active;

                    const Content = () => {
                        return (
                            <>
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
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    ></Image>
                                    <Text
                                        sx={{
                                            color: "#fff",
                                            fontSize: "2.9167vw",
                                            fontWeight: 800,
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            width: "100%",
                                            textAlign: "center",
                                        }}
                                    >
                                        {item.text}
                                    </Text>
                                </Box>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: "-5.2083vw",
                                        left: "50%",
                                        width: "26.0417vw",
                                        transform: "translateX(-50%)",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            transition: "all 0.2s",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                marginRight: "0.5vw",
                                            }}
                                        >
                                            <PlayButton
                                                onClick={item.play}
                                            ></PlayButton>
                                        </Box>
                                    </Box>
                                </Box>
                            </>
                        );
                    };

                    return (
                        <Box
                            key={index}
                            sx={{
                                position: "absolute",
                                left: showAllActivities
                                    ? item.showAll.left
                                    : item.left[active],

                                top: showAllActivities
                                    ? item.showAll?.top
                                    : item?.top?.[active],
                                width: showAllActivities
                                    ? item.showAll.width
                                    : item.width[active],
                                height: showAllActivities
                                    ? item.showAll.width
                                    : item.width[active],
                                transform: showAllActivities
                                    ? item.showAll.transform
                                    : item.transform[active],
                                transition: "all 0.2s",
                                maxWidth: item.maxWidth,
                            }}
                        >
                            <Box
                                sx={{
                                    transition: "all 0.2s",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {isCurrent && (
                                    <motion.div
                                        style={{
                                            position: "absolute",
                                            left: "0%",
                                            top: "0%",
                                            width: "100%",
                                            height: "100%",
                                            backgroundImage: `url(${GrayPlanetBg})`,
                                            backgroundSize: "100% 100%",
                                        }}
                                        animate={{
                                            rotate: "360deg",
                                        }}
                                        transition={{
                                            duration: 50,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    ></motion.div>
                                )}
                                <Box
                                    sx={{
                                        zIndex: 10,
                                        position: "absolute",
                                        left: "50%",
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: "90%",
                                    }}
                                >
                                    {isCurrent ? (
                                        <motion.img
                                            src={item.img}
                                            style={{
                                                width: "100%",
                                                background: "transparent",
                                                scale: 1,
                                            }}
                                            variants={{
                                                rotation: {
                                                    rotate: "360deg",
                                                    scale: 1.1,
                                                    transition: {
                                                        scale: {
                                                            duration: 1,
                                                            ease: "linear",
                                                            repeatType:
                                                                "reverse",
                                                            repeat: Infinity,
                                                        },
                                                        rotate: {
                                                            duration: 50,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                            repeatType: "loop",
                                                        },
                                                    },
                                                },
                                                oneScale: {
                                                    scale: 1,
                                                    transition: {
                                                        scale: {
                                                            duration: 1,
                                                            ease: "linear",
                                                        },
                                                    },
                                                },
                                                twoScale: {
                                                    scale: 1.1,
                                                    transition: {
                                                        scale: {
                                                            duration: 0.1,
                                                            ease: "linear",
                                                        },
                                                    },
                                                },
                                            }}
                                            animate={imgAnimation}
                                            onMouseEnter={async () => {
                                                await imgAnimation.stop();
                                                await imgAnimation.start(
                                                    "twoScale",
                                                );
                                            }}
                                            onMouseLeave={async () => {
                                                await imgAnimation.start(
                                                    "oneScale",
                                                );
                                                await imgAnimation.start(
                                                    "rotation",
                                                );
                                            }}
                                        ></motion.img>
                                    ) : (
                                        <Image
                                            style={{
                                                width: "100%",
                                                opacity: "0.8",
                                            }}
                                            src={item.img}
                                        ></Image>
                                    )}

                                    {isCurrent && !showAllActivities && (
                                        <motion.div
                                            style={{
                                                position: "absolute",
                                                left: "50%",
                                                top: "50%",
                                                transform:
                                                    "translate(-50%, -50%)",
                                                transition: "all 0.2s",
                                                width: "100%",
                                            }}
                                            onMouseEnter={async () => {
                                                await imgAnimation.stop();
                                                await imgAnimation.start(
                                                    "twoScale",
                                                );
                                            }}
                                            onMouseLeave={async () => {
                                                await imgAnimation.start(
                                                    "oneScale",
                                                );
                                                await imgAnimation.start(
                                                    "rotation",
                                                );
                                            }}
                                        >
                                            {Content()}
                                        </motion.div>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </>
    );
};

export default PlanetList;
