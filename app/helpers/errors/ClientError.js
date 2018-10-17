module.exports = class ClientError extends Error {
	constructor(message, status, time) {
		super(message);
		this.status = status;
		this.time = time;
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor);
		} else {
			this.stack = (new Error(message)).stack;
		}
	}
};