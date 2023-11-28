import { Box, Image, Text, Button } from "@chakra-ui/react";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import OldWhite from "./assets/old-white.svg";
import OldYellow from "./assets/old-yellow.svg";
import FindYellow from "./assets/find-yellow.svg";
import FindWhite from "./assets/find-white.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    getMultiDelegateERC721Contract,
    getMultiProvider,
} from "@/hooks/useMultiContract";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { useMercuryPilotsContract } from "@/hooks/useContract";
import BackHomeButton from "./BackHomeButton";
import Loading from "../Loading";
import useSkyToast from "@/hooks/useSkyToast";
import { handleError } from "@/utils/error";
import { PilotInfo, usePilotInfo } from "@/hooks/usePilotInfo";
import styled from "@emotion/styled";
import { MyPilotXp } from "./PilotXp";
import ExchangeIcon from "./assets/exchange.svg";
import MyPilot from "./MyPilot";
import AllPilotList, {
    getIsSpecialPilot,
    getSpecialPilotImg,
} from "@/skyConstants/pilots";
import SelectPilotCollections from "./SelectPilotCollections";
import RegisteredPilot from "./RegisteredPilot";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import { ZERO_DATA } from "@/skyConstants";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import UnknownPilotIcon from "./assets/unknow-pilot2.svg";

const CustomButton = styled(Button)`
    width: 10.4167vw;
    height: 2.6042vw;
    border-radius: 1.5625vw;
    font-size: 1.0417vw;
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
            label: "Active Pilot Record",
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
    const addNetworkToMetask = useAddNetworkToMetamask();
    const mercuryPilotsContract = useMercuryPilotsContract();
    const [activeLoading, setActiveLoading] = useState(false);
    const [currentTab, setCurrentTab] = React.useState(0);
    const pilotList = AllPilotList[chainId];

    const { activePilot, handleGetActivePilot } = usePilotInfo(account);
    const [inputPilotId, setInputPilotId] = useState("");
    const [pilotIndex, setPilotIndex] = useState(1);

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
        if (chainId !== Number(DEAFAULT_CHAINID)) {
            await addNetworkToMetask(Number(DEAFAULT_CHAINID));
            return;
        }
        try {
            setActiveLoading(true);
            let tokenURI, owner;
            const collectionAddress = currentCollection.address;
            const isSpecialPilot = getIsSpecialPilot(currentCollection.address);
            const multiDelegateERC721Contract = getMultiDelegateERC721Contract(
                currentCollection.chainId,
            );
            const multiProvider = getMultiProvider(currentCollection.chainId);
            if (isSpecialPilot) {
                tokenURI = getSpecialPilotImg(collectionAddress, inputPilotId);
                [owner] = await multiProvider.all([
                    multiDelegateERC721Contract.ownerOf(
                        collectionAddress,
                        inputPilotId,
                    ),
                ]);
            } else {
                [tokenURI, owner] = await multiProvider.all([
                    multiDelegateERC721Contract.tokenURI(
                        collectionAddress,
                        inputPilotId,
                    ),
                    multiDelegateERC721Contract.ownerOf(
                        currentCollection.address,
                        inputPilotId,
                    ),
                ]);
            }

            if (owner === ZERO_DATA) {
                toast("Token ID does not exist");
                return;
            }
            const img = isSpecialPilot
                ? tokenURI
                : await getPilotImgFromUrl(tokenURI);

            handleSelectPilotId({
                ...selectPilotInfo,
                pilotId: Number(inputPilotId),
                img,
                owner,
            });
            setActiveLoading(false);
        } catch (e) {
            console.log(e, "e");
            setActiveLoading(false);
            toast("Token ID does not exist");
        }
    };

    const handleSetActive = async () => {
        if (chainId !== Number(DEAFAULT_CHAINID)) {
            await addNetworkToMetask(Number(DEAFAULT_CHAINID));
            return;
        }
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
                padding: "8vh 0 8.3333vh",
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
                                    marginRight: "1.0417vw",
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
                                            ? "#" + activePilot.pilotId
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
                            nonexistentImg={UnknownPilotIcon}
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
                                    selectPilotInfo={selectPilotInfo}
                                    handleSelectPilotId={handleSelectPilotId}
                                ></RegisteredPilot>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "0",
                        right: "0",
                    }}
                >
                    {currentTab === 0 && (
                        <CustomButton
                            variant="unstyled"
                            onClick={handleSearchTokenId}
                            sx={{
                                marginRight: "1.25vw",
                            }}
                        >
                            Preview
                        </CustomButton>
                    )}
                    <CustomButton
                        disabled={selectPilotInfo.pilotId === 0}
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
