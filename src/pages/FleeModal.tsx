import React, { useState } from "react";
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
    useToast,
} from "@chakra-ui/react";
import CloseIcon from "../assets/icon-close.svg";
import WarningIcon from "../assets/icon-warning.svg";
import {
    useSkylabBaseContract,
    useSkylabGameFlightRaceContract,
} from "@/hooks/useContract";
import { useGameContext } from "./Game";
import SkyToast from "@/components/Toast";
import { handleError } from "@/utils/error";
import { useNavigate } from "react-router-dom";

const FleeModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { tokenId, onNext } = useGameContext();
    const navigate = useNavigate();
    const toast = useToast();
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();
    const skylabBaseContract = useSkylabBaseContract();
    const [loading, setLoading] = useState(false);
    // 获取游戏状态
    const getGameState = async () => {
        const state = await skylabGameFlightRaceContract.gameState(tokenId);
        return state.toNumber();
    };
    // 在commitPath之前投降
    const handleRetreat = async () => {
        try {
            const res = await skylabGameFlightRaceContract.retreat(tokenId);
            await res.wait();
            navigate(`/spendresource?tokenId=${tokenId}`);
            onNext(7);
        } catch (error) {
            setLoading(false);
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };

    // 找到对手之前退出游戏
    const handleWithdrawFromQueue = async () => {
        try {
            const res = await skylabGameFlightRaceContract.withdrawFromQueue(
                tokenId,
            );
            await res.wait();
            toast({
                position: "top",
                render: () => (
                    <SkyToast
                        message={"Successfiul withdraw from queue"}
                    ></SkyToast>
                ),
            });
            setTimeout(() => {
                navigate(`/spendresource?tokenId=${tokenId}`);
            }, 1000);
        } catch (error) {
            setLoading(false);
            toast({
                position: "top",
                render: () => (
                    <SkyToast message={handleError(error)}></SkyToast>
                ),
            });
        }
    };

    const handleFlee = async () => {
        const state = await getGameState();
        const opTokenId =
            await skylabGameFlightRaceContract?.matchedAviationIDs(tokenId);

        if (opTokenId.toNumber() === 0) {
            await handleWithdrawFromQueue();
        } else if (state === 1 || state === 2) {
            await handleRetreat();
        }
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
                        onClick={handleFlee}
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
