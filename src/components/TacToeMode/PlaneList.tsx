import {
    Box,
    Button,
    Text,
    Image,
    PopoverBody,
    PopoverTrigger,
    Popover,
    PopoverContent,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useMultiProvider } from "@/hooks/useMultiContract";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import NoPlane from "@/components/Tournament/assets/no-plane.png";
import GrayTipIcon from "@/components/Tournament/assets/gray-tip.svg";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import PlaneShadow from "@/components/Tournament/assets/plane-shadow.png";
import InGame from "@/components/Tournament/assets/ingame.svg";
import PlaneBg from "@/components/Tournament/assets/plane-bg.png";
import BlackArrowRight from "@/components/Tournament/assets/black-arrow-right.svg";
import { usePilotInfo } from "@/hooks/usePilotInfo";
import BlackArrowLeft from "@/components/Tournament/assets/black-arrow-left.svg";
import RoundTime from "@/skyConstants/roundTime";
import { PlaneInfo } from "@/pages/TacToeMode";

export const NoPlaneContent = () => {
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

const PlaneList = ({ planeList }: { planeList: PlaneInfo[] }) => {
    const { account } = useActiveWeb3React();
    const [currentImg, setCurrentImg] = useState(0);
    const { activePilot } = usePilotInfo(account);

    const [active, setActive] = useState(1);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const ethcallProvider = useMultiProvider(DEAFAULT_CHAINID);

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
                        src={planeList[currentImg - 1].img}
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
                {planeList[currentImg].state && (
                    <Image
                        onClick={async () => {
                            if (chainId !== Number(DEAFAULT_CHAINID)) {
                                await addNetworkToMetask(
                                    Number(DEAFAULT_CHAINID),
                                );
                                return;
                            }
                            navigate(
                                `/tactoe/game?tokenId=${planeList[currentImg].tokenId}`,
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
                <Image sx={{}} src={planeList[currentImg].img}></Image>
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
                                    setCurrentImg(currentImg - 1);
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
                    {currentImg !== planeList.length - 1 && (
                        <>
                            <Image
                                src={BlackArrowRight}
                                sx={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    setCurrentImg(currentImg + 1);
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
                        fontFamily: "Quantico",
                    }}
                    w="100%"
                >
                    <Text fontSize="1.25vw" fontWeight={600} textAlign="center">
                        {RoundTime[planeList[currentImg].round]?.startTime}-
                        {RoundTime[planeList[currentImg].round]?.endTime}
                    </Text>
                    <Text fontSize="1.25vw" fontWeight={600} textAlign="center">
                        Lvl.0{planeList[currentImg].level}
                        {/* #{list[currentImg].tokenId} */}
                    </Text>
                    {planeList.length > 0 && (
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
                                {planeList.map((item, index) => {
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
                                                setCurrentImg(index);
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

export default PlaneList;
