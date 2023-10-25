import { Box, Image, Text, Grid, GridItem } from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import {
    getMultiERC721Contract,
    useMultiMercuryPilotsContract,
    useMultiProvider,
} from "@/hooks/useMultiContract";
import { getMetadataImg } from "@/utils/ipfsImg";
import { useMercuryPilotsContract } from "@/hooks/useContract";
import Loading from "../Loading";
import { PilotInfo } from "@/hooks/usePilotInfo";
import { PilotXp } from "./PilotXp";

const RegisteredPilot = ({
    handleSelectTokenId,
}: {
    handleSelectTokenId: (value: PilotInfo) => void;
}) => {
    const { account, chainId } = useActiveWeb3React();
    const [recentlyActivePilots, setRecentlyActivePilots] = useState([]);
    const mercuryPilotsContract = useMercuryPilotsContract();
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();
    const multiProvider = useMultiProvider(chainId);
    const [loading, setLoading] = useState(false);

    const handleGetRecentlyUsedPilot = async () => {
        try {
            setLoading(true);
            const recentlyActivePilots =
                await mercuryPilotsContract.getRecentlyActivePilots(account);

            const uniquePilots = _.uniqBy(
                recentlyActivePilots,
                (item: any) => `${item.collectionAddress}-${item.tokenId}`,
            );

            const p = [];
            for (let i = 0; i < uniquePilots.length; i++) {
                const multiERC721Contract = getMultiERC721Contract(
                    uniquePilots[i].collectionAddress,
                );
                p.push(multiERC721Contract.tokenURI(uniquePilots[i].pilotId));
                p.push(
                    multiMercuryPilotsContract.getPilotMileage(
                        uniquePilots[i].collectionAddress,
                        uniquePilots[i].pilotId,
                    ),
                );
            }

            const res = await multiProvider.all(p);
            setRecentlyActivePilots(
                uniquePilots.map((item, index) => {
                    return {
                        address: item.collectionAddress,
                        tokenId: item.pilotId.toNumber(),
                        img: getMetadataImg(res[index * 2]),
                        xp: res[index * 2 + 1].toNumber(),
                    };
                }),
            );
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!account || !mercuryPilotsContract) {
            return;
        }
        handleGetRecentlyUsedPilot();
    }, [account, mercuryPilotsContract]);

    return (
        <Box>
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
                    position: "relative",
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
                        recentlyActivePilots.map((item) => {
                            return (
                                <GridItem
                                    key={item.address + "-" + item.tokenId}
                                    w="100%"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        handleSelectTokenId({
                                            address: item.address,
                                            tokenId: item.tokenId,
                                            img: item.img,
                                        });
                                    }}
                                >
                                    <Image
                                        src={item.img}
                                        sx={{
                                            width: "3.4375vw",
                                            height: "3.4375vw",
                                            border: "1px solid #fff",
                                            borderRadius: "10px",
                                        }}
                                    ></Image>
                                    <PilotXp value={item.xp}></PilotXp>
                                    <Text
                                        sx={{
                                            fontSize: "0.8333vw",
                                        }}
                                    >
                                        #{item.tokenId}
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
