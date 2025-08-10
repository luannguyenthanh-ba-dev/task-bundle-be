const { ResponseHandler, StatusCodes, logger } = require('../../utils');
const { BoardRoles } = require('./boards.const');
const { BoardsService } = require('./boards.service');
const { UsersService } = require('../users/users.service');
const { sendInviteToBoardEmail } = require('../email/email.service');

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
      const updated = await BoardsService.updateOneBoardInfo(boardID, data);

      return ResponseHandler.success(res, StatusCodes.OK, updated);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Update board met Unknown Error!!!'
      );
    }
  }

  async inviteMember(req, res) {
    const data = req.body;
    const boardID = req.params?.board_id;
    const user = req.user;
    const board = req.board;
    try {
      // Find user
      const existUser = await UsersService.findOne({
        email: data.email,
        is_verified: true,
      });
      if (!existUser) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found verified user to invite to board!!!'
        );
      }

      const existUsersBoards = await BoardsService.findOneUsersBoards({
        user_id: existUser._id,
        board_id: boardID,
      });
      // Check user already in board
      if (existUsersBoards) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_IMPLEMENTED,
          'User already in board, cannot invite to board!!!'
        );
      }
      const invited = await BoardsService.inviteUserToBoard({
        userID: existUser._id,
        boardID,
        role: data.role,
        accepted: false,
      });

      // Send invite email
      const sent = await sendInviteToBoardEmail(
        existUser,
        user,
        board,
        BoardsService.generateAcceptUrl(boardID, data.email)
      );
      // If can not send invite email (include accept url)
      if (!sent) {
        // Remove invitation and throw un-expectation error
        BoardsService.removeUserOfBoard(existUser._id, boardID);
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_IMPLEMENTED,
          'Can not invite member to board because of email service problem!!!'
        );
      }
      //
      // TODO: Push notification to member app
      //
      logger.info(`Invited user to board: ${JSON.stringify(invited)}`);
      return ResponseHandler.success(res, StatusCodes.OK, { success: true });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Invite member to board met Unknown Error!!!'
      );
    }
  }

  async acceptInvite(req, res) {
    const boardID = req.params?.board_id;
    const invitedEmail = req.params?.email;
    try {
      const [board, user] = await Promise.all([
        BoardsService.findOneBoard({ _id: boardID }),
        UsersService.findOne({ email: invitedEmail, is_verified: true }),
      ]);
      if (!board) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found board, cannot accept invitation!!!'
        );
      }
      if (!user) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found verified user, cannot accept invitation!!!'
        );
      }
      const existInvitation = await BoardsService.findOneUsersBoards({
        board_id: boardID,
        user_id: user._id,
        accepted: false,
      });
      if (!existInvitation) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found invitation to board of user, cannot accept invitation!!!'
        );
      }
      const accepted = await BoardsService.acceptInvitation(user._id, boardID);
      if (!accepted) {
        return ResponseHandler.success(res, StatusCodes.OK, { success: false });
      }
      const html = BoardsService.generateSuccessfullyAcceptedUI(board.name);
      //
      // TODO: Push notification to admin app
      //
      res.setHeader('Content-Type', 'text/html');
      return res.status(StatusCodes.OK).send(html);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Accept invitation to board met Unknown Error!!!'
      );
    }
  }

  async getListBoardUsers(req, res) {
    const boardID = req.params?.board_id;
    try {
      const members = await BoardsService.getBoardUsersInfo(boardID);
      return ResponseHandler.success(res, StatusCodes.OK, members);
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Get list members of board met Unknown Error!!!'
      );
    }
  }

  async updateMemberRole(req, res) {
    const data = req.body;
    const boardID = req.params?.board_id;
    try {
      const existUser = await UsersService.findOne({ email: data.email });
      if (!existUser) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found user, cannot update role for member of board!!!'
        );
      }

      const existUsersBoards = await BoardsService.findOneUsersBoards({
        user_id: existUser._id,
        board_id: boardID,
      });
      if (!existUsersBoards) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not a member of board, cannot update role!!!'
        );
      }
      const result = await BoardsService.updateBoardMemberRole(
        existUser._id,
        boardID,
        data.role
      );
      return ResponseHandler.success(res, StatusCodes.OK, { success: result });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Update members role of board met Unknown Error!!!'
      );
    }
  }

  async removeMember(req, res) {
    const boardID = req.params?.board_id;
    const email = req.params?.email;
    try {
      const existUser = await UsersService.findOne({ email });
      if (!existUser) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not found user, cannot remove member of board!!!'
        );
      }
      const existUsersBoards = await BoardsService.findOneUsersBoards({
        user_id: existUser._id,
        board_id: boardID,
      });
      if (!existUsersBoards) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_FOUND,
          'Not a member of board, cannot remove out of board!!!'
        );
      }
      if (existUsersBoards.role === BoardRoles.ADMIN) {
        return ResponseHandler.error(
          res,
          StatusCodes.NOT_ACCEPTABLE,
          'ADMIN of board, cannot remove out of board!!!'
        );
      }

      const result = await BoardsService.removeUserOfBoard(
        existUser._id,
        boardID
      );
      return ResponseHandler.success(res, StatusCodes.OK, { success: result });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Update members role of board met Unknown Error!!!'
      );
    }
  }

  async leaveBoard(req, res) {
    const boardID = req.params?.board_id;
    const user = req.user;
    try {
      const result = await BoardsService.removeUserOfBoard(user._id, boardID);
      return ResponseHandler.success(res, StatusCodes.OK, { success: result });
    } catch (error) {
      return ResponseHandler.error(
        res,
        StatusCodes.NOT_ACCEPTABLE,
        error.message || 'Get list members of board met Unknown Error!!!'
      );
    }
  }

  async starBoard(req, res) {
    // TODO
  }

  async followBoard(req, res) {
    // TODO
  }

  async closeBoard(req, res) {
    // TODO
  }

  async viewDetail(req, res) {
    // TODO
    // Get board detail info
    // Get list of list_ids of board
  }
}

module.exports = { BoardsController: new BoardsController() };
