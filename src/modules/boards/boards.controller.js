const { ResponseHandler, StatusCodes, logger } = require('../../utils');
const { BoardRoles } = require('./boards.const');
const { BoardsService } = require('./boards.service');

class BoardsController {
  async create(req, res) {
    const data = req.body;
    const user = req.user;
    try {
      const board = await BoardsService.createBoard(data);
      const inv = await BoardsService.inviteUserToBoard({
        userID: user._id,
        boardID: board._id,
        role: BoardRoles.ADMIN,
        accepted: true,
      });
      // TODO: Send notification create board to app
      logger.info(`Create new board: ${board.name}`);
      logger.info(`Assign owner: ${JSON.stringify(inv)}`);

      return ResponseHandler.success(res, StatusCodes.CREATED, board);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Create new board met Unknown Error!!!'
      );
    }
  }

  async homeView(req, res) {
    const user = req.user;
    try {
      const [starBoards, nearViewedBoards, invitedBoards, ownerBoards] =
        await Promise.all([
          BoardsService.getAllBoardsByFilters({
            user_id: user._id,
            is_star: true,
          }),
          BoardsService.getAllBoardsByFilters({
            user_id: user._id,
            near_viewed: true,
          }),
          BoardsService.getAllBoardsByFilters({
            user_id: user._id,
            accepted: true,
          }), // Get all boards that user is in them
          BoardsService.getAllBoardsByFilters({
            // Get all boards that user is owner
            user_id: user._id,
            role: BoardRoles.ADMIN,
          }),
        ]);
      return ResponseHandler.success(res, StatusCodes.OK, {
        start_boards: starBoards,
        near_viewed_boards: nearViewedBoards,
        invited_boards: invitedBoards,
        owner_boards: ownerBoards,
      });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Home view met Unknown Error!!!'
      );
    }
  }

  async updateInfo(req, res) {
    const data = req.body;
    const boardID = req.params?.board_id;
    try {
      const board = await BoardsService.findOneBoard({ _id: boardID });
      if (!board) {
        ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found board to update!!!'
        );
      }
      const updated = await BoardsService.updateOneBoardInfo(boardID, data);

      return ResponseHandler.success(res, StatusCodes.CREATED, updated);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Create new board met Unknown Error!!!'
      );
    }
  }

  async inviteMember(req, res) {
    //
  }

  async removeMember(req, res) {
    //
  }

  async updateMemberRole(req, res) {
    //
  }

  async closeBoard(req, res) {
    //
  }

  async viewDetail(req, res) {
    //
  }
}

module.exports = { BoardsController: new BoardsController() };
