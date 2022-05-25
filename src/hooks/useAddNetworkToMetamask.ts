import { hexValue } from "ethers/lib/utils";
import { useCallback } from "react";
import { ChainId, SUPPORTED_NETWORKS } from "../utils/web3Utils";

const useAddNetworkToMetamask = (): ((chainId: ChainId) => void) => {
    const { ethereum } = window;

    const addNetwork = useCallback(
        async (chainId: ChainId) => {
            if (ethereum) {
                try {
                    await ethereum.request?.({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: hexValue(chainId) }],
                    });
                } catch (error: any) {
                    // 4902 indicates chain has not been added
                    if (error.code === 4902) {
                        await ethereum.request?.({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: hexValue(chainId),
                                    ...SUPPORTED_NETWORKS[chainId],
                                },
                            ],
                        });
                    }
                }
            }
        },
        [ethereum],
    );

    return addNetwork;
};

export default useAddNetworkToMetamask;
