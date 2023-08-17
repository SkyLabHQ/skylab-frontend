import { Box, Image, Text } from "@chakra-ui/react";
import { Step } from "react-joyride";
const stepArrowDirections = ["bottom", "right", "left", "top"];

const tourConfig: Step[] = [
    {
        target: ".first-step",
        placement: "bottom",
        content: (
            <div>
                <Text
                    sx={{
                        color: "#000",
                        fontSize: "20px",
                        fontWeight: 600,
                    }}
                >
                    The player with higher{" "}
                    <span style={{ color: "#c8ad23" }}>bid</span> conquers the{" "}
                    <span
                        style={{
                            border: "2px solid #76c551",
                            color: "#76c551",
                        }}
                    >
                        grid
                    </span>
                </Text>
            </div>
        ),
    },
];

export { tourConfig, stepArrowDirections };
