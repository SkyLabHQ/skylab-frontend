import { Box, HStack, Img, Stack, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FC, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TutorialIcon from "../../assets/icon-tutorial.svg";
import KeyboardIcon from "../../assets/icon-keyboard.svg";
import DistanceIcon from "../../assets/icon-distance.svg";

type Props = {
    horizontal?: boolean;
    showDescription?: boolean;
};

const Description = styled(Text)({
    fontFamily: "Orbitron",
    fontWeight: 600,
    fontSize: 24,
    color: "white",
});

const Shortcut = styled(Box)({
    background: "rgba(255, 255, 255, 0.2)",
    border: "1px solid #FFFFFF",
    borderRadius: "10px",
    fontFamily: "Orbitron",
    fontWeight: 600,
    fontSize: 24,
    color: "white",
    width: "40px",
    textAlign: "center",
});

export const TutorialGroup: FC<Props> = ({ horizontal, showDescription }) => {
    const navigate = useNavigate();

    const redirectToTutorial = () => navigate("/game/tutorial");

    const redirectToKeyboardControl = () => navigate("/game/keyboard");

    const redirectToDistanceInfo = () => navigate("/game/distance");

    useEffect(() => {
        const keyboardListener = (event: KeyboardEvent) => {
            const key = event.key;
            if (key === "t") {
                redirectToTutorial();
            }
            if (key === "k") {
                redirectToKeyboardControl();
            }
            if (key === "c") {
                redirectToDistanceInfo();
            }
        };

        document.addEventListener("keydown", keyboardListener);

        return () => {
            document.removeEventListener("keydown", keyboardListener);
        };
    }, []);

    return (
        <Stack
            direction={horizontal ? "row" : "column"}
            spacing="12px"
            alignItems="flex-end"
        >
            <HStack
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                spacing="10px"
                onClick={redirectToTutorial}
            >
                {showDescription ? (
                    <Fragment>
                        <Description>Tutorial</Description>
                        <Shortcut>T</Shortcut>
                    </Fragment>
                ) : null}
                <Img src={TutorialIcon} w="60px" />
            </HStack>
            <HStack
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                spacing="10px"
                onClick={redirectToKeyboardControl}
            >
                {showDescription ? (
                    <Fragment>
                        <Description>Keyboard Short-cut Panel</Description>
                        <Shortcut>K</Shortcut>
                    </Fragment>
                ) : null}
                <Img src={KeyboardIcon} w="60px" />
            </HStack>
            <HStack
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                spacing="10px"
                onClick={redirectToDistanceInfo}
            >
                {showDescription ? (
                    <Fragment>
                        <Description>Distance Info Panel</Description>
                        <Shortcut>C</Shortcut>
                    </Fragment>
                ) : null}
                <Img src={DistanceIcon} w="60px" />
            </HStack>
        </Stack>
    );
};
