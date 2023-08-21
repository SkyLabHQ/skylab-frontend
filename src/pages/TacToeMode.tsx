import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import { Box, Button, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TacToeMode = () => {
    const navigate = useNavigate();
    const { setIsKnobVisible } = useKnobVisibility();

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);
    return (
        <Box>
            <Text
                onClick={() => {
                    navigate(-1);
                }}
            >
                Back
            </Text>

            <Button
                onClick={() => {
                    navigate("/tactoe");
                }}
            >
                Normal Version
            </Button>
            <Button
                onClick={() => {
                    navigate("/tactoe");
                }}
            >
                Discount Version
            </Button>
        </Box>
    );
};

export default TacToeMode;
