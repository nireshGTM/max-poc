import _ from "lodash";

const CustomError = function (message) {
    Error.call(this, message);
    Error.captureStackTrace(this);
    this.message = message;
    this.name = this.constructor.name;
};
CustomError.prototype = Object.create(Error.prototype);

class HumanError extends CustomError {
    /**
     * Construct a nice human readable error.
     * @param niceMessage - A nice human readable message that should explain to the end-user what happened, but not give them any proprietary information.
     * @param rawError - An optional error to include for raw debugging information.
     * @param errorCode - An optional error code.
     */
    constructor(niceMessage, rawError, errorCode) {
        super(niceMessage);
        this.errorCode = 0;
        this.message = niceMessage;
        this.errorCode = errorCode;
        this.rawError = rawError;
        if (rawError) {
            this.stack = rawError.stack;
        }
    }
    static createWithError(error, message, errorCode) {
        if (!error) {
            return null;
        }
        if (error instanceof HumanError) {
            return error;
        }
        if (error instanceof Error) {
            return new HumanError(message || error.message, error, errorCode);
        }
        return new HumanError(message || error.toString(), null, errorCode);
    }
    static processCustomizedErrorOrComplete(error, customMessage, customErrorCode, callback, completion) {
        let hError = HumanError.createWithError(error);
        if (hError) {
            if (!_.isNil(customMessage))
                hError.message = customMessage;
            if (!_.isNil(customErrorCode))
                hError.errorCode = customErrorCode;
            if (callback)
                callback(hError);
            return;
        }
        if (completion)
            completion();
    }
    static processErrorOrComplete(error, callback, completion) {
        HumanError.processCustomizedErrorOrComplete(error, null, null, callback, completion);
    }
}
export default HumanError;