import {
    Box,
    Text,
    Image,
    useDisclosure,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
} from "@chakra-ui/react";
import ProMerTab from "@/components/Tournament/assets/proMerTab.png";
import MileageIcon from "./assets/mileage-icon.svg";
import Medal1 from "./assets/medal1.svg";
import Medal2 from "./assets/medal2.svg";
import Medal3 from "./assets/medal3.svg";
import styled from "@emotion/styled";
import RulesIcon from "./assets/rules-icon.svg";
import DownArrow from "./assets/down-arrow.svg";
import CosmeticGray from "./assets/cosmetic-gray.svg";
import RightArrowBlack from "./assets/right-arrow-black.svg";
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
import { getMetadataImg } from "@/utils/ipfsImg";
import { shortenAddress } from "@/utils";
import Loading from "../Loading";

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
                    left: "-10px",
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
                borderRadius: isTop3 ? "10px" : "0",
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
                        marginRight: "22px",
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
                    borderRadius: "10px",
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
    NetPoints = "Net Points",
}

const MileageLeaderboard = ({ show }: { show?: boolean }) => {
    const { chainId } = useActiveWeb3React();
    const multiProvider = useMultiProvider(chainId);
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
            name: "Profit and Loss",
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
        setLoading(true);
        const currentItem = menu.find((item) => item.value === currentMenu);
        const groupMethod = currentItem.groupMethod;
        const detailMethod = currentItem.detailMethod;
        const p = [];
        for (let i = 0; i <= 15; i++) {
            p.push(multiMercuryPilotsContract[groupMethod](i));
        }
        const res = await multiProvider.all(p);

        const allPilot = [];

        for (let i = 0; i <= 15; i++) {
            for (let j = 0; j < res[i].length; j++) {
                if (
                    res[i][j].collectionAddress !==
                        "0x0000000000000000000000000000000000000000" &&
                    res[i][j].pilotId.toNumber() !== 0
                ) {
                    allPilot.push(res[i][j]);
                }
            }
        }

        const p1 = [];

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
            p1.push(multiERC721Contract.tokenURI(allPilot[i].pilotId));
            p1.push(multiERC721Contract.ownerOf(allPilot[i].pilotId));
        }

        const res1 = await multiProvider.all(p1);

        const list = [];
        for (let i = 0; i < allPilot.length; i++) {
            list.push({
                pilotId: allPilot[i].pilotId.toNumber(),
                value: res1[i * 3].toNumber(),
                pilotUrl: getMetadataImg(res1[i * 3 + 1]),
                pilotOwner: res1[i * 3 + 2],
            });
        }

        setList(list);
        setLoading(false);
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
                        fontSize: "20px",
                        color: "#fff",
                    }}
                >
                    Leaderboard{" "}
                </Text>
                <Box>Find Me</Box>
            </Box>
            <Box>
                <Box
                    sx={{
                        padding: "0 1.4583vw",
                    }}
                >
                    <Menu autoSelect={false}>
                        <MenuButton>
                            <Text
                                sx={{
                                    color: "#BCBBBE",
                                    fontSize: "1.0417vw",
                                }}
                            >
                                {currentMenu}
                            </Text>
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
                                            paddingLeft: "10px",
                                        }}
                                    >
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
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
                height: "106px",
                display: "flex",
                borderRadius: "20px",
                background: "rgba(177, 177, 177, 0.50)",
                padding: "10px 0 0 16px",
                marginTop: "18px",
            }}
        >
            <Image
                src={CosmeticGray}
                sx={{
                    width: "64px",
                    height: "64px",
                    marginRight: "16px",
                }}
            ></Image>
            <Box>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "20px",
                        fontWeight: 500,
                    }}
                >
                    ^%2&{")"}$19^#v&!_
                </Text>
                <Text
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "14px",
                    }}
                >
                    pending...
                </Text>
            </Box>
        </Box>
    );
};

const Nav2NFT = ({
    icon,
    title,
    value,
    onClick,
}: {
    icon: string;
    title: string;
    value?: string;
    onClick?: () => void;
}) => {
    return (
        <PrimaryButton
            sx={{
                display: "flex",
                borderRadius: "1.0417vw",
                background: "rgba(255, 255, 255, 0.50)",
                width: "10.9375vw",
                height: "4.1667vw",
                padding: "0.5208vw",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Image
                sx={{
                    width: "2.8125vw",
                    marginRight: "0.7292vw",
                }}
                src={icon}
            ></Image>
            <Box
                sx={{
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#4A4A4A",
                            fontSize: "1.0417vw",
                            fontWeight: 500,
                        }}
                    >
                        {title}
                    </Box>
                    <Box
                        sx={{
                            borderLeft: "1px solid rgba(96, 96, 96, 0.30)",
                            height: "1.4583vw",
                            paddingLeft: "0.2083vw",
                        }}
                    >
                        <Image src={RightArrowBlack}></Image>
                    </Box>
                </Box>
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                        color: "#4A4A4A",
                        fontWeight: 500,
                    }}
                >
                    {value}
                </Text>
            </Box>
        </PrimaryButton>
    );
};

const NavButtonStyle = styled(PrimaryButton)`
    width: 11.0417vw;
    height: 2.7083vw;
    border-radius: 15px;
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
    activePilot,
    onNextRound,
}: {
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
                    height: "54.0741vh",
                    marginTop: "1.8519vh",
                }}
            >
                <MileageLeaderboard show={isOpen}></MileageLeaderboard>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "14px",
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
                            top: "-15px",
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
                            src={Medal1}
                            sx={{
                                width: "40px",
                                marginRight: "2px",
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
                            width: "40px",
                            marginRight: "2px",
                        }}
                    ></Image>
                    <Text>Detailed Rules</Text>
                </NavButtonStyle>
            </Box>
            <Cosmetics></Cosmetics>
            <Box
                sx={{
                    marginTop: "14px",
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
                    value={"Baby Merc"}
                    onClick={() => {
                        onNextRound("babyMerc");
                    }}
                ></Nav2NFT>
                <ImgButton
                    sx={{
                        width: "14.5833vw",
                        left: "-400px",
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
            </Box>
        </Box>
    );
};

export default RightNav;
