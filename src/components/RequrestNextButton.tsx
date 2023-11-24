import { Box, Text, BoxProps } from "@chakra-ui/react";
import styled from "@emotion/styled";
import LongBt from "@/assets/long-bt.jpg";
import React from "react";
const RequestNextButtonStyle = styled(Box)`
    width: 26.0417vw;
    height: 4.1146vw;
    background: red;
    background: url(${LongBt});
    background-size: 100% 100%;
    cursor: pointer;
    text-align: center;
    line-height: 4.1146vw;
    font-weight: 600;
    fontfamily: Quantico;
    font-size: 1.25vw;
    color: #000;
    &:hover {
        filter: drop-shadow(0px 4px 5px #fbc53e);
    }
`;

const RequestNextButton = ({
    onClick,
    ...prop
}: { onClick: () => void } & BoxProps) => {
    return (
        <RequestNextButtonStyle {...prop} onClick={onClick}>
            <Text sx={{}}>Request Access For Tournament</Text>
        </RequestNextButtonStyle>
    );
};

export default RequestNextButton;
