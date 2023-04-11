import {
    Box,
    Flex,
    Image,
    Link,
    Stack,
    Text,
    Tooltip,
    useDisclosure,
    useMediaQuery,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import React, {
    Fragment,
    ReactElement,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { motion, useAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";

import logo from "../assets/logo.svg";
import knob from "../assets/knob.png";
import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import Web3Status from "./Web3Status";
import UserSettings from "./UserSettings";
import MediaMenu from "./MediaMenu";

const Header = (): ReactElement => {
    // hooks
    const { t } = useTranslation();

    // state
    const { isOpen, onOpen, onClose } = useDisclosure();
    const MotionBox = motion(Box);
    const menuAnimation = useAnimation();
    const scrollTopWhenOpenRef = useRef(0);
    const { isKnobVisible } = useKnobVisibility();
    const headerType = useMemo(() => {
        const hash = window.location.hash;
        if (hash.endsWith("/") || hash.endsWith("mint") || hash === "") {
            return "skyLab";
        }
        return "apollo";
    }, [window.location.hash]);

    // close mobile menu if we left it open
    const [largerThan767] = useMediaQuery("(min-width: 767px)");

    const onKnobClick = () => {
        onOpen();
        scrollTopWhenOpenRef.current = document.documentElement.scrollTop;
    };

    const scrollListener = () => {
        if (document.documentElement.scrollTop === 0 && isKnobVisible) {
            onOpen();
        } else if (
            Math.abs(
                scrollTopWhenOpenRef.current -
                    document.documentElement.scrollTop,
            ) > 200
        ) {
            onClose();
        }
    };

    useEffect(() => {
        if (largerThan767) {
            onClose();
        }
    }, [largerThan767]);

    useEffect(() => {
        menuAnimation.start({
            opacity: isOpen ? 1 : 0,
            transition: { duration: 0.5 },
        });
    }, [isOpen]);

    useEffect(() => {
        if (!isKnobVisible) {
            onClose();
        } else {
            onOpen();
        }

        window.addEventListener("scroll", scrollListener);
        return () => {
            window.removeEventListener("scroll", scrollListener);
        };
    }, [isKnobVisible]);

    return (
        <Fragment>
            {!isOpen && isKnobVisible ? (
                <Image
                    position="fixed"
                    top="0"
                    left="10vw"
                    cursor="pointer"
                    w="50px"
                    opacity="0.5"
                    zIndex="1000"
                    src={knob}
                    onClick={onKnobClick}
                />
            ) : null}
            <MotionBox
                as="header"
                position="fixed"
                top="0"
                backdropFilter="blur(10px)"
                bg="blackAlpha.80"
                w="100%"
                h="80px"
                dropShadow="lg"
                px="30px"
                py="10px"
                zIndex={10}
                display={isOpen ? "block" : "none"}
                initial={{
                    opacity: 0,
                }}
                animate={menuAnimation}
            >
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    color="white"
                    wrap="wrap"
                >
                    <Box
                        mr={5}
                        boxSize={{ base: "45px", lg: "60px", xl: "80px" }}
                    >
                        <Link
                            as={ReactLink}
                            to="/"
                            w="fit-content"
                            onClick={onClose}
                        >
                            <Image src={logo} alt="Logo" />
                        </Link>
                    </Box>
                    {headerType === "skyLab" ? (
                        <Stack
                            direction={{ base: "column", md: "row" }}
                            display={{
                                base: isOpen ? "block" : "none",
                                md: "flex",
                            }}
                            width={{ base: "full", md: "auto" }}
                            alignItems="center"
                            spacing={{ base: 1, md: 14 }}
                            flexGrow={0.9}
                            mt={{ base: 4, md: 0 }}
                            fontSize={{ base: "16px", lg: "21px" }}
                        >
                            <Link
                                className="underline"
                                as={ReactLink}
                                to="/mint"
                                w="fit-content"
                                onClick={onClose}
                            >
                                <Text>Preview</Text>
                            </Link>
                            {/* <Tooltip
                                label={t("comingSoon")}
                                aria-label="A tooltip"
                            >
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
                            </Tooltip> */}
                        </Stack>
                    ) : null}
                    <Box
                        position="absolute"
                        left="50%"
                        transform="translateX(-50%)"
                    >
                        <MediaMenu />
                    </Box>
                    <Box
                        display={{
                            base: isOpen ? "block" : "none",
                            md: "block",
                        }}
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
        </Fragment>
    );
};

export default Header;
