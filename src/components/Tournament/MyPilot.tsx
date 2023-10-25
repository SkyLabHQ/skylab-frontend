import { Box, BoxProps, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import UnkowPilotIcon from "./assets/unknow-pilot.svg";
import PilotBorder from "./assets/pilot-border.svg";
import SupportIcon from "./assets/support.svg";

const MyPilotStyle = styled(Box)`
    background: url(${PilotBorder});
    width: 4.8958vw;
    height: 4.8958vw;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
`;

const UnknowStyle = styled(Image)`
    width: 4.8958vw;
    height: 4.8958vw;
    borderradius: "0.8333vw";
`;

const MyPilot = ({
    img,
    onClick,
    showSupport,
    ...rest
}: {
    img: string;
    onClick?: () => void;
    showSupport?: boolean;
} & BoxProps) => {
    return (
        <>
            {img ? (
                <MyPilotStyle {...rest} onClick={onClick}>
                    <Image
                        src={img}
                        sx={{
                            width: "80%",
                            height: "80%",
                            borderRadius: "0.8333vw",
                        }}
                    ></Image>
                    {showSupport && (
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                width: "100%",
                            }}
                        >
                            <Image
                                src={SupportIcon}
                                sx={{
                                    width: "1.7708vw",
                                    height: "1.7708vw",
                                    position: "absolute",
                                    top: "50%",
                                    left: "-0.5208vw",
                                    transform: "translateY(-50%)",
                                }}
                            ></Image>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "0.9375vw",
                                    textAlign: "right",
                                    fontSize: "0.8333vw",
                                    background: "#49B643",
                                    lineHeight: "0.9375vw",
                                    color: "#fff",
                                    borderRadius: "1.6667vw",
                                }}
                            >
                                Support
                            </Box>
                        </Box>
                    )}
                </MyPilotStyle>
            ) : (
                <UnknowStyle
                    {...rest}
                    onClick={onClick}
                    src={UnkowPilotIcon}
                ></UnknowStyle>
            )}
        </>
    );
};

export default MyPilot;
