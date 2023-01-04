import {
    Button,
    IconButton,
    Modal,
    ModalContent,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import Identicon from "./Identicon";
import { shortenAddress } from "../utils";
import { ChainId, injected } from "../utils/web3Utils";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle, FaWallet } from "react-icons/fa";
import AccountDetails from "./AccountDetails";
import UnsupportedNetwork from "./UnsupportedNetwork";
import ConnectWallet from "./ConnectWallet";
import { PolygonIcon } from "../constants";
import SupportedNetworks from "./SupportedNetworks";

const Web3Status = (): ReactElement => {
    // state
    const { account, chainId, error } = useActiveWeb3React();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [walletConnected, setWalletConnected] = useState(false);
    const [connectedNetworkModalOpen, setConnectedNetworkModalOpen] =
        useState(false);

    // hooks
    const { t } = useTranslation();

    // check injected authorized state
    injected.isAuthorized().then((isAuthorized: boolean) => {
        setWalletConnected(isAuthorized);
    });

    // action handlers for modal content close state
    const onModalClose = (): void => {
        onClose();
        setConnectedNetworkModalOpen(false); // reset state
    };

    return (
        <React.Fragment>
            <Button
                variant="outline"
                px={5}
                textTransform="capitalize"
                title={
                    account
                        ? "Account details"
                        : error || walletConnected
                        ? "Switch network"
                        : t("connectWallet")
                }
                _hover={{ color: "gray.900", bg: "blue.400" }}
                onClick={onOpen}
                rightIcon={
                    account ? (
                        <Identicon />
                    ) : error || walletConnected ? (
                        <FaExclamationTriangle size="20px" />
                    ) : (
                        <FaWallet size="20px" />
                    )
                }
            >
                {account
                    ? shortenAddress(account || "")
                    : error || walletConnected
                    ? t("wrongNetwork")
                    : t("connectWallet")}
            </Button>
            <Modal isOpen={isOpen} onClose={onModalClose} size="2xl" isCentered>
                <ModalOverlay
                    backdropFilter="blur(30px)"
                    bg="rgba(0, 0, 0, 0.2)"
                />
                <ModalContent bgColor="whiteAlpha.200">
                    {connectedNetworkModalOpen ? (
                        <SupportedNetworks />
                    ) : account ? (
                        <AccountDetails onModalClose={onModalClose} />
                    ) : error || walletConnected ? (
                        <UnsupportedNetwork />
                    ) : (
                        <ConnectWallet onModalClose={onModalClose} />
                    )}
                </ModalContent>
            </Modal>
            {chainId === ChainId.POLYGON && account && (
                <IconButton
                    aria-label={t("network")}
                    title={`Polygon ${t("network")}`}
                    icon={<PolygonIcon fontSize="20px" />}
                    onClick={() => {
                        setConnectedNetworkModalOpen(true);
                        onOpen();
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default Web3Status;
