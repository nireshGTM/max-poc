const respondWithError = (res, error) => {
    let status = error.errorCode || 500;
    let responseData = {
        "status": false,
        "with": status,
        "because": error.message
    };
    if (process.env.DEBUG_ERRORS == "1" && error.rawError) {
        responseData.raw_error = error.rawError.toString();
    }
    res.status(status).send(responseData);
}
const respondWithSuccess = (res, verb, noun, data) => {
    let responseData = {
        "status": true,
        "by": verb,
        "the": noun
    };
    if (data) {
        responseData["with"] = data;
    }
    res.send(responseData);
}

export {
    respondWithError,
    respondWithSuccess,
};