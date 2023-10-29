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
import Medal1 from "./assets/medal1.svg";
import Medal2 from "./assets/medal2.svg";
import Medal3 from "./assets/medal3.svg";
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
import {
    ActivePilotRes,
    getIsSpecialPilot,
    handlePilotsInfo,
} from "@/skyConstants/pilots";
import { ChainId } from "@/utils/web3Utils";
import { ZERO_DATA } from "@/skyConstants";
import useSkyToast from "@/hooks/useSkyToast";

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

enum MenuProps {
    EstateScore = "Estate Score",
    Mileage = "Mileage",
    WinStreak = "Win Streak",
    NetPoints = "Net Point Transferred",
}

const ListItem = ({
    pilotImg,
    rank,
    address,
    value,
}: {
    pilotImg: string;
    rank: number;
    address: string;
    value: any;
}) => {
    const toast = useSkyToast();

    const { onCopy } = useClipboard(address);

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

            <Image
                src={pilotImg}
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
                    cursor: "pointer",
                }}
                onClick={handleOnCopy}
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

const GameLeaderboard = ({ show }: { show?: boolean }) => {
    const { chainId } = useActiveWeb3React();
    const multiProvider = useMultiProvider(chainId);
    const ethereumMultiProvider = useMultiProvider(ChainId.ETHEREUM);
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
            name: "Win Streak",
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
                            isSpecialPilot: getIsSpecialPilot(
                                item.collectionAddress,
                            ),
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
                defaultMultiDelegateERC721Contract,
                ethereumMultiDelegateERC721Contract,
                defaultMultiProvider: multiProvider,
                ethereumMultiProvider,
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
                        isSpecialPilot: getIsSpecialPilot(
                            item.collectionAddress,
                        ),
                    });
                } else {
                    allPilotWinStreak.push(item.toNumber());
                }
            });

            const list = await handlePilotsInfo({
                defaultMultiDelegateERC721Contract,
                ethereumMultiDelegateERC721Contract,
                defaultMultiProvider: multiProvider,
                ethereumMultiProvider,
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
                        isSpecialPilot: getIsSpecialPilot(
                            item.collectionAddress,
                        ),
                    });
                } else {
                    allPilotNetPoints.push(item.toNumber());
                }
            });

            const list = await handlePilotsInfo({
                defaultMultiDelegateERC721Contract,
                ethereumMultiDelegateERC721Contract,
                defaultMultiProvider: multiProvider,
                ethereumMultiProvider,
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
                                    pilotImg={item.pilotImg}
                                    address={item.pilotOwner}
                                    value={item.value}
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
