import { Box, BoxProps, Image, Text } from "@chakra-ui/react";
import React from "react";
import styled from "@emotion/styled";
import MileageIcon from "./assets/mileage-icon.svg";

const MyPilotXpStyle = styled(Box)`
    background: rgba(255, 255, 255, 0.5);
    width: 8.6458vw;
    height: 2.0833vw;
    text-align: center;
    line-height: 2.0833vw;
    padding-left: 2.0833vw;
    font-size: 1.0417vw;
    color: #000;
    font-weight: 500;
    border-radius: 2.5vw;
    position: relative;
    margin: 0.5208vw 0;
`;

export const MyPilotXp = ({ value, ...rest }: { value: number } & BoxProps) => {
    return (
        <MyPilotXpStyle {...rest}>
            <Image
                src={MileageIcon}
                sx={{
                    position: "absolute",
                    left: "0%",
                    top: "50%",
                    width: "3.125vw",
                    height: "3.125vw",
                    transform: "translate(-20%, -50%)",
                }}
            ></Image>
            <Text
                sx={{
                    fontSize: "0.8333vw",
                }}
            >
                {value}
            </Text>
        </MyPilotXpStyle>
    );
};

interface PilotXpStyleProps {
    active: string;
}

const PilotXpStyle = styled(Box)<PilotXpStyleProps>`
    background: ${(props) =>
        props.active == "true" ? "rgb(242,216,97)" : "#dbdbdb"};
    width: 7.0313vw;
    height: 1.875vw;
    background-size: 100% 100%;
    text-align: center;
    font-size: 1.0417vw;
    line-height: 1.875vw;
    color: #000;
    font-weight: 500;
    position: relative;
    border-radius: 2.5vw;
    margin: 0.3125vw 0;
`;

export const PilotXp = ({
    value,
    active,
    ...rest
}: { value: number; active: boolean } & BoxProps) => {
    return (
        <PilotXpStyle {...rest} active={active.toString()}>
            <Image
                src={MileageIcon}
                sx={{
                    position: "absolute",
                    left: "0%",
                    top: "50%",
                    width: "2.2917vw",
                    height: "2.2917vw",
                    transform: "translate(-20%, -50%)",
                }}
            ></Image>
            <Text
                sx={{
                    fontSize: "1.0417vw",
                }}
            >
                {value}
            </Text>
        </PilotXpStyle>
    );
};
