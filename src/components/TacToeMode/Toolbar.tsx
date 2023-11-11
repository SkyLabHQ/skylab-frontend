import useBurnerWallet from "@/hooks/useBurnerWallet";
import { Box, Button, Text, Image, useDisclosure } from "@chakra-ui/react";
import React from "react";
import BidTacToeTutorial from "@/components/TacToe/BidTacToeTutorial";
import FaucetLinkIcon from "@/components/TacToe/assets/faucet-link.svg";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { faucetUrl } from "@/skyConstants";
import BulbIcon from "@/components/TacToe/assets/bulb.svg";
import { ChainId } from "@/utils/web3Utils";

export const Toolbar = () => {
    const { chainId } = useActiveWeb3React();
    return (
        <Box
            sx={{
                position: "absolute",
                right: "3.125vw",
                top: "1.4063vw",
                display: "flex",
            }}
        >
            <BidTacToeTutorial>
                <Image
                    sx={{
                        width: "2.0833vw",
                        height: "2.0833vw",
                        marginRight: "0.5208vw",
                    }}
                    src={BulbIcon}
                ></Image>
            </BidTacToeTutorial>
            {chainId === ChainId.MUMBAI && (
                <Box
                    sx={{
                        borderRadius: "0.5208vw",
                        width: "2.0833vw",
                        height: "2.0833vw",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "0.1042vw solid #fff",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        window.open(faucetUrl, "_blank");
                    }}
                >
                    <Image
                        src={FaucetLinkIcon}
                        sx={{
                            width: "36px",
                            height: "36px",
                        }}
                    ></Image>
                </Box>
            )}
        </Box>
    );
};
