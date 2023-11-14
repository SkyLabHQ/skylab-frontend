import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";

const ContentComponent = (props: any) => {
    const isLastStep = props.currentStep === props.steps.length - 1;
    const content = props.steps[props.currentStep].content;
    return (
        <Box
            sx={{
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                fontWeight: "600",
                background: "#fff",
                color: "#000",
                fontFamily: "Orbitron",
            }}
        >
            {/* Check if the step.content is a function or a string */}
            {typeof content === "function" ? content({ ...props }) : content}
            {/* <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                }}
            >
                <Text
                    sx={{
                        fontSize: "20px",
                        color: "#787878",
                        fontWeight: "600",
                    }}
                >
                    ({props.currentStep + 1}/{props.steps.length})
                </Text>
                <button
                    style={{
                        background: "#FDDC2D",
                        color: "#000",
                        width: "84px",
                        height: "40px",
                        fontSize: "24px",
                        fontWeight: "600",
                        marginLeft: "10px",
                        borderRadius: "5px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                    onClick={() => {
                        if (isLastStep) {
                            props.setIsOpen(false);
                        } else {
                            props.setCurrentStep((s: any) => s + 1);
                        }
                    }}
                >
                    OK
                </button>
            </Box> */}
        </Box>
    );
};

export default ContentComponent;
