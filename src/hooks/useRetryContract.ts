import { Contract, ethers, Wallet } from "ethers";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "./useActiveWeb3React";
import SKYLABTESSTFLIGHT_ABI from "@/skyConstants/abis/SkylabTestFlight.json";
import SKYLABTOURNAMENT_ABI from "@/skyConstants/abis/SkylabTournament.json";
import SKYLABGAMEFLIGHTRACE_ABI from "@/skyConstants/abis/SkylabGameFlightRace.json";
import SKYLABRESOURCES_ABI from "@/skyConstants/abis/SkylabResources.json";
import retry from "p-retry";
import PQueue from "p-queue";

const MethodPriority = {
    commitBid: 10,
    revealBid: 10,
    setMessage: 0,
    setEmote: 0,
    claimTimeoutPenalty: 100,
    surrender: 10,
};

const queue = new PQueue({
    concurrency: 1,
});

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
import {
    calculateGasMargin,
    getRandomProvider,
    randomRpc,
} from "@/utils/web3Utils";
import useFeeData from "./useFeeData";
import qs from "query-string";
import { useTacToeSigner } from "./useSigner";
import NonceManager from "@/utils/nonceManager";
import { waitForTransaction } from "@/utils/web3Network";
import { AddressZero } from "@ethersproject/constants";
import { isAddress } from "@/utils/isAddress";
import { getSCWallet } from "./useSCWallet";

const nonceManager = new NonceManager();

function hex_to_ascii(str1: string) {
    var hex = str1.toString();
    var str = "";
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

export async function getReason(provider: any, hash: string) {
    let tx = await provider.getTransaction(hash);
    if (!tx) {
        console.log("tx not found");
    } else {
        let code = await provider.call(
            { to: tx.to, data: tx.data, value: tx.value },
            tx.blockNumber,
        );
        let reason = hex_to_ascii(code.substr(138));
        console.log("revert reason:", reason);
        return reason;
    }
}

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

const iface = new ethers.utils.Interface([
    "event UserOperationRevertReason(bytes32 indexed userOpHash, address indexed sender, uint256 nonce, bytes revertReason);",
    "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed);",
]);

const topic0RevertReason = iface.getEventTopic("UserOperationRevertReason");

const topic0Event = iface.getEventTopic("UserOperationEvent");

export const useBurnerRetryContract = (contract: Contract, signer?: Wallet) => {
    const { chainId } = useActiveWeb3React();
    return useCallback(
        async (
            method: string,
            args: any[],
            overrides: {
                gasLimit?: number;
                signer?: any;
                usePaymaster?: boolean;
            } = {},
        ) => {
            const {
                gasLimit,
                signer: overridsSigner,
                usePaymaster,
            } = overrides;
            const provider = getRandomProvider(chainId);
            const newSigner = overridsSigner ? overridsSigner : signer;
            const address = await newSigner.getAddress();

            return retry(
                async (tries) => {
                    if (usePaymaster) {
                        const { sCWSigner, sCWAddress } = await getSCWallet(
                            newSigner.privateKey,
                        );
                        const hash = await queue.add(
                            async () => {
                                console.log(`tries ${tries} ${method} start`);
                                return await sCWSigner.sendTransaction({
                                    from: sCWAddress as `0x${string}`,
                                    to: contract.address as `0x${string}`,
                                    data: contract.interface.encodeFunctionData(
                                        method,
                                        args,
                                    ) as `0x${string}`,
                                });
                            },
                            {
                                priority: MethodPriority[method] || 1,
                            },
                        );

                        console.log(
                            `tries ${tries} use paymaster receipt hash: ${hash}`,
                        );

                        const receipt = await waitForTransaction(
                            provider,
                            hash,
                        );

                        console.log(receipt);
                        const operateLog = receipt.logs.find((log) => {
                            return log.topics[0] === topic0Event;
                        });

                        if (operateLog) {
                            const operateData = iface.parseLog({
                                data: operateLog.data,
                                topics: operateLog.topics,
                            });

                            const success = operateData.args.success;

                            if (!success) {
                                const errorLog = receipt.logs.find((log) => {
                                    return log.topics[0] === topic0RevertReason;
                                });

                                console.log(errorLog, "errorLog");

                                if (!errorLog) {
                                    throw new Error("Transaction failed");
                                }
                                const errorData = iface.parseLog({
                                    data: errorLog.data,
                                    topics: errorLog.topics,
                                });

                                const revertReason =
                                    errorData.args.revertReason;
                                console.log(revertReason, "");
                                const revertBytes =
                                    ethers.utils.arrayify(revertReason);

                                // 解析错误消息
                                const errorMessage =
                                    ethers.utils.defaultAbiCoder.decode(
                                        ["string"],
                                        ethers.utils.hexDataSlice(
                                            revertBytes,
                                            4,
                                        ),
                                    )[0];

                                throw new Error(errorMessage);
                            }
                        }

                        console.log(`tries ${tries} ${method} success`);

                        return receipt;
                    } else {
                        console.log(`tries ${tries} ${method} start`);

                        let res;
                        try {
                            const gasPrice = await provider.getGasPrice();

                            const nonce = await nonceManager.getNonce(
                                provider,
                                address,
                            );
                            const gas = await contract
                                .connect(newSigner)
                                .estimateGas[method](...args);

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

                            const receipt = await waitForTransaction(
                                provider,
                                res.hash,
                            );

                            console.log(receipt, "receipt");

                            if (receipt.status === 0) {
                                const reason = await getReason(
                                    provider,
                                    res.hash,
                                );

                                if (reason) {
                                    throw new Error(reason);
                                }

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
                    }
                },
                {
                    retries: 1,
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
