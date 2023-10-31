import {
    Box,
    Text,
    Image,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    useClipboard,
} from "@chakra-ui/react";
import SupportIcon from "./assets/support.svg";
import { useEffect, useMemo, useState } from "react";
import {
    useMultiDelegateERC721Contract,
    useMultiMercuryPilotsContract,
    useMultiPilotMileageContract,
    useMultiPilotNetPointsContract,
    useMultiPilotWinStreakContract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { shortenAddress } from "@/utils";
import GrayArrow from "./assets/gray-arrow.svg";
import Loading from "../Loading";
import { ActivePilotRes, handlePilotsInfo } from "@/skyConstants/pilots";
import { ChainId } from "@/utils/web3Utils";
import { ZERO_DATA } from "@/skyConstants";
import useSkyToast from "@/hooks/useSkyToast";
import { RankBackground, RankMedal } from "@/skyConstants/rank";

const colors = [
    "#96D1F2",
    "#FFA5C9",
    "#FFF47D",
    "#C8E469",
    "#8DEABD",
    "#FFC0FC",
    "#FFCA9F",
    "#F19E8A",
    "#B497E5",
    "#7D9BFF",
    "#CFC2BE",
];

function getColorByNumber(number: number) {
    const index = Math.abs(number) % colors.length; // 使用绝对值来确保索引是非负数
    return colors[index];
}

enum MenuProps {
    EstateScore = "Estate Score",
    Mileage = "Mileage",
    WinStreak = "Longest Win Streak",
    NetPoints = "Net Point Transferred",
}

const ListItem = ({ rank, detail }: { rank: number; detail: any }) => {
    const { pilotImg, pilotOwner, value, actualPilotOwner } = detail;
    const toast = useSkyToast();
    const { onCopy } = useClipboard(pilotOwner);

    const isTop3 = useMemo(() => {
        return [1, 2, 3].includes(rank);
    }, [rank]);

    const handleOnCopy = () => {
        onCopy();
        toast("Copy address success");
    };

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

            <Box
                sx={{
                    position: "relative",
                    width: isTop3 ? "2.3958vw" : "1.7708vw",
                    height: isTop3 ? "2.3958vw" : "1.7708vw",
                }}
            >
                {pilotImg ? (
                    <Image
                        src={pilotImg}
                        sx={{
                            width: "100%",
                            height: "100%",
                            border: "1px solid #fff",
                            borderRadius: "0.5208vw",
                        }}
                    ></Image>
                ) : (
                    <Box
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background: getColorByNumber(rank),
                            border: "1px solid #fff",
                            borderRadius: "0.5208vw",
                        }}
                    ></Box>
                )}

                {pilotImg && pilotOwner !== actualPilotOwner && (
                    <Image
                        src={SupportIcon}
                        sx={{
                            width: "110%",
                            position: "absolute",
                            bottom: "-4px",
                            left: "50%",
                            maxWidth: "110%",
                            transform: "translateX(-50%)",
                        }}
                    ></Image>
                )}
            </Box>

            <Text
                sx={{
                    flex: 1,
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "0.8333vw",
                    cursor: "pointer",
                }}
                onClick={handleOnCopy}
            >
                {shortenAddress(pilotOwner)}
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

