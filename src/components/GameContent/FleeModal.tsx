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
    useToast,
} from "@chakra-ui/react";
import CloseIcon from "@/assets/icon-close.svg";
import WarningIcon from "@/assets/icon-warning.svg";
import { useSkylabGameFlightRaceContract } from "@/hooks/useContract";
import SkyToast from "@/components/Toast";
import { handleError } from "@/utils/error";
import { useGameContext } from "@/pages/Game";
import useBurnerWallet, {
    ApproveGameState,
    BalanceState,
} from "@/hooks/useBurnerWallet";
import useFeeData from "@/hooks/useFeeData";
import { calculateGasMargin } from "@/utils/web3Utils";
import Loading from "../Loading";
import useSkyToast from "@/hooks/useSkyToast";

const FleeModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { getFeeData } = useFeeData();
    const { tokenId, onNext } = useGameContext();
    const toast = useSkyToast();
    const [loading, setLoading] = React.useState(false);
    const { handleCheckBurner, burner } = useBurnerWallet(tokenId);
    const skylabGameFlightRaceContract = useSkylabGameFlightRaceContract();

    // 在commitPath之前投降
    const handleRetreat = async () => {
        try {
            setLoading(true);
            await handleCheckBurner();
            const feeData = await getFeeData();
            const gas = await skylabGameFlightRaceContract
                .connect(burner)
                .estimateGas.retreat(tokenId);
            const res = await skylabGameFlightRaceContract
                .connect(burner)
                .retreat(tokenId, {
                    gasLimit: calculateGasMargin(gas),
                    ...feeData,
                });
            await res.wait();
            setLoading(false);
            onClose();
            onNext(6);
        } catch (error) {
            setLoading(false);
            toast(handleError(error));
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
                    {loading && <Loading size={50}></Loading>}
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
