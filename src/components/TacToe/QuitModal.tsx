import React from "react";
import {
    Text,
    Img,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from "@chakra-ui/react";
import CloseIcon from "@/assets/icon-close.svg";
import { handleError } from "@/utils/error";
import Loading from "../Loading";
import useSkyToast from "@/hooks/useSkyToast";
import {
    useBidTacToeFactoryRetry,
    useBidTacToeGameRetry,
} from "@/hooks/useRetryContract";
import { useGameContext } from "@/pages/TacToe";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "query-string";

const QuitModal = ({
    quitType,
    isOpen,
    onClose,
}: {
    quitType: "wait" | "game";
    isOpen: boolean;
    onClose: () => void;
}) => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = qs.parse(search) as any;
    const istest = params.testflight ? params.testflight === "true" : false;
    const { tokenId, bidTacToeGameAddress } = useGameContext();
    const toast = useSkyToast();
    const [loading, setLoading] = React.useState(false);
    const { tacToeFactoryRetryWrite } = useBidTacToeFactoryRetry(tokenId);

    const { tacToeGameRetryWrite } = useBidTacToeGameRetry(
        bidTacToeGameAddress,
        tokenId,
    );

    const handleRetreat = async () => {
        try {
            setLoading(true);
            if (loading) return;
            if (quitType === "wait") {
                await tacToeFactoryRetryWrite("withdrawFromQueue", [], 250000);
                const url = istest
                    ? `/tactoe/mode?tokenId=${tokenId}&testflight=true`
                    : `/tactoe/mode?tokenId=${tokenId}`;
                navigate(url);
            } else {
                await tacToeGameRetryWrite("surrender", [], 1500000);
            }

            setLoading(false);
            onClose();
        } catch (error) {
            setLoading(false);
            toast(handleError(error));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                bg="rgba(255, 255, 255, 0.7)"
                border="3px solid #FDDC2D"
                borderRadius="1.0417vw"
                sx={{
                    width: "31.25vw",
                    maxWidth: "31.25vw",
                }}
            >
                <Img
                    pos="absolute"
                    top="0.8333vw"
                    right="0.8333vw"
                    w="1.6667vw"
                    src={CloseIcon}
                    cursor="pointer"
                    onClick={() => onClose()}
                />
                <ModalBody
                    pb="0"
                    pt="1.875vw"
                    sx={{
                        width: "31.25vw",
                    }}
                >
                    <Text
                        color="black"
                        fontSize="1.4583vw"
                        fontWeight="600"
                        fontFamily={"Orbitron"}
                        textAlign={"center"}
                    >
                        Are you sure you want to quit?
                    </Text>
                    {loading && <Loading size={50}></Loading>}
                </ModalBody>

                <ModalFooter
                    display="flex"
                    justifyContent="space-between"
                    pt="2.6042vw"
                >
                    <Button
                        bg="white"
                        colorScheme="white"
                        onClick={handleRetreat}
                        fontSize="1.25vw"
                        w="10.9375vw"
                        padding="1.6667vw 0"
                        borderRadius="1.0417vw"
                        fontWeight={400}
                    >
                        Quit
                    </Button>
                    <Button
                        colorScheme="yellow"
                        onClick={onClose}
                        fontSize="1.25vw"
                        w="10.9375vw"
                        padding="1.6667vw 0"
                        borderRadius="1.0417vw"
                        fontWeight={400}
                    >
                        Continue to {quitType}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default QuitModal;
