const getNowSecondsTimestamp = () => {
    return Math.floor(Date.now() / 1000) * 1000;
};

export default getNowSecondsTimestamp;
