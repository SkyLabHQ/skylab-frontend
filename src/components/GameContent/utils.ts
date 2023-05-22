import { MapInfo } from ".";

export const calculateLoad = (map: MapInfo[][], skipSelectCheck = false) => {
    let totalFuelLoad = 0,
        totalBatteryLoad = 0,
        totalTime = 0;

    for (const row of map) {
        for (const item of row) {
            if (item.selected || skipSelectCheck) {
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
    opponentLevel,
    opponentFuel,
    opponentBattery,
}: {
    myLevel: number;
    myFuel: number;
    myBattery: number;
    opponentLevel: number;
    opponentFuel: number;
    opponentBattery: number;
}) => {
    const emoji = getEmoji(WIN_EMOJI_LIST, 3);
    return `----${emoji}----
Me
✅⬆️${myLevel}
🛢${myFuel}
🔋${myBattery}
⚔️⚔️⚔️⚔️
Opponent
⛔️⬇️${opponentLevel}
🛢${opponentFuel}
🔋${opponentBattery}
----${emoji}----
`;
};

export const generateLoseText = ({
    myLevel,
    myFuel,
    myBattery,
    opponentLevel,
    opponentFuel,
    opponentBattery,
}: {
    myLevel: number;
    myFuel: number;
    myBattery: number;
    opponentLevel: number;
    opponentFuel: number;
    opponentBattery: number;
}) => {
    const emoji = getEmoji(LOSE_EMOJI_LIST, 3);
    return `----${emoji}----
Me
⛔️⬇️${myLevel}
🛢${myFuel}
🔋${myBattery}
⚔️⚔️⚔️⚔️
Opponent
✅⬆️${opponentLevel}
🛢${opponentFuel}
🔋${opponentBattery}
----${emoji}----
`;
};
