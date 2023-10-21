import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import { Contract, Provider } from "ethers-multicall";
import MERCURYPILOTS_ABI from "@/skyConstants/abis/MercuryPilots.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import SKYLABBIDTACTOEGAME_ABI from "@/skyConstants/abis/SkylabBidTacToeGame.json";
import SKYLABBIDTACTOE_ABI from "@/skyConstants/abis/SkylabBidTacToe.json";

import qs from "query-string";
import useActiveWeb3React from "./useActiveWeb3React";
import { randomRpc } from "@/utils/web3Utils";
import { useLocation } from "react-router-dom";
import {
    skylabGameFlightRaceTestAddress,
    skylabGameFlightRaceTournamentAddress,
    skylabResourcesAddress,
    skylabResourcesTestAddress,
    skylabBidTacToeAddress,
    skylabTestFlightAddress,
    skylabTournamentAddress,
    mercuryPilotsAddress,
} from "./useContract";
import { ethers } from "ethers";

// returns null on errors
function useContract(address: string | undefined, ABI: any): Contract | null {
    return useMemo(() => {
        if (!address || !ABI) return null;
        try {
            return getContract(address, ABI);
        } catch (error) {
            console.error("Failed to get contract", error);
            return null;
        }
    }, [address, ABI]);
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
export function getContract(address: string, ABI: any): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI);
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

export const useMultiSkylabTestFlightContract = (propChainId?: number) => {
    const { chainId: activeChainId } = useActiveWeb3React();
    const chainId = propChainId || activeChainId;
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;
    return useContract(
        chainId &&
            (istest
                ? skylabTestFlightAddress[chainId]
                : skylabTournamentAddress[chainId]),
        istest ? SKYLABTESSTFLIGHT_ABI : SKYLABTOURNAMENT_ABI,
    );
};

export const useMultiSkylabGameFlightRaceContract = () => {
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
    );
};

export const useMultiSkylabBidTacToeFactoryContract = (
    propChainId?: number,
) => {
    const { chainId: activeChainId } = useActiveWeb3React();
    const chainId = propChainId || activeChainId;

    return useContract(skylabBidTacToeAddress[chainId], SKYLABBIDTACTOE_ABI);
};

export const useMultiSkylabBidTacToeGameContract = (address: string) => {
    return useContract(address, SKYLABBIDTACTOEGAME_ABI);
};

export const getMultiERC721Contract = (address: string) => {
    return getContract(address, SKYLABTESSTFLIGHT_ABI);
};

export const useMultiERC721Contract = (address: string) => {
    return useContract(address, SKYLABTESSTFLIGHT_ABI);
};

export const useMultiMercuryPilotsContract = () => {
    const { chainId } = useActiveWeb3React();
    return useContract(mercuryPilotsAddress[chainId], MERCURYPILOTS_ABI);
};

export const useMultiProvider = (chainId?: number) => {
    return useMemo(() => {
        if (!chainId) return null;
        const rpcList = randomRpc[chainId];
        const provider = new ethers.providers.JsonRpcProvider(rpcList[0]);
        return new Provider(provider as any, chainId);
    }, [chainId]);
};

export const getMultiProvider = (chainId: number) => {
    const rpcList = randomRpc[chainId];
    const provider = new ethers.providers.JsonRpcProvider(rpcList[0]);
    return new Provider(provider, chainId);
};
