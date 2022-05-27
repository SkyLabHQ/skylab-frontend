import {
    Button,
    Link,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    ModalFooter,
    Text,
} from "@chakra-ui/react";
import { UnsupportedChainIdError } from "@web3-react/core";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_WALLETS } from "../constants";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

interface ConnectWalletProps {
    onModalClose: () => void;
}

const ConnectWallet = ({ onModalClose }: ConnectWalletProps): ReactElement => {
    // hooks
    const { activate, setError } = useActiveWeb3React();
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <ModalHeader mt="20px" fontSize="40px" textAlign="center">
                {t("connectWallet")}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Stack spacing="15px" p="15px">
                    {Object.values(SUPPORTED_WALLETS).map(
                        ({ name, Icon, connector }) => (
                            <Button
                                key={name}
                                w="full"
                                minH="50px"
                                fontSize="18px"
                                leftIcon={
                                    <Icon
                                        fontSize="30px"
                                        mb={
                                            name === "Coinbase Wallet"
                                                ? "6px"
                                                : 0
                                        }
                                    />
                                }
                                onClick={() => {
                                    activate(connector, undefined, true).catch(
                                        (e) => {
                                            if (
                                                e instanceof
                                                UnsupportedChainIdError
                                            ) {
                                                void activate(connector);
                                            } else {
                                                setError(e);
                                            }
                                        },
                                    );
                                    onModalClose();
                                }}
                            >
                                {name}
                            </Button>
                        ),
                    )}
                </Stack>
            </ModalBody>
            <ModalFooter fontSize="18px" mb="20px" justifyContent="center">
                <Link
                    className="underline"
                    href="https://ethereum.org/en/wallets"
                    isExternal
                >
                    <Text>{t("needWallet")}</Text>
                </Link>
            </ModalFooter>
        </React.Fragment>
    );
};

export default ConnectWallet;
