import { Box, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useKnobVisibility } from "@/contexts/KnobVisibilityContext";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import TacTocTutorial from "@/components/TacToc/TacTocTutorial";
import TacTocPage from "@/components/TacToc";
import { TourProvider } from "@reactour/tour";
import tourConfig from "@/components/TacToc/config";
import styled from "@emotion/styled";
import { CSSObject } from "@emotion/react";
import "@reactour/popover/dist/index.css";

const ContentComponentStyle = styled(Box)``;

function ContentComponent(props: any) {
    const isLastStep = props.currentStep === props.steps.length - 1;
    const content = props.steps[props.currentStep].content;
    return (
        <ContentComponentStyle
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

const opositeSide = {
    top: "bottom",
    bottom: "top",
    right: "left",
    left: "right",
};
function doArrow(
    position: "top" | "right" | "bottom" | "left" | "custom",
    verticalAlign: "top" | "bottom",
    horizontalAlign: "left" | "right",
): CSSObject {
    if (!position || position === "custom") {
        return {};
    }

    const width = 40;
    const height = 30;
    const color = "white";
    const isVertical = position === "top" || position === "bottom";
    const spaceFromSide = 25;

    const obj = {
        [`--rtp-arrow-${
            isVertical ? opositeSide[horizontalAlign] : verticalAlign
        }`]: height + spaceFromSide + "px",
        [`--rtp-arrow-${opositeSide[position]}`]: -height + 2 + "px",
        [`--rtp-arrow-border-${isVertical ? "left" : "top"}`]: `${
            width / 2
        }px solid transparent`,
        [`--rtp-arrow-border-${isVertical ? "right" : "bottom"}`]: `${
            width / 2
        }px solid transparent`,
        [`--rtp-arrow-border-${position}`]: `${height}px solid ${color}`,
    };

    console.log(obj, "objobj");
    return obj;
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
            <TourProvider
                onClickMask={() => {}}
                steps={tourConfig}
                padding={{
                    mask: 5,
                    popover: 35,
                }}
                ContentComponent={ContentComponent}
                styles={{
                    maskWrapper: (base) => ({
                        ...base,
                    }),
                    popover: (base: any, state: any) => {
                        console.log(base, "base");
                        return {
                            ...base,
                            boxShadow: "none",
                            borderRadius: "16px",
                            ...doArrow(
                                state.position,
                                state.verticalAlign,
                                state.horizontalAlign,
                            ),
                        };

                        // top: 0,
                    },
                    highlightedArea: (base: any, props: any) => ({
                        ...base,
                        display: "block",
                        stroke: "#FDDC2D",
                        strokeWidth: 4,
                        strokeDasharray: "8,4",
                        padding: 0,
                        rx: 10,
                    }),
                }}
            >
                {showTutorial ? (
                    <TacTocTutorial></TacTocTutorial>
                ) : (
                    <TacTocPage
                        onShowTutorial={(show) => {
                            setShowTutorial(show);
                        }}
                    ></TacTocPage>
                )}
            </TourProvider>
        </Box>
    );
};

export default TacToc;
