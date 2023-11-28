import { providers } from "ethers";
import retry from "p-retry";
import timeout from "p-timeout";

export const DEFAULT_MAX_CALL_RETRIES = 8 as const;

export function waitForTransaction(
    provider: providers.JsonRpcProvider,
    txHash: string,
): Promise<providers.TransactionReceipt> {
    return retry(
        async (tries) => {
            console.log(
                `[wait-tx] WAITING ON tx hash: ${txHash} tries ${tries}`,
            );

            try {
                const receipt = await timeout(
                    provider.getTransactionReceipt(txHash),
                    { milliseconds: 30 * 1000 },
                );

                if (receipt) {
                    console.log(
                        `[wait-tx] FINISHED tx hash: ${txHash} tries ${tries}`,
                    );
                    return receipt;
                } else {
                    return Promise.reject(new Error("couldn't get receipt"));
                }
            } catch (e) {
                console.error(
                    `[wait-tx] TIMED OUT tx hash: ${txHash} tries ${tries} error:`,
                    e,
                );
                return Promise.reject(e);
            }
        },
        {
            // TODO: Should we set maxRetryTime?
            retries: DEFAULT_MAX_CALL_RETRIES,
            minTimeout: 2000,
            maxTimeout: 60_000,
            factor: 1.5,
            onFailedAttempt(e) {
                console.log(
                    `[wait-tx] SLEEPING tx hash: ${txHash} tries ${e.attemptNumber} sleeping...`,
                );
            },
        },
    );
}
