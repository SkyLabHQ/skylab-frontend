import { ChainId } from "@/utils/web3Utils";

export interface PilotBaseInfo {
    address: string;
    img?: string;
    name?: string;
    enumerable?: boolean;
    chainId?: ChainId;
}

const AllPilotList: {
    [chainId in ChainId]?: PilotBaseInfo[];
} = {
    [ChainId.MUMBAI]: [
        {
            address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Nouns",
            enumerable: false,
            chainId: ChainId.MAINNET,
        },
        {
            address: "0x23581767a106ae21c074b2276D25e5C3e136a68b",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Moonbirds",
            enumerable: false,
            chainId: ChainId.MAINNET,
        },
        {
            address: "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Mfer",
            enumerable: true,
            chainId: ChainId.MAINNET,
        },
        {
            address: "0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Cryptoadz",
            enumerable: false,
            chainId: ChainId.MAINNET,
        },
        {
            address: "0x2f5683e27F80C7F9EE98FA083Aa7Bc875c650742",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Baby Merc",
            enumerable: true,
        },
        {
            address: "0xfa068dB54c31B230530B0D287Dd5cE0C869D6640",
            img: "https://i.imgur.com/8uY4kZu.png",
            name: "Baby Merc2",
            enumerable: true,
            chainId: ChainId.MUMBAI,
        },
    ],
    [ChainId.POLYGON]: [
        {
            address: "0x41723AC847978665E4161a0c2fC6b437a72AdFdD",
        },
    ],
};

export const getPilotChainId = (chainId: ChainId, address: string) => {
    const pilotList = AllPilotList[chainId];

    const pilotChainId = pilotList.find(
        (pilot: PilotBaseInfo) => pilot.address === address,
    )?.chainId;

    return pilotChainId;
};

export default AllPilotList;
