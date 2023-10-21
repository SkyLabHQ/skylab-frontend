import {
    Box,
    Text,
    Image,
    useDisclosure,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
} from "@chakra-ui/react";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import MileageIcon from "./assets/mileage-icon.svg";
import Medal1 from "./assets/medal1.svg";
import Medal2 from "./assets/medal2.svg";
import Medal3 from "./assets/medal3.svg";
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
import { useEffect, useMemo, useState } from "react";
import {
    getMultiERC721Contract,
    useMultiMercuryPilotsContract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { getMetadataImg, getPilotImgFromUrl } from "@/utils/ipfsImg";
import { shortenAddress } from "@/utils";
import GrayArrow from "./assets/gray-arrow.svg";
import Loading from "../Loading";
import Nav2NFT from "./Nav2NFT";
import RequestNextButton from "../RequrestNextButton";
import NoPlane from "./assets/no-plane.png";
import GrayTipIcon from "./assets/gray-tip.svg";
import { PlaneInfo } from "@/pages/Activities";
import PlaneShadow from "./assets/plane-shadow.png";
import InGame from "./assets/ingame.svg";
import Expired from "./assets/expired.svg";
import PlaneBg from "./assets/plane-bg.png";
import BlackArrowRight from "./assets/black-arrow-right.svg";
import RoundTime from "@/skyConstants/roundTime";
import BlackArrowLeft from "./assets/black-arrow-left.svg";
import { getPilotChainId } from "@/skyConstants/pilots";
import { ChainId } from "@/utils/web3Utils";

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
const RankMedal = {
    1: Medal1,
    2: Medal2,
    3: Medal3,
};

const RankBackground = {
    1: "linear-gradient(257deg, #FDCE49 61.28%, #EBD85B 64.38%, #FFF 68.02%, #FFF 70.38%, #FDCE49 81.84%)",
    2: "rgba(142, 180, 189, 0.50)",
    3: "rgba(196, 113, 102, 0.50)",
};

const NormalItem = ({
    pilotUrl,
    rank,
    address,
    value,
}: {
    pilotUrl: string;
    rank: number;
    address: string;
    value: any;
}) => {
    const isTop3 = useMemo(() => {
        return [1, 2, 3].includes(rank);
    }, [rank]);

    return (
        <Box
            sx={{
                display: "flex",
                height: "5.3704vh",
                alignItems: "center",
                background: RankBackground[rank],
                padding: "0 1.0417vw 0 0.625vw",
                borderRadius: isTop3 ? "0.5208vw" : "0",
                marginBottom: "0.3125vw",
                borderBottom: "1px solid #fff",
            }}
        >
            {isTop3 ? (
                <Image
                    src={RankMedal[rank]}
                    sx={{
                        width: "2.3958vw",
                        height: "2.3958vw",
                        marginRight: "1.1458vw",
                    }}
                ></Image>
            ) : (
                <Text
                    sx={{
                        width: "2.3958vw",
                        marginRight: "1.1458vw",
                        fontSize: "1.25vw",
                        textAlign: "center",
                        color: "#fff",
                    }}
                >
                    {rank}
                </Text>
            )}

            <Image
                src={pilotUrl}
                sx={{
                    width: isTop3 ? "2.3958vw" : "1.7708vw",
                    height: isTop3 ? "2.3958vw" : "1.7708vw",
                    border: "1px solid #fff",
                    borderRadius: "0.5208vw",
                }}
            ></Image>

            <Text
                sx={{
                    flex: 1,
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "0.8333vw",
                }}
            >
                {shortenAddress(address)}
            </Text>
            <Text
                sx={{
                    color: "#BCBBBE",
                    fontSize: "0.8333vw",
                }}
            >
                {value}
            </Text>
        </Box>
    );
};

enum MenuProps {
    EstateScore = "Estate Score",
    Mileage = "Mileage",
    WinStreak = "Win Streak",
    NetPoints = "Net Point Transferred",
}

const PilotLeaderboard = ({ show }: { show?: boolean }) => {
    const { chainId } = useActiveWeb3React();
    const multiProvider = useMultiProvider(chainId);
    const mainnetMultiProvider = useMultiProvider(ChainId.MAINNET);
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentMenu, setCurrentMenu] = useState(MenuProps.WinStreak);
    const menu = [
        // {
        //     name: "Estate Score",
        //     value: MenuProps.EstateScore,
        // },
        {
            name: "Mileage",
            value: MenuProps.Mileage,
            groupMethod: "getPilotMileageGroup",
            detailMethod: "getPilotMileage",
        },
        {
            name: "Net Point Transferred",
            value: MenuProps.NetPoints,
            groupMethod: "getPilotNetPointsGroup",
            detailMethod: "getPilotNetPoints",
        },
        {
            name: "Win Streak",
            value: MenuProps.WinStreak,
            groupMethod: "getPilotWinStreakGroup",
            detailMethod: "getPilotWinStreak",
        },
    ];

    const handleGetMileage = async () => {
        try {
            setLoading(true);
            const currentItem = menu.find((item) => item.value === currentMenu);
            const groupMethod = currentItem.groupMethod;
            const detailMethod = currentItem.detailMethod;
            const p = [];
            for (let i = 0; i <= 15; i++) {
                p.push(multiMercuryPilotsContract[groupMethod](i));
            }
            const res = await multiProvider.all(p);
            console.log(res, "r");
            const allPilot = [];

            for (let i = 0; i <= 15; i++) {
                for (let j = 0; j < res[i].length; j++) {
                    if (
                        res[i][j].collectionAddress !==
                            "0x0000000000000000000000000000000000000000" &&
                        res[i][j].pilotId.toNumber() !== 0
                    ) {
                        console.log(
                            res[i][j].collectionAddress,
                            "res[i][j].collectionAddress",
                        );
                        console.log(
                            res[i][j].pilotId.toNumber(),
                            "res[i][j].pilotId.toNumber()",
                        );
                        allPilot.push(res[i][j]);
                    }
                }
            }

            console.log(allPilot, "allPilot");
            const p1 = [];
            const pPilotInfoDefault = [];
            const pPilotInfoMainnet = [];
            const defaultIndex = [];

            for (let i = 0; i < allPilot.length; i++) {
                const multiERC721Contract = getMultiERC721Contract(
                    allPilot[i].collectionAddress,
                );
                p1.push(
                    multiMercuryPilotsContract[detailMethod](
                        allPilot[i].collectionAddress,
                        allPilot[i].pilotId,
                    ),
                );

                const pilotChainId = getPilotChainId(
                    chainId,
                    allPilot[i].collectionAddress,
                );

                if (pilotChainId === ChainId.MAINNET) {
                    defaultIndex.push(ChainId.MAINNET);
                    pPilotInfoMainnet.push(
                        multiERC721Contract.tokenURI(allPilot[i].pilotId),
                    );
                    pPilotInfoMainnet.push(
                        multiERC721Contract.ownerOf(allPilot[i].pilotId),
                    );
                } else {
                    defaultIndex.push(chainId);
                    pPilotInfoDefault.push(
                        multiERC721Contract.tokenURI(allPilot[i].pilotId),
                    );
                    pPilotInfoDefault.push(
                        multiERC721Contract.ownerOf(allPilot[i].pilotId),
                    );
                }
            }
            console.log(mainnetMultiProvider, "mainnetMultiProvider");
            console.log("css");
            const [mainnetPilotRes, defaultRes, res1] = await Promise.all([
                mainnetMultiProvider.all(pPilotInfoMainnet),
                multiProvider.all(pPilotInfoDefault),
                multiProvider.all(p1),
            ]);

            console.log("first");
            const list = [];
            for (let i = 0; i < allPilot.length; i++) {
                const imgUrl =
                    defaultIndex[i] === ChainId.MAINNET
                        ? mainnetPilotRes[i * 2]
                        : defaultRes[i * 2];
                const img = await getPilotImgFromUrl(imgUrl);
                const owenr =
                    defaultIndex[i] === ChainId.MAINNET
                        ? mainnetPilotRes[i * 2 + 1]
                        : defaultRes[i * 2 + 1];

                list.push({
                    pilotId: allPilot[i].pilotId.toNumber(),
                    value: res1[i].toNumber(),
                    pilotUrl: img,
                    pilotOwner: owenr,
                });
            }
            console.log(list, "listlist");

            setList(list.sort((a, b) => b.value - a.value));
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setList([]);
        }
    };

    useEffect(() => {
        handleGetMileage();
    }, [currentMenu]);

    return (
        <Box
            sx={{
                height: "54.0741vh",
                borderRadius: "1.0417vw",
                border: "3px solid #F2D861",
                background: "#424242",
                position: "absolute",
                width: "100%",
                right: show ? "0" : "-100%",
                opacity: show ? 1 : 0,
                top: 0,
                transition: "all 0.3s",
            }}
        >
            <Box
                sx={{
                    height: "4.1667vh",
                    background:
                        "linear-gradient(180deg, rgba(99, 99, 99, 0.10) 0%, #636363 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 1.4583vw",
                }}
            >
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                        color: "#fff",
                    }}
                >
                    Leaderboard{" "}
                </Text>
                {/* <Box>Find Me</Box> */}
            </Box>
            <Box>
                <Box
                    sx={{
                        padding: "0 1.4583vw",
                    }}
                >
                    <Menu autoSelect={false}>
                        {({ isOpen }) => (
                            <>
                                <MenuButton>
                                    <Box
                                        sx={{
                                            display: "flex",
                                        }}
                                    >
                                        <Image
                                            src={GrayArrow}
                                            sx={{
                                                marginRight: "0.2604vw",
                                                transform: isOpen
                                                    ? "rotate(270deg)"
                                                    : "rotate(0deg)",
                                            }}
                                        ></Image>
                                        <Text
                                            sx={{
                                                color: "#BCBBBE",
                                                fontSize: "1.0417vw",
                                            }}
                                        >
                                            {currentMenu}
                                        </Text>
                                    </Box>
                                </MenuButton>
                                <MenuList
                                    sx={{
                                        background: "#4A4A4A",
                                    }}
                                >
                                    {menu.map((item, index) => {
                                        return (
                                            <MenuItem
                                                onClick={() => {
                                                    setCurrentMenu(item.value);
                                                }}
                                                key={index}
                                                sx={{
                                                    color: "#BCBBBE",
                                                    fontSize: "1.0417vw",
                                                    paddingLeft: "0.5208vw",
                                                }}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
                <Box
                    sx={{
                        height: "45.3704vh",
                        overflowY: "overlay",
                        padding: "0 1.4583vw",
                    }}
                >
                    {loading ? (
                        <Loading></Loading>
                    ) : (
                        list.map((item, index) => {
                            return (
                                <NormalItem
                                    key={index}
                                    pilotUrl={item.pilotUrl}
                                    address={item.pilotOwner}
                                    value={item.value}
                                    rank={index + 1}
                                ></NormalItem>
                            );
                        })
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
    currentIsExpired,
    currentRound,
    list,
    currentImg,
    onCurrentImg,
    activePilot,
    onNextRound,
}: {
    currentIsExpired: boolean;
    currentRound: number;
    list: PlaneInfo[];
    currentImg: number;
    onCurrentImg: (index: number) => void;
    activePilot: PilotInfo;
    onNextRound: (step: number | string) => void;
}) => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

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
                <PilotLeaderboard show={isOpen}></PilotLeaderboard>
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
                    onClick={() => {
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
                        left: "-20.8333vw",
                        position: "absolute",
                        top: "0",
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
                            currentIsExpired={currentIsExpired}
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
