const { StatusCodes } = require('http-status-codes');

class ResponseHandler {
  success(res, statusCode = 200, data = {}, message = 'Success!') {
    return res.status(statusCode).json({
      status: 'success',
      code: statusCode,
      message,
      data,
    });
  }

  error(res, statusCode = 500, error = {}, message = 'Unexpected Error!') {
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message,
      error,
    });
  }
}

module.exports = { ResponseHandler: new ResponseHandler(), StatusCodes };
