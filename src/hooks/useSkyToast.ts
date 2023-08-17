import { useToast } from "@chakra-ui/react";
import SkyToast from "@/components/Toast";
import React from "react";

const useSkyToast = () => {
    const toast = useToast({ position: "top" });

    const showSkyToast = (message: string, isCloseAble?: boolean) => {
        const id = toast({
            duration: isCloseAble ? 600000 : 3000,
            render: () =>
                React.createElement(SkyToast, {
                    message,
                    isCloseAble,
                    onClose,
                }),
        });

        const onClose = () => {
            if (id) {
                toast.close(id);
            }
        };
    };

    return showSkyToast;
};

export default useSkyToast;
