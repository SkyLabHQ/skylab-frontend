import {
    Box,
    Button,
    Flex,
    IconButton,
    Image,
    Link,
    Stack,
    Text,
    Tooltip,
    useDisclosure,
    useMediaQuery,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import React, { ReactElement, useEffect } from "react";
import { motion } from "framer-motion";
import { HamburgerIcon } from "@chakra-ui/icons";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.svg";
import Web3Status from "./Web3Status";
import UserSettings from "./UserSettings";
import MediaMenu from "./MediaMenu";

const Header = (): ReactElement => {
    // hooks
    const { t } = useTranslation();

    // state
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleToggle = () => (isOpen ? onClose() : onOpen());
    const MotionBox = motion(Box);

    // close mobile menu if we left it open
    const [largerThan767] = useMediaQuery("(min-width: 767px)");

    useEffect(() => {
        if (largerThan767) {
            onClose();
        }
    }, [largerThan767]);

    return (
        <MotionBox
            as="header"
            position="fixed"
            top="0"
            backdropFilter="blur(10px)"
            bg="blackAlpha.80"
            w="100%"
            h={isOpen ? "300px" : "80px"}
            dropShadow="lg"
            px="30px"
            py="10px"
            zIndex={10}
            whileHover={{ opacity: 1, duration: 1 }}
            initial={{ opacity: isOpen || isMobile ? 1 : 0 }}
        >
            <Flex
                alignItems="center"
                justifyContent="space-between"
                color="white"
                wrap="wrap"
                fontFamily="Glass Antiqua"
            >
                <Box mr={5} boxSize={{ base: "45px", lg: "60px", xl: "80px" }}>
                    <Link
                        as={ReactLink}
                        to="/"
                        w="fit-content"
                        onClick={onClose}
                    >
                        <Image src={logo} alt="Logo" />
                    </Link>
                </Box>
                <IconButton
                    onClick={handleToggle}
                    display={{ base: "block", md: "none" }}
                    aria-label="Menu"
                    title="Menu"
                    icon={<HamburgerIcon />}
                />
                <Stack
                    direction={{ base: "column", md: "row" }}
                    display={{ base: isOpen ? "block" : "none", md: "flex" }}
                    width={{ base: "full", md: "auto" }}
                    alignItems="center"
                    spacing={{ base: 1, md: 14 }}
                    flexGrow={0.5}
                    mt={{ base: 4, md: 0 }}
                    fontSize={{ base: "16px", lg: "21px" }}
                >
                    <Link
                        className="underline"
                        as={ReactLink}
                        to="/"
                        w="fit-content"
                        onClick={onClose}
                    >
                        <Text>{t("home")}</Text>
                    </Link>
                    <Link
                        className="underline"
                        as={ReactLink}
                        to="/mint"
                        w="fit-content"
                        onClick={onClose}
                    >
                        <Text>{t("mint")}</Text>
                    </Link>
                    <Tooltip label={t("comingSoon")} aria-label="A tooltip">
                        <Link
                            as={ReactLink}
                            to="#"
                            variant="unstyled"
                            m="0"
                            opacity="0.4"
                            cursor="not-allowed"
                            boxShadow="var(--chakra-shadows-none)"
                            _hover={{ textDecoration: "none" }}
                        >
                            {t("bag")}
                        </Link>
                    </Tooltip>
                    <MediaMenu />
                </Stack>
                <Box
                    display={{ base: isOpen ? "block" : "none", md: "block" }}
                    mt={{ base: 4, md: 0 }}
                >
                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        gridGap="10px"
                    >
                        <Web3Status />
                        {/* <UserSettings /> */}
                    </Flex>
                </Box>
            </Flex>
        </MotionBox>
    );
};

export default Header;
