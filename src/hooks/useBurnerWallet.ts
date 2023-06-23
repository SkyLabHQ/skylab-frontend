import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "./useActiveWeb3React";
import qs from "query-string";

import {
    getSigner,
    useLocalSigner,
    useSkylabGameFlightRaceContract,
} from "./useContract";

export enum BalanceState {
    ACCOUNT_LACK,
    LACK,
    ENOUTH,
}

export enum ApproveGameState {
    APPROVED,
    NOT_APPROVED,
}

const useBurnerWallet = (tokenId: number) => {
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const { library, account } = useActiveWeb3React();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const burner = useLocalSigner();

    const getBalanceState = useCallback(async () => {
        if (!library || !burner) {
            return;
        }

        const burnerBalance = await library.getBalance(burner.address);
        if (burnerBalance.lt(ethers.utils.parseEther("0.02"))) {
            const balance = await library.getBalance(account);
            if (balance.lt(ethers.utils.parseEther("0.051"))) {
                return BalanceState.ACCOUNT_LACK;
            }
            return BalanceState.LACK;
        }
        return BalanceState.ENOUTH;
    }, [burner, library]);

    const transferGas = useCallback(async () => {
        if (!library || !account || !burner) {
            return;
        }
        const singer = getSigner(library, account);
        const transferResult = await singer.sendTransaction({
            to: burner.address,
            value: ethers.utils.parseEther("0.05"),
        });
        await transferResult.wait();
    }, [library, burner, account]);

    const getApproveGameState = useCallback(async () => {
        if (!skylabGameFlightRaceContract || !tokenId || !burner) {
            return;
        }
        const isApprovedForGame = await skylabGameFlightRaceContract
            .connect(burner)
            .isApprovedForGame(tokenId);

        return isApprovedForGame
            ? ApproveGameState.APPROVED
            : ApproveGameState.NOT_APPROVED;
    }, [skylabGameFlightRaceContract, tokenId, burner]);

    const approveForGame = useCallback(async () => {
        if (!account || !skylabGameFlightRaceContract || !tokenId || !burner) {
            return;
        }
        console.log("start approveForGame");
        const approveResult = await skylabGameFlightRaceContract.approveForGame(
            burner.address,
            tokenId,
        );
        await approveResult.wait();
        console.log("success approveForGame");
    }, [tokenId, burner, account, skylabGameFlightRaceContract]);

    return {
        approveForGame,
        getApproveGameState,
        getBalanceState,
        transferGas,
        burner,
    };
};

export default useBurnerWallet;
