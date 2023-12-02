import { Contract, ethers } from "ethers";
import { useMemo } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABBIDTACTOE_ABI from "@/skyConstants/abis/SkylabBidTacToe.json";
import MERCURYPILOTS_ABI from "@/skyConstants/abis/MercuryPilots.json";
import SKYLABBIDTACTOEGAME_ABI from "@/skyConstants/abis/SkylabBidTacToeGame.json";
import BABYMERCS_ABI from "@/skyConstants/abis/BabyMercs.json";

import qs from "query-string";
import useActiveWeb3React from "./useActiveWeb3React";
import {
    ChainId,
    getRandomProvider,
    TESTFLIGHT_CHAINID,
} from "@/utils/web3Utils";
import { useLocation } from "react-router-dom";
import { isAddress } from "@/utils/isAddress";
import { skylabBidTacToeAddress } from "./useContract";

// account is optional
export function getContract(address: string, ABI: any): Contract {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI);
}
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

export const useBurnerSkylabBidTacToeContract = (istest: boolean = false) => {
    const { chainId: activeChainId } = useActiveWeb3React();
    const chainId = istest ? TESTFLIGHT_CHAINID : activeChainId;
    return useContract(
        skylabBidTacToeAddress[istest ? chainId : TESTFLIGHT_CHAINID],
        SKYLABBIDTACTOE_ABI,
    );
};

export const useBurnerSkylabBidTacToeGameContract = (address: string) => {
    return useContract(address, SKYLABBIDTACTOEGAME_ABI);
};
