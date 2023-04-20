import { Box, Img, Stack } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import TutorialIcon from "../../assets/icon-tutorial.svg";
import KeyboardIcon from "../../assets/icon-keyboard.svg";
import DistanceIcon from "../../assets/icon-distance.svg";

type Props = {
    horizontal?: boolean;
};

export const TutorialGroup: FC<Props> = ({ horizontal }) => {
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
        <Stack direction={horizontal ? "row" : "column"} spacing="12px">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                cursor="pointer"
                onClick={redirectToTutorial}
            >
                <Img src={TutorialIcon} w="60px" />
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                cursor="pointer"
                onClick={redirectToKeyboardControl}
            >
                <Img src={KeyboardIcon} w="60px" />
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                cursor="pointer"
                onClick={redirectToDistanceInfo}
            >
                <Img src={DistanceIcon} w="60px" />
            </Box>
        </Stack>
    );
};
