const handleIpfsImg = (url: string) => {
    if (url.startsWith("ipfs://")) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};

export const getMetadataImg = (basedata: string) => {
    const jsonString = window.atob(basedata.substr(basedata.indexOf(",") + 1));
    const jsonObject = JSON.parse(jsonString);
    const url = jsonObject.image;
    if (url.startsWith("ipfs://")) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};
export default handleIpfsImg;
