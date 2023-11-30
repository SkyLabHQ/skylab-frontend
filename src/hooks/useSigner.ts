import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import useActiveWeb3React from "./useActiveWeb3React";
import qs from "query-string";
import { getRandomProvider } from "@/utils/web3Utils";

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
        const provider = getRandomProvider(chainId);

        let stringPrivateKey = istest
            ? sessionStorage.getItem("testflightPrivateKey")
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
                ? sessionStorage.setItem(
                      "testflightPrivateKey",
                      JSON.stringify(objPrivateKey),
                  )
                : localStorage.setItem(
                      "tactoePrivateKey",
                      JSON.stringify(objPrivateKey),
                  );
        }
        return new ethers.Wallet(objPrivateKey[key], provider);
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

export const getDefaultWithProvider = (
    tokenId: number,
    chainId: number,
): ethers.Wallet => {
    if (!tokenId || !chainId) {
        return null;
    }
    const provider = getRandomProvider(chainId);
    let stringPrivateKey = localStorage.getItem("tactoePrivateKey");

    let objPrivateKey;
    try {
        objPrivateKey = stringPrivateKey ? JSON.parse(stringPrivateKey) : {};
    } catch (e) {
        objPrivateKey = {};
    }
    const key = chainId + "-" + tokenId;

    if (!objPrivateKey[key]) {
        // 随机创建一个私钥账户
        const randomAccount = ethers.Wallet.createRandom();
        objPrivateKey[key] = randomAccount.privateKey;
        localStorage.setItem("tactoePrivateKey", JSON.stringify(objPrivateKey));
    }
    return new ethers.Wallet(objPrivateKey[key], provider);
};
export const getTestflightWithProvider = (
    tokenId: number,
    chainId: number,
): ethers.Wallet => {
    if (!tokenId || !chainId) {
        return null;
    }
    const provider = getRandomProvider(chainId);
    let stringPrivateKey = sessionStorage.getItem("testflightPrivateKey");

    let objPrivateKey;
    try {
        objPrivateKey = stringPrivateKey ? JSON.parse(stringPrivateKey) : {};
    } catch (e) {
        objPrivateKey = {};
    }
    const key = chainId + "-" + tokenId;

    if (!objPrivateKey[key]) {
        // 随机创建一个私钥账户
        const randomAccount = ethers.Wallet.createRandom();
        objPrivateKey[key] = randomAccount.privateKey;
        sessionStorage.setItem(
            "testflightPrivateKey",
            JSON.stringify(objPrivateKey),
        );
    }
    return new ethers.Wallet(objPrivateKey[key], provider);
};

export const getTestflightSigner = (
    chainId: number,
    useNew?: boolean,
): ethers.Wallet => {
    if (!chainId) {
        return null;
    }

    const provider = getRandomProvider(chainId);
    let stringPrivateKey = sessionStorage.getItem("testflight");
    if (!stringPrivateKey || useNew) {
        const randomPrivateKey = ethers.Wallet.createRandom().privateKey;
        stringPrivateKey = randomPrivateKey;
    }
    sessionStorage.setItem("testflight", stringPrivateKey);
    return new ethers.Wallet(stringPrivateKey, provider);
};
