import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { injected } from "../utils/web3Utils";

const useEagerConnect = (): boolean => {
    const { activate, active } = useWeb3React();
    const [tried, setTried] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            injected.isAuthorized().then((isAuthorized: boolean) => {
                if (isAuthorized) {
                    activate(injected, undefined, true).catch(() => {
                        setTried(true);
                    });
                } else {
                    if (isMobile && window.ethereum) {
                        activate(injected, undefined, true).catch(() => {
                            setTried(true);
                        });
                    } else {
                        setTried(true);
                    }
                }
            });
        }, 600);
    }, [activate, active]);

    useEffect(() => {
        if (active) setTried(true);
    }, [active]);

    return tried;
};

export default useEagerConnect;
