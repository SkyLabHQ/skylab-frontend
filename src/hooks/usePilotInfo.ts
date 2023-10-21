import AllPilotList, {
    getPilotChainId,
    PilotBaseInfo,
} from "@/skyConstants/pilots";
import { getMetadataImg, getPilotImgFromUrl } from "@/utils/ipfsImg";
import { useEffect, useState } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { useMercuryPilotsContract } from "./useContract";
import {
    getMultiERC721Contract,
    getMultiProvider,
    useMultiMercuryPilotsContract,
    useMultiProvider,
} from "./useMultiContract";

export interface PilotInfo {
    address: string;
    tokenId: number;
    name?: string;
    img?: string;
    xp?: number;
    owner?: string;
}

export const usePilotInfo = (account: string) => {
    const { chainId } = useActiveWeb3React();
    const pilotList = AllPilotList[chainId];
    const defaultMultiProvider = useMultiProvider(chainId);
    const mercuryPilotsContract = useMercuryPilotsContract();
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();
    const [activePilot, setActivePilot] = useState<PilotInfo>({
        address: "",
        tokenId: 0,
        img: "",
        xp: 0,
    });

    const handleGetActivePilot = async () => {
        const res = await mercuryPilotsContract.getActivePilot(account);
        const pilotChainId = getPilotChainId(chainId, res.collectionAddress);

        if (
            res.collectionAddress !==
            "0x0000000000000000000000000000000000000000"
        ) {
            const multiProvider = getMultiProvider(pilotChainId);
            const multiERC721Contract = getMultiERC721Contract(
                res.collectionAddress,
            );

            const [tokenURI, name, owner] = await multiProvider.all([
                multiERC721Contract.tokenURI(res.pilotId),
                multiERC721Contract.name(),
                multiERC721Contract.ownerOf(res.pilotId),
            ]);
            const [xp] = await defaultMultiProvider.all([
                multiMercuryPilotsContract.getPilotMileage(
                    res.collectionAddress,
                    res.pilotId,
                ),
            ]);

            const img = await getPilotImgFromUrl(tokenURI);

            setActivePilot({
                address: res.collectionAddress,
                tokenId: res.pilotId.toNumber(),
                img: img,
                xp: xp.toNumber(),
                name: name,
                owner: owner,
            });
        }
    };

    useEffect(() => {
        if (!account || !multiMercuryPilotsContract) return;
        handleGetActivePilot();
    }, [account, multiMercuryPilotsContract]);

    return {
        activePilot,
        handleGetActivePilot,
    };
};
