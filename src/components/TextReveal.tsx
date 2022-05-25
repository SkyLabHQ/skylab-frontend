import { Heading } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import React, { ReactElement } from "react";

const charVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
    },
};

const textVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delay: 0.7,
            staggerChildren: 0.1,
        },
    },
};

const TextReveal = ({
    children,
    fontSize,
}: React.PropsWithChildren<{ fontSize: string }>): ReactElement => {
    const MotionHeading = motion(Heading);
    const text = children as string;
    return (
        <MotionHeading
            initial="hidden"
            animate="visible"
            variants={textVariants}
            fontSize={fontSize}
        >
            {text.split("").map((char, index) => (
                <motion.span variants={charVariants} key={`${char}-${index}`}>
                    {char}
                </motion.span>
            ))}
        </MotionHeading>
    );
};

export default TextReveal;
