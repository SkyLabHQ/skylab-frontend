import { Contract, ethers } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";

import useActiveWeb3React from "./useActiveWeb3React";
import { ChainId } from "@/utils/web3Utils";

const skylabBaseTestAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xcCc0B9290E27A75425F9A3F0E9d72E17ebdA0D44",
};
const skylabBaseTournamentAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0xe959546968D86d05C4c76c72E160cbD2cc0b281c",
};

const skylabGameFlightRaceTestAddress: { [chainId in ChainId]?: string } = {
    [ChainId.MUMBAI]: "0x424e648159cF9f00c1d2c1826427EaD631C2932c",
};
const skylabGameFlightRaceTournamentAddress: { [chainId in ChainId]?: string } =
    {
        [ChainId.MUMBAI]: "0x33e8F645FEC8CcF1a488267768b0445B5292C39A",
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

export const useSkylabTestFlightContract = (istest?: boolean) => {
    const { chainId } = useActiveWeb3React();

    return useContract(
        chainId &&
            (istest
                ? skylabBaseTestAddress[chainId]
                : skylabBaseTournamentAddress[chainId]),
        SKYLABTESSTFLIGHT_ABI,
        true,
    );
};

export const useSkylabGameFlightRaceContract = (istest?: boolean) => {
    const { chainId } = useActiveWeb3React();

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

    return useContract(
        chainId && skylabResourcesAddress[chainId],
        SKYLABRESOURCES_ABI,
        true,
    );
};
