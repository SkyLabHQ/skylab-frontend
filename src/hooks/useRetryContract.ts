import { Contract, ethers } from "ethers";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "./useActiveWeb3React";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import {
    skylabGameFlightRaceTestAddress,
    skylabGameFlightRaceTournamentAddress,
    skylabResourcesAddress,
    skylabResourcesTestAddress,
    skylabTestFlightAddress,
    skylabTournamentAddress,
    useLocalSigner,
} from "./useContract";
import { calculateGasMargin, ChainId, RPC_URLS } from "@/utils/web3Utils";
import useFeeData from "./useFeeData";
import qs from "query-string";

const getSkylabTestFlightContract = (
    provider: any,
    chainId: number,
    istest: boolean,
) => {
    return new Contract(
        chainId &&
            (istest
                ? skylabTestFlightAddress[chainId]
                : skylabTournamentAddress[chainId]),
        istest ? SKYLABTESSTFLIGHT_ABI : SKYLABTOURNAMENT_ABI,
        provider,
    );
};

const getSkylabGameFlightRaceContract = (
    provider: any,
    chainId: number,
    istest: boolean,
) => {
    return new Contract(
        chainId &&
            (istest
                ? skylabGameFlightRaceTestAddress[chainId]
                : skylabGameFlightRaceTournamentAddress[chainId]),
        SKYLABGAMEFLIGHTRACE_ABI,
        provider,
    );
};

export const wait = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const getSkylabResourcesContract = (
    provider: any,
    chainId: number,
    istest: boolean,
) => {
    return new Contract(
        chainId &&
            (istest
                ? skylabResourcesTestAddress[chainId]
                : skylabResourcesAddress[chainId]),
        SKYLABRESOURCES_ABI,
        provider,
    );
};

export enum ContractType {
    TOURNAMENT = "TOURNAMENT",
    RESOURCES = "RESOURCES",
    RACETOURNAMENT = "RACETOURNAMENT",
}

const contractMap = {
    [ContractType.TOURNAMENT]: getSkylabTestFlightContract,
    [ContractType.RESOURCES]: getSkylabResourcesContract,
    [ContractType.RACETOURNAMENT]: getSkylabGameFlightRaceContract,
};

export const useRetryBalanceCall = () => {
    const { chainId, library } = useActiveWeb3React();
    const balanceCall = useCallback(
        async (address: string) => {
            if (!chainId || !library) return;
            let error = null;
            try {
                const res = await library.getBalance(address);
                return res;
            } catch (e) {
                error = e;
                console.log("the first time call balance error", e);
            }

            if (error) {
                try {
                    console.log("try to use local rpc");
                    await wait(1000);
                    const rpcList = RPC_URLS[chainId];
                    const provider = new ethers.providers.JsonRpcProvider(
                        rpcList[1],
                    );
                    const res = await provider.getBalance(address);
                    return res;
                } catch (e) {
                    console.log("the local rpc call balance error", e);
                    throw e;
                }
            }
        },
        [chainId, library],
    );
    return balanceCall;
};

export const useRetryContractCall = (propChainId?: number) => {
    const { chainId: activeChainId, library } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;
    const burner = useLocalSigner();
    const chainId = propChainId ? propChainId : activeChainId;

    const rCall = useCallback(
        async (
            contractName: any,
            method: string,
            args: any[],
            useBurner?: boolean,
        ) => {
            if (!chainId || !library) return;
            let error = null;
            try {
                let contract = contractMap[contractName](
                    library,
                    chainId,
                    istest,
                );
                if (useBurner) {
                    contract = contract.connect(burner);
                }
                const res = await contract[method](...args);
                return res;
            } catch (e) {
                error = e;
                console.log(`the first time call method ${method} error`, e);
            }

            if (error) {
                try {
                    console.log("try to use local rpc");
                    await wait(1000);
                    const rpcList = RPC_URLS[chainId];
                    const provider = new ethers.providers.JsonRpcProvider(
                        rpcList[1],
                    );
                    let contract = contractMap[contractName](
                        provider,
                        chainId,
                        istest,
                    );
                    if (useBurner) {
                        contract = contract.connect(burner);
                    }
                    const res = await contract[method](...args);
                    return res;
                } catch (e) {
                    console.log(
                        `the local rpc call method  ${method} error`,
                        e,
                    );
                    throw e;
                }
            }
        },
        [chainId, library],
    );

    return rCall;
};

export const useBurnerContractCall = () => {
    const { getFeeData } = useFeeData();

    const { chainId, library } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const burner = useLocalSigner();
    const istest = params.testflight ? params.testflight === "true" : false;

    const bCall = async (
        contractName: any,
        method: string,
        args: any[],
        callBack?: () => void,
    ) => {
        const rpcList = RPC_URLS[chainId];
        let error = null;
        if (!chainId || !library) {
            return;
        }
        try {
            const contract = contractMap[contractName](
                library,
                chainId,
                istest,
            );
            const feeData = await getFeeData();

            const gas = await contract
                .connect(burner)
                .estimateGas[method](...args);
            callBack?.();
            const res = await contract.connect(burner)[method](...args, {
                gasLimit: calculateGasMargin(gas),
                ...feeData,
            });
            await res.wait();
            return res;
        } catch (e) {
            error = e;
            console.log(`the first time write method ${method} error`, e);
        }

        if (error) {
            try {
                console.log("try to use local rpc");
                await wait(3000);
                const provider = new ethers.providers.JsonRpcProvider(
                    rpcList[1],
                );
                const contract = contractMap[contractName](
                    provider,
                    chainId,
                    istest,
                );

                const feeData = await getFeeData();
                const gas = await contract
                    .connect(burner)
                    .estimateGas[method](...args);
                callBack?.();
                const res = await contract.connect(burner)[method](...args, {
                    gasLimit: calculateGasMargin(gas),
                    ...feeData,
                });
                await res.wait();
                return res;
            } catch (e) {
                console.log(`the local rpc write method ${method} error`, e);
                throw e;
            }
        }
    };

    return bCall;
};

export default useBurnerContractCall;
