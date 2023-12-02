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
    useBttGameRetry,
} from "@/hooks/useRetryContract";
import { useGameContext } from "@/pages/TacToe";
import { useNavigate } from "react-router-dom";
import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { getRandomProvider } from "@/utils/web3Utils";
import { ethers } from "ethers";
import { useTacToeSigner } from "@/hooks/useSigner";

const QuitModal = ({
    quitType,
    isOpen,
    onClose,
}: {
    quitType: "wait" | "game";
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { account } = useActiveWeb3React();
    const navigate = useNavigate();
    const { tokenId, bidTacToeGameAddress, istest, realChainId } =
        useGameContext();
    const toast = useSkyToast();
    const [loading, setLoading] = React.useState(false);
    const tacToeFactoryRetryWrite = useBidTacToeFactoryRetry(tokenId);
    const [burnerWallet] = useTacToeSigner(tokenId);

    const tacToeGameRetryWrite = useBttGameRetry(bidTacToeGameAddress, tokenId);

    const handleRetreat = async () => {
        try {
            setLoading(true);
            if (loading) return;
            if (quitType === "wait") {
                await tacToeFactoryRetryWrite("withdrawFromQueue", [], {
                    gasLimit: 250000,
                    usePaymaster: istest,
                });
                const url = istest
                    ? `/btt/mode?tokenId=${tokenId}&testflight=true`
                    : `/btt/mode?tokenId=${tokenId}`;
                handleGetGas();
                navigate(url);
            } else {
                await tacToeGameRetryWrite("surrender", [], {
                    gasLimit: 500000,
                    usePaymaster: istest,
                });

                if (!istest) {
                    handleGetGas();
                }
            }

            setLoading(false);
            onClose();
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast(handleError(error, istest));
        }
    };

    const handleGetGas = async () => {
        console.log("start transfer gas");
        const provider = getRandomProvider(realChainId);
        const singer = new ethers.Wallet(burnerWallet, provider);
        const balance = await provider.getBalance(singer.address);
        const gasPrice = await provider.getGasPrice();
        const fasterGasPrice = gasPrice.mul(110).div(100);
        const gasFee = fasterGasPrice.mul(21000);
        const l1Fees = ethers.utils.parseEther("0.0001");

        if (balance.sub(l1Fees).lte(gasFee)) {
            return;
        }

        const value = balance.sub(gasFee).sub(l1Fees);
        const transferResult = await singer.sendTransaction({
            to: account,
            value: value,
            gasLimit: 21000,
            gasPrice: fasterGasPrice,
        });

        console.log("transfer remain balance", transferResult);
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
                        height={"3vw"}
                    >
                        Quit
                    </Button>
                    <Button
                        colorScheme="yellow"
                        onClick={onClose}
                        fontSize="1.25vw"
                        w="10.9375vw"
                        height={"3vw"}
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
