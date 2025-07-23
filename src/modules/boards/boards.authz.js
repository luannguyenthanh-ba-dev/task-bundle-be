const validator = require('validator');

const { BoardsService } = require('./boards.service');
const { BoardRoles } = require('./boards.const');
const { ResponseHandler, StatusCodes } = require('../../utils');

class BoardAuthz {
  /**
   * verifyBoardAdmin: Middleware function check admin of a board to handle specific feature belong to admin role
   * role = BoardRoles.ADMIN
   * req.params.board_id -> required
   */
  async verifyBoardAdmin(req, res, next) {
    const user = req.user;
    const boardID = req.params?.board_id;
    if (!boardID || !validator.isMongoId(boardID)) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'Invalid board ID!!!'
      );
    }

    // const existBoard = await BoardsService.findOneBoard({ _id: boardID });
    // if (!existBoard) {
    //   return ResponseHandler.error(
    //     res,
    //     StatusCodes.NOT_FOUND,
    //     'Not found board to action on board!!!'
    //   );
    // }

    if (!user) {
      return ResponseHandler.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Unauthorize user to action on board!!!'
      );
    }
    // Check admin role for user on board
    const uB = await BoardsService.findOneUsersBoards({
      user_id: user._id,
      board_id: boardID,
      role: BoardRoles.ADMIN,
    });
    if (!uB) {
      return ResponseHandler.error(
        res,
        StatusCodes.FORBIDDEN,
        'User is not board ADMIN!!!'
      );
    }
    return next();
  }
}

module.exports = { BoardAuthz: new BoardAuthz() };
