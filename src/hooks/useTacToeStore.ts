import { useCallback, useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";

export const useGridCommited = (tokenId: number, grid: number) => {
    const { chainId } = useActiveWeb3React();
    const getGridCommited = useCallback(() => {
        if (!tokenId || !chainId || grid === -1) {
            return "";
        }
        let stringSalt = localStorage.getItem("bttCommited");
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

    const addGridCommited = useCallback(
        (amount: number, salt: number) => {
            if (!tokenId || !chainId || grid === -1 || !salt) {
                return null;
            }
            let stringSalt = localStorage.getItem("bttCommited");
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
            localStorage.setItem("bttCommited", JSON.stringify(objSalt));
        },
        [tokenId, chainId, grid],
    );

    const deleteGridCommited = useCallback(() => {
        if (!tokenId || !chainId || grid === -1) {
            return null;
        }
        let stringSalt = localStorage.getItem("bttCommited");
        let objSalt;
        try {
            objSalt = stringSalt ? JSON.parse(stringSalt) : {};
        } catch (e) {
            objSalt = {};
        }
        const key = chainId + "-" + tokenId;
        if (objSalt[key]?.[grid]) {
            delete objSalt[key][grid];
            localStorage.setItem("bttCommited", JSON.stringify(objSalt));
        }
    }, [tokenId, chainId, grid]);

    return {
        getGridCommited,
        addGridCommited,
        deleteGridCommited,
    };
};

export const useDeleteTokenIdCommited = (tokenId: number) => {
    const { chainId } = useActiveWeb3React();

    const deleteTokenIdCommited = useCallback(() => {
        if (!tokenId || !chainId) {
            return null;
        }
        let stringSalt = localStorage.getItem("bttCommited");
        let objSalt;
        try {
            objSalt = stringSalt ? JSON.parse(stringSalt) : {};
        } catch (e) {
            objSalt = {};
        }
        const key = chainId + "-" + tokenId;
        if (objSalt[key]) {
            delete objSalt[key];
            localStorage.setItem("bttCommited", JSON.stringify(objSalt));
        }
    }, [tokenId, chainId]);

    return deleteTokenIdCommited;
};

interface GameInfo {
    gameAddress: string;
    oldLevel: number;
    newLevel: number;
    oldPoint: number;
    newPoint: number;
    win: boolean;
}

export const useAddBttTransaction = (tokenId: number) => {
    const { chainId, account } = useActiveWeb3React();

    return useCallback(
        ({
            gameAddress,
            oldLevel,
            newLevel,
            oldPoint,
            newPoint,
            win,
        }: GameInfo) => {
            if (!tokenId || !chainId || !account) {
                return null;
            }

            const time = new Date().getTime();
            let stringRecord = localStorage.getItem("bttRecords");
            let objRecord;
            try {
                objRecord = stringRecord ? JSON.parse(stringRecord) : {};
            } catch (e) {
                objRecord = {};
            }
            const records = objRecord[chainId] ?? {};
            records[gameAddress] = {
                account,
                tokenId,
                time,
                gameAddress,
                oldLevel,
                newLevel,
                oldPoint,
                newPoint,
                win,
            };
            objRecord[chainId] = records;
            localStorage.setItem("bttRecords", JSON.stringify(objRecord));
        },
        [tokenId, chainId],
    );
};
