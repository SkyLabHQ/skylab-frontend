import { tournamentChainId } from "@/pages/Activities";
import {
    getIsSpecialPilot,
    getSpecialPilotImg,
    getPilotInfo,
} from "@/skyConstants/pilots";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { ChainId, DEAFAULT_CHAINID } from "@/utils/web3Utils";
import { useEffect, useState } from "react";
import {
    useMultiDelegateERC721Contract,
    useMultiMercuryPilotsContract,
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
    const defaultMultiProvider = useMultiProvider(DEAFAULT_CHAINID);
    const ethereumMultiProvider = useMultiProvider(ChainId.ETHEREUM);
    const defaultMultiDelegateERC721Contract =
        useMultiDelegateERC721Contract(DEAFAULT_CHAINID);
    const ethereumMultiDelegateERC721Contract = useMultiDelegateERC721Contract(
        ChainId.ETHEREUM,
    );
    const multiMercuryPilotsContract =
        useMultiMercuryPilotsContract(DEAFAULT_CHAINID);
    const multiPilotMileageContract =
        useMultiPilotMileageContract(DEAFAULT_CHAINID);

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
            const [res] = await defaultMultiProvider.all([
                multiMercuryPilotsContract.getActivePilot(account),
            ]);
            const collectionAddress = res.collectionAddress;
            const pilotItem = getPilotInfo(
                tournamentChainId,
                collectionAddress,
            );
            if (!pilotItem) {
                setActivePilot({
                    address: "",
                    pilotId: 0,
                    img: "",
                    xp: 0,
                    name: "",
                    owner: "",
                });
                return;
            }
            if (pilotItem) {
                const isSpecialPilot = getIsSpecialPilot(collectionAddress);
                const pilotChainId = pilotItem.chainId;
                const pilotId = res.pilotId;
                let tokenURI, owner, xp;

                if (tournamentChainId === pilotChainId) {
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

                const img = isSpecialPilot
                    ? tokenURI
                    : await getPilotImgFromUrl(tokenURI);
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
