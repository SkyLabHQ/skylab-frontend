import { ChainId } from "@/utils/web3Utils";
import NounsImg from "@/assets/pilots/nouns.avif";
import MoonbirdsImg from "@/assets/pilots/moonbirds.avif";
import MferImg from "@/assets/pilots/mfer.avif";
import CryptoadzImg from "@/assets/pilots/cryptoadz.webp";
import BabymercImg from "@/assets/pilots/babymerc.jpg";
import MercsImg from "@/assets/pilots/mercs.jpg";
import { getPilotImgFromUrl } from "@/utils/ipfsImg";
import {
    getMultiDelegateERC721Contract,
    getMultiProvider,
} from "@/hooks/useMultiContract";
import { babyMercsAddress } from "@/hooks/useContract";

const MainnetPilotList: PilotBaseInfo[] = [
    {
        address: "0x79FCDEF22feeD20eDDacbB2587640e45491b757f",
        img: MferImg,
        name: "Mfer",
        enumerable: true,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/mfers",
    },
    {
        address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
        img: NounsImg,
        name: "Nouns",
        enumerable: true,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/nouns",
    },
    {
        address: "0x1CB1A5e65610AEFF2551A50f76a87a7d3fB649C6",
        img: CryptoadzImg,
        name: "Cryptoadz",
        enumerable: false,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/cryptoadz-by-gremplin",
    },
    {
        address: "0x23581767a106ae21c074b2276D25e5C3e136a68b",
        img: MoonbirdsImg,
        name: "Moonbirds",
        enumerable: false,
        chainId: ChainId.ETHEREUM,
        openSeaUrl: "https://opensea.io/collection/proof-moonbirds",
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
        {
            address: "0xfa068dB54c31B230530B0D287Dd5cE0C869D6640",
            img: MercsImg,
            name: "Merc",
            enumerable: true,
            chainId: ChainId.MUMBAI,
            disabled: true,
        },
        {
            address: babyMercsAddress[ChainId.MUMBAI],
            img: BabymercImg,
            name: "Baby Merc",
            enumerable: true,
            chainId: ChainId.MUMBAI,
        },
        ...MainnetPilotList,
    ],
    [ChainId.POLYGON]: [
        {
            address: "0xfa068dB54c31B230530B0D287Dd5cE0C869D6640",
            img: MercsImg,
            name: "Merc",
            enumerable: true,
            chainId: ChainId.MUMBAI,
            disabled: true,
        },
        {
            address: babyMercsAddress[ChainId.POLYGON],
            img: BabymercImg,
            name: "Baby Merc",
            enumerable: true,
            chainId: ChainId.POLYGON,
            openSeaUrl: "https://opensea.io/collection/babymercs-2",
        },
        ...MainnetPilotList,
    ],
    [ChainId.BASEGOERLI]: [
        {
            address: "0xfa068dB54c31B230530B0D287Dd5cE0C869D6640",
            img: MercsImg,
            name: "Merc",
            enumerable: true,
            chainId: ChainId.MUMBAI,
            disabled: true,
        },
        {
            address: babyMercsAddress[ChainId.POLYGON],
            img: BabymercImg,
            name: "Baby Merc",
            enumerable: true,
            chainId: ChainId.POLYGON,
            openSeaUrl: "https://opensea.io/collection/babymercs-2",
        },
        ...MainnetPilotList,
    ],
    [ChainId.BASE]: [
        {
            address: "0xfa068dB54c31B230530B0D287Dd5cE0C869D6640",
            img: MercsImg,
            name: "Merc",
            enumerable: true,
            chainId: ChainId.MUMBAI,
            disabled: true,
        },
        {
            address: babyMercsAddress[ChainId.POLYGON],
            img: BabymercImg,
            name: "Baby Merc",
            enumerable: true,
            chainId: ChainId.POLYGON,
            openSeaUrl: "https://opensea.io/collection/babymercs-2",
        },
        ...MainnetPilotList,
    ],
};

export const getPilotInfo = (chainId: ChainId, address: string) => {
    const pilotList = AllPilotList[chainId];
    const pilot = pilotList.find(
        (pilot: PilotBaseInfo) => pilot.address === address,
    );
    return pilot;
};

const getMoonbirdsImg = (pilotId: number | string) => {
    return `https://moonbirds.imgix.net/${pilotId}`;
};

