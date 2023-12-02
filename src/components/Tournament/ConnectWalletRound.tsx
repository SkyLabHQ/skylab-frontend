import { Box, Button, Text } from "@chakra-ui/react";
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

    const { activate } = useWeb3React();

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
                w="25.2604vw"
                left="50%"
                top="50%"
                transform="translateX(-50%)"
                paddingTop="1.0417vw"
                zIndex={22}
                pos="absolute"
                cursor={"pointer"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <SubmitButton
                    width="100%"
                    onClick={() => {
                        activate(injected, undefined, true).catch((e) => {
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
                        fontSize="1.875vw"
                        color="#000"
                        fontWeight="600"
                        textAlign="center"
                    >
                        Connect Wallet
                    </Text>
                </SubmitButton>
                <Button
                    variant={"unstyled"}
                    onClick={() => {
                        onNextRound(2);
                    }}
                >
                    <Text
                        sx={{
                            textDecoration: "underline",
                        }}
                    >
                        Skip
                    </Text>
                </Button>
            </Box>
        </Box>
    );
};

export default ConnectWalletRound;
