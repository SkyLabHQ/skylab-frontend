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
    getMultiERC721Contract,
    useMultiDelegateERC721Contract,
    useMultiMercuryPilotsContract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { shortenAddress } from "@/utils";
import GrayArrow from "./assets/gray-arrow.svg";
import Loading from "../Loading";
import { getPilotChainId } from "@/skyConstants/pilots";
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
    const mainnetMultiProvider = useMultiProvider(ChainId.MAINNET);
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const defaultMultiDelegateERC721Contract =
        useMultiDelegateERC721Contract(chainId);
    const mainnetMultiDelegateERC721Contract = useMultiDelegateERC721Contract(
        ChainId.MAINNET,
    );

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
        if (
            !defaultMultiDelegateERC721Contract
            // ||!mainnetMultiDelegateERC721Contract
        ) {
            return;
        }
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

            const allPilot = [];

            for (let i = 0; i <= 15; i++) {
                for (let j = 0; j < res[i].length; j++) {
                    if (
                        res[i][j].collectionAddress !== ZERO_DATA &&
                        res[i][j].pilotId.toNumber() !== 0
                    ) {
                        allPilot.push(res[i][j]);
                    }
                }
            }

            const p1 = [];
            const pPilotInfoDefault = [];
            const pPilotInfoMainnet = [];
            const chainIdIndex = [];

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
                    chainIdIndex.push(ChainId.MAINNET);
                    pPilotInfoMainnet.push(
                        multiERC721Contract.tokenURI(allPilot[i].pilotId),
                    );
                    pPilotInfoMainnet.push(
                        multiERC721Contract.ownerOf(allPilot[i].pilotId),
                    );
                } else {
                    chainIdIndex.push(chainId);
                    pPilotInfoDefault.push(
                        defaultMultiDelegateERC721Contract.tokenURI(
                            allPilot[i].collectionAddress,
                            allPilot[i].pilotId,
                        ),
                    );
                    pPilotInfoDefault.push(
                        defaultMultiDelegateERC721Contract.ownerOf(
                            allPilot[i].collectionAddress,
                            allPilot[i].pilotId,
                        ),
                    );
                }
            }

            const [mainnetPilotRes, defaultRes, res1] = await Promise.all([
                mainnetMultiProvider.all(pPilotInfoMainnet),
                multiProvider.all(pPilotInfoDefault),
                multiProvider.all(p1),
            ]);

            const list = [];
            let defaultIndex = 0;
            let mainnetIndex = 0;
            for (let i = 0; i < allPilot.length; i++) {
                let imgUrl = "";
                let owner = "";
                if (chainIdIndex[i] === ChainId.MAINNET) {
                    imgUrl = mainnetPilotRes[mainnetIndex * 2];
                    owner = mainnetPilotRes[mainnetIndex * 2 + 1];
                    mainnetIndex++;
                } else {
                    imgUrl = defaultRes[defaultIndex * 2];
                    owner = defaultRes[defaultIndex * 2 + 1];
                    defaultIndex++;
                }
                const img = await getPilotImgFromUrl(imgUrl);

                list.push({
                    pilotId: allPilot[i].pilotId.toNumber(),
                    value: res1[i].toNumber(),
                    pilotUrl: img,
                    pilotOwner: owner,
                });
            }

            const _list = list
                .filter((item) => item.pilotOwner !== ZERO_DATA)
                .sort((a, b) => b.value - a.value);

            setList(_list);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setList([]);
        }
    };

    useEffect(() => {
        handleGetMileage();
    }, [
        currentMenu,
        defaultMultiDelegateERC721Contract,
        mainnetMultiDelegateERC721Contract,
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
                                    pilotUrl={item.pilotUrl}
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