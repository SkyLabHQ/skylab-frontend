import { Box, BoxProps, Image } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import UnkowPilotIcon from "./assets/unknow-pilot.png";
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
    nonexistentImg,
    ...rest
}: {
    img: string;
    onClick?: () => void;
    showSupport?: boolean;
    nonexistentImg?: string;
} & BoxProps) => {
    return (
        <Box
            sx={{
                cursor: onClick && "pointer",
            }}
        >
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
                        <Image
                            src={SupportIcon}
                            sx={{
                                position: "absolute",
                                bottom: "-10px",
                                left: "50%",
                                width: "110%",
                                maxWidth: "110%",
                                transform: "translateX(-50%)",
                            }}
                        ></Image>
                    )}
                </MyPilotStyle>
            ) : (
                <UnknowStyle
                    {...rest}
                    onClick={onClick}
                    src={nonexistentImg ? nonexistentImg : UnkowPilotIcon}
                ></UnknowStyle>
            )}
        </Box>
    );
};

export default MyPilot;
