import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import TacTocTutorial from "@/components/TacToc/TacTocTutorial";
import TacTocPage from "@/components/TacToc";
import { TourProvider, StepType } from "@reactour/tour";
import { tourConfig, stepArrowDirections } from "@/components/TacToc/config";
import styled from "@emotion/styled";
import Joyride from "react-joyride";

const ContentComponentStyle = styled(Box)`
    &::after {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
    }

    &.bottom-arrow::after {
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        border-bottom: 36px solid white;
        left: 22px;
        top: -30px;
    }
    &.right-arrow::after {
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 12px solid white;
        top: 22px;
        left: -10px;
    }

    &.left-arrow::after {
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 12px solid white;
        top: 22px;
        right: -10px;
    }

    &.top-arrow::after {
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid white;
        left: 22px;
        bottom: -10px;
    }
`;

function ContentComponent(props: any) {
    const isLastStep = props.currentStep === props.steps.length - 1;
    const content = props.steps[props.currentStep].content;
    console.log(props.currentStep, "props.currentStep");
    return (
        <ContentComponentStyle
            sx={{
                color: "#fff",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                fontWeight: "600",
            }}
            className={`user-guide-content ${
                stepArrowDirections[props.currentStep]
            }-arrow`}
        >
            {/* Check if the step.content is a function or a string */}
            {typeof content === "function" ? content({ ...props }) : content}

            <Box
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
            </Box>
        </ContentComponentStyle>
    );
}

const TacToc = () => {
    const { setIsKnobVisible } = useKnobVisibility();
    const { account } = useActiveWeb3React();
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        setIsKnobVisible(false);
        return () => setIsKnobVisible(true);
    }, []);
    return (
        <Box
            sx={{
                padding: "27px 90px",
                position: "relative",
                background: "#303030",
                width: "100vw",
                height: "100vh",
            }}
        >
            <Joyride steps={tourConfig}></Joyride>
            {showTutorial ? (
                <TacTocTutorial></TacTocTutorial>
            ) : (
                <TacTocPage
                    onShowTutorial={(show) => {
                        setShowTutorial(show);
                    }}
                ></TacTocPage>
            )}
            {/* <TourProvider
                onClickMask={() => {}}
                steps={tourConfig}
                ContentComponent={ContentComponent}
                styles={{
                    maskWrapper: (base) => ({
                        ...base,
                    }),
                    popover: (base) => ({
                        ...base,
                        boxShadow: "none",
                        padding: "60px",

                        borderRadius: "16px",
                        // top: 0,
                    }),
                    highlightedArea: (base: any, props: any) => ({
                        ...base,
                        display: "block",
                        stroke: "#FDDC2D",
                        strokeWidth: 4,
                        strokeDasharray: "8,4",
                        rx: 10,
                    }),
                }}
            >
               
            </TourProvider> */}
        </Box>
    );
};

export default TacToc;
