import { isAddress } from "@ethersproject/address";

export const shortenAddress = (address: string, chars = 4): string => {
    const parsed = isAddress(address);
    if (!parsed) return "";
    return `${address.substring(0, chars + 2)}...${address.substring(
        42 - chars,
    )}`;
};

export const getBlockExplorerLink = (
    data: string,
    type: "tx" | "token" | "address" | "block",
): string => {
    return `https://polygonscan.com/${type}/${data}`;
};

export const randomizeString = (text: string): string => {
    return text
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
};
