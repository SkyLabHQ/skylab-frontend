import {
    LightSmartContractAccount,
    getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import {
    AlchemyProvider,
    withAlchemyGasFeeEstimator,
} from "@alchemy/aa-alchemy";
import {
    Deferrable,
    LocalAccountSigner,
    SmartAccountSigner,
    createPublicErc4337Client,
    getDefaultEntryPointAddress,
    deepHexlify,
} from "@alchemy/aa-core";
import { baseGoerli } from "viem/chains";
import { toHex } from "viem";
import { ethers } from "ethers";

const chain = baseGoerli;
export const withAlchemyGasEstimator = (
    provider: AlchemyProvider,
): AlchemyProvider => {
    provider.withGasEstimator(async (struct: any) => {
        const request = deepHexlify(await resolveProperties(struct));
        const estimates = await provider.rpcClient.estimateUserOperationGas(
            request,
            provider.getEntryPointAddress(),
        );

        struct.callGasLimit = ethers.BigNumber.from(estimates.callGasLimit)
            .add(ethers.BigNumber.from(100000))
            .toHexString();
        struct.verificationGasLimit = estimates.verificationGasLimit;
        struct.preVerificationGas = estimates.preVerificationGas;

        return {
            ...struct,
        };
    });
    return provider;
};

async function resolveProperties<T>(object: Deferrable<T>): Promise<T> {
    const promises = Object.keys(object).map((key) => {
        const value = object[key as keyof Deferrable<T>];
        return Promise.resolve(value).then((v) => ({ key: key, value: v }));
    });

    const results = await Promise.all(promises);

    return results.reduce((accum, curr) => {
        accum[curr.key as keyof T] = curr.value;
        return accum;
    }, {} as T);
}

const rpcUrl =
    "https://base-goerli.g.alchemy.com/v2/vDX2uQbv3DcZEeQxXEnymi3dqUwRvXQd";

export const getSCWallet = async (privateKey: string) => {
    const owner: SmartAccountSigner =
        LocalAccountSigner.privateKeyToAccountSigner(
            privateKey as `0x${string}`,
        );

    const baseSigner = new AlchemyProvider({
        rpcUrl,
        chain,
        opts: {
            txMaxRetries: 60,
        },
    }).connect((provider) => {
        return new LightSmartContractAccount({
            chain,
            owner: owner,
            entryPointAddress: getDefaultEntryPointAddress(chain),
            factoryAddress: getDefaultLightAccountFactoryAddress(chain),
            rpcClient: provider,
        });
    });

    const smartAccountAddress = await baseSigner.getAddress();

    const dummyPaymasterDataMiddleware = async (uoStruct: any) => {
        // Return an object like {paymasterAndData: "0x..."} where "0x..." is the valid paymasterAndData for your paymaster contract (used in gas estimation)
        // You can even hardcode these dummy singatures
        // You can read up more on dummy signatures here: https://www.alchemy.com/blog/dummy-signatures-and-gas-token-transfers
        // console.log("dummy paymaster for gas estimate", uoStruct);
        const params1: any = await resolveProperties(uoStruct);
        // console.log("params1", params1);

        const body = {
            id: 1,
            jsonrpc: "2.0",
            method: "eth_paymasterAndDataForUserOperation",
            params: [
                {
                    ...params1,
                    nonce: toHex(Number(params1.nonce)),
                    sender: smartAccountAddress,
                    callGasLimit: "0x0",
                    preVerificationGas: "0x0",
                    verificationGasLimit: "0x0",
                    maxFeePerGas: "0x0",
                    maxPriorityFeePerGas: "0x0",
                },
                baseSigner.getEntryPointAddress(),
                toHex(chain.id),
            ],
        };

        const response = await fetch("https://paymaster.base.org", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        // console.log("response", data);

        return {
            paymasterAndData: data.result,
        };
    };

    // Define the PaymasterDataMiddlewareOverrideFunction
    const paymasterDataMiddleware = async (uoStruct: any) => {
        // Return at minimum {paymasterAndData: "0x..."}, can also return gas estimates
        // console.log("final paymaster", uoStruct);

        const params1: any = await resolveProperties(uoStruct);
        // console.log("params1", params1);
        const body = {
            id: 1,
            jsonrpc: "2.0",
            method: "eth_paymasterAndDataForUserOperation",
            params: [
                {
                    ...params1,
                    nonce: toHex(Number(params1.nonce)),
                    sender: smartAccountAddress,
                    callGasLimit: toHex(Number(params1.callGasLimit)),
                    preVerificationGas: toHex(
                        Number(params1.preVerificationGas),
                    ),
                    verificationGasLimit: toHex(
                        Number(params1.verificationGasLimit),
                    ),
                    maxFeePerGas: toHex(Number(params1.maxFeePerGas)),
                    maxPriorityFeePerGas: toHex(
                        Number(params1.maxPriorityFeePerGas),
                    ),
                },
                baseSigner.getEntryPointAddress(),
                toHex(chain.id),
            ],
        };

        const response = await fetch("https://paymaster.base.org", {
            method: "post",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        // console.log("response", data);

        return {
            paymasterAndData: data.result,
        };
    };

    const signer = withAlchemyGasFeeEstimator(baseSigner, 50n, 50n);

    const signer2 = withAlchemyGasEstimator(signer);

    // Integrate the dummy paymaster data middleware and paymaster data middleware middleware with the provider
    const smartAccountSigner = signer2.withPaymasterMiddleware({
        dummyPaymasterDataMiddleware,
        paymasterDataMiddleware,
    });

    const client = createPublicErc4337Client({
        chain,
        rpcUrl,
    });

    return {
        sCWSigner: smartAccountSigner,
        sCWClient: client,
        sCWAddress: smartAccountAddress,
    };
};
