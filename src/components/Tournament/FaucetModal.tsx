import React from "react";
import {
    Box,
    Text,
    Image,
    Modal,
    ModalContent,
    Checkbox,
} from "@chakra-ui/react";
import FaucetBg from "./assets/faucet-bg.png";
import PolygonIcon from "./assets/polygon.png";
import CloseIcon from "./assets/close-button.svg";
import { faucetUrl } from "@/skyConstants";

interface FaucetModalProps {
    open: boolean;
    onClose: (checked: boolean) => void;
}

const FaucetModal = ({ open, onClose }: FaucetModalProps) => {
    const [checked, setChecked] = React.useState(false);
    return (
        <Modal
            isOpen={open}
            onClose={() => {
                onClose(checked);
            }}
            size="full"
        >
            <ModalContent bg="rgba(0, 0, 0, 0.5)">
                <Box
                    pos={"absolute"}
                    left={"50%"}
                    top={"50%"}
                    transform={"translate(-50%,-50%)"}
                    height="10.9896vw"
                    w={"28.2813vw"}
                    background={`url(${FaucetBg})`}
                    backgroundSize="100% 100%"
                    padding="1.0417vw 2.0833vw"
                    fontFamily="Orbitron"
                    color="#000"
                >
                    <Image
                        onClick={() => {
                            onClose(checked);
                        }}
                        src={CloseIcon}
                        sx={{
                            position: "absolute",
                            right: "1.0417vw",
                            top: "1.0417vw",
                            height: "0.9375vw",
                            width: "0.9375vw",
                            cursor: "pointer",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "1.25vw",
                            fontWeight: "600",
                        }}
                    >
                        If you do not have sufficient gas, get free tokens with
                        the link below
                    </Text>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={() => {
                            window.open(faucetUrl);
                        }}
                    >
                        <Image
                            src={PolygonIcon}
                            sx={{
                                width: "8.0729vw",
                            }}
                        ></Image>
                        <Text
                            sx={{
                                fontSize: "1.0417vw",
                                fontFamily: "Arial",
                            }}
                        >
                            Faucet
                        </Text>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: "red",
                        }}
                    >
                        <Checkbox
                            onChange={(e) => {
                                setChecked(e.target.checked);
                            }}
                            colorScheme="gray"
                            borderColor="#D9D9D9"
                            checked={checked}
                            size="lg"
                            sx={{ marginRight: "0.5208vw" }}
                            variant="outline"
                        >
                            Do not show again
                        </Checkbox>
                    </Box>
                </Box>
            </ModalContent>
        </Modal>
    );
};

export default FaucetModal;
