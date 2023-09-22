import { useGameContext } from "@/pages/TacToe";
import { Box, Button } from "@chakra-ui/react";
import React from "react";

const ResultButton = () => {
    const { onStep } = useGameContext();
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
            }}
        >
            <Button
                sx={{
                    border: "3px solid #bcbbbe !important",
                    borderRadius: "18px",
                    width: "100px",
                    height: "52px",
                    color: "#d9d9d9",
                    fontSize: "20px",
                    marginRight: "24px",
                }}
                variant={"outline"}
                onClick={() => {
                    onStep(4);
                }}
            >
                Next
            </Button>
            <Button
                sx={{
                    border: "3px solid #fff !important",
                    borderRadius: "18px",
                    width: "100px",
                    height: "52px",
                    background: "#fff",
                    color: "#000",
                    fontSize: "20px",
                }}
                colorScheme={"white"}
                onClick={() => {
                    onStep(3);
                }}
            >
                Share
            </Button>
        </Box>
    );
};

export default ResultButton;