const GameLeaderboard = ({ show }: { show?: boolean }) => {
    const { chainId } = useActiveWeb3React();
    const multiProvider = useMultiProvider(chainId);
    const multiPilotMileageContract = useMultiPilotMileageContract();
    const multiPilotWinStreakContract = useMultiPilotWinStreakContract();
    const multiPilotNetPointsContract = useMultiPilotNetPointsContract();
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const defaultMultiDelegateERC721Contract =
        useMultiDelegateERC721Contract(chainId);
    const ethereumMultiDelegateERC721Contract = useMultiDelegateERC721Contract(
        ChainId.ETHEREUM,
    );

    const [currentMenu, setCurrentMenu] = useState(MenuProps.WinStreak);
    const menu = [
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
            name: "Longest Win Streak",
            value: MenuProps.WinStreak,
            groupMethod: "getPilotWinStreakGroup",
            detailMethod: "getPilotWinStreak",
        },
    ];

    const handleGetMileage = async () => {
        try {
            setLoading(true);
            const p = [];
            for (let i = 0; i <= 15; i++) {
                p.push(multiPilotMileageContract.getPilotMileageGroup(i));
            }
            const res = await multiProvider.all(p);
            const allPilot = [];
            const pMileageRequest: any = [];
            for (let i = 0; i <= 15; i++) {
                for (let j = 0; j < res[i].length; j++) {
                    const item = res[i][j];
                    if (
                        item.collectionAddress !== ZERO_DATA &&
                        item.pilotId.toNumber() !== 0
                    ) {
                        allPilot.push({
                            collectionAddress: item.collectionAddress,
                            pilotId: item.pilotId.toNumber(),
                        });
                        pMileageRequest.push(
                            multiPilotMileageContract.getPilotMileage(
                                item.collectionAddress,
                                item.pilotId,
                            ),
                        );
                    }
                }
            }

            const mileageRes = await multiProvider.all(pMileageRequest);

            const list = await handlePilotsInfo({
                chainId,
                values: mileageRes.map((item) => item.toNumber()),
                allPilot,
            });

            setList(list);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setList([]);
        }
    };

    const handleGetWinStreak = async () => {
        try {
            setLoading(true);
            const p = [];
            for (let i = 0; i <= 15; i++) {
                p.push(multiPilotWinStreakContract.getPilotWinStreakGroup(i));
            }
            const res = await multiProvider.all(p);
            const allWallet: string[] = [];
            const pPilotAndWinStreak: any = [];
            for (let i = 0; i <= 15; i++) {
                for (let j = 0; j < res[i].length; j++) {
                    const item = res[i][j];
                    if (item !== ZERO_DATA) {
                        allWallet.push(item);
                        pPilotAndWinStreak.push(
                            multiMercuryPilotsContract.getActivePilot(item),
                            multiPilotWinStreakContract.getPilotWinStreak(item),
                        );
                    }
                }
            }

            const pilotAndWinStreakRes = await multiProvider.all(
                pPilotAndWinStreak,
            );

            const allPilot: ActivePilotRes[] = [];
            const allPilotWinStreak: number[] = [];

            pilotAndWinStreakRes.forEach((item, index) => {
                if (index % 2 === 0) {
                    allPilot.push({
                        collectionAddress: item.collectionAddress,
                        pilotId: item.pilotId.toNumber(),
                    });
                } else {
                    allPilotWinStreak.push(item.toNumber());
                }
            });

            const list = await handlePilotsInfo({
                chainId,
                values: allPilotWinStreak,
                allPilot,
                pilotOwners: allWallet,
            });

            setList(list);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setList([]);
        }
    };

    const handleGetNetPoints = async () => {
        try {
            setLoading(true);
            const p = [];
            for (let i = 0; i <= 15; i++) {
                p.push(multiPilotNetPointsContract.getPilotNetPointsGroup(i));
            }
            const res = await multiProvider.all(p);
            const allWallet: string[] = [];

            const pPilotNetPoints: any = [];

            for (let i = 0; i <= 15; i++) {
                for (let j = 0; j < res[i].length; j++) {
                    const item = res[i][j];
                    if (item !== ZERO_DATA) {
                        allWallet.push(item);
                        pPilotNetPoints.push(
                            multiMercuryPilotsContract.getActivePilot(item),
                            multiPilotNetPointsContract.getPilotNetPoints(item),
                        );
                    }
                }
            }

            const pilotNetPointsRes = await multiProvider.all(pPilotNetPoints);
            const allPilot: ActivePilotRes[] = [];
            const allPilotNetPoints: number[] = [];

            pilotNetPointsRes.forEach((item, index) => {
                if (index % 2 === 0) {
                    allPilot.push({
                        collectionAddress: item.collectionAddress,
                        pilotId: item.pilotId.toNumber(),
                    });
                } else {
                    allPilotNetPoints.push(item.toNumber());
                }
            });

            const list = await handlePilotsInfo({
                chainId,
                values: allPilotNetPoints,
                allPilot,
                pilotOwners: allWallet,
            });

            setList(list);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setList([]);
        }
    };

    useEffect(() => {
        if (
            !defaultMultiDelegateERC721Contract ||
            !ethereumMultiDelegateERC721Contract ||
            !multiPilotMileageContract ||
            !multiPilotWinStreakContract ||
            !multiMercuryPilotsContract
        ) {
            return;
        }

        if (currentMenu === MenuProps.WinStreak) {
            handleGetWinStreak();
        } else if (currentMenu === MenuProps.Mileage) {
            handleGetMileage();
        } else if (currentMenu === MenuProps.NetPoints) {
            handleGetNetPoints();
        }
    }, [
        currentMenu,
        multiPilotMileageContract,
        multiPilotWinStreakContract,
        defaultMultiDelegateERC721Contract,
        ethereumMultiDelegateERC721Contract,
        multiMercuryPilotsContract,
    ]);

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
                                <ListItem
                                    key={index}
                                    detail={item}
                                    rank={index + 1}
                                ></ListItem>
                            );
                        })
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default GameLeaderboard;
