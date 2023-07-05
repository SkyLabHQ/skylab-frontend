import { useToast } from "@chakra-ui/react";
import SkyToast from "@/components/Toast";
import React from "react";

const useSkyToast = () => {
    const toast = useToast({ position: "top" });

    const showSkyToast = (message: string) => {
        toast({
            render: () => React.createElement(SkyToast, { message }),
        });
    };

    return showSkyToast;
};

export default useSkyToast;
