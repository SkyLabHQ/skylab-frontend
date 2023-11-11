import { Contract, ethers } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";

import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import SKYLABBIDTACTOE_ABI from "@/skyConstants/abis/SkylabBidTacToe.json";
import MERCURYPILOTS_ABI from "@/skyConstants/abis/MercuryPilots.json";
import SKYLABBIDTACTOEGAME_ABI from "@/skyConstants/abis/SkylabBidTacToeGame.json";
import BABYMERCS_ABI from "@/skyConstants/abis/BabyMercs.json";
import DELEGATEERC721_ABI from "@/skyConstants/abis/DelegateERC721.json";

import qs from "query-string";
import useActiveWeb3React from "./useActiveWeb3React";
import { ChainId } from "@/utils/web3Utils";
import { useLocation } from "react-router-dom";

type ChainIdToAddressMap = { [chainId in ChainId]?: string };

export const skylabTestFlightAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x505b66109a1112dB5DF85884aB75F28A258d755b",
};
export const skylabTournamentAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x12CAc51DD11aa2C3f20A2855b454553D73a293d7",
    [ChainId.POLYGON]: "0xb806EFDba9DB957b5960B7a58b5F7d57187dFF17",
};

export const skylabGameFlightRaceTestAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x6Fa257B58436a60f8F0909EdC2de0a5dF753028a",
};
export const skylabGameFlightRaceTournamentAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x6B120220575B3acbB5EA560fC6FaC57b54DE4075",
    [ChainId.POLYGON]: "0x71F676D892fBcf1e6ac61a7bDf62be105f8505E6", //0x5c931fe359E94B6baF4C215b9169D8F1AcfD6B91
};

export const skylabResourcesTestAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x2cCee5bbA7BC5DF4972b6a07f394aFE38826d932",
};
export const skylabResourcesAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0xC86aA7751E2fF3fAf8C2d05E45198ed59b3dAf13",
    [ChainId.POLYGON]: "0x16dd2704c8adcbddc6c12dbf26289e0407d75139", //0x8C3F11a17FE2f342ed121C81eBE64da3E81D5eef
};

export const skylabBidTacToeAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x89e61F9dCa2336a67d9131ad094f2202913c577d",
    [ChainId.POLYGON]: "0xb0D5AB79F5A0e6023861e45692C66BC0B87f1658",
};

export const mercuryPilotsAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x3a2e43c675F4da9aF823366261697d9efEFF2447",
    [ChainId.POLYGON]: "0xe13013cBCc3ee016e020544B691882A14Bdf3ee9",
};

export const babyMercsAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x5aeA85A1469D5CCAaeE0Da6e92E39A9F65b30bf9",
    [ChainId.POLYGON]: "0x7F37F3bb0610410189C792bab5C8a94bff880E04",
};

export const delegateERC721Address: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x940d94B2af1718dD284BDcBc2264e97e97C12F93",
    [ChainId.POLYGON]: "0xc058fd46391f69758434B49AA17073eD00F17D8C",
    [ChainId.ETHEREUM]: "0xc6B4AF6B7C944a4C43755b83753D292Ac3447b19",
};

export const pilotMileageAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0xBAA0aD275a12e0b1b887497103884E5474286D2d",
    [ChainId.POLYGON]: "0x743AC85caf73DcB362951658421116809A299b53",
};

export const pilotNetPointsAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x3C41918442e54A4e8ece229BCE0e3320f8068b6b",
    [ChainId.POLYGON]: "0x44A4ee1bD559A55398f8533C8c8848032Ef44305",
};

export const pilotWinStreakAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0xd28A68A83d3F9F511DD058eC96B806D255764d07",
    [ChainId.POLYGON]: "0xdf2b732D9fafA6D306a905b3B5BDB385280bd6a3",
};

export const botAddress: ChainIdToAddressMap = {
    [ChainId.MUMBAI]: "0x990958391330E96Febdb13E5C7F66559a1fa18B4",
    [ChainId.POLYGON]: "0xf2554f111dDB0617A3398e86E9393fE552A106ac",
};

