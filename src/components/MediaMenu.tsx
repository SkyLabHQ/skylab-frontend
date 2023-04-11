import {
    Box,
    Button,
    Center,
    Image,
    Link,
    Stack,
    useOutsideClick,
} from "@chakra-ui/react";
import React, {
    Dispatch,
    ReactElement,
    SetStateAction,
    useRef,
    useState,
} from "react";
import {
    BOX_VARIANTS,
    LIST_ITEM_VARIANTS,
    LIST_VARIANTS,
    LOGOS,
} from "../constants";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const MediaMenu = (): ReactElement => {
    // state
    const [isOpen, toggleOpen] = useState(false);
    const MotionBox = motion(Box);

    // hooks
    const { t } = useTranslation();

    return (
        <MotionBox
            pos="relative"
            variants={BOX_VARIANTS}
            animate={isOpen ? "open" : "closed"}
            initial="closed"
        >
            <Button
                variant="ghost"
                _hover={{ bg: "none" }}
                _active={{ bg: "none" }}
                _focus={{ bg: "none" }}
                bg="none"
                as={Button}
                p={0}
                rightIcon={
                    isOpen ? <FaChevronCircleUp /> : <FaChevronCircleDown />
                }
                onClick={() => toggleOpen(!isOpen)}
                fontSize={{ base: "16px", lg: "21px" }}
            >
                Request Early Access
            </Button>
            <Navigation onToggle={toggleOpen} />
        </MotionBox>
    );
};

const Navigation = ({
    onToggle,
}: {
    onToggle: Dispatch<SetStateAction<boolean>>;
}): ReactElement => {
    // state
    const MotionStack = motion(Stack);
    const ref = useRef<HTMLDivElement>(null);

    // hooks
    useOutsideClick({
        ref: ref,
        handler: () => onToggle(false),
    });

    return (
        <Box
            ref={ref}
            pos="absolute"
            top={{ base: "0vw", md: "7vw", lg: "6vw", xl: "3vw" }}
            right="-50%"
        >
            <MotionStack variants={LIST_VARIANTS} spacing={3} direction="row">
                {LOGOS.map(({ logo, url }, index) => (
                    <CustomListItem logo={logo} url={url} key={index} />
                ))}
            </MotionStack>
        </Box>
    );
};

const CustomListItem = ({
    logo,
    url,
}: {
    logo: string;
    url: string;
}): ReactElement => {
    const MotionListItem = motion(Box);
    return (
        <MotionListItem
            variants={LIST_ITEM_VARIANTS}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.85 }}
            bgColor="blackAlpha.800"
            borderRadius="10px"
            p="10px"
            zIndex={11}
            boxSize={{ base: "35px", md: "50px", lg: "60px", xl: "70px" }}
        >
            <Center h="full">
                <Link href={url ? url : undefined} isExternal>
                    <Image src={logo} />
                </Link>
            </Center>
        </MotionListItem>
    );
};

export default MediaMenu;
