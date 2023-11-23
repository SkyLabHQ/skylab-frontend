export const handleError = (callError: any, isPaymaster?: boolean) => {
    if (isPaymaster && callError.details) {
        return callError.details;
    }

    return (
        callError.reason ||
        callError.error?.message ||
        callError.data?.message ||
        callError.message
    );
};
