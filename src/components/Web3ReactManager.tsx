import { WarningIcon } from "@chakra-ui/icons";
import {
    Button,
    Center,
    Heading,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { CHAIN_ID_MAP, PolygonIcon } from "../constants";
import useAddNetworkToMetamask from "../hooks/useAddNetworkToMetamask";
import useEagerConnect from "../hooks/useEagerConnect";
import useInactiveListener from "../hooks/useInactiveListener";
import { ChainId, network, NETWORK_CONTEXT_NAME } from "../utils/web3Utils";
import Header from "./Header";

export default function Web3ReactManager({
    children,
}: {
    children: JSX.Element;
}): JSX.Element | null {
    // if we catch an error, prompt to switch to Polygon
    const addNetworkToMetask = useAddNetworkToMetamask();

    // translations
    const { t } = useTranslation();

    // eagerly connect to browser injected level
    const { active } = useWeb3React();
    const {
        active: networkActive,
        error: networkError,
        activate: activateNetwork,
    } = useWeb3React(NETWORK_CONTEXT_NAME);

    // try to eagerly connect to an injected provider, if it exists and has granted access already
    const triedEager = useEagerConnect();

    // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
    useEffect(() => {
        if (triedEager && !networkActive && !networkError && !active) {
            activateNetwork(network);
        }
    }, [triedEager, networkActive, networkError, activateNetwork, active]);

    // listen for changes on the injected connector, if exists
    useInactiveListener(!triedEager);

    // spin if we havent tried eagerly connecting yet
    if (!triedEager) {
        return (
            <Center minH="100vh">
                <Spinner size="xl" colorScheme="blue" />
            </Center>
        );
    }

    // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
    if (triedEager && !active && networkError) {
        // get chain and network name from our map
        const chainId = /id: (\d*)/.exec(networkError.message);
        const networkName = CHAIN_ID_MAP[Number(chainId?.[1] || -1)];

        // handle errors
        if (networkError instanceof UnsupportedChainIdError) {
            return (
                <>
                    <Header />
                    <Center minH="100vh">
                        <Stack spacing="30px" alignItems="center">
                            <WarningIcon fontSize="50px" />
                            <Stack spacing="10px" alignItems="center">
                                <Heading as="h1" fontSize="xx-large">
                                    {t("wrongNetwork")}
                                </Heading>
                                <Text color="whiteAlpha.600">
                                    <Trans
                                        i18nKey="wrongNetworkSwitchPrompt"
                                        values={{ networkName }}
                                    />
                                </Text>
                            </Stack>
                            <Button
                                w="full"
                                onClick={() =>
                                    addNetworkToMetask(ChainId.POLYGON)
                                }
                                leftIcon={<PolygonIcon boxSize="27px" />}
                                variant="solid"
                            >
                                {t("switchToPolygon")}
                            </Button>
                        </Stack>
                    </Center>
                </>
            );
        } else if (networkError instanceof UserRejectedRequestError) {
            // TO-DO: add toast here
        } else {
            return (
                <>
                    <Header />
                    <Center minH="100vh">
                        <Heading as="h1" fontSize="xx-large">
                            Unknown error occurred. Please reload the page.
                        </Heading>
                    </Center>
                </>
            );
        }
    }

    return children;
}
