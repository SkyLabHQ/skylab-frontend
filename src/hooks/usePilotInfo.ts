import { getMetadataImg } from "@/utils/ipfsImg";
import { useEffect, useState } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { useMercuryPilotsContract } from "./useContract";
import {
    useMultiERC721Contract,
    useMultiMercuryPilotsContract,
    useMultiProvider,
} from "./useMultiContract";

export interface PilotInfo {
    address: string;
    tokenId: number;
    name?: string;
    img?: string;
    xp?: number;
}

export const usePilotInfo = () => {
    const { account, chainId } = useActiveWeb3React();
    const multiProvider = useMultiProvider(chainId);
    const mercuryPilotsContract = useMercuryPilotsContract();
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();

    const [pilotAddressTokenId, setPilotAddressTokenId] = useState({
        address: "",
        tokenId: 0,
    });

    const [activePilot, setActivePilot] = useState<PilotInfo>({
        address: "",
        tokenId: 0,
        img: "",
        xp: 0,
    });

    const multiERC721Contract = useMultiERC721Contract(
        pilotAddressTokenId?.address,
    );

    const handleGetActivePilot = async () => {
        const res = await mercuryPilotsContract.viewActivePilot(account);
        if (
            res.collectionAddress !==
            "0x0000000000000000000000000000000000000000"
        ) {
            setPilotAddressTokenId({
                address: res.collectionAddress,
                tokenId: res.pilotId.toNumber(),
            });
        } else {
            setPilotAddressTokenId({
                address: "",
                tokenId: 0,
            });
        }
    };

    const handleGetTokenURI = async () => {
        const [tokenURI, name, xp] = await multiProvider.all([
            multiERC721Contract.tokenURI(pilotAddressTokenId.tokenId),
            multiERC721Contract.name(),
            multiMercuryPilotsContract.getPilotMileage(
                pilotAddressTokenId.address,
                pilotAddressTokenId.tokenId,
            ),
        ]);
        setActivePilot({
            ...pilotAddressTokenId,
            img: getMetadataImg(tokenURI),
            xp: xp.toNumber(),
            name: name,
        });
    };

    useEffect(() => {
        if (!account) return;
        handleGetActivePilot();
    }, [account]);

    useEffect(() => {
        if (
            pilotAddressTokenId.address === "" ||
            pilotAddressTokenId.tokenId === 0 ||
            !multiERC721Contract
        )
            return;

        handleGetTokenURI();
    }, [
        pilotAddressTokenId.address,
        pilotAddressTokenId.tokenId,
        multiERC721Contract,
    ]);

    return {
        activePilot,
        handleGetActivePilot,
    };
};
