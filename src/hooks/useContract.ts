import { Contract } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABBASE_ABI from "@/skyConstants/abis/SkylabBase.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";

import useActiveWeb3React from "./useActiveWeb3React";

enum ChainId {
    Mumbai = 80001,
}

const skylabBaseAddress: { [chainId in ChainId]: string } = {
    [ChainId.Mumbai]: "0xEd805b1d92822416664b78b2f0d1727Aa89c36c6",
};

const skylabGameFlightRaceAddress: { [chainId in ChainId]: string } = {
    [ChainId.Mumbai]: "0xCe09B910c5D1Ac8D8C9f855f02892E5135b16120",
};

const skylabResourcesAddress: { [chainId in ChainId]: string } = {
    [ChainId.Mumbai]: "0xEE3286998781E390aDFfC9E37c01C9EF2293609c",
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

export const useSkylabBaseContract = () => {
    const { chainId } = useActiveWeb3React();

    return useContract(
        chainId && skylabBaseAddress[chainId],
        SKYLABBASE_ABI,
        true,
    );
};

export const useSkylabGameFlightRaceContract = () => {
    const { chainId } = useActiveWeb3React();

    return useContract(
        chainId && skylabGameFlightRaceAddress[chainId],
        SKYLABGAMEFLIGHTRACE_ABI,
        true,
    );
};

export const useSkylabResourcesContract = () => {
    const { chainId } = useActiveWeb3React();

    return useContract(
        chainId && skylabResourcesAddress[chainId],
        SKYLABRESOURCES_ABI,
        true,
    );
};
