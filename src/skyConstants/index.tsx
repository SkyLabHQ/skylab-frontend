import { AbstractConnector } from "@web3-react/abstract-connector";
import { injected, walletconnect, walletlink } from "../utils/web3Utils";
import { ComponentWithAs, createIcon, IconProps } from "@chakra-ui/react";
import { Variants } from "framer-motion";
import { coinbaseImage } from "./coinbaseImage";
import { css } from "@emotion/react";
import openseaLogo from "../assets/opensea.svg";
import mediumLogo from "../assets/medium.svg";
import githubLogo from "../assets/github.svg";
import discordLogo from "../assets/discord.svg";
import twitterLogo from "../assets/twitter.svg";
import telegramLogo from "../assets/telegram.svg";
import mirrorLogo from "../assets/mirror.svg";
import CardAviation from "../assets/card-aviation.svg";
import CardFactory from "../assets/card-factory.svg";
import CardShield from "../assets/card-shield.svg";
import CardBomb from "../assets/card-bomb.svg";
import CardFuel from "../assets/card-fuel.svg";
import CardBattery from "../assets/card-battery.svg";

import { GradientCardProps } from "../components/GradientCard";

export const PolygonIcon = createIcon({
    displayName: "Polygon Network",
    viewBox: "0 0 38.4 33.5",
    path: (
        <path
            fill="#8247E5"
            d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
        />
    ),
});

