import { Box, Image, Text, ButtonProps } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { PrimaryButton } from "../Button/Index";
import RightArrowBlack from "./assets/right-arrow-black.svg";

const Nav2NFTStyle = styled(PrimaryButton)`
    display: flex;
    border-radius: 1.0417vw;
    background: rgba(255, 255, 255, 0.5);
    width: 10.9375vw;
    height: 4.1667vw;
    padding: 0.5208vw;
    cursor: pointer;
`;

const Nav2NFT = ({
    icon,
    title,
    value,
    onClick,
    ...rest
}: {
    icon: string;
    title: string;
    value?: string;
    onClick?: () => void;
} & ButtonProps) => {
    return (
        <Nav2NFTStyle {...rest} onClick={onClick}>
            <Image
                sx={{
                    width: "2.8125vw",
                    marginRight: "0.7292vw",
                }}
                src={icon}
            ></Image>
            <Box
                sx={{
                    flex: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#4A4A4A",
                            fontSize: "1.0417vw",
                            fontWeight: 500,
                        }}
                    >
                        {title}
                    </Box>
                    <Box
                        sx={{
                            borderLeft: "1px solid rgba(96, 96, 96, 0.30)",
                            height: "1.4583vw",
                            paddingLeft: "0.2083vw",
                        }}
                    >
                        <Image src={RightArrowBlack}></Image>
                    </Box>
                </Box>
                <Text
                    sx={{
                        fontSize: "1.0417vw",
                        color: "#4A4A4A",
                        fontWeight: 500,
                        textAlign: "left",
                    }}
                >
                    {value}
                </Text>
            </Box>
        </Nav2NFTStyle>
    );
};

export default Nav2NFT;
