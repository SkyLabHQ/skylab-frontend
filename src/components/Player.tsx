import { twitterUrl } from "@/skyConstants";
import {
    Box,
    chakra,
    Flex,
    Image,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    Text,
} from "@chakra-ui/react";
import {
    AnimationControls,
    isValidMotionProp,
    motion,
    Variants,
} from "framer-motion";
import React, { memo, ReactElement, useState } from "react";

interface PlayersProps {
    width?: string;
    animationControl: AnimationControls;
    img: string;
    variants: Variants;
    playerKey: string;
    toolTip?: boolean;
    onClickPlayer: (playerKey: string) => void;
}

const Player = memo(
    ({
        width = "100%",
        animationControl,
        img,
        variants,
        playerKey,
        onClickPlayer,
        toolTip,
    }: PlayersProps): ReactElement => {
        const MotionBox = chakra(motion.div, {
            shouldForwardProp: (prop) =>
                isValidMotionProp(prop) || prop === "children",
        });

        return (
            <MotionBox
                cursor="pointer"
                variants={variants}
                // whileHover="hover"
                // whileTap={{ scale: 0.8 }}
                // whileFocus={{ scale: 1.5 }}
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
                display="flex"
                justifyContent="center"
            >
                {toolTip ? (
                    <Popover placement="top">
                        <PopoverTrigger>
                            <Image w={width} src={img} />
                        </PopoverTrigger>
                        <PopoverContent
                            sx={{
                                background: "rgba(255, 255, 255, 0.8) ",
                                borderRadius: "10px",
                                border: "none",
                                color: "#000",
                                textAlign: "center",
                                "&:focus": {
                                    outline: "none !important",
                                    boxShadow: "none !important",
                                },
                            }}
                        >
                            <PopoverBody>
                                <Text
                                    sx={{ fontSize: "20px" }}
                                    onClick={() => {
                                        window.open(twitterUrl);
                                    }}
                                >
                                    Reveal during
                                    <span
                                        style={{ textDecoration: "underline" }}
                                    >
                                        {" "}
                                        tournament
                                    </span>
                                    🔗
                                </Text>
                                <Text sx={{ fontSize: "24px" }}>May 2023</Text>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Image
                        w={width}
                        src={img}
                        onClick={() => {
                            onClickPlayer(playerKey);
                        }}
                    />
                )}
            </MotionBox>
        );
    },
    (prev, next) => prev.playerKey === next.playerKey,
);

Player.displayName = "Player";
export default Player;
