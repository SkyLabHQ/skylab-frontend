// timerWorker.ts
let timerId: NodeJS.Timeout | null = null;
const interval = 1000;

self.addEventListener("message", (event: MessageEvent) => {
    const { action, timeToCount } = event.data;
    // 剩余时间

    let time = timeToCount;
    if (action === "start") {
        self.postMessage(time);
        timerId = setInterval(() => {
            time -= interval;
            if (time < 0) time = 0;
            self.postMessage(time);
            if (time === 0) {
                clearInterval(timerId);
            }
        }, interval);
    } else if (action === "stop") {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }
});

export default null;
