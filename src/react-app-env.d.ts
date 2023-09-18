/// <reference types="react-scripts" />

interface Window {
    ethereum?: {
        isMetamask?: bool;
        autoRefreshOnNetworkChange?: bool;
        request?: (...args: any[]) => any;
        on?: (...args: any[]) => void;
        removeListener?: (...args: any[]) => void;
    };
    web3?: unknown;
}

declare module "@metamask/jazzicon" {
    export default function (diameter: number, seed: number): HTMLElement;
}

declare module "*.svg" {
    import React = require("react");
    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
}

declare module "*.wav";

declare module "*.mp4";

declare module "html2canvas";
