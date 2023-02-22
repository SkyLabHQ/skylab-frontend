import { Img, VStack } from "@chakra-ui/react";
import React, { FC } from "react";

import Up from "../../assets/cave-lift-up.svg";
import Down from "../../assets/cave-lift-down.svg";
import Middle from "../../assets/cave-lift-middle.svg";

type Props = {
    onUp: () => void;
    onDown: () => void;
};

export const Lift: FC<Props> = ({ onUp, onDown }) => {
    return (
        <VStack spacing={0}>
            <Img src={Up} onClick={onUp} cursor="pointer" />
            <Img src={Middle} />
            <Img src={Down} onClick={onDown} cursor="pointer" />
        </VStack>
    );
};
