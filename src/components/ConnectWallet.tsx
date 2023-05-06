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
import { SUPPORTED_WALLETS } from "../skyConstants";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

interface ConnectWalletProps {
    onModalClose: () => void;
}

const ConnectWallet = ({ onModalClose }: ConnectWalletProps): ReactElement => {
    // hooks
    const { activate, setError } = useActiveWeb3React();

    return (
        <React.Fragment>
            <ModalCloseButton left="var(--chakra-space-2)" size="lg" />
            <ModalHeader mt="20px" fontSize="48px" textAlign="center">
                Welcome! Connect your wallet
            </ModalHeader>
            <ModalBody>
                <Stack spacing="15px" p="15px">
                    {Object.values(SUPPORTED_WALLETS).map(
                        ({ name, Icon, connector }) => (
                            <Button
                                key={name}
                                w="65%"
                                margin="0 auto"
                                padding="0 24px"
                                minH="120px"
                                minW="480px"
                                fontSize="64px"
                                leftIcon={<Icon fontSize="64px" />}
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
            <ModalFooter
                fontSize="18px"
                mb="20px"
                justifyContent="center"
                flexDirection="column"
            >
                <Text>First time setting up a crypto wallet?</Text>
                <Link
                    className="underline"
                    href="https://ethereum.org/en/wallets"
                    isExternal
                >
                    Learn more about crypto wallets
                </Link>
            </ModalFooter>
        </React.Fragment>
    );
};

export default ConnectWallet;
