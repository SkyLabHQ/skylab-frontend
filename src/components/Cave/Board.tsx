import { Box, HStack, Img, VStack, Text } from "@chakra-ui/react";
import { useAnimation, motion } from "framer-motion";
import React, { FC, useEffect, useState } from "react";

import { Factory } from ".";
import { Cabin } from "./Cabin";
import { Workshop } from "./Workshop";

type Props = {
    caveLevel: number;
    selectedFactory: Record<number, Factory[]>;
    setSelectedFactory: (factory: Record<number, Factory[]>) => void;
};

export const Board: FC<Props> = ({
    caveLevel,
    setSelectedFactory,
    selectedFactory,
}) => {
    const workshopAnimation = useAnimation();
    const cabinAnimation = useAnimation();

    const onClear = () => {
        setSelectedFactory({
            ...selectedFactory,
            1: [],
        });
    };

    useEffect(() => {
        if (caveLevel === 2) {
            workshopAnimation.start({
                y: -1000,
            });
            cabinAnimation.start({
                y: -820,
            });
        } else {
            workshopAnimation.start({
                y: 0,
            });
            cabinAnimation.start({
                y: 1000,
            });
        }
    }, [caveLevel]);

    return (
        <Box w="55vw" h="77vh" overflowY="hidden" overflowX="visible">
            <motion.div
                animate={workshopAnimation}
                transition={{ type: "tween", duration: 1 }}
            >
                <Workshop
                    selectedFactory={selectedFactory[1]}
                    onClear={onClear}
                />
            </motion.div>
            <motion.div
                animate={cabinAnimation}
                initial={{ y: 1000 }}
                transition={{ type: "tween", duration: 1 }}
            >
                <Cabin
                    selectedFactory={selectedFactory[2]}
                    setSelectedFactory={(val) =>
                        setSelectedFactory({
                            ...selectedFactory,
                            2: val,
                        })
                    }
                />
            </motion.div>
        </Box>
    );
};
