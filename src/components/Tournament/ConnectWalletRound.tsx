import { Box, Text } from "@chakra-ui/react";
import ConnectBg from "./assets/tournament-button.svg";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";

import { injected } from "../../utils/web3Utils";
import { UnsupportedChainIdError } from "@web3-react/core";

const ConnectWalletRound = () => {
    const { activate, setError } = useActiveWeb3React();

    return (
        <Box
            w="485px"
            h="129px"
            bg={`url(${ConnectBg})`}
            left="50%"
            top="60%"
            transform="translateX(-50%)"
            paddingTop="20px"
            zIndex={22}
            onClick={() => {
                activate(injected, undefined, true).catch((e) => {
                    if (e instanceof UnsupportedChainIdError) {
                        void activate(injected);
                    } else {
                        setError(e);
                    }
                });
            }}
            pos="absolute"
            cursor={"pointer"}
        >
            <Text
                fontSize="36px"
                color="#000"
                fontWeight="600"
                textAlign="center"
            >
                Connect Wallet
            </Text>
        </Box>
    );
};

export default ConnectWalletRound;
