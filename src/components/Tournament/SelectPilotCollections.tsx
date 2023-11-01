import {
    Box,
    Image,
    NumberInput,
    NumberInputField,
    Text,
    useDisclosure,
    Grid,
    GridItem,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    useMultiERC721Contract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import Loading from "../Loading";
import { PilotInfo } from "@/hooks/usePilotInfo";
import AllPilotList, { PilotBaseInfo } from "@/skyConstants/pilots";
import OpenSeaLink from "./assets/opensea-link.svg";
import SelectPilotIcon from "./assets/select-pilot-tip.svg";
import PilotLock from "./assets/pilot-lock.svg";

export const PilotItem = ({
    onClick,
    info,
}: {
    onClick: () => void;
    info: PilotBaseInfo;
}) => {
    const { img, name, openSeaUrl, disabled } = info;

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "0.5208vw",
                border: "1px solid #FFF",
                background: disabled ? "#B1B1B1" : "rgb(182, 200, 202)",
                width: "20.8333vw",
                height: "4.2708vw",
                position: "relative",
                paddingLeft: "0.5208vw",
                cursor: disabled ? "no-drop" : "pointer",
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    position: "relative",
                    borderRadius: "5px",
                    overflow: "hidden",
                }}
            >
                <Image
                    src={img}
                    sx={{
                        width: "3.0208vw",
                        height: "3.0208vw",
                        border: "2px solid #fff",
                        borderRadius: "5px",
                    }}
                ></Image>
                {disabled && (
                    <Box
                        sx={{
                            background: disabled && "rgba(0, 0, 0, 0.50)",
                            position: "absolute",
                            left: "0%",
                            top: "0%",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src={PilotLock}
                            sx={{
                                width: "2vw",
                            }}
                        ></Image>
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    paddingLeft: "4vw",
                }}
            >
                <Text
                    sx={{
                        textAlign: "left",
                        fontSize: "1.0417vw",
                        color: disabled ? "#D9D9D9" : "#4A4A4A",
                    }}
                >
                    {name}
                </Text>
                {disabled && (
                    <Text
                        sx={{
                            textAlign: "left",
                            fontSize: "0.7292vw",
                            color: "#D9D9D9",
                        }}
                    >
                        Coming soon...
                    </Text>
                )}
            </Box>

            {openSeaUrl && (
                <Image
                    sx={{
                        position: "absolute",
                        right: "0.5208vw",
                        top: "50%",
                        transform: "translateY(-50%)",
                        borderRadius: "40px",
                        width: "3.8542vw",
                    }}
                    src={OpenSeaLink}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        window.open(openSeaUrl, "_blank");
                    }}
                ></Image>
            )}
        </Box>
    );
};

