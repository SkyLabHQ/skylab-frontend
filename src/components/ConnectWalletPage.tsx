import useAddNetworkToMetamask from "@/hooks/useAddNetworkToMetamask";
import { DEAFAULT_CHAINID, injected } from "@/utils/web3Utils";
import { Box, Text, Image } from "@chakra-ui/react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "./Button/Index";
import BackIcon from "@/components/TacToe/assets/back-arrow.svg";

const ConnectWalletPage = () => {
    const addNetworkToMetask = useAddNetworkToMetamask();
    const navigate = useNavigate();
    const { activate } = useWeb3React();
    return (
        <Box
            sx={{
                position: "relative",
                width: "100vw",
                height: "100vh",
                zIndex: 200,
                background: "#303030",
            }}
        >
            <Image
                src={BackIcon}
                onClick={() => navigate("/activities")}
                sx={{
                    position: "absolute",
                    left: "1.0417vw",
                    top: "1.0417vw",
                    width: "2.0833vw",
                }}
            ></Image>
            <Box
                w="25.2604vw"
                left="50%"
                top="50%"
                transform="translateX(-50%)"
                paddingTop="1.0417vw"
                zIndex={22}
                pos="absolute"
                cursor={"pointer"}
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
                        sx={{
                            fontFamily: "Orbitron",
                        }}
                    >
                        Connect Wallet
                    </Text>
                </SubmitButton>
            </Box>
        </Box>
    );
};

export default ConnectWalletPage;
