import { MapInfo } from ".";
import { GridPosition } from "./map";

export const calculateLoad = (map: MapInfo[][]) => {
    let totalFuelLoad = 0,
        totalBatteryLoad = 0,
        totalTime = 0;

    for (const row of map) {
        for (const item of row) {
            if (item.selected) {
                totalFuelLoad += item.fuelLoad ?? 0;
                totalBatteryLoad += item.batteryLoad ?? 0;
                totalTime += item.time ?? 0;
            }
        }
    }

    return {
        totalFuelLoad,
        totalBatteryLoad,
        totalTime,
    };
};

export const calculateDrivingLoad = (
    map: MapInfo[][],
    mapPath: GridPosition[],
) => {
    let totalFuelLoad = 0,
        totalBatteryLoad = 0,
        totalTime = 0;

    for (const row of mapPath) {
        const item = map[row.x][row.y];
        totalFuelLoad += item.fuelLoad ?? 0;
        totalBatteryLoad += item.batteryLoad ?? 0;
        totalTime += item.time ?? 0;
    }

    return {
        totalFuelLoad,
        totalBatteryLoad,
        totalTime,
    };
};

export const decreaseLoad = (max: number, load?: number) =>
    (load ?? 0) <= 0 ? 0 : load! - Math.floor(max / 100);

export const increaseLoad = (max: number, load?: number) =>
    (load ?? 0) + Math.floor(max / 100);

export const mergeIntoLocalStorage = (
    key: string,
    object: Record<string, unknown>,
) => {
    const originalValue = localStorage.getItem(key);
    if (originalValue) {
        localStorage.setItem(
            key,
            JSON.stringify({ ...JSON.parse(originalValue), ...object }),
        );
        return;
    }
    localStorage.setItem(key, JSON.stringify(object));
};

export const getRecordFromLocalStorage = (key: string) => {
    const val = localStorage.getItem(key);
    if (val) {
        return JSON.parse(val);
    }
    return undefined;
};

const WIN_EMOJI_LIST = ["❤️", "👑", "🦋", "🌻", "🤪", "😎", "🤭", "🤩"];
const LOSE_EMOJI_LIST = ["🥀", "💔", "🤬", "🤕", "☠️"];

const getEmoji = (emojiList: string[], number: number) => {
    const selectedEmoji: string[] = [];
    while (selectedEmoji.length < number) {
        const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        if (selectedEmoji.includes(emoji)) {
            continue;
        }
        selectedEmoji.push(emoji);
    }
    return selectedEmoji.join("");
};

export const generateWinText = ({
    myLevel,
    myFuel,
    myBattery,
    opLevel,
    opFuel,
    opBattery,
}: {
    myLevel: number;
    myFuel: number;
    myBattery: number;
    opLevel: number;
    opFuel: number;
    opBattery: number;
}) => {
    const emoji = getEmoji(WIN_EMOJI_LIST, 3);
    return `----${emoji}----
Me
✅⬆️${myLevel}
🛢${myFuel}
🔋${myBattery}
⚔️⚔️⚔️⚔️
Opponent
⛔️⬇️${opLevel}
🛢${opFuel}
🔋${opBattery}
----${emoji}----
@skylabHQ`;
};

export const generateLoseText = ({
    myLevel,
    myFuel,
    myBattery,
    opLevel,
    opFuel,
    opBattery,
}: {
    myLevel: number;
    myFuel: number;
    myBattery: number;
    opLevel: number;
    opFuel: number;
    opBattery: number;
}) => {
    const emoji = getEmoji(LOSE_EMOJI_LIST, 3);
    return `----${emoji}----
Me
⛔️⬇️${myLevel}
🛢${myFuel}
🔋${myBattery}
⚔️⚔️⚔️⚔️
Opponent
✅⬆️${opLevel}
🛢${opFuel}
🔋${opBattery}
----${emoji}----
@skylabHQ`;
};

export const upLevel = (level: number) => {
    if (level === 1) {
        return 2;
    } else {
        return level + 0.5;
    }
};

export const downLevel = (level: number) => {
    if (level === 1.5 || level === 1) {
        return 0;
    } else {
        return level - 1;
    }
};
