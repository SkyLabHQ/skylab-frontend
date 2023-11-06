import { Box, keyframes, Text } from "@chakra-ui/react";
import React from "react";
export const SixtySecond = 60 * 1000;
export const ThirtySecond = 30 * 1000;

const BttTimer = ({
    width,
    time,
    show = true,
    gray = false,
}: {
    width: string;
    time: string;
    show?: boolean;
    gray?: boolean;
}) => {
    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <Box
                sx={{
                    border: gray
                        ? "3px solid #616161"
                        : show
                        ? "3px solid #FFF"
                        : "3px solid #616161",
                    width: "21.4583vw",
                    background: "transparent",
                    height: "1.25vw",
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "0.1042vw",
                }}
            >
                <Box
                    sx={{
                        width: width,
                        background: gray ? "#616161" : "#fff",
                    }}
                ></Box>
            </Box>
            {show && (
                <Text
                    sx={{
                        fontSize: "1.25vw",
                        position: "absolute",
                        right: "-100px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: gray ? "#616161" : "#fff",
                    }}
                >
                    {time}
                </Text>
            )}
        </Box>
    );
};

const move = keyframes`
    0% {
        opacity:0
    }
    
    100% {
        opacity: 1;
    }
`;

export const BufferTimer = ({
    width,
    show,
}: {
    width: string;
    show: boolean;
}) => {
    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <Box
                sx={{
                    background: "#616161",
                    height: "0.3125vw",
                    width: "21.4583vw",
                    marginTop: "1.4815vh",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
                animation={`${show ? move : ""} 1s linear infinite alternate`}
            >
                <Box
                    sx={{
                        width: width,
                        background: show ? "#fff" : "#616161",
                        height: "0.3125vw",
                    }}
                ></Box>
            </Box>
            <Box
                sx={{
                    height: "1.4583vw",
                }}
            >
                {show && (
                    <Text
                        sx={{
                            fontSize: "1.0417vw",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        On Chain Buffer Time. Please Submit ASAP
                    </Text>
                )}
            </Box>
        </Box>
    );
};

export default BttTimer;
