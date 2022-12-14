import { Heading, Image, Stack } from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { motion, useAnimation } from "framer-motion";

import "./GradientCard.css";
import Background from "../assets/gradient-card-background.svg";

export interface GradientCardProps {
    title: string;
    description: string;
    img: string;
    position: Record<string, number>;
}

const GradientCard = ({
    title,
    description,
    img,
    position,
}: GradientCardProps): ReactElement => {
    const imgAnimation = useAnimation();
    const textAnimation = useAnimation();
    const [delay, setDelay] = useState(0.25);

    const onHoverStart = async () => {
        setDelay(0);
        imgAnimation.start({ width: 300, height: 300 });
        textAnimation.start({ maxWidth: 470, whiteSpace: "pre-wrap" });
    };

    const onHoverEnd = async () => {
        setDelay(0.25);
        imgAnimation.start({ width: 100, height: 100 });
        textAnimation.start({ maxWidth: 270, whiteSpace: "nowrap" });
    };

    return (
        <motion.div
            style={{
                padding: "60px 15px",
                borderRadius: "0.75rem",
                border: "2px solid white",
                cursor: "pointer",
                width: "48%",
                height: "330px",
                position: "absolute",
                overflow: "hidden",
                ...position,
            }}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            whileHover={{
                backgroundImage: `url(${Background})`,
                backgroundColor: "white",
                backgroundSize: "cover",
                width: "100%",
                height: "700px",
                paddingTop: "120px",
                zIndex: 1000,
                color: "black",
            }}
            transition={{ type: "tween", duration: 1 }}
        >
            <Stack spacing="15px" alignItems="center" textAlign="center">
                <motion.div
                    style={{ width: 100, height: 100 }}
                    animate={imgAnimation}
                    transition={{ type: "tween", duration: 1, delay }}
                >
                    <Image src={img} objectFit="cover" w="full" />
                </motion.div>
                <Stack spacing="30px">
                    <Heading>{title}</Heading>
                    <motion.p
                        style={{
                            maxWidth: "270px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                        }}
                        animate={textAnimation}
                        transition={{ type: "tween", duration: 1, delay }}
                    >
                        {description}
                    </motion.p>
                </Stack>
            </Stack>
        </motion.div>
    );
};

export default GradientCard;
