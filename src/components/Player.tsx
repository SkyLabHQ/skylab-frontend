import { Box, chakra, Flex, Image } from "@chakra-ui/react";
import {
    AnimationControls,
    isValidMotionProp,
    motion,
    Variants,
} from "framer-motion";
import React, { memo, ReactElement } from "react";

interface PlayersProps {
    animationControl: AnimationControls;
    img: string;
    variants: Variants;
    playerKey: string;
    onClickPlayer: (playerKey: string) => void;
}

const Player = memo(
    ({
        animationControl,
        img,
        variants,
        playerKey,
        onClickPlayer,
    }: PlayersProps): ReactElement => {
        const MotionBox = chakra(motion.div, {
            shouldForwardProp: (prop) =>
                isValidMotionProp(prop) || prop === "children",
        });

        return (
            <MotionBox
                cursor="pointer"
                variants={variants}
                whileHover="hover"
                whileTap={{ scale: 0.8 }}
                whileFocus={{ scale: 1.5 }}
                initial={`${playerKey}Initial`}
                animate={animationControl}
                boxSize={{
                    base: "75px",
                    sm: "100px",
                    md: "125px",
                    lg: "175px",
                    xl: "200px",
                }}
                exit={"exit"}
                layout
            >
                <Image
                    w="100%"
                    src={img}
                    onClick={() => onClickPlayer(playerKey)}
                />
            </MotionBox>
        );
    },
    (prev, next) => prev.playerKey === next.playerKey,
);

Player.displayName = "Player";
export default Player;