// returns null on errors
function useContract(
    address: string | undefined,
    ABI: any,
    withSignerIfPossible = true,
): Contract | null {
    const { library, account } = useActiveWeb3React();
    return useMemo(() => {
        if (!address || !ABI || !library) return null;
        try {
            return getContract(
                address,
                ABI,
                library,
                withSignerIfPossible && account ? account : undefined,
            );
        } catch (error) {
            console.error("Failed to get contract", error);
            return null;
        }
    }, [address, ABI, library, withSignerIfPossible, account]);
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}
// account is optional
export function getContract(
    address: string,
    ABI: any,
    library: Web3Provider,
    account?: string,
): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(
        address,
        ABI,
        getProviderOrSigner(library, account) as any,
    );
}
// account is optional
export function getProviderOrSigner(
    library: Web3Provider,
    account?: string,
): Web3Provider | JsonRpcSigner {
    return account ? getSigner(library, account) : library;
}
// account is not optional
export function getSigner(
    library: Web3Provider,
    account: string,
): JsonRpcSigner {
    return library.getSigner(account).connectUnchecked();
}

// 获取本地私钥账户
export function useLocalSigner(): ethers.Wallet {
    const { library } = useActiveWeb3React();

    const owner = useMemo(() => {
        if (!library) return null;
        let privateKey = localStorage.getItem("privateKey");
        if (!privateKey) {
            // 随机创建一个私钥账户
            const randomAccount = ethers.Wallet.createRandom();
            localStorage.setItem("privateKey", randomAccount.privateKey);
            privateKey = randomAccount.privateKey;
        }
        const owner = new ethers.Wallet(privateKey, library);
        return owner;
    }, [library]);
    return owner;
}

export const useMercuryBaseContract = (usetest?: boolean) => {
    const { chainId } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = usetest
        ? usetest
        : params.testflight
        ? params.testflight === "true"
        : false;
    return useContract(
        chainId &&
            (istest
                ? skylabTestFlightAddress[chainId]
                : skylabTournamentAddress[chainId]),
        istest ? SKYLABTESSTFLIGHT_ABI : SKYLABTOURNAMENT_ABI,
        true,
    );
};

export const useSkylabGameFlightRaceContract = () => {
    const { chainId } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight === "true";
    return useContract(
        chainId &&
            (istest
                ? skylabGameFlightRaceTestAddress[chainId]
                : skylabGameFlightRaceTournamentAddress[chainId]),
        SKYLABGAMEFLIGHTRACE_ABI,
        true,
    );
};

export const useSkylabResourcesContract = () => {
    const { chainId } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight === "true";
    return useContract(
        chainId &&
            (istest
                ? skylabResourcesTestAddress[chainId]
                : skylabResourcesAddress[chainId]),
        SKYLABRESOURCES_ABI,
        true,
    );
};

export const useSkylabBidTacToeContract = (useSigner: boolean = true) => {
    const { chainId } = useActiveWeb3React();
    return useContract(
        skylabBidTacToeAddress[chainId],
        SKYLABBIDTACTOE_ABI,
        useSigner,
    );
};

export const useMercuryPilotsContract = () => {
    const { chainId } = useActiveWeb3React();
    return useContract(mercuryPilotsAddress[chainId], MERCURYPILOTS_ABI);
};

export const useDelegateERC721Contract = () => {
    const { chainId } = useActiveWeb3React();
    return useContract(delegateERC721Address[chainId], DELEGATEERC721_ABI);
};

export const useBabyMercsContract = () => {
    const { chainId } = useActiveWeb3React();
    return useContract(babyMercsAddress[chainId], BABYMERCS_ABI);
};

export const useSkylabBidTacToeGameContract = (address: string) => {
    const { chainId } = useActiveWeb3React();
    return useContract(chainId && address, SKYLABBIDTACTOEGAME_ABI, true);
};
