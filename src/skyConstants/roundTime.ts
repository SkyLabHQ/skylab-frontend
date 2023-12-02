const requireContext = require.context("./winnerImg", true, /^\.\/.*\.png$/);
const images = requireContext.keys().map(requireContext);

const RoundTime: any = {
    1: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    2: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    3: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    4: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
    5: {
        startTime: "",
        endTime: "",
        rewardList: [],
    },
};

export default RoundTime;
