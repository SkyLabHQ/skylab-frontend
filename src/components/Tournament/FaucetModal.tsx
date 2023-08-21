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
                    height="211px"
                    w={"543px"}
                    background={`url(${FaucetBg})`}
                    backgroundSize="100% 100%"
                    padding="20px 40px"
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
                            right: "20px",
                            top: "20px",
                            height: "18px",
                            width: "18px",
                            cursor: "pointer",
                        }}
                    ></Image>
                    <Text
                        sx={{
                            color: "#000",
                            fontSize: "24px",
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
                            window.open("https://faucet.polygon.technology");
                        }}
                    >
                        <Image
                            src={PolygonIcon}
                            sx={{
                                width: "155px",
                            }}
                        ></Image>
                        <Text
                            sx={{
                                fontSize: "20px",
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
                            sx={{ marginRight: "10px" }}
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