const SelectPilotCollections = ({
    currentCollection,
    inputPilotId,
    handleInputPilotId,
    handleSelectPilotId,
    handlePilotIndex,
}: {
    currentCollection: any;
    inputPilotId: string;
    handleInputPilotId: (value: string) => void;
    handleSelectPilotId: (value: PilotInfo) => void;
    handlePilotIndex: (value: number) => void;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure({
        defaultIsOpen: true,
    });
    const { chainId, account } = useActiveWeb3React();
    const [currentMyNfts, setCurrentMyNfts] = useState([]);
    const [loading, setLoading] = useState(false);

    const multiERC721Contract = useMultiERC721Contract(
        currentCollection.address,
    );

    const multiProvider = useMultiProvider(currentCollection.chainId);

    const handleSelectSeries = (index: number) => {
        handlePilotIndex(index);
        onClose();
    };

    // get all exsit nft info
    const handleGetAllNft = async () => {
        setLoading(true);
        const [balance] = await multiProvider.all([
            multiERC721Contract.balanceOf(account),
        ]);

        const pilotIds = await multiProvider.all(
            new Array(balance.toNumber()).fill("").map((item, index) => {
                return multiERC721Contract.tokenOfOwnerByIndex(account, index);
            }),
        );

        const p = [];
        for (let i = 0; i < pilotIds.length; i++) {
            p.push(multiERC721Contract.tokenURI(pilotIds[i]));
            p.push(multiERC721Contract.ownerOf(pilotIds[i]));
        }
        const res = await multiProvider.all(p);
        setCurrentMyNfts(
            pilotIds.map((item, index) => {
                return {
                    pilotId: item.toNumber(),
                    img: getMetadataImg(res[index * 2]),
                    owner: res[index * 2 + 1],
                };
            }),
        );
        setLoading(false);
    };

    useEffect(() => {
        if (!currentCollection.enumerable) {
            return;
        }
        handleGetAllNft();
    }, [currentCollection]);

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                        cursor: isOpen ? "pointer" : "default",
                    }}
                    onClick={() => {
                        if (isOpen) {
                            onClose();
                        }
                    }}
                >
                    {isOpen
                        ? "< Choose Pilot from Below"
                        : "Select Pilot from these colletions"}
                </Text>
                <Popover placement="end-start">
                    <PopoverTrigger>
                        <Image
                            src={SelectPilotIcon}
                            sx={{
                                marginLeft: "1.0417vw",
                                cursor: "pointer",
                                width: "1.0417vw",
                                height: "1.0417vw",
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
                                    fontSize: "1.0417vw",
                                    fontFamily: "Quantico",
                                    lineHeight: "1.5625vw",
                                }}
                            >
                                If you use a supporting pilot from other
                                players. You can play games with it and
                                accumulate mileage on it, but you can not claim
                                rewards given to the pilot or spend its mileage.
                                {/* Or you can mint a Baby Merc of your own. */}
                            </span>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Box>

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
                        {AllPilotList[chainId].map(
                            (item: any, index: number) => {
                                return (
                                    <Box
                                        key={index}
                                        sx={{
                                            marginBottom: "0.3125vw",
                                        }}
                                    >
                                        <PilotItem
                                            onClick={() => {
                                                !item.disabled &&
                                                    handleSelectSeries(index);
                                            }}
                                            info={item}
                                        ></PilotItem>
                                    </Box>
                                );
                            },
                        )}
                    </Box>
                ) : (
                    <PilotItem
                        info={currentCollection}
                        onClick={onOpen}
                    ></PilotItem>
                )}

                {!isOpen && (
                    <Box
                        sx={{
                            marginTop: "0.8333vw",
                        }}
                    >
                        {" "}
                        <Box>
                            <Text
                                sx={{
                                    fontSize: "1.0417vw",
                                    marginTop: "1.875vw",
                                }}
                            >
                                Input Token ID
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
                                value={inputPilotId}
                                onChange={(value) => {
                                    handleInputPilotId(value);
                                }}
                            >
                                <NumberInputField />
                            </NumberInput>
                        </Box>
                        {currentCollection.enumerable && (
                            <Box
                                sx={{
                                    minHeight: "208px",
                                    border: "2px solid #fff",
                                    background: "rgba(61, 61, 61, 0.10)",
                                    position: "relative",
                                    marginTop: "1.875vw",
                                    width: "49.6354vw",
                                    height: "20.3125vw",
                                    backdropFilter: "blur(5px)",
                                    borderRadius: "0.8333vw",
                                    display: "flex",
                                    padding: "2.0833vw",
                                }}
                            >
                                <Grid
                                    templateColumns="repeat(5, 1fr)"
                                    templateRows={"repeat(3, 1fr)"}
                                    sx={{
                                        width: "100%",
                                    }}
                                >
                                    {loading ? (
                                        <Loading></Loading>
                                    ) : (
                                        currentMyNfts.map((item) => {
                                            return (
                                                <GridItem
                                                    key={item.pilotId}
                                                    onClick={() => {
                                                        handleSelectPilotId({
                                                            address:
                                                                currentCollection.address,
                                                            pilotId:
                                                                item.pilotId,
                                                            img: item.img,
                                                            owner: item.owner,
                                                        });
                                                    }}
                                                    w="100%"
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                        alignItems: "center",
                                                        flexDirection: "column",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <Image
                                                        src={item.img}
                                                        sx={{
                                                            width: "68px",
                                                            height: "68px",
                                                            borderRadius:
                                                                "10px",
                                                            border: "3px solid #fff",
                                                        }}
                                                    ></Image>
                                                    <Text>
                                                        {" "}
                                                        #{item.pilotId}{" "}
                                                    </Text>
                                                </GridItem>
                                            );
                                        })
                                    )}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default SelectPilotCollections;
