import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";

export const useTacToeSalt = (tokenId: number, grid: number) => {
    const { chainId } = useActiveWeb3React();

    const getSalt = useCallback(() => {
        console.log(tokenId, chainId, grid);
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
        const key = chainId + "-" + tokenId;
        if (!objSalt[key]) {
            return "";
        }
        return objSalt[key][grid];
    }, [tokenId, chainId, grid]);

    const addBidAmountAndSalt = useCallback(
        (amount: number, salt: number) => {
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
            const key = chainId + "-" + tokenId;
            if (!objSalt[key]) {
                objSalt[key] = {};
            }
            objSalt[key][grid] = {
                salt,
                amount,
            };
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
        const key = chainId + "-" + tokenId;
        if (objSalt[key]?.[grid]) {
            delete objSalt[key][grid];
            localStorage.setItem("tactoeSalt", JSON.stringify(objSalt));
        }
    }, [tokenId, chainId, grid]);

    return {
        getSalt,
        addBidAmountAndSalt,
        deleteSalt,
    };
};

export default useTacToeSalt;
