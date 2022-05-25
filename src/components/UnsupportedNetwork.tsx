import {
    Button,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { PolygonIcon } from "../constants";
import useAddNetworkToMetamask from "../hooks/useAddNetworkToMetamask";
import { ChainId } from "../utils/web3Utils";

const UnsupportedNetwork = (): ReactElement => {
    // hooks
    const addNetworkToMetask = useAddNetworkToMetamask();
    const { t } = useTranslation();

    return (
        <>
            <ModalHeader fontSize="x-large">
                {t("supportedNetworks")}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Stack spacing="20px" p="10px">
                    <Text fontSize="lg">{t("connectToPolygon")}</Text>
                    <Button
                        w="full"
                        onClick={() => addNetworkToMetask(ChainId.POLYGON)}
                        leftIcon={<PolygonIcon boxSize="27px" />}
                        variant="solid"
                    >
                        {t("switchToPolygon")}
                    </Button>
                </Stack>
            </ModalBody>
        </>
    );
};

export default UnsupportedNetwork;
