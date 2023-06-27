import { ChainId } from "@/utils/web3Utils";
import axios from "axios";
import { ethers } from "ethers";
import useActiveWeb3React from "./useActiveWeb3React";

const url = {
    [ChainId.POLYGON]: "https://gasstation.polygon.technology/v2",
    [ChainId.MUMBAI]: "https://gasstation-testnet.polygon.technology/v2",
};
const useFeeData = () => {
    const { chainId } = useActiveWeb3React();

    const getFeeData = async () => {
        const res = await axios.get(url[chainId]);
        return {
            maxFeePerGas: ethers.utils.parseUnits(
                res.data.standard.maxFee,
                "gwei",
            ),
            maxPriorityFeePerGas: ethers.utils.parseUnits(
                String(res.data.standard.maxPriorityFee),
                "gwei",
            ),
        };
    };

    return { getFeeData };
};

export default useFeeData;
