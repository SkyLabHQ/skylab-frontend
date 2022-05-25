import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { injected } from "../utils/web3Utils";

const useInactiveListener = (suppress: boolean = false): void => {
    const { active, error, activate, deactivate, setError } = useWeb3React();

    useEffect(() => {
        const { ethereum } = window;
        if (ethereum && ethereum.on && !suppress && !active && !error) {
            // event handlers
            const handleChainChanged = (): void => {
                activate(injected, undefined, true).catch((error) => {
                    console.error(
                        "Failed to activate after chain changed",
                        error,
                    );
                    // set error to bubble it up to the manager
                    setError(error);
                });
            };
            const handleAccountsChanged = (accounts: string[]): void => {
                if (accounts.length > 0) {
                    activate(injected, undefined, true).catch((error) => {
                        console.error(
                            "Failed to activate after accounts changed",
                            error,
                        );
                        // set error to bubble it up to the manager
                        setError(error);
                    });
                } else {
                    // we must be disconnecting
                    deactivate();
                }
            };
            const handleNetworkChanged = () => {
                activate(injected, undefined, true).catch((error) => {
                    console.error(
                        "Failed to activate after network changed",
                        error,
                    );
                    // set error to bubble it up to the manager
                    setError(error);
                });
            };

            // event listeners
            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("networkChanged", handleNetworkChanged);

            return (): void => {
                if (ethereum.removeListener) {
                    ethereum.removeListener(
                        "accountsChanged",
                        handleAccountsChanged,
                    );
                    ethereum.removeListener(
                        "networkChanged",
                        handleNetworkChanged,
                    );
                    ethereum.removeListener("chainChanged", handleChainChanged);
                }
            };
        }
        return undefined;
    }, []);
};

export default useInactiveListener;
