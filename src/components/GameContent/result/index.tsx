import React, { FC, useState } from "react";

import { GameLose } from "./lose";
import { GameWin } from "./win";

type Props = {};

export const GameResult: FC<Props> = ({}) => {
    const [win, isWin] = useState(true);

    return win === undefined ? null : win ? <GameWin /> : <GameLose />;
};
