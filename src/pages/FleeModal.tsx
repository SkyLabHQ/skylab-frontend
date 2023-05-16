import React from "react";
import {
    Box,
    Text,
    Img,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from "@chakra-ui/react";
import CloseIcon from "../assets/icon-close.svg";
import WarningIcon from "../assets/icon-warning.svg";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
} from "@/hooks/useContract";
import { useGameContext } from "./Game";

const FleeModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { tokenId } = useGameContext();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabBaseContract = useSkylabBaseContract();

    const handleRetreat = async () => {
        const res = await skylabGameFlightRaceContract.retreat(tokenId);
        await res.wait();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
            <ModalOverlay />
            <ModalContent
                bg="rgba(255, 255, 255, 0.7)"
                border="3px solid #FDDC2D"
                borderRadius="20px"
            >
                <Img
                    pos="absolute"
                    top="16px"
                    right="16px"
                    w="32px"
                    src={CloseIcon}
                    cursor="pointer"
                    onClick={() => onClose()}
                />
                <ModalBody pb="0" pt="36px">
                    <Box display="flex" justifyContent="space-between">
                        <Img w="220px" src={WarningIcon} />
                        <Text
                            color="black"
                            fontSize="36px"
                            fontFamily="Orbitron"
                            fontWeight="600"
                        >
                            If you quit the game, your aviation will be
                            down-graded, but you get to keep all your resources.
                        </Text>
                    </Box>
                </ModalBody>

                <ModalFooter
                    display="flex"
                    justifyContent="space-between"
                    pt="0"
                >
                    <Button
                        bg="white"
                        colorScheme="white"
                        onClick={handleRetreat}
                        fontSize="36px"
                        fontFamily="Orbitron"
                        fontWeight="600"
                        w="40%"
                        padding="32px 0"
                        borderRadius="20px"
                    >
                        Quit
                    </Button>
                    <Button
                        colorScheme="yellow"
                        onClick={onClose}
                        fontSize="36px"
                        fontFamily="Orbitron"
                        fontWeight="600"
                        w="50%"
                        padding="32px 0"
                        borderRadius="20px"
                    >
                        Continue to collide
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FleeModal;