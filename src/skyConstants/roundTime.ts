const requireContext = require.context("./winnerImg", true, /^\.\/.*\.png$/);
const images = requireContext.keys().map(requireContext);

const RoundTime: any = {
    1: {
        startTime: "Jul 22",
        endTime: "Jul 24",
        rewardList: [],
    },
    2: {
        startTime: "Jul 24",
        endTime: "Jul 30",
        rewardList: [],
    },
    3: {
        startTime: "Aug 01",
        endTime: "Aug 03",
        rewardList: [],
    },
    4: {
        startTime: "Aug 05",
        endTime: "Aug 07",
        rewardList: [],
    },
    5: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
};

export default RoundTime;
