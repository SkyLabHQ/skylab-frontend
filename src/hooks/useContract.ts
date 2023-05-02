import { Contract } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABBASE_ABI from "@/constants/abis/SkylabBase.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/constants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/constants/abis/SkylabResources.json";

import useActiveWeb3React from "./useActiveWeb3React";

enum ChainId {
    Mumbai = 80001,
}

const skylabBaseAddress: { [chainId in ChainId]: string } = {
    [ChainId.Mumbai]: "0x755A7B30f516693822a7e254cC0812552FAF882F",
};

const skylabGameFlightRaceAddress: { [chainId in ChainId]: string } = {
    [ChainId.Mumbai]: "0xAe3Efb44FDe5e6c5522d4f99966C5eE1fCAeC23B",
};

const skylabResourcesAddress: { [chainId in ChainId]: string } = {
    [ChainId.Mumbai]: "0xc7CF521D3E33a098c44A03Ee01c2635fd2c8877a",
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
