import { Box, Text } from "@chakra-ui/react";
import ConnectBg from "./assets/tournament-button.svg";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

import { DEAFAULT_CHAINID, injected } from "../../utils/web3Utils";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { SubmitButton } from "../Button/Index";
import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";

interface ChildProps {
    onNextRound: (nextStep: number) => void;
}

const ConnectWalletRound = ({ onNextRound }: ChildProps) => {
    const addNetworkToMetask = useAddNetworkToMetamask();

    const { account } = useActiveWeb3React();

    const { activate, setError } = useWeb3React();

    useEffect(() => {
        if (account) {
            onNextRound(2);
        }
    }, [account]);

    return (
        <Box
            sx={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.3)",
                zIndex: 200,
            }}
        >
            <Box
                w="485px"
                left="50%"
                top="50%"
                transform="translateX(-50%)"
                paddingTop="20px"
                zIndex={22}
                pos="absolute"
                cursor={"pointer"}
            >
                <SubmitButton
                    width="100%"
                    onClick={() => {
                        activate(injected, undefined, true).catch((e) => {
                            console.log(e, "Eee");
                            if (e instanceof UnsupportedChainIdError) {
                                addNetworkToMetask(DEAFAULT_CHAINID).then(
                                    () => {
                                        activate(injected);
                                    },
                                );
                            }
                        });
                    }}
                >
                    <Text
                        fontSize="36px"
                        color="#000"
                        fontWeight="600"
                        textAlign="center"
                    >
                        Connect Wallet
                    </Text>
                </SubmitButton>
            </Box>
        </Box>
    );
};

export default ConnectWalletRound;
