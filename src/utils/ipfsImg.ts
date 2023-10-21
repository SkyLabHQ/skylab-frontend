import axios from "axios";
const handleIpfsImg = (url: string) => {
    if (url.startsWith("ipfs://")) {
        return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
};

export const getPilotImgFromUrl = async (tokenURI: string) => {
    if (tokenURI.startsWith("data:application/json;base64")) {
        return getMetadataImg(tokenURI);
    } else {
        try {
            const res = await axios.get(tokenURI);
            return res.data.image;
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
export default handleIpfsImg;