const getNounsImg = (pilotId: number | string) => {
    return `https://noun.pics/${pilotId}`;
};

// 是否是特殊的飞行员 Moonbirds 和 Nouns
export const getIsSpecialPilot = (address: string) => {
    return (
        address === "0x23581767a106ae21c074b2276D25e5C3e136a68b" ||
        address === "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03"
    );
};

export const getSpecialPilotImg = (
    address: string,
    pilotId: number | string,
) => {
    if (address === "0x23581767a106ae21c074b2276D25e5C3e136a68b") {
        return getMoonbirdsImg(pilotId);
    } else {
        return getNounsImg(pilotId);
    }
};

export interface ActivePilotRes {
    collectionAddress: string;
    pilotId: number;
    isSpecialPilot?: boolean;
}

export const handlePilotsInfo = async ({
    allPilot,
    chainId,
    values,
    pilotOwners,
}: {
    allPilot: ActivePilotRes[];
    chainId: number;
    values: any[];
    pilotOwners?: string[];
}) => {
    const chainIdIndex: any = [];

    const pilots = allPilot.map((item) => {
        const isSpecialPilot = getIsSpecialPilot(item.collectionAddress);
        const pilotItem = getPilotInfo(chainId, item.collectionAddress);

        return {
            ...item,
            isSpecialPilot,
            pilotChainId: pilotItem?.chainId,
        };
    });

    const allRequests = {};
    for (const item of pilots) {
        const pilotChainId = item.pilotChainId;
        if (!pilotChainId) {
            chainIdIndex.push(pilotChainId);
            continue;
        }
        const collectionAddress = item.collectionAddress;
        const pilotId = item.pilotId;

        const multiDelegateERC721Contract =
            getMultiDelegateERC721Contract(pilotChainId);
        const multiProvider = getMultiProvider(pilotChainId);

        if (!allRequests[pilotChainId]) {
            allRequests[pilotChainId] = [];
        }

        if (!item.isSpecialPilot) {
            allRequests[pilotChainId].push(
                multiDelegateERC721Contract.tokenURI(
                    collectionAddress,
                    pilotId,
                ),
            );
        }
        allRequests[pilotChainId].push(
            multiDelegateERC721Contract.ownerOf(collectionAddress, pilotId),
        );

        chainIdIndex.push(pilotChainId);
    }

    const expandRequests = Object.entries(allRequests);

    const allIndex = {};

    const requests = expandRequests.map(([chainId, chainRequests]) => {
        const multiProvider = getMultiProvider(Number(chainId));
        allIndex[chainId] = 0;
        return multiProvider.all(chainRequests as any);
    });

    const allResult = await Promise.all(requests);

    const list = pilots.map((item, index) => {
        let owner = "";
        let imgUrl = "";

        if (!item.pilotChainId) {
            return {
                address: item.collectionAddress,
                pilotId: item.pilotId,
                pilotImg: imgUrl,
                value: values[index],
                pilotOwner: pilotOwners?.[index] ? pilotOwners[index] : owner,
                actualPilotOwner: owner,
            };
        }

        const currentChainId = chainIdIndex[index];

        const resIndex = expandRequests.findIndex(
            ([chainId, chainRequests]) => {
                return chainId == currentChainId;
            },
        );

        if (item.isSpecialPilot) {
            imgUrl = getSpecialPilotImg(item.collectionAddress, item.pilotId);
        } else {
            imgUrl = allResult[resIndex][allIndex[currentChainId]++];
        }

        owner = allResult[resIndex][allIndex[currentChainId]++];

        const imgPromise = item.isSpecialPilot
            ? imgUrl
            : getPilotImgFromUrl(imgUrl);

        return {
            address: item.collectionAddress,
            pilotId: item.pilotId,
            pilotImg: imgPromise,
            value: values[index],
            pilotOwner: pilotOwners?.[index] ? pilotOwners[index] : owner,
            actualPilotOwner: owner,
        };
    });

    const imgRes = await Promise.all(
        list.map((item) => {
            return item.pilotImg;
        }),
    );

    const _list = list
        .map((item, index) => {
            return { ...item, pilotImg: imgRes[index] };
        })

        .sort((a, b) => b.value - a.value);

    return _list;
};

export default AllPilotList;
