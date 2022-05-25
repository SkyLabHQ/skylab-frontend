import { useCallback } from "react";

const useSwitchProfiles = (): (() => void) => {
    const { ethereum } = window;

    const switchProfiles = useCallback(async () => {
        if (ethereum) {
            await ethereum.request?.({
                method: "eth_requestAccounts",
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
            await ethereum.request?.({
                method: "wallet_requestPermissions",
                params: [
                    {
                        eth_accounts: {},
                    },
                ],
            });
        }
    }, [ethereum]);

    return switchProfiles;
};

export default useSwitchProfiles;
