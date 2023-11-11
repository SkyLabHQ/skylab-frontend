import { Mutex } from "async-mutex";
import { ethers } from "ethers";
import getNowSecondsTimestamp from "./nowTime";

const NONCE_STALE_AFTER_MS = 10_000;

interface AccountNonce {
    [key: string]: number;
}

class NonceManager {
    private nonceMutex: Mutex;
    private nonce: AccountNonce = {};
    private lastTransactionTimestamp = 0;

    constructor() {
        this.lastTransactionTimestamp = Date.now();
        this.nonceMutex = new Mutex();
    }

    public async resetNonce(address: string) {
        await this.nonceMutex.runExclusive(() => {
            this.nonce[address] = undefined;
        });
    }

    public async getNonce(
        provider: ethers.providers.JsonRpcProvider,
        address: string,
    ) {
        const releaseMutex = await this.nonceMutex.acquire();

        const shouldRefreshNonce =
            this.nonce[address] === undefined ||
            getNowSecondsTimestamp() - this.lastTransactionTimestamp >
                NONCE_STALE_AFTER_MS;

        if (shouldRefreshNonce) {
            try {
                const chainNonce = await provider.getTransactionCount(address);
                const localNonce = this.nonce[address] ?? 0;

                this.nonce[address] = Math.max(chainNonce, localNonce);
            } finally {
                releaseMutex(); // 释放锁
            }
        }

        const newNonce = this.nonce[address];
        if (this.nonce[address] !== undefined) this.nonce[address]++;

        releaseMutex();

        return newNonce;
    }

    public async getSingerNonce(singer: ethers.Wallet) {
        const address = await singer.getAddress();
        const releaseMutex = await this.nonceMutex.acquire();

        const shouldRefreshNonce =
            this.nonce[address] === undefined ||
            getNowSecondsTimestamp() - this.lastTransactionTimestamp >
                NONCE_STALE_AFTER_MS;

        if (shouldRefreshNonce) {
            try {
                const chainNonce = await singer.getTransactionCount();
                const localNonce = this.nonce[address] ?? 0;

                this.nonce[address] = Math.max(chainNonce, localNonce);
            } finally {
                releaseMutex(); // 释放锁
            }
        }

        const newNonce = this.nonce[address];
        if (this.nonce[address] !== undefined) this.nonce[address]++;

        releaseMutex();

        return newNonce;
    }
}

export default NonceManager;
