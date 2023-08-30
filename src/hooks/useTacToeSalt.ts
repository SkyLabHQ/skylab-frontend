import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";

export const useTacToeSalt = (tokenId: number, grid: number) => {
    const { chainId } = useActiveWeb3React();

    const salt = useMemo(() => {
        if (!tokenId || !chainId || grid === -1) {
            return "";
        }
        let stringSalt = localStorage.getItem("tactoeSalt");
        let objSalt;
        try {
            objSalt = stringSalt ? JSON.parse(stringSalt) : {};
        } catch (e) {
            objSalt = {};
        }
        const key = chainId + "-" + tokenId + "-" + grid;
        if (!objSalt[key]) {
            return "";
        }
        return objSalt[key];
    }, [tokenId, chainId, grid]);

    const addSalt = useCallback(
        (salt: string) => {
            if (!tokenId || !chainId || grid === -1 || !salt) {
                return null;
            }
            let stringSalt = localStorage.getItem("tactoeSalt");
            let objSalt;
            try {
                objSalt = stringSalt ? JSON.parse(stringSalt) : {};
            } catch (e) {
                objSalt = {};
            }
            const key = chainId + "-" + tokenId + "-" + grid;
            objSalt[key] = salt;
            localStorage.setItem("tactoeSalt", JSON.stringify(objSalt));
        },
        [tokenId, chainId, grid],
    );

    const deleteSalt = useCallback(() => {
        if (!tokenId || !chainId || grid === -1) {
            return null;
        }
        let stringSalt = localStorage.getItem("tactoeSalt");
        let objSalt;
        try {
            objSalt = stringSalt ? JSON.parse(stringSalt) : {};
        } catch (e) {
            objSalt = {};
        }
        const key = chainId + "-" + tokenId + "-" + grid;
        if (objSalt[key]) {
            delete objSalt[key];
            localStorage.setItem("tactoeSalt", JSON.stringify(objSalt));
        }
    }, [tokenId, chainId, grid]);

    return {
        salt,
        addSalt,
        deleteSalt,
    };
};

export default useTacToeSalt;
