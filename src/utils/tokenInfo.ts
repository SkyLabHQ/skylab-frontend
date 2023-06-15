export const updateTokenInfoValue = (tokenId: number, newValue: any) => {
    const tokenInfo = localStorage.getItem("tokenInfo")
        ? JSON.parse(localStorage.getItem("tokenInfo"))
        : {};
    tokenInfo[tokenId] = {
        ...tokenInfo[tokenId],
        ...newValue,
    };
    localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
};

export const getTokenInfoValue = (tokenId: number, attribute: string) => {
    const tokenInfo = localStorage.getItem("tokenInfo")
        ? JSON.parse(localStorage.getItem("tokenInfo"))
        : {};
    return tokenInfo[tokenId] ? tokenInfo[tokenId][attribute] : null;
};

export const deleteTokenInfo = (tokenId: number) => {
    const tokenInfo = localStorage.getItem("tokenInfo")
        ? JSON.parse(localStorage.getItem("tokenInfo"))
        : {};

    if (tokenInfo[tokenId]) {
        delete tokenInfo[tokenId];
    }
    localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
};

export default null;
