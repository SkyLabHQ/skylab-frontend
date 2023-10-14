import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";
import XpBg from "./assets/xp-bg.jpg";
import XpBgNormal from "./assets/xp-bg-normal.jpg";
import styled from "@emotion/styled";

const MyPilotXpStyle = styled(Box)`
    background: url(${XpBg});
    width: 11.4063vw;
    height: 3.5417vw;
    background-size: 100% 100%;
    text-align: center;
    line-height: 3.5417vw;
    padding-left: 2.0833vw;
    font-size: 20px;
    color: #000;
    font-weight: 500;
`;

export const MyPilotXp = ({ value, ...rest }: { value: number } & BoxProps) => {
    return <MyPilotXpStyle {...rest}>{value}</MyPilotXpStyle>;
};

const PilotXpStyle = styled(Box)`
    background: url(${XpBgNormal});
    width: 140px;
    height: 43px;
    background-size: 100% 100%;
    text-align: center;
    font-size: 20px;
    line-height: 43px;
    color: #000;
    padding-left: 30px;
    font-weight: 500;
`;

export const PilotXp = ({ value, ...rest }: { value: number } & BoxProps) => {
    return <PilotXpStyle {...rest}>{value}</PilotXpStyle>;
};
