import { Contract } from "ethers";
import { useState, useEffect } from "react";

import abi from "../assets/abi.json";
import useActiveWeb3React from "./useActiveWeb3React";

export const useContract = () => {
    const { library, connector } = useActiveWeb3React();
    const [contract, setContract] = useState<Contract>();

    const getContract = async () => {
        const provider = await connector?.getProvider();
        const signer = library?.getSigner();
        const newContract = new Contract(
            "0x2538EDAa0bAb3e376c9910e78Ee7d3Ee88d60148",
            abi,
            signer ?? provider,
        );
        setContract(newContract);
    };

    useEffect(() => {
        getContract();
    }, [library, connector]);

    return contract;
};
