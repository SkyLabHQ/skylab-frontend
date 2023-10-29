import {
    getIsSpecialPilot,
    getSpecialPilotImg,
    getPilotInfo,
} from "@/skyConstants/pilots";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { ChainId } from "@/utils/web3Utils";
import { useEffect, useState } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import { useMercuryPilotsContract } from "./useContract";
import {
    useMultiDelegateERC721Contract,
    useMultiPilotMileageContract,
    useMultiProvider,
} from "./useMultiContract";

export interface PilotInfo {
    address: string;
    pilotId: number;
    name?: string;
    img?: string;
    xp?: number;
    owner?: string;
}

export const usePilotInfo = (account: string) => {
    const { chainId } = useActiveWeb3React();
    const defaultMultiProvider = useMultiProvider(chainId);
    const ethereumMultiProvider = useMultiProvider(ChainId.ETHEREUM);
    const defaultMultiDelegateERC721Contract =
        useMultiDelegateERC721Contract(chainId);
    const ethereumMultiDelegateERC721Contract = useMultiDelegateERC721Contract(
        ChainId.ETHEREUM,
    );
    const mercuryPilotsContract = useMercuryPilotsContract();
    const multiPilotMileageContract = useMultiPilotMileageContract();
    const [init, setInit] = useState<boolean>(false);
    const [activePilot, setActivePilot] = useState<PilotInfo>({
        address: "",
        pilotId: 0,
        img: "",
        xp: 0,
        owner: "",
    });

    const handleGetActivePilot = async () => {
        try {
            const res = await mercuryPilotsContract.getActivePilot(account);
            const collectionAddress = res.collectionAddress;
            const pilotItem = getPilotInfo(chainId, collectionAddress);
            if (!pilotItem) {
                return;
            }
            if (pilotItem) {
                const pilotChainId = pilotItem.chainId;
                const pilotId = res.pilotId;
                let tokenURI, owner, xp;

                if (chainId === pilotChainId) {
                    [tokenURI, owner, xp] = await defaultMultiProvider.all([
                        defaultMultiDelegateERC721Contract.tokenURI(
                            collectionAddress,
                            pilotId,
                        ),
                        defaultMultiDelegateERC721Contract.ownerOf(
                            collectionAddress,
                            pilotId,
                        ),
                        multiPilotMileageContract.getPilotMileage(
                            collectionAddress,
                            pilotId,
                        ),
                    ]);
                } else {
                    const isSpecialPilot = getIsSpecialPilot(collectionAddress);
                    if (isSpecialPilot) {
                        tokenURI = getSpecialPilotImg(
                            collectionAddress,
                            pilotId,
                        );
                        [[owner], [xp]] = await Promise.all([
                            ethereumMultiProvider.all([
                                ethereumMultiDelegateERC721Contract.ownerOf(
                                    collectionAddress,
                                    pilotId,
                                ),
                            ]),
                            defaultMultiProvider.all([
                                multiPilotMileageContract.getPilotMileage(
                                    collectionAddress,
                                    pilotId,
                                ),
                            ]),
                        ]);
                    } else {
                        [[tokenURI, owner], [xp]] = await Promise.all([
                            ethereumMultiProvider.all([
                                ethereumMultiDelegateERC721Contract.tokenURI(
                                    collectionAddress,
                                    pilotId,
                                ),
                                ethereumMultiDelegateERC721Contract.ownerOf(
                                    collectionAddress,
                                    pilotId,
                                ),
                            ]),
                            defaultMultiProvider.all([
                                multiPilotMileageContract.getPilotMileage(
                                    collectionAddress,
                                    pilotId,
                                ),
                            ]),
                        ]);
                    }
                }
                const img = await getPilotImgFromUrl(tokenURI);
                setActivePilot({
                    address: res.collectionAddress,
                    pilotId: res.pilotId.toNumber(),
                    img: img,
                    xp: xp.toNumber(),
                    name: pilotItem.name,
                    owner: owner,
                });
            }
        } catch (e) {
            console.log(e, "getActivePilot error");
            setActivePilot({
                address: "",
                pilotId: 0,
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
        if (
            !account ||
            !multiPilotMileageContract ||
            !defaultMultiProvider ||
            !ethereumMultiProvider ||
            !defaultMultiDelegateERC721Contract ||
            !ethereumMultiDelegateERC721Contract
        )
            return;
        handleGetActivePilot();
    }, [
        account,
        multiPilotMileageContract,
        defaultMultiProvider,
        ethereumMultiProvider,
        defaultMultiDelegateERC721Contract,
        ethereumMultiDelegateERC721Contract,
    ]);

    return { init, activePilot, handleGetActivePilot };
};
