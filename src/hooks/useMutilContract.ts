import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { getAddress } from "@ethersproject/address";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import { Contract, Provider } from "ethers-multicall";

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
    skylabBidTacToeAddress,
    skylabGameFlightRaceTestAddress,
    skylabGameFlightRaceTournamentAddress,
    skylabResourcesAddress,
    skylabResourcesTestAddress,
    skylabTestBidTacToeAddress,
    skylabTestFlightAddress,
    skylabTournamentAddress,
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

export const useMultiSkylabTestFlightContract = (usetest?: boolean) => {
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

export const useMultiSkylabBidTacToeFactoryContract = () => {
    const { chainId } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;

    return useContract(
        chainId &&
            (istest
                ? skylabTestBidTacToeAddress[chainId]
                : skylabBidTacToeAddress[chainId]),
        SKYLABBIDTACTOE_ABI,
    );
};

export const useMultiSkylabBidTacToeGameContract = (address: string) => {
    const { chainId } = useActiveWeb3React();
    return useContract(chainId && address, SKYLABBIDTACTOEGAME_ABI);
};

export const useMultiProvider = () => {
    const { chainId } = useActiveWeb3React();
    const rpcList = randomRpc[chainId];
    const provider = new ethers.providers.JsonRpcProvider(rpcList[0]);
    return useMemo(() => {
        if (!provider) return null;
        return new Provider(provider as any);
    }, [provider]);
};
