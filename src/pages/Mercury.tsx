import { Box, Img } from "@chakra-ui/react";
import React, { ReactElement, useEffect } from "react";

import { useKnobVisibility } from "../contexts/KnobVisibilityContext";
import Background from "../assets/tournament-background.png";
import { Tournament } from "../components/Tournament";

const Mercury = (): ReactElement => {
    const { setIsKnobVisible } = useKnobVisibility();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);

    return (
        <Box w="100vw" h="100vh" pos="relative" bg={`url(${Background})`}>
            <Tournament />
        </Box>
    );
};

export default Mercury;
