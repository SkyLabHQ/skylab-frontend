import {
    Box,
    Image,
    NumberInput,
    NumberInputField,
    Text,
    useDisclosure,
    Button,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import GardenIcon from "@/components/TacToe/assets/garden-icon.png";
import BackIcon from "@/components/TacToe/assets/back-arrow-home.svg";
import AircraftActiveIcon from "./assets/aircraft-active.svg";
import React, { useEffect, useMemo, useState } from "react";
import XpBg from "./assets/xp-bg.png";
import RegisterIcon from "./assets/register.svg";
import RegisterActiveIcon from "./assets/register-active.svg";
import RegisteredIcon from "./assets/registered.svg";
import RegisteredActiveIcon from "./assets/registered-active.svg";
import BabymercIcon from "./assets/babymerc.svg";
import RightArrowBlackIcon from "./assets/right-arrow-black.svg";
import { ChainId } from "@/utils/web3Utils";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    useMultiERC721Contract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import { useMercuryPilotsContract } from "@/hooks/useContract";

const NFTList = {
    [ChainId.MUMBAI]: [
        {
            address: "0x14875C22fE0780985Bc5e4841d12e2a00Df835C7",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Mefe",
            enumerable: true,
        },
        {
            address: "0x14875C22fE0780985Bc5e4841d12e2a00Df835C7",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Mef22e",
            enumerable: true,
        },
        {
            address: "0x14875C22fE0780985Bc5e4841d12e2a00Df835C7",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Mef111e",
            enumerable: false,
        },
    ],
    [ChainId.POLYGON]: [
        {
            address: "0x14875C22fE0780985Bc5e4841d12e2a00Df835C7",
        },
    ],
};

const ActivePilot = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Image
                src={AircraftActiveIcon}
                sx={{
                    width: "4.4271vw",
                    height: "4.4271vw",
                    marginRight: "1.3542vw",
                }}
            ></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                }}
            >
                You are not owner of this NFT.
            </Text>
        </Box>
    );
};

