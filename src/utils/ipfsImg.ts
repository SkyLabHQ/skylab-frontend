import axios from "axios";
const handleIpfsUrl = (url: string) => {
    if (url.startsWith("ipfs://")) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};

export const getPilotImgFromUrl = async (tokenURI: string) => {
    if (!tokenURI) return "";
    else if (tokenURI.startsWith("data:application/json;base64")) {
        return getMetadataImg(tokenURI);
    } else {
        try {
            let newTokenURI = handleIpfsUrl(tokenURI);
            const res = await axios.get(newTokenURI);
            const img = handleIpfsUrl(res.data.image);
            return img;
        } catch (e) {
            console.log(e);
            return "";
        }
    }
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
export default handleIpfsUrl;
