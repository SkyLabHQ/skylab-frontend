import { ZERO_DATA } from "@/skyConstants";
import { getPilotInfo } from "@/skyConstants/pilots";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { useEffect, useState } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
    useDelegateERC721Contract,
    useMercuryPilotsContract,
} from "./useContract";
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
    const defaultMultiProvider = useMultiProvider(chainId);
    const mercuryPilotsContract = useMercuryPilotsContract();
    const multiMercuryPilotsContract = useMultiMercuryPilotsContract();
    const delegateERC721Contract = useDelegateERC721Contract();
    const [init, setInit] = useState<boolean>(false);
    const [activePilot, setActivePilot] = useState<PilotInfo>({
        address: "",
        tokenId: 0,
        img: "",
        xp: 0,
        owner: ZERO_DATA,
    });

    const handleGetActivePilot = async () => {
        try {
            const res = await mercuryPilotsContract.getActivePilot(account);
            const pilotItem = getPilotInfo(chainId, res.collectionAddress);
            if (!pilotItem) {
                return;
            }
            const pilotChainId = pilotItem.chainId;
            if (res.collectionAddress !== ZERO_DATA && pilotItem) {
                const multiProvider = getMultiProvider(pilotChainId);
                const multiERC721Contract = getMultiERC721Contract(
                    res.collectionAddress,
                );
                const [tokenURI, owner] = await multiProvider.all([
                    multiERC721Contract.tokenURI(res.pilotId),
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
                    name: pilotItem.name,
                    owner: owner,
                });
            }
        } catch (e) {
            setActivePilot({
                address: "",
                tokenId: 0,
                img: "",
                xp: 0,
                name: "",
                owner: "",
            });
        } finally {
            setInit(true);
        }
    };

    useEffect(() => {
        if (!account || !multiMercuryPilotsContract || !delegateERC721Contract)
            return;
        handleGetActivePilot();
    }, [account, multiMercuryPilotsContract, delegateERC721Contract]);

    return { init, activePilot, handleGetActivePilot };
};
