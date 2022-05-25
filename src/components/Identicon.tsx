import React, { ReactElement, useEffect, useRef } from "react";

import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import useActiveWeb3React from "../hooks/useActiveWeb3React";

const StyledIdenticonContainer = styled.div`
    height: 24px;
    width: 24px;
    border-radius: 1.125rem;
    display: inline-block;
    vertical-align: text-bottom;
`;

export default function Identicon(): ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    const { account } = useActiveWeb3React();

    useEffect(() => {
        if (account && ref.current) {
            ref.current.innerHTML = "";
            ref.current.appendChild(
                Jazzicon(24, parseInt(account.slice(2, 10), 16)),
            );
        }
    }, [account]);

    return <StyledIdenticonContainer ref={ref} />;
}
