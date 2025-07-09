const { ResponseHandler, StatusCodes } = require('../../utils/response-handler.util');

class UsersController {
  async viewMyProfile(req, res) {
    return ResponseHandler.success(res, StatusCodes.OK, {});
  }
}

module.exports = { UsersController: new UsersController() };
