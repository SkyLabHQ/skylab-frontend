const handleIpfsImg = (url: string) => {
    if (url.startsWith("ipfs://")) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};
export default handleIpfsImg;
