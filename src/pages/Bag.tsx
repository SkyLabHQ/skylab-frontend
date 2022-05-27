import { Box, Center, Stack } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import TextReveal from "../components/TextReveal";
import UserNftBag from "../components/UserNftBag";

const Bag = (): ReactElement => {
    const { t } = useTranslation();

    return (
        <Box mt="100px" pos="relative">
            <Center>
                <TextReveal fontSize="7vw">{t("comingSoon")}</TextReveal>
            </Center>
            <Stack spacing="5vw">
                <UserNftBag name={t("spaceships")} />
                <UserNftBag name={t("pilots")} />
                <UserNftBag name={t("loots")} />
            </Stack>
        </Box>
    );
};

export default Bag;
