import { ChainId } from "@/utils/web3Utils";
import NounsImg from "@/assets/pilots/nouns.avif";
import MoonbirdsImg from "@/assets/pilots/moonbirds.avif";
import MferImg from "@/assets/pilots/mfer.avif";
import CryptoadzImg from "@/assets/pilots/cryptoadz.webp";
import BabymercImg from "@/assets/pilots/babymerc.jpg";
import MercsImg from "@/assets/pilots/mercs.jpg";

const MainnetPilotList: PilotBaseInfo[] = [
    {
        address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
        img: NounsImg,
        name: "Nouns",
        enumerable: false,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/nouns",
    },
    {
        address: "0x23581767a106ae21c074b2276D25e5C3e136a68b",
        img: MoonbirdsImg,
        name: "Moonbirds",
        enumerable: false,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/proof-moonbirds",
    },
    {
        address: "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
        img: MferImg,
        name: "Mfer",
        enumerable: true,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/mfers",
    },
    {
        address: "0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6",
        img: CryptoadzImg,
        name: "Cryptoadz",
        enumerable: false,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/cryptoadz-by-gremplin",
    },
];

export interface PilotBaseInfo {
    address: string;
    img?: string;
    name?: string;
    enumerable?: boolean;
    chainId?: ChainId;
    openSeaUrl?: string;
    disabled?: boolean;
}

const AllPilotList: {
    [chainId in ChainId]?: PilotBaseInfo[];
} = {
    [ChainId.MUMBAI]: [
        ...MainnetPilotList,
        {
            address: "0x2f5683e27F80C7F9EE98FA083Aa7Bc875c650742",
            img: BabymercImg,
            name: "Baby Merc",
            enumerable: true,
            chainId: ChainId.MUMBAI,
        },
        {
            address: "0xfa068dB54c31B230530B0D287Dd5cE0C869D6640",
            img: MercsImg,
            name: "Merc2",
            enumerable: true,
            chainId: ChainId.MUMBAI,
            disabled: true,
        },
    ],
    [ChainId.POLYGON]: [
        ...MainnetPilotList,
        {
            address: "0x41723AC847978665E4161a0c2fC6b437a72AdFdD",
        },
    ],
};

export const getPilotInfo = (chainId: ChainId, address: string) => {
    const pilotList = AllPilotList[chainId];

    const pilot = pilotList.find(
        (pilot: PilotBaseInfo) => pilot.address === address,
    );

    return pilot;
};

export default AllPilotList;
