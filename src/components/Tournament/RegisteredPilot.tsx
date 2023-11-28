import { Box, Image, Text, Grid, GridItem } from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    useMultiPilotMileageContract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import { useMercuryPilotsContract } from "@/hooks/useContract";
import Loading from "../Loading";
import { PilotInfo } from "@/hooks/usePilotInfo";
import { PilotXp } from "./PilotXp";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import { getPilotInfo, handlePilotsInfo } from "@/skyConstants/pilots";

const RegisteredPilot = ({
    selectPilotInfo,
    handleSelectPilotId,
}: {
    selectPilotInfo: PilotInfo;
    handleSelectPilotId: (value: PilotInfo) => void;
}) => {
    const { account, chainId } = useActiveWeb3React();
    const defaultMultiProvider = useMultiProvider(chainId);

    const [recentlyActivePilots, setRecentlyActivePilots] = useState([]);
    const mercuryPilotsContract = useMercuryPilotsContract();
    const multiPilotMileageContract =
        useMultiPilotMileageContract(DEAFAULT_CHAINID);

    const [loading, setLoading] = useState(false);

    const handleGetRecentlyUsedPilot = async () => {
        try {
            setLoading(true);
            const recentlyActivePilots =
                await mercuryPilotsContract.getRecentlyActivePilots(account);
            const pMileageRequest: any = [];

            // filter out invalid pilots
            const uniquePilots = _.uniqBy(
                recentlyActivePilots,
                (item: any) =>
                    `${item.collectionAddress}-${item.pilotId.toNumber()}`,
            )
                .filter((item) => {
                    const pilotItem = getPilotInfo(
                        chainId,
                        item.collectionAddress,
                    );
                    return !!pilotItem;
                })
                .map((item) => {
                    pMileageRequest.push(
                        multiPilotMileageContract.getPilotMileage(
                            item.collectionAddress,
                            item.pilotId,
                        ),
                    );
                    return {
                        ...item,
                        pilotId: item.pilotId.toNumber(),
                    };
                });

            const mileageRes = await defaultMultiProvider.all(pMileageRequest);

            const list = await handlePilotsInfo({
                chainId,
                allPilot: uniquePilots,
                values: mileageRes.map((item) => {
                    return item.toNumber();
                }),
            });

            setRecentlyActivePilots(list);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            !account ||
            !mercuryPilotsContract ||
            !multiPilotMileageContract ||
            !defaultMultiProvider
        ) {
            return;
        }
        handleGetRecentlyUsedPilot();
    }, [
        account,
        mercuryPilotsContract,
        multiPilotMileageContract,
        defaultMultiProvider,
    ]);

    return (
        <Box>
            <Box
                sx={{
                    width: "33.3333vw",
                    height: "15vw",
                    backdropFilter: "blur(5px)",
                    border: "2px solid #fff",
                    borderRadius: "0.8333vw",
                    display: "flex",
                    padding: "0.8333vw",
                    marginTop: "3.7037vh",
                    position: "relative",
                }}
            >
                <Grid
                    templateColumns="repeat(4, 1fr)"
                    templateRows={"repeat(3, 1fr)"}
                    sx={{
                        width: "100%",
                        overflow: "auto",
                        height: "100%",
                    }}
                >
                    {loading ? (
                        <Loading></Loading>
                    ) : (
                        recentlyActivePilots.map((item) => {
                            return (
                                <GridItem
                                    key={item.address + "-" + item.pilotId}
                                    w="100%"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        handleSelectPilotId({
                                            address: item.address,
                                            pilotId: item.pilotId,
                                            img: item.pilotImg,
                                        });
                                    }}
                                >
                                    <Image
                                        src={item.pilotImg}
                                        sx={{
                                            width: "3.4375vw",
                                            height: "3.4375vw",
                                            border: "1px solid #fff",
                                            borderRadius: "10px",
                                        }}
                                    ></Image>
                                    <PilotXp
                                        value={item.value}
                                        active={
                                            selectPilotInfo.address ===
                                                item.address &&
                                            selectPilotInfo.pilotId ===
                                                item.pilotId
                                        }
                                    ></PilotXp>
                                    <Text
                                        sx={{
                                            fontSize: "0.8333vw",
                                        }}
                                    >
                                        #{item.pilotId}
                                    </Text>
                                </GridItem>
                            );
                        })
                    )}
                </Grid>
            </Box>
        </Box>
    );
};

export default RegisteredPilot;
