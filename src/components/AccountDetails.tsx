import { CheckIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Button,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    Flex,
    ModalFooter,
    Text,
    useClipboard,
    Box,
    Link,
} from "@chakra-ui/react";
import { find } from "lodash";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_WALLETS } from "../constants";
import useActiveWeb3React from "../hooks/useActiveWeb3React";
import useSwitchProfiles from "../hooks/useSwitchProfiles";
import { getBlockExplorerLink, shortenAddress } from "../utils";
import Identicon from "./Identicon";

interface AccountDetailsProps {
    onModalClose: () => void;
}

const AccountDetails = ({
    onModalClose,
}: AccountDetailsProps): ReactElement => {
    // hooks
    const { account, connector } = useActiveWeb3React();
    const { t } = useTranslation();
    const { hasCopied, onCopy } = useClipboard(account ?? "", {
        timeout: 1000,
    });
    const switchProfiles = useSwitchProfiles();

    const wallet = find(SUPPORTED_WALLETS, ["connector", connector]);
    const WalletIcon = wallet?.Icon!;

    return (
        <>
            <ModalHeader fontSize="x-large">{t("account")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Flex justifyContent="space-between" alignItems="end">
                    <Stack spacing="1px">
                        <Flex alignItems="center" gridGap="7px">
                            <Text
                                mt="5px"
                                textAlign="center"
                                fontSize="13px"
                                color="whiteAlpha.600"
                            >
                                {t("connectedWith")} {wallet?.name}
                            </Text>
                            <Box boxSize="20px">
                                <WalletIcon />
                            </Box>
                        </Flex>
                        <Flex
                            gridGap="3px"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Identicon />
                            <Flex alignItems="center" gridGap="7px">
                                <Text fontSize="24px">
                                    {account && shortenAddress(account)}
                                </Text>
                                <Link
                                    href={getBlockExplorerLink(
                                        account || "",
                                        "address",
                                    )}
                                    isExternal
                                >
                                    <ExternalLinkIcon
                                        fontSize="15px"
                                        cursor="pointer"
                                    />
                                </Link>
                            </Flex>
                        </Flex>
                    </Stack>
                    <Button
                        onClick={onCopy}
                        leftIcon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                        variant="ghost"
                    >
                        {hasCopied ? t("copied") : t("copyAddress")}
                    </Button>
                </Flex>
            </ModalBody>
            <ModalFooter>
                {wallet?.name === "MetaMask" && (
                    <Box w="full" px="15px">
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                switchProfiles();
                                onModalClose();
                            }}
                            w="full"
                        >
                            {t("switchAccounts")}
                        </Button>
                    </Box>
                )}
            </ModalFooter>
        </>
    );
};

export default AccountDetails;
