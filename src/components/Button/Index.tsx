import React from "react";
import { Box, Button, Img, Text, ButtonProps } from "@chakra-ui/react";
import LeftTopBorder from "./assets/lefttop-border.svg";
import RightBottomBorder from "./assets/rightbottom-border.svg";
import LoadingIcon from "./assets/loading-icon.png";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

export const SubmitButton = ({
    loadingText,
    isLoading,
    style,
    children,
    width = "466px",
    onClick,
}: {
    loadingText?: string;
    isLoading?: boolean;
    style?: any;
    children?: React.ReactNode;
    width?: string;
    onClick?: (e?: any) => void;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                position: "relative",
                width: width,
                height: "73px",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                    background: "transparent",
                },
                ...style,
            }}
            onClick={(e) => onClick?.(e)}
        >
            <Img
                src={LeftTopBorder}
                sx={{ left: 0, top: 0, position: "absolute" }}
            ></Img>

            <Img
                src={RightBottomBorder}
                sx={{ right: 0, bottom: 0, position: "absolute" }}
            ></Img>
            <Box
                sx={{
                    left: 0,
                    top: 0,
                    position: "absolute",
                    width: "100%",
                    display: "flex",
                    padding: "10px",
                }}
            >
                <Box
                    sx={{
                        background: isLoading ? "#ABABAB" : "#8DF6F5",
                        height: "53px",
                        width: "10px",
                        transform: " skewX(-45deg)",
                        marginRight: "10px",
                    }}
                ></Box>
                <Box
                    sx={{
                        background: isLoading ? "#ABABAB" : "#8DF6F5",
                        height: "53px",
                        width: "10px",
                        transform: " skewX(-45deg)",
                        marginRight: "10px",
                    }}
                ></Box>
                <Box
                    sx={{
                        width: "100%",
                        height: "53px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000",
                        background: isLoading
                            ? "#ABABAB"
                            : "linear-gradient(90deg, #8DF6F5 -6.62%, #FFAD29 49.91%, #8DF6F5 104.58%);",
                        transform: " skewX(-45deg)",
                    }}
                ></Box>
                <Box
                    sx={{
                        background: isLoading ? "#ABABAB" : "#8DF6F5",
                        height: "53px",
                        width: "10px",
                        transform: " skewX(-45deg)",
                        marginLeft: "10px",
                    }}
                ></Box>
                <Box
                    sx={{
                        background: isLoading ? "#ABABAB" : "#8DF6F5",
                        height: "53px",
                        width: "10px",
                        transform: " skewX(-45deg)",
                        marginLeft: "10px",
                    }}
                ></Box>
            </Box>

            <Box
                sx={{
                    zIndex: 100,
                    color: "#000",
                    fontSize: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isLoading ? (
                    <>
                        <Text color="#fff"> {loadingText}</Text>
                        <motion.img
                            src={LoadingIcon}
                            style={{
                                marginLeft: "10px",
                                width: "30px",
                                rotate: 0,
                            }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 1,
                            }}
                            animate={{ rotate: 360 }}
                        />
                    </>
                ) : (
                    children
                )}
            </Box>
        </Box>
    );
};
const ImgButtonStyle = styled(Button)`
    &:hover {
        filter: drop-shadow(0px 4px 5px #fbc53e);
    }
`;

export const ImgButton = (props: ButtonProps) => {
    return <ImgButtonStyle variant={"unstyled"} {...props}></ImgButtonStyle>;
};

const PrimaryButtonStyle = styled(Button)`
    &:hover {
        box-shadow: 0px 4px 4px #fbc53e;
    }
`;

export const PrimaryButton = (props: ButtonProps) => {
    return (
        <PrimaryButtonStyle
            variant={"unstyled"}
            {...props}
        ></PrimaryButtonStyle>
    );
};
