import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";

export const useTacToeSigner = (
    tokenId: number,
): [ethers.Wallet, () => void] => {
    const { chainId } = useActiveWeb3React();

    const singer = useMemo(() => {
        if (!tokenId || !chainId) {
            return null;
        }
        let stringPrivateKey = localStorage.getItem("tactoePrivateKey");
        let objPrivateKey;
        try {
            objPrivateKey = stringPrivateKey
                ? JSON.parse(stringPrivateKey)
                : {};
        } catch (e) {
            objPrivateKey = {};
        }
        const key = chainId + "-" + tokenId;

        console.log(objPrivateKey, "objPrivateKey");
        if (!objPrivateKey[key]) {
            // 随机创建一个私钥账户
            const randomAccount = ethers.Wallet.createRandom();
            objPrivateKey[key] = randomAccount.privateKey;
            localStorage.setItem(
                "tactoePrivateKey",
                JSON.stringify(objPrivateKey),
            );
        }
        return new ethers.Wallet(objPrivateKey[key]);
    }, [tokenId, chainId]);

    const deleteSigner = useCallback(() => {
        if (!tokenId || !chainId) {
            return null;
        }
        let stringPrivateKey = localStorage.getItem("tactoePrivateKey");
        let objPrivateKey;
        try {
            objPrivateKey = JSON.parse(stringPrivateKey);
        } catch (e) {
            objPrivateKey = {};
        }
        const key = chainId + "-" + tokenId;
        if (objPrivateKey[key]) {
            delete objPrivateKey[key];
            localStorage.setItem(
                "tactoePrivateKey",
                JSON.stringify(objPrivateKey),
            );
        }
    }, [tokenId, chainId]);

    return [singer, deleteSigner];
};
