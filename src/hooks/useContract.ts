import { Contract, ethers } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import qs from "query-string";
import useActiveWeb3React from "./useActiveWeb3React";
import { ChainId } from "@/utils/web3Utils";
import { useLocation } from "react-router-dom";

export const skylabTestFlightAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xf893c57bC190bc97990F1f278009CeC0Cb28a492",
};
export const skylabTournamentAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0x962B800863e685562EaB79FE02f9b145BffE5355",
    [ChainId.POLYGON]: "0xc439f052a92736F6d0a474654ab88F737b7bD308", //0xc439f052a92736F6d0a474654ab88F737b7bD308
};

export const skylabGameFlightRaceTestAddress: {
    [chainId in ChainId]?: string;
} = {
    [ChainId.MUMBAI]: "0x6Fa257B58436a60f8F0909EdC2de0a5dF753028a",
};
export const skylabGameFlightRaceTournamentAddress: {
    [chainId in ChainId]?: string;
} = {
    [ChainId.MUMBAI]: "0x6B120220575B3acbB5EA560fC6FaC57b54DE4075",
    [ChainId.POLYGON]: "0x5c931fe359E94B6baF4C215b9169D8F1AcfD6B91", //0x5c931fe359E94B6baF4C215b9169D8F1AcfD6B91
};

export const skylabResourcesTestAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xD7f0794CD14C10d5cfB9dB7544A423F98d111172",
};
export const skylabResourcesAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xC86aA7751E2fF3fAf8C2d05E45198ed59b3dAf13",
    [ChainId.POLYGON]: "0x8C3F11a17FE2f342ed121C81eBE64da3E81D5eef", //0x8C3F11a17FE2f342ed121C81eBE64da3E81D5eef
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

export const useSkylabTestFlightContract = (usetest?: boolean) => {
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
    const istest = params.testflight ? params.testflight === "true" : false;
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
    const istest = params.testflight ? params.testflight === "true" : false;

    return useContract(
        chainId &&
            (istest
                ? skylabResourcesTestAddress[chainId]
                : skylabResourcesAddress[chainId]),
        SKYLABRESOURCES_ABI,
        true,
    );
};