export const MetamaskIcon = createIcon({
    displayName: "Metamask Logo",
    viewBox: "0 0 318.6 318.6",
    path: (
        <>
            <style type="text/css">
                {
                    ".st0{fill:#E2761B;stroke:#E2761B;stroke-linecap:round;stroke-linejoin:round;} .st1{fill:#E4761B;stroke:#E4761B;stroke-linecap:round;stroke-linejoin:round;} .st2{fill:#D7C1B3;stroke:#D7C1B3;stroke-linecap:round;stroke-linejoin:round;} .st3{fill:#233447;stroke:#233447;stroke-linecap:round;stroke-linejoin:round;} .st4{fill:#CD6116;stroke:#CD6116;stroke-linecap:round;stroke-linejoin:round;} .st5{fill:#E4751F;stroke:#E4751F;stroke-linecap:round;stroke-linejoin:round;} .st6{fill:#F6851B;stroke:#F6851B;stroke-linecap:round;stroke-linejoin:round;} .st7{fill:#C0AD9E;stroke:#C0AD9E;stroke-linecap:round;stroke-linejoin:round;} .st8{fill:#161616;stroke:#161616;stroke-linecap:round;stroke-linejoin:round;} .st9{fill:#763D16;stroke:#763D16;stroke-linecap:round;stroke-linejoin:round;}"
                }
            </style>
            <polygon
                className="st0"
                points="274.1,35.5 174.6,109.4 193,65.8 "
            />
            <g>
                <polygon
                    className="st1"
                    points="44.4,35.5 143.1,110.1 125.6,65.8 	"
                />
                <polygon
                    className="st1"
                    points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7 	"
                />
                <polygon
                    className="st1"
                    points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8 	"
                />
                <polygon
                    className="st1"
                    points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1 	"
                />
                <polygon
                    className="st1"
                    points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1 	"
                />
                <polygon
                    className="st1"
                    points="106.8,247.4 140.6,230.9 111.4,208.1 	"
                />
                <polygon
                    className="st1"
                    points="177.9,230.9 211.8,247.4 207.1,208.1 	"
                />
            </g>
            <g>
                <polygon
                    className="st2"
                    points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3 	"
                />
                <polygon
                    className="st2"
                    points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9 	"
                />
            </g>
            <polygon
                className="st3"
                points="138.8,193.5 110.6,185.2 130.5,176.1 "
            />
            <polygon
                className="st3"
                points="179.7,193.5 188,176.1 208,185.2 "
            />
            <g>
                <polygon
                    className="st4"
                    points="106.8,247.4 111.6,206.8 80.3,207.7 	"
                />
                <polygon
                    className="st4"
                    points="207,206.8 211.8,247.4 238.3,207.7 	"
                />
                <polygon
                    className="st4"
                    points="230.8,162.1 174.6,164.6 179.8,193.5 188.1,176.1 208.1,185.2 	"
                />
                <polygon
                    className="st4"
                    points="110.6,185.2 130.6,176.1 138.8,193.5 144.1,164.6 87.8,162.1 	"
                />
            </g>
            <g>
                <polygon
                    className="st5"
                    points="87.8,162.1 111.4,208.1 110.6,185.2 	"
                />
                <polygon
                    className="st5"
                    points="208.1,185.2 207.1,208.1 230.8,162.1 	"
                />
                <polygon
                    className="st5"
                    points="144.1,164.6 138.8,193.5 145.4,227.6 146.9,182.7 	"
                />
                <polygon
                    className="st5"
                    points="174.6,164.6 171.9,182.6 173.1,227.6 179.8,193.5 	"
                />
            </g>
            <polygon
                className="st6"
                points="179.8,193.5 173.1,227.6 177.9,230.9 207.1,208.1 208.1,185.2 "
            />
            <polygon
                className="st6"
                points="110.6,185.2 111.4,208.1 140.6,230.9 145.4,227.6 138.8,193.5 "
            />
            <polygon
                className="st7"
                points="180.3,262.3 180.6,253 178.1,250.8 140.4,250.8 138.1,253 138.3,262.3 106.8,247.4 117.8,256.4
	140.1,271.9 178.4,271.9 200.8,256.4 211.8,247.4 "
            />
            <polygon
                className="st8"
                points="177.9,230.9 173.1,227.6 145.4,227.6 140.6,230.9 138.1,253 140.4,250.8 178.1,250.8 180.6,253 "
            />
            <g>
                <polygon
                    className="st9"
                    points="278.3,114.2 286.8,73.4 274.1,35.5 177.9,106.9 214.9,138.2 267.2,153.5 278.8,140 273.8,136.4
		281.8,129.1 275.6,124.3 283.6,118.2 	"
                />
                <polygon
                    className="st9"
                    points="31.8,73.4 40.3,114.2 34.9,118.2 42.9,124.3 36.8,129.1 44.8,136.4 39.8,140 51.3,153.5 103.6,138.2
		140.6,106.9 44.4,35.5 	"
                />
            </g>
            <polygon
                className="st6"
                points="267.2,153.5 214.9,138.2 230.8,162.1 207.1,208.1 238.3,207.7 284.8,207.7 "
            />
            <polygon
                className="st6"
                points="103.6,138.2 51.3,153.5 33.9,207.7 80.3,207.7 111.4,208.1 87.8,162.1 "
            />
            <polygon
                className="st6"
                points="174.6,164.6 177.9,106.9 193.1,65.8 125.6,65.8 140.6,106.9 144.1,164.6 145.3,182.8 145.4,227.6
	173.1,227.6 173.3,182.8 "
            />
        </>
    ),
});

export const WalletConnectIcon = createIcon({
    displayName: "WalletConect Logo",
    viewBox: "0 0 300 185",
    path: (
        <g
            id="Page-1"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
        >
            <g id="walletconnect-logo-alt" fill="#3B99FC" fillRule="nonzero">
                <path
                    d="M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z"
                    id="WalletConnect"
                ></path>
            </g>
        </g>
    ),
});

export const CoinBaseIcon = createIcon({
    displayName: "WalletConect Logo",
    viewBox: "0 0 300 185",
    path: (
        <>
            <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="4"
            >
                <use xlinkHref="#image0" transform="scale(0.00416667)" />
            </pattern>
            <image id="image0" xlinkHref={coinbaseImage} />
        </>
    ),
});

// constants here
export const LANGUAGE_OPTIONS = [
    { displayText: "English", i18nKey: "en" },
    { displayText: "简体中文", i18nKey: "zh" },
];

