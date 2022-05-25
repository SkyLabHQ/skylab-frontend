import {
    Flex,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Radio,
    RadioGroup,
    Stack,
    Switch,
    Text,
} from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiDotsVertical } from "react-icons/bi";
import { LANGUAGE_OPTIONS } from "../constants";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

const UserSettings = (): ReactElement => {
    // hooks
    const { t, i18n } = useTranslation();

    // state
    // TO-DO: change to theme
    const [isDark, setIsDark] = useState(true);
    const initialFocusRef = useRef<HTMLDivElement>(null);
    const [lang, setLang] = useState(i18n.language.split("-")[0]);

    // set the lang user is connected to by default
    useEffect(() => {
        setLang(i18n.language.split("-")[0]);
    }, []);

    return (
        <Popover>
            <PopoverTrigger>
                <IconButton
                    aria-label={t("yourSettings")}
                    title={t("yourSettings")}
                    icon={<BiDotsVertical size={25} />}
                />
            </PopoverTrigger>
            <PopoverContent maxW="250px">
                <PopoverHeader fontWeight="bold" fontSize="20px">
                    {t("yourSettings")}
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <Stack spacing="20px" p="10px">
                    <Stack spacing="5px">
                        <Text fontWeight="semibold" fontSize="18px">
                            {t("language")}
                        </Text>
                        <RadioGroup
                            onChange={i18n.changeLanguage}
                            value={lang}
                            ref={initialFocusRef}
                        >
                            <Stack direction="row">
                                {LANGUAGE_OPTIONS.map(
                                    ({ displayText, i18nKey }) => (
                                        <Radio key={i18nKey} value={i18nKey}>
                                            {displayText}
                                        </Radio>
                                    ),
                                )}
                            </Stack>
                        </RadioGroup>
                    </Stack>
                    <Stack spacing="10px">
                        <Text fontWeight="semibold" fontSize="18px">
                            {t("theme")}
                        </Text>
                        <Flex
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Flex alignItems="center" gridGap="20px">
                                <Switch
                                    isChecked={isDark}
                                    isDisabled
                                    onChange={() => setIsDark(!isDark)}
                                />
                                {isDark ? (
                                    <BsMoonStarsFill size={25} />
                                ) : (
                                    <BsSunFill size={25} />
                                )}
                            </Flex>
                            <Text color="whiteAlpha.800" fontSize="16px">
                                {t("comingSoon")}
                            </Text>
                        </Flex>
                    </Stack>
                </Stack>
            </PopoverContent>
        </Popover>
    );
};

export default UserSettings;
