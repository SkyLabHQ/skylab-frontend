import { Box, Center } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import TextReveal from "../components/TextReveal";

const Bag = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <Box mt={isMobile ? "200px" : "150px"} pos="relative">
            <Center>
                <TextReveal fontSize="7vw">{t("comingSoon")}</TextReveal>
            </Center>
        </Box>
    );
};

export default Bag;
