import { Mutex } from "async-mutex";
import { ethers } from "ethers";

const NONCE_STALE_AFTER_MS = 10_000;

class NonceManager {
    private nonceMutex: Mutex;
    private nonce: number | undefined = undefined;
    private lastTransactionTimestamp = 0;

    constructor() {
        this.lastTransactionTimestamp = Date.now();
        this.nonceMutex = new Mutex();
    }

    public async resetNonce() {
        await this.nonceMutex.runExclusive(() => {
            this.nonce = undefined;
        });
    }

    public async getNonce(
        provider: ethers.providers.JsonRpcProvider,
        address: string,
    ) {
        const releaseMutex = await this.nonceMutex.acquire();

        const shouldRefreshNonce =
            this.nonce === undefined ||
            Date.now() - this.lastTransactionTimestamp > NONCE_STALE_AFTER_MS;

        if (shouldRefreshNonce) {
            try {
                const chainNonce = await provider.getTransactionCount(address);
                const localNonce = this.nonce || 0;

                this.nonce = Math.max(chainNonce, localNonce);
            } finally {
                releaseMutex(); // 释放锁
            }
        }

        const newNonce = this.nonce;
        if (this.nonce !== undefined) this.nonce++;

        releaseMutex();

        return newNonce;
    }
}

export default NonceManager;
