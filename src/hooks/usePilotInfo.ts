import {
    getIsSpecialPilot,
    getSpecialPilotImg,
    getPilotInfo,
} from "@/skyConstants/pilots";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import { DEAFAULT_CHAINID } from "@/utils/web3Utils";
import { useEffect, useState } from "react";
import {
    getMultiDelegateERC721Contract,
    getMultiProvider,
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
        const sessionPilot = sessionStorage.getItem("activePilot");
        let sessionPilotObj = {};
        try {
            if (sessionPilot) {
                sessionPilotObj = JSON.parse(sessionPilot);
                if (sessionPilotObj[account]) {
                    setActivePilot(sessionPilotObj[account]);
                    setInit(true);
                }
            }
        } catch {
            sessionPilotObj = {};
        }

        try {
            const [res] = await defaultMultiProvider.all([
                multiMercuryPilotsContract.getActivePilot(account),
            ]);
            const collectionAddress = res.collectionAddress;
            const pilotItem = getPilotInfo(DEAFAULT_CHAINID, collectionAddress);
            if (!pilotItem) {
                const pilotInfo = {
                    address: "",
                    pilotId: 0,
                    img: "",
                    xp: 0,
                    name: "",
                    owner: "",
                };
                setActivePilot(pilotInfo);
                sessionStorage.setItem(
                    "activePilot",
                    JSON.stringify({
                        ...sessionPilotObj,
                        [account]: pilotInfo,
                    }),
                );
                return;
            }
            if (pilotItem) {
                const isSpecialPilot = getIsSpecialPilot(collectionAddress);
                const pilotChainId = pilotItem.chainId;
                const pilotId = res.pilotId;
                let tokenURI, owner, xp;

                const multiDelegateERC721Contract =
                    getMultiDelegateERC721Contract(pilotChainId);
                const multiProvider = getMultiProvider(pilotItem.chainId);

                if (isSpecialPilot) {
                    tokenURI = getSpecialPilotImg(collectionAddress, pilotId);
                    [[owner], [xp]] = await Promise.all([
                        multiProvider.all([
                            multiDelegateERC721Contract.ownerOf(
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
                        multiProvider.all([
                            multiDelegateERC721Contract.tokenURI(
                                collectionAddress,
                                pilotId,
                            ),
                            multiDelegateERC721Contract.ownerOf(
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

                const img = isSpecialPilot
                    ? tokenURI
                    : await getPilotImgFromUrl(tokenURI);

                const pilotInfo = {
                    address: res.collectionAddress,
                    pilotId: res.pilotId.toNumber(),
                    img: img,
                    xp: xp.toNumber(),
                    name: pilotItem.name,
                    owner: owner,
                };
                setActivePilot(pilotInfo);

                sessionStorage.setItem(
                    "activePilot",
                    JSON.stringify({
                        ...sessionPilotObj,
                        [account]: pilotInfo,
                    }),
                );
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
        if (!account || !multiPilotMileageContract || !defaultMultiProvider)
            return;
        handleGetActivePilot();
    }, [account, multiPilotMileageContract, defaultMultiProvider]);

    return { init, activePilot, handleGetActivePilot };
};
