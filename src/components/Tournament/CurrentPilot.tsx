import { Box, Image, Text, Button } from "@chakra-ui/react";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import OldWhite from "./assets/old-white.svg";
import OldYellow from "./assets/old-yellow.svg";
import FindYellow from "./assets/find-yellow.svg";
import FindWhite from "./assets/find-white.svg";
import BabymercIcon from "./assets/babymerc.svg";
import RightArrowBlackIcon from "./assets/right-arrow-black.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    getMultiERC721Contract,
    getMultiProvider,
} from "@/hooks/useMultiContract";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { useMercuryPilotsContract } from "@/hooks/useContract";
import BackHomeButton from "./BackHomeButton";
import Loading from "../Loading";
import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";
import { PilotInfo, usePilotInfo } from "@/hooks/usePilotInfo";
import UnkowPilotIcon1 from "./assets/unknow-pilot1.svg";
import styled from "@emotion/styled";
import { MyPilotXp, PilotXp } from "./PilotXp";
import ExchangeIcon from "./assets/exchange.svg";
import MyPilot from "./MyPilot";
import Nav2NFT from "./Nav2NFT";
import AllPilotList from "@/skyConstants/pilots";
import SelectPilotCollections from "./SelectPilotCollections";
import RegisteredPilot from "./RegisteredPilot";

const CustomButton = styled(Button)`
    width: 13.4375vw;
    height: 3.125vw;
    border-radius: 1.5625vw;
    font-size: 1.25vw;
    font-weight: 900;
    background: #d9d9d9;
    color: #000;
    &[disabled] {
        color: #636363;
        background: #ababab;
    }
    &[disabled]:hover {
        color: #636363;
        background: #ABABAB;
    },
`;

