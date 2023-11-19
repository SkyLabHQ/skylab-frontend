import { Contract, ethers, Wallet } from "ethers";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "./useActiveWeb3React";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import retry from "p-retry";

import {
    skylabGameFlightRaceTestAddress,
    skylabGameFlightRaceTournamentAddress,
    skylabResourcesAddress,
    skylabResourcesTestAddress,
    skylabTestFlightAddress,
    skylabTournamentAddress,
    useLocalSigner,
    useSkylabBidTacToeContract,
    useSkylabBidTacToeGameContract,
} from "./useContract";
import { calculateGasMargin, randomRpc } from "@/utils/web3Utils";
import useFeeData from "./useFeeData";
import qs from "query-string";
import { useTacToeSigner } from "./useSigner";
import NonceManager from "@/utils/nonceManager";
import { waitForTransaction } from "@/utils/web3Network";
import { AddressZero } from "@ethersproject/constants";
import { isAddress } from "@/utils/isAddress";

const nonceManager = new NonceManager();

export function getContractWithSigner(address: string, ABI: any, signer: any) {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }

    return new Contract(address, ABI, signer);
}

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
                    const rpcList = randomRpc[chainId];
                    const provider = new ethers.providers.JsonRpcProvider(
                        rpcList[0],
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

// retry once when call contract error
export const useRetryContractCall = () => {
    const { chainId, library } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight === "true";
    const burner = useLocalSigner();

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
                    const rpcList = randomRpc[chainId];
                    const provider = new ethers.providers.JsonRpcProvider(
                        rpcList[0],
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

// retry once when write contract error
export const useBurnerContractCall = () => {
    const { getFeeData } = useFeeData();

    const { chainId, library } = useActiveWeb3React();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const burner = useLocalSigner();
    const istest = params.testflight === "true";
    const bCall = async (
        contractName: any,
        method: string,
        args: any[],
        callBack?: () => void,
    ) => {
        const rpcList = randomRpc[chainId];
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
                    rpcList[0],
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

export const useBidTacToeFactoryRetry = (
    tokenId?: number,
    propTestflight: boolean = false,
) => {
    const [signer] = useTacToeSigner(tokenId, propTestflight);
    const contract = useSkylabBidTacToeContract();
    const tacToeFactoryRetryWrite = useBurnerRetryContract(contract, signer);

    return tacToeFactoryRetryWrite;
};

export const useBurnerRetryContract = (contract: Contract, signer?: Wallet) => {
    const { chainId } = useActiveWeb3React();
    return useCallback(
        async (
            method: string,
            args: any[],
            overrides: {
                gasLimit?: number;
                signer?: any;
            } = {},
        ) => {
            const { gasLimit, signer: overridsSigner } = overrides;
            const rpcList = randomRpc[chainId];
            const provider = new ethers.providers.JsonRpcProvider(rpcList[0]);
            const newSigner = overridsSigner ? overridsSigner : signer;
            const address = await newSigner.getAddress();

            return retry(
                async (tries) => {
                    let res;
                    try {
                        const gasPrice = await provider.getGasPrice();
                        console.log(`tries ${tries}  ${method} start`);

                        const gas = await contract
                            .connect(newSigner)
                            .estimateGas[method](...args);
                        const nonce = await nonceManager.getNonce(
                            provider,
                            address,
                        );

                        res = await contract
                            .connect(newSigner)
                            [method](...args, {
                                nonce,
                                gasPrice: gasPrice.mul(120).div(100),
                                gasLimit:
                                    gasLimit && gasLimit > gas.toNumber()
                                        ? gasLimit
                                        : calculateGasMargin(gas),
                            });

                        console.log(res);
                        const receipt = await waitForTransaction(
                            provider,
                            res.hash,
                        );

                        if (receipt.status === 0) {
                            throw new Error("Transaction failed");
                        }
                        console.log(`tries ${tries} ${method} success`);

                        return res;
                    } catch (e) {
                        console.log(
                            `tries ${tries} write method ${method} error`,
                            e,
                        );
                        nonceManager.resetNonce(address);
                        return Promise.reject(e);
                    }
                },
                {
                    // TODO: Should we set maxRetryTime?
                    retries: 0,
                    onFailedAttempt(e) {
                        console.log(`tries ${e.attemptNumber}`);
                    },
                },
            );
        },
        [chainId, contract, signer],
    );
};

export const useBidTacToeGameRetry = (address: string, tokenId?: number) => {
    const [signer] = useTacToeSigner(tokenId);
    const contract = useSkylabBidTacToeGameContract(address);
    const tacToeGameRetryWrite = useBurnerRetryContract(contract, signer);

    if (!signer) {
        return null;
    }

    return tacToeGameRetryWrite;
};

export default useBurnerContractCall;