/** SUPPORTED WALLETS */
export type WalletData = {
    name: string;
    Icon: ComponentWithAs<"svg", IconProps>;
    connector: AbstractConnector;
};
export type SupportedWallets = "METAMASK";
export const SUPPORTED_WALLETS: {
    [supportedWallet in SupportedWallets]: WalletData;
} = {
    METAMASK: {
        name: "MetaMask",
        Icon: MetamaskIcon,
        connector: injected,
    },
    // WALLET_CONNECT: {
    //     name: "WalletConnect",
    //     Icon: WalletConnectIcon,
    //     connector: walletconnect,
    // },
    // COINBASE: {
    //     name: "Coinbase Wallet",
    //     Icon: CoinBaseIcon,
    //     connector: walletlink,
    // },
};

export const CHAIN_ID_MAP: { [key: number]: string } = {
    "-1": "unknown",
    0: "kardia",
    1: "ethereum",
    8: "ubiq",
    10: "optimism",
    19: "songbird",
    20: "elastos",
    25: "cronos",
    30: "rsk",
    40: "telos",
    52: "csc",
    55: "zyx",
    56: "binance",
    57: "syscoin",
    60: "gochain",
    61: "ethclassic",
    66: "okexchain",
    70: "hoo",
    82: "meter",
    88: "tomochain",
    100: "xdai",
    106: "velas",
    108: "thundercore",
    122: "fuse",
    128: "heco",
    137: "polygon",
    200: "xdaiarb",
    246: "energyweb",
    250: "fantom",
    269: "hpb",
    288: "boba",
    321: "kucoin",
    336: "shiden",
    361: "theta",
    534: "candle",
    592: "astar",
    820: "callisto",
    888: "wanchain",
    1088: "metis",
    1284: "moonbeam",
    1285: "moonriver",
    2020: "ronin",
    2612: "ezchain",
    4689: "iotex",
    5050: "xlc",
    5551: "nahmii",
    8217: "klaytn",
    10000: "smartbch",
    32659: "fusion",
    42161: "arbitrum",
    42220: "celo",
    42262: "oasis",
    43114: "avalanche",
    71394: "godwoken",
    333999: "polis",
    1313161554: "aurora",
    1666600000: "harmony",
    11297108109: "palm",
    836542336838601: "curio",
};

export const sentenceVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delay: 0.5,
            staggerChildren: 0.08,
        },
    },
};

export const letterVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
    },
};

export const GlobalStyles = css`
    body {
        margin: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: white;
        background: black;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
            monospace;
    }
    a:active,
    a:focus {
        box-shadow: none !important;
    }
    a.underline {
        display: block;
        position: relative;
        overflow: hidden;
    }
    a.underline:hover {
        text-decoration: none !important;
    }
    a.underline:hover::after,
    a.underline:focus::after {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
    a.underline::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.2em;
        background-color: var(--chakra-colors-blue-500);
        transition: opacity 600ms, transform 300ms;
        transform: translate3d(-100%, 0, 0);
    }
    .hoverActualText {
        opacity: 0;
    }

    .randomizedText,
    .hoverActualText {
        transition: opacity 0.5s linear;
    }

    .wrapRandomText:hover .randomizedText {
        opacity: 0;
    }
    .wrapRandomText:hover .hoverActualText {
        opacity: 1;
    }
    .swiper {
        width: 100%;
        height: 100%;
        padding-top: 5vw;
        padding-bottom: 4vw;
        position: relative;
    }
    .swiper-slide {
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
        font-size: 18px;
        background: #fff;
    }

    .swiper-pagination {
        position: absolute;
        bottom: 0vw !important;
    }

    .swiper-pagination-bullet {
        background: white;
        opacity: 0.4;
    }

    .swiper-pagination-bullet-active {
        background: #237eff;
        opacity: 1;
    }
`;

