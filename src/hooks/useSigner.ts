import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "./useActiveWeb3React";
import qs from "query-string";

export const useTacToeSigner = (
    tokenId: number,
    propTestflight: boolean = false,
): [ethers.Wallet, () => void] => {
    const { chainId } = useActiveWeb3React();
    const { search } = useLocation();

    const params = qs.parse(search) as any;
    const istest = propTestflight
        ? propTestflight
        : params.testflight === "true";
    const singer = useMemo(() => {
        if (!tokenId || !chainId) {
            return null;
        }
        let stringPrivateKey = istest
            ? localStorage.getItem("testflightPrivateKey")
            : localStorage.getItem("tactoePrivateKey");
        let objPrivateKey;
        try {
            objPrivateKey = stringPrivateKey
                ? JSON.parse(stringPrivateKey)
                : {};
        } catch (e) {
            objPrivateKey = {};
        }
        const key = chainId + "-" + tokenId;

        if (!objPrivateKey[key]) {
            // 随机创建一个私钥账户
            const randomAccount = ethers.Wallet.createRandom();
            objPrivateKey[key] = randomAccount.privateKey;
            istest
                ? localStorage.setItem(
                      "testflightPrivateKey",
                      JSON.stringify(objPrivateKey),
                  )
                : localStorage.setItem(
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
        let stringPrivateKey = istest
            ? localStorage.getItem("testflightPrivateKey")
            : localStorage.getItem("tactoePrivateKey");
        let objPrivateKey;
        try {
            objPrivateKey = JSON.parse(stringPrivateKey);
        } catch (e) {
            objPrivateKey = {};
        }
        const key = chainId + "-" + tokenId;
        if (objPrivateKey[key]) {
            delete objPrivateKey[key];
            istest
                ? localStorage.setItem(
                      "testflightPrivateKey",
                      JSON.stringify(objPrivateKey),
                  )
                : localStorage.setItem(
                      "tactoePrivateKey",
                      JSON.stringify(objPrivateKey),
                  );
        }
    }, [tokenId, chainId]);

    return [singer, deleteSigner];
};
