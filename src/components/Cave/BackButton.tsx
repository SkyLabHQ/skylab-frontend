import { Img } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import React, { FC } from "react";

import Background from "../../assets/cave-back-background.svg";
import Door from "../../assets/cave-back-door.svg";
import Front from "../../assets/cave-back-front.svg";

type Props = {
    onClick: () => void;
};

export const BackButton: FC<Props> = ({ onClick }) => {
    const imgAnimation = useAnimation();

    const onHoverStart = () => {
        imgAnimation.start({ top: -500 });
    };

    const onHoverEnd = () => {
        imgAnimation.start({ top: 0 });
    };

    return (
        <motion.div
            onClick={onClick}
            // onHoverStart={onHoverStart}
            // onHoverEnd={onHoverEnd}
            style={{
                width: "150px",
                height: "155px",
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
            }}
        >
            <Img
                src={Background}
                pos="absolute"
                left={0}
                top={0}
                w="150px"
                h="155px"
            />
            <motion.img
                src={Door}
                animate={imgAnimation}
                transition={{ type: "tween", duration: 1 }}
                style={{
                    width: "150px",
                    height: "155px",
                    position: "absolute",
                }}
            />
            <Img
                src={Front}
                pos="absolute"
                left={0}
                top={0}
                w="150px"
                h="155px"
            />
        </motion.div>
    );
};