export const LOGOS = [
    {
        logo: mirrorLogo,
        url: "https://mirror.xyz/0xD0f899a62aC7ED1b4A145a111ae42D23f4cc2919",
    },
    { logo: twitterLogo, url: "https://twitter.com/skylabHQ" },
    { logo: githubLogo, url: "https://github.com/SkyLabHQ" },
    { logo: discordLogo, url: "https://discord.gg/qWxPz8Qr87" },
    { logo: telegramLogo, url: "https://t.me/skylabHQ" },
    // { logo: mediumLogo, url: "" },
    // { logo: openseaLogo, url: "" },
];

export const BOX_VARIANTS = {
    open: {
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2,
        },
    },
    closed: {
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40,
        },
    },
};

export const LIST_VARIANTS: Variants = {
    open: {
        opacity: 1,
        display: "flex",
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
        },
    },
    closed: {
        opacity: 0,
        display: "none",
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

export const LIST_ITEM_VARIANTS: Variants = {
    open: {
        opacity: 1,
        backdropFilter: "blur(100px)",
    },
    closed: {
        opacity: 0,
    },
};

export const PLAYER_VARIANTS: Variants = {
    hover: {
        scale: 1.3,
    },
    hide: {
        display: "none",
    },
    player0Initial: {
        x: 2000,
    },
    player1Initial: {
        x: 2000,
    },
    player2Initial: {
        x: 2000,
    },
    player3Initial: {
        x: 2000,
    },
    player4Initial: {
        x: 2000,
    },
    exit: {
        opacity: 0,
        transition: { delay: 1, duration: 1 },
    },
};

export const BANNER_GRADIENT_CARDS: GradientCardProps[] = [
    {
        title: "Aviation",
        description:
            "Core entity of Project Mercury. The goal of Project Mercury is to upgrade aviation to higher levels. Aviation starts from Level 1 Paper Plane to Kite, Fighter Jet, Mars Explorer, and to infinity. To ascend, players need to play and win any PvP game that's plugged into Project Mercury. The Vault Contract keeps the supply and demand of every level of aviation in check. Aviations are tradeable and transferrable.",
        img: CardAviation,
        position: { left: 0, top: 0 },
        width: "49%",
        imgWidth: "150px",
    },
    {
        title: "Factory",
        description:
            "Production entity of Project Mercury.  Factory produces Fuel and Battery -- resources that are useful in PvP games. Fuel and Battery are non-transferrable and non-tradeable tokens that can only be loaded to aviations and used in PvP games. Players receive factory as reward when losing PvP games. Factories are tradeable and transferrable.",
        img: CardFactory,
        position: { right: 0, top: 0 },
        width: "49%",
        imgWidth: "150px",
    },
    {
        title: "Shield",
        description:
            "Shields protect factories from bomb attacks. Shields can be transferred, traded and attached to factories to protect them. Players receive shields as reward when losing PvP games.",
        img: CardShield,
        position: { left: 0, bottom: "0" },
        width: "24%",
        imgWidth: "100px",
    },
    {
        title: "Bomb",
        description:
            "Bombs attacks factories to obtain Fuel and Battery. Bombs are non-transferrable and non-tradeable tokens that can only be used to attack factories. Bombs keep the supply of factories and Fuel and Battery production capacity in check. Aviation holders receive bombs as reward on a daily basis.",
        img: CardBomb,
        position: { left: "25%", bottom: "0" },
        width: "24%",
        imgWidth: "100px",
    },
    {
        title: "Fuel",
        description: "The resource that you use in activities",
        img: CardFuel,
        position: { right: "25%", bottom: "0" },
        width: "24%",
        imgWidth: "100px",
    },
    {
        title: "Battery",
        description: "The resource that you use in activities",
        img: CardBattery,
        position: { right: "0%", bottom: "0" },
        width: "24%",
        imgWidth: "100px",
    },
];

export const twitterUrl =
    "https://twitter.com/skylabhq?s=21&t=3tvwVYYbX3FtWjnf7IBmAA";
