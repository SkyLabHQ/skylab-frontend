// 等级对应的点数范围
export const levelRanges = [
    1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
];
export function getLevel(point: number) {
    for (let i = 0; i < levelRanges.length; i++) {
        if (point < levelRanges[i]) {
            return i; // 返回等级，从1开始
        }
    }
}
