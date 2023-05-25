import { Contract } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABBASE_ABI from "@/skyConstants/abis/SkylabBase.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";

import useActiveWeb3React from "./useActiveWeb3React";
import { ChainId } from "@/utils/web3Utils";

const skylabBaseAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xe959546968D86d05C4c76c72E160cbD2cc0b281c",
};

const skylabGameFlightRaceAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0x0A122e4cfb79721232d7b1275D535Da952Fd25Cf",
};

const skylabResourcesAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xF0f7a8409cb11bb82e4F3383757447f62C9e970A",
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