const RegisteredPilot = () => {
    return (
        <Box
            sx={{
                width: "49.6354vw",
                height: "27.7083vw",
                backdropFilter: "blur(5px)",
                border: "2px solid #fff",
                borderRadius: "0.8333vw",
                display: "flex",
                padding: "2.0833vw",
                marginTop: "3.125vw",
            }}
        >
            <Grid
                templateColumns="repeat(5, 1fr)"
                templateRows={"repeat(3, 1fr)"}
                sx={{
                    width: "100%",
                }}
            >
                {[12, 3, 4, 5, 2, 2, 2, 2].map((item, index) => {
                    return (
                        <GridItem
                            w="100%"
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                src={BabymercIcon}
                                sx={{
                                    width: "3.4375vw",
                                    height: "3.4375vw",
                                }}
                            ></Image>
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};

const SearchButton = ({
    disabled,
    onClick,
}: {
    disabled: boolean;
    onClick: () => void;
}) => {
    return (
        <Button
            sx={{
                width: "13.4375vw",
                height: "3.125vw",
                borderRadius: "1.5625vw",
                fontSize: "1.25vw",
                fontWeight: 900,
                background: "#D9D9D9",
                color: "#000",
                "&[disabled]": {
                    color: "#636363",
                    background: "#ABABAB",
                },
                "&[disabled]:hover": {
                    color: "#636363",
                    background: "#ABABAB",
                },
            }}
            onClick={onClick}
            disabled={disabled}
            variant="unstyled"
        >
            Set Active
        </Button>
    );
};

const PilotItem = ({
    onClick,
    img,
    name,
}: {
    onClick: () => void;
    img: string;
    name: string;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "0.5208vw",
                border: "1px solid #FFF",
                background: "rgb(182, 200, 202)",
                width: "20.8333vw",
                height: "4.2708vw",
                position: "relative",
                paddingLeft: "0.5208vw",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            <Image
                src={img}
                sx={{
                    width: "3.0208vw",
                    height: "3.0208vw",
                }}
            ></Image>
            <Text
                sx={{
                    textAlign: "center",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "1.0417vw",
                    color: "#4A4A4A",
                }}
            >
                {name}
            </Text>
        </Box>
    );
};

const SelectPilotCollections = ({
    selectPilotInfo,
    handleSelectTokenId,
}: {
    selectPilotInfo: SelectPilotInfo;
    handleSelectTokenId: (value: SelectPilotInfo) => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { chainId, account } = useActiveWeb3React();
    const [pilotIndex, setPilotIndex] = useState(0);
    const [currentMyNfts, setCurrentMyNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    const nftItem = useMemo(() => {
        return NFTList[chainId][pilotIndex];
    }, [chainId, pilotIndex]);

    const multiERC721Contract = useMultiERC721Contract(nftItem.address);
    const multiProvider = useMultiProvider(chainId);

    const handleGetAllNft = async () => {
        handleSelectTokenId({
            address: nftItem.address,
            tokenId: 0,
        });
        setCurrentMyNfts([]);
        setLoading(true);
        const [balance] = await multiProvider.all([
            multiERC721Contract.balanceOf(account),
        ]);

        // get all tokenId
        const tokenIds = await multiProvider.all(
            new Array(balance.toNumber()).fill("").map((item, index) => {
                return multiERC721Contract.tokenOfOwnerByIndex(account, index);
            }),
        );
        // get all tokenURI
        const tokenURIs = await multiProvider.all([
            ...tokenIds.map((item) => {
                return multiERC721Contract.tokenURI(item);
            }),
        ]);

        setCurrentMyNfts(
            tokenIds.map((item, index) => {
                return {
                    tokenId: item.toNumber(),
                    img: getMetadataImg(tokenURIs[index]),
                };
            }),
        );
        setLoading(false);
    };

    console.log(currentMyNfts, "currentMyNfts");

    useEffect(() => {
        if (!nftItem.enumerable) {
            return;
        }
        handleGetAllNft();
    }, [nftItem]);

    console.log(selectPilotInfo, "selectTokenId");
    return (
        <Box>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    marginTop: "1.3542vw",
                }}
            >
                Select Pilot from these colletions
            </Text>
            <Box
                sx={{
                    position: "relative",
                    marginTop: "0.8333vw",
                }}
            >
                {isOpen ? (
                    <Box
                        sx={{
                            position: "absolute",
                            left: "0%",
                            top: "0%",
                        }}
                    >
                        {NFTList[chainId].map((item: any, index: number) => {
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        marginBottom: "0.3125vw",
                                    }}
                                >
                                    <PilotItem
                                        onClick={onClose}
                                        img={item.img}
                                        name={item.name}
                                    ></PilotItem>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <PilotItem
                        onClick={onOpen}
                        img={nftItem.img}
                        name={nftItem.name}
                    ></PilotItem>
                )}

                {nftItem.enumerable ? (
                    <Box
                        sx={{
                            width: "953px",
                            height: "532px",
                            borderRadius: "16px",
                            border: "2px solid #fff",
                            background: "rgba(61, 61, 61, 0.10)",
                        }}
                    >
                        <Grid
                            templateColumns="repeat(5, 1fr)"
                            sx={{
                                width: "100%",
                            }}
                        >
                            {currentMyNfts.map((item, index) => {
                                return (
                                    <GridItem
                                        key={item.tokenId}
                                        onClick={() => {
                                            handleSelectTokenId({
                                                address: nftItem.address,
                                                tokenId: item.tokenId,
                                            });
                                        }}
                                        w="100%"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            background:
                                                item.tokenId ===
                                                    selectPilotInfo.tokenId &&
                                                "red",
                                        }}
                                    >
                                        <Image
                                            src={item.img}
                                            sx={{
                                                width: "76px",
                                                height: "76px",
                                            }}
                                        ></Image>
                                        <Text> {item.tokenId} </Text>
                                    </GridItem>
                                );
                            })}
                        </Grid>
                    </Box>
                ) : (
                    <Box>
                        <Text
                            sx={{
                                fontSize: "1.0417vw",
                                marginTop: "1.875vw",
                            }}
                        >
                            In-put Token Id{" "}
                        </Text>
                        <NumberInput
                            variant="unstyled"
                            sx={{
                                borderRadius: "0.2604vw",
                                background: "#D9D9D9",
                                color: "#000",
                                paddingLeft: "0.5208vw",
                                width: "20.8333vw",
                                height: "2.0833vw",
                                marginTop: "0.8333vw",
                                lineHeight: "2.0833vw",
                                fontSize: "1.0417vw",
                            }}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const IndicateNav = () => {
    return (
        <Box sx={{ marginTop: "12.7604vw", width: "12.5vw" }}>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                    fontFamily: "Quantico",
                }}
            >
                If you do not have any pilot, mint a Baby Merc:
            </Text>
            <Box
                sx={{
                    marginTop: "0.3125vw",
                    width: "12.5vw",
                    height: "3.4896vw",
                    flexShrink: 0,
                    borderRadius: "0.5208vw",
                    background: "rgba(255, 255, 255, 0.50)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 0.5208vw",
                }}
            >
                <Image
                    src={BabymercIcon}
                    sx={{
                        width: "2.8125vw",
                        height: "2.8125vw",
                        marginRight: "0.2604vw",
                    }}
                ></Image>
                <Box
                    sx={{
                        color: "#4A4A4A",
                        fontSize: "1.0417vw",
                        flex: 1,
                        fontWeight: "500",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text>Mint</Text>
                        <Box
                            sx={{
                                borderLeft: "1px solid rgba(96, 96, 96, 0.30)",
                                paddingLeft: "0.2083vw",
                            }}
                        >
                            <Image
                                sx={{
                                    width: "1.1458vw",
                                }}
                                src={RightArrowBlackIcon}
                            ></Image>
                        </Box>
                    </Box>
                    <Text>Baby Merc</Text>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "1.6667vw",
                    width: "12.5vw",
                    height: "2.7083vw",
                    flexShrink: 0,
                    borderRadius: "0.7813vw",
                    display: "flex",
                    padding: "0 0.5208vw",
                    background:
                        "linear-gradient(95deg, rgba(143, 255, 249, 0.00) 29.09%, rgba(251, 209, 97, 0.80) 60.98%, rgba(251, 209, 97, 0.00) 89.72%)",
                    boxShadow:
                        "0.2083vw 0.2083vw 0.2083vw 0vw rgba(0, 0, 0, 0.25)",
                    border: "2px solid #FFF",
                }}
            >
                <Image
                    src={BabymercIcon}
                    sx={{
                        marginRight: "0.2604vw",
                        width: "1.5625vw",
                    }}
                ></Image>
                <Box
                    sx={{
                        color: "#fff",
                        fontSize: "1.0417vw",
                        flex: 1,
                        fontWeight: "900",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text>Leaderboard</Text>
                        <Box
                            sx={{
                                borderLeft:
                                    "0.0521vw solid rgba(96, 96, 96, 0.30)",
                                paddingLeft: "0.2083vw",
                            }}
                        >
                            <Image
                                sx={{
                                    width: "1.1458vw",
                                }}
                                src={RightArrowBlackIcon}
                            ></Image>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const LeftContent = ({
    activePilot,
    handleTabChange,
    value,
}: {
    activePilot: SelectPilotInfo;
    value: number;
    handleTabChange: (value: number) => void;
}) => {
    const tabList = [
        {
            icon: RegisterIcon,
            activeIcon: RegisterActiveIcon,
            label: "Find My Pilot",
        },
        {
            icon: RegisteredIcon,
            activeIcon: RegisteredActiveIcon,
            label: "Registered Pilot",
        },
    ];

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Image
                    src={activePilot?.img}
                    sx={{
                        width: "4.8958vw",
                        height: "4.8958vw",
                        marginRight: "0.5208vw",
                    }}
                ></Image>
                <Box>
                    <Text
                        sx={{
                            fontSize: "1.0417vw",
                        }}
                    >
                        name 1234
                    </Text>
                    <Box
                        sx={{
                            background: `url(${XpBg})`,
                            width: "11.4063vw",
                            height: "3.5417vw",
                            backgroundSize: "100% 100%",
                        }}
                    ></Box>
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: "2.5vw",
                    "& >div": {
                        marginBottom: "0.7813vw",
                    },
                    "& >div:last-child": {
                        marginBottom: "0",
                    },
                }}
            >
                {tabList.map((item, index) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => handleTabChange(index)}
                        >
                            <Image
                                src={
                                    index === value
                                        ? item.activeIcon
                                        : item.icon
                                }
                                sx={{
                                    marginRight: "1.0417vw",
                                    width: "3.125vw",
                                    height: "3.125vw",
                                }}
                            ></Image>
                            <Text
                                sx={{
                                    fontSize: "1.0417vw",
                                    fontWeight: 900,
                                    color: index === value ? "#f2d861" : "#fff",
                                }}
                            >
                                {item.label}
                            </Text>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

interface SelectPilotInfo {
    address: string;
    tokenId: number;
    img?: string;
}

const CurrentPilot = ({
    onNextRound,
}: {
    onNextRound: (step: number | string) => void;
}) => {
    const { account, chainId } = useActiveWeb3React();
    const multiProvider = useMultiProvider(chainId);
    const mercuryPilotsContract = useMercuryPilotsContract();
    const [currentTab, setCurrentTab] = React.useState(0);
    const [activePilot, setActivePilot] = useState<SelectPilotInfo>();
    const [selectPilotInfo, setSelectPilotInfo] = useState<SelectPilotInfo>({
        address: "",
        tokenId: 0,
    });
    const multiERC721Contract = useMultiERC721Contract(activePilot?.address);

    const handleTabChange = (value: number) => {
        setCurrentTab(value);
    };

    const handleSelectTokenId = (value: SelectPilotInfo) => {
        setSelectPilotInfo(value);
    };

    const handleSetActive = async () => {
        const res = await mercuryPilotsContract.setActivePilot(
            selectPilotInfo.address,
            selectPilotInfo.tokenId,
            account,
        );
        await res.wait();
        handleGetActivePilot();
    };

    const handleGetActivePilot = async () => {
        const res = await mercuryPilotsContract.getActivePilot(account);
        if (
            res.collectionAddress !==
            "0x0000000000000000000000000000000000000000"
        ) {
            setActivePilot({
                address: res.collectionAddress,
                tokenId: res.pilotId.toNumber(),
            });
        } else {
            setActivePilot({
                address: "",
                tokenId: 0,
            });
        }
    };

    const handleGetTokenURI = async () => {
        const tokenURI = await multiProvider.all([
            multiERC721Contract.tokenURI(activePilot.tokenId),
        ]);
        setActivePilot({
            ...activePilot,
            img: getMetadataImg(tokenURI[0]),
        });
    };

    useEffect(() => {
        if (!account) return;
        handleGetActivePilot();
    }, [account]);

    useEffect(() => {
        if (!multiERC721Contract || !multiProvider) return;
        handleGetTokenURI();
    }, [multiERC721Contract, multiProvider]);

    console.log(activePilot, "---");

    return (
        <Box
            sx={{
                paddingTop: "7.2917vw",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    position: "absolute",
                    left: "0",
                    top: "0",
                    cursor: "pointer",
                }}
                onClick={() => onNextRound(2)}
            >
                <Image src={GardenIcon}></Image>
                <Image sx={{}} src={BackIcon}></Image>
            </Box>
            <Box
                sx={{
                    width: "83.3333vw",
                    margin: "0 auto",
                    borderTop: "1px solid #fff",
                    paddingTop: "1.0417vw",
                    position: "relative",
                }}
            >
                <Box>
                    <Text
                        sx={{
                            fontSize: "1.25vw",
                        }}
                    >
                        Current Pilot{" "}
                    </Text>

                    <Box sx={{ display: "flex", paddingTop: "2.3148vh" }}>
                        <Box
                            sx={{
                                marginRight: "4.6875vw",
                            }}
                        >
                            <LeftContent
                                activePilot={activePilot}
                                value={currentTab}
                                handleTabChange={handleTabChange}
                            ></LeftContent>
                        </Box>
                        <Box>
                            <ActivePilot></ActivePilot>
                            {currentTab === 0 && (
                                <SelectPilotCollections
                                    handleSelectTokenId={handleSelectTokenId}
                                    selectPilotInfo={selectPilotInfo}
                                ></SelectPilotCollections>
                            )}
                            {currentTab === 1 && (
                                <RegisteredPilot></RegisteredPilot>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    width: "83.3333vw",
                    position: "absolute",
                    bottom: "9.2593vh",
                    left: "50%",
                    transform: "translate(-50%, 0)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <IndicateNav></IndicateNav>
                <SearchButton
                    disabled={false}
                    onClick={handleSetActive}
                ></SearchButton>
            </Box>
        </Box>
    );
};

export default CurrentPilot;
