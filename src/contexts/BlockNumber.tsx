import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import useDebounce from "@/utils/useDebounce";
import { DEAFAULT_CHAINID, randomRpc } from "@/utils/web3Utils";
import { ethers } from "ethers";
import {
    createContext,
    ReactElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

export const BlockNumberContext = createContext<{
    blockNumber: number | null;
}>({
    blockNumber: null,
});

export const BlockNumberProvider = ({
    children,
}: {
    children: ReactElement;
}) => {
    const { chainId = DEAFAULT_CHAINID } = useActiveWeb3React();
    const library = useMemo(() => {
        const provider = new ethers.providers.StaticJsonRpcProvider(
            randomRpc[chainId][0],
        );
        return provider;
    }, [chainId]);

    const [state, setState] = useState<{
        chainId: number | undefined;
        blockNumber: number | null;
    }>({
        chainId,
        blockNumber: null,
    });

    const blockNumberCallback = useCallback(
        (blockNumber: number) => {
            setState((state) => {
                if (chainId === state.chainId) {
                    if (typeof state.blockNumber !== "number")
                        return { chainId, blockNumber };
                    return {
                        chainId,
                        blockNumber: Math.max(blockNumber, state.blockNumber),
                    };
                }
                return state;
            });
        },
        [chainId, setState],
    );

    useEffect(() => {
        if (!library || !chainId) return undefined;

        setState({ chainId, blockNumber: null });

        library
            .getBlockNumber()
            .then(blockNumberCallback)
            .catch((error) =>
                console.error(
                    `Failed to get block number for chainId: ${chainId}`,
                    error,
                ),
            );
        library.on("block", blockNumberCallback);

        return () => {
            library.removeListener("block", blockNumberCallback);
        };
    }, [chainId, library, blockNumberCallback]);

    const debouncedState = useDebounce(state, 100);

    return (
        <BlockNumberContext.Provider
            value={{
                blockNumber: debouncedState.blockNumber,
            }}
        >
            {children}
        </BlockNumberContext.Provider>
    );
};

export const useBlockNumber = () => useContext(BlockNumberContext);