const IndicateNav = ({
    onNextRound,
}: {
    onNextRound: (step: number | string) => void;
}) => {
    return (
        <Box
            sx={{
                width: "12.5vw",
                position: "absolute",
                bottom: "0",
                left: "0",
            }}
        >
            {/* <Text
                sx={{
                    fontSize: "1.0417vw",
                    fontFamily: "Quantico",
                }}
            >
                If you do not have any pilot, mint a Baby Merc:
            </Text>
            <Nav2NFT
                icon={BabyMercIcon}
                title={"Mint"}
                value={"Baby Merc"}
                onClick={() => {
                    onNextRound("babyMerc");
                }}
                sx={{
                    width: "12.5vw  !important",
                }}
            ></Nav2NFT> */}
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
    handleTabChange,
    value,
}: {
    value: number;
    handleTabChange: (value: number) => void;
}) => {
    const tabList = [
        {
            icon: FindWhite,
            activeIcon: FindYellow,
            label: "Find My Pilot",
        },
        {
            icon: OldWhite,
            activeIcon: OldYellow,
            label: "Registered Pilot",
        },
    ];

    return (
        <Box
            sx={{
                width: "17.1875vw",
                marginRight: "7.5vw",
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
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => handleTabChange(index)}
                    >
                        <Image
                            src={index === value ? item.activeIcon : item.icon}
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
    );
};

export interface SelectPilotInfo {
    address: string;
    tokenId: number;
    img?: string;
    xp?: number;
}

const CurrentPilot = ({
    onNextRound,
}: {
    onNextRound: (step: number | string) => void;
}) => {
    const toast = useSkyToast();
    const { account, chainId } = useActiveWeb3React();

    const mercuryPilotsContract = useMercuryPilotsContract();

    const [activeLoading, setActiveLoading] = useState(false);
    const [currentTab, setCurrentTab] = React.useState(0);
    const pilotList = AllPilotList[chainId];

    const { activePilot, handleGetActivePilot } = usePilotInfo(account);
    const [inputPilotId, setInputPilotId] = useState("");
    const [pilotIndex, setPilotIndex] = useState(0);

    const currentCollection = useMemo(() => {
        return pilotList[pilotIndex];
    }, [pilotIndex]);

    const [selectPilotInfo, setSelectPilotInfo] = useState<PilotInfo>({
        address: currentCollection.address,
        pilotId: 0,
        img: "",
        owner: "",
    });

    const handleInputPilotId = (value: string) => {
        setInputPilotId(value);
    };

    const handlePilotIndex = (value: number) => {
        setPilotIndex(value);
        setSelectPilotInfo({
            address: pilotList[value].address,
            pilotId: 0,
            img: "",
        });
    };

    const handleTabChange = (value: number) => {
        setCurrentTab(value);
    };

    const handleSelectPilotId = (value: PilotInfo) => {
        setSelectPilotInfo(value);
    };
    const handleSearchTokenId = async () => {
        try {
            const multiERC721Contract = getMultiERC721Contract(
                currentCollection.address,
            );

            const multiProvider = getMultiProvider(currentCollection.chainId);

            const [tokenURI, owner] = await multiProvider.all([
                multiERC721Contract.tokenURI(inputPilotId),
                multiERC721Contract.ownerOf(inputPilotId),
            ]);

            const img = await getPilotImgFromUrl(tokenURI);
            handleSelectPilotId({
                ...selectPilotInfo,
                pilotId: Number(inputPilotId),
                img,
                owner,
            });
        } catch (e) {
            toast("TokenId is not exist.");
        }
    };

    const handleSetActive = async () => {
        try {
            if (
                selectPilotInfo.address === "" ||
                selectPilotInfo.pilotId === 0
            ) {
                return;
            }
            setActiveLoading(true);
            const res = await mercuryPilotsContract.setActivePilot(
                selectPilotInfo.address,
                selectPilotInfo.pilotId,
                account,
            );
            await res.wait();
            setActiveLoading(false);
            setSelectPilotInfo({
                address: "",
                pilotId: 0,
                img: "",
            });
            setTimeout(() => {
                handleGetActivePilot();
            }, 1000);
        } catch (e) {
            toast(handleError(e));
            setActiveLoading(false);
        }
    };

    return (
        <Box
            sx={{
                padding: "12.963vh 0 8.3333vh",
                height: "100vh",
            }}
        >
            <BackHomeButton onClick={() => onNextRound(2)}></BackHomeButton>
            {activeLoading && <Loading></Loading>}
            <Box
                sx={{
                    width: "83.3333vw",
                    margin: "0 auto",
                    borderTop: "1px solid #fff",
                    position: "relative",
                    paddingTop: "1.8519vh",
                    height: "100%",
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
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "1.8519vh",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                marginRight: "2.6875vw",
                                width: "17.1875vw",
                            }}
                        >
                            <MyPilot
                                img={activePilot.img}
                                showSupport={activePilot.owner !== account}
                                sx={{
                                    width: "4.8958vw !important",
                                    height: "4.8958vw !important",
                                    marginRight: "0.5208vw",
                                }}
                            ></MyPilot>

                            {activePilot.pilotId > 0 && (
                                <Box>
                                    <Text
                                        sx={{
                                            fontSize: "1.0417vw",
                                            lineHeight: "1.0417vw",
                                            height: "1.0417vw",
                                        }}
                                    >
                                        {activePilot.name}{" "}
                                        {activePilot.pilotId
                                            ? activePilot.pilotId
                                            : ""}
                                    </Text>
                                    <MyPilotXp
                                        value={activePilot?.xp}
                                    ></MyPilotXp>
                                </Box>
                            )}
                        </Box>
                        <Image
                            src={ExchangeIcon}
                            sx={{
                                height: "2.0313vw",
                                marginRight: "2.6875vw",
                                width: "2.0313vw",
                            }}
                        ></Image>

                        <MyPilot
                            img={selectPilotInfo.img}
                            showSupport={selectPilotInfo.owner !== account}
                            sx={{
                                width: "4.8958vw !important",
                                height: "4.8958vw !important",
                                marginRight: "0.5208vw",
                            }}
                        ></MyPilot>
                    </Box>

                    <Box sx={{ display: "flex", paddingTop: "2.3148vh" }}>
                        <LeftContent
                            value={currentTab}
                            handleTabChange={handleTabChange}
                        ></LeftContent>
                        <Box
                            sx={{
                                flex: 1,
                            }}
                        >
                            {currentTab === 0 && (
                                <SelectPilotCollections
                                    currentCollection={currentCollection}
                                    inputPilotId={inputPilotId}
                                    handleInputPilotId={handleInputPilotId}
                                    handlePilotIndex={handlePilotIndex}
                                    handleSelectPilotId={handleSelectPilotId}
                                ></SelectPilotCollections>
                            )}
                            {currentTab === 1 && (
                                <RegisteredPilot
                                    handleSelectPilotId={handleSelectPilotId}
                                ></RegisteredPilot>
                            )}
                        </Box>
                    </Box>
                </Box>
                <IndicateNav onNextRound={onNextRound}></IndicateNav>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                    }}
                >
                    {currentTab === 0 && !currentCollection.enumerable && (
                        <CustomButton
                            variant="unstyled"
                            onClick={handleSearchTokenId}
                            sx={{
                                marginRight: "44px",
                            }}
                        >
                            Search
                        </CustomButton>
                    )}
                    <CustomButton
                        disabled={false}
                        variant="unstyled"
                        onClick={handleSetActive}
                    >
                        Set Active
                    </CustomButton>
                </Box>
            </Box>
        </Box>
    );
};

export default CurrentPilot;
