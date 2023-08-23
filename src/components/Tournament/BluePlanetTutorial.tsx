import { useDisclosure } from "@chakra-ui/react";
import React from "react";
import { Image, Box } from "@chakra-ui/react";
import TutorialModal from "../GameContent/TutorialModal";
import ButtonTip from "./assets/tutorial-button.svg";

const BluePlanetTutorial = () => {
    const {
        isOpen: isTutorialOpen,
        onOpen: onTutorialOpen,
        onClose: onTutorialClose,
    } = useDisclosure();
    return (
        <Box>
            <Image
                sx={{ cursor: "pointer" }}
                src={ButtonTip}
                onClick={() => {
                    onTutorialOpen();
                }}
            ></Image>
            <TutorialModal
                onClose={onTutorialClose}
                isOpen={isTutorialOpen}
            ></TutorialModal>
        </Box>
    );
};

export default BluePlanetTutorial;
