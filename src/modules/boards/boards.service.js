// const { BoardRoles } = require('./boards.const');
const { BoardsModel } = require('./boards.model');
const { UsersBoardsModel } = require('./users-boards.model');

class BoardsService {
  /**
   * create: Create new board
   * @param {*} data Object
   * @returns board
   */
  async createBoard(data) {
    try {
      const board = await BoardsModel.create({ ...data });
      return board;
    } catch (error) {
      throw new Error(
        error.message || 'createBoard met: Internal Server Error!!!'
      );
    }
  }

  /**
   * inviteUserToBoard: Invite a user to a board
   * @param {*} data.userID String
   * @param {*} data.boardID String
   * @param {*} data.role BoardRoles
   * @param {*} data.accepted Boolean
   * @returns users_boards
   */
  async inviteUserToBoard(data) {
    const { userID, boardID, role, accepted } = data;
    try {
      const invited = await UsersBoardsModel.create({
        user: userID,
        board: boardID,
        role,
        accepted,
      });
      return invited;
    } catch (error) {
      throw new Error(
        error.message || 'inviteUserToBoard met: Internal Server Error!!!'
      );
    }
  }

  /**
   * getAllByFilters: Get all boards by filters
   * @param {*} filters._id String | Array[]
   * @param {*} filters.name String
   * @param {*} filters.is_star Boolean
   * @param {*} filters.is_followed Boolean
   * @param {*} filters.near_viewed Boolean
   * @param {*} filters.accepted Boolean
   * @param {*} filters.role BoardRoles
   * @return boards
   */
  async getAllBoardsByFilters(filters) {
    const query = { is_deleted: false };
    if (filters._id) {
      query._id = filters._id;
    }
    if (filters.name) {
      query.name = { $regex: filters.name, $option: 'i' };
    }
    if (filters.is_star || filters.is_star === false) {
      query.is_star = filters.is_star;
    }
    if (filters.is_followed || filters.is_followed === false) {
      query.is_followed = filters.is_followed;
    }
    let userBoards = [];
    if (filters.user_id) {
      const subQuery = { user: filters.user_id };

      // only accept for `true`
      if (filters.near_viewed) {
        subQuery.last_view_at = { $ne: null };
      }

      if (filters.accepted || filters.accepted === false) {
        subQuery.accepted = filters.accepted;
      }
      if (filters.role) {
        subQuery.role = filters.role;
      }

      const sQ = UsersBoardsModel.find(subQuery);

      if (filters.near_viewed) {
        sQ.sort({ last_view_at: -1 });
      }

      userBoards = await sQ.select('board');
      if (
        userBoards.length === 0 &&
        !(filters.near_viewed || filters.accepted === false)
      ) {
        throw new Error('User not have any boards');
      }
    }
    if (userBoards.length) {
      userBoards = userBoards.map((data) => data.board);
      query._id = { $in: userBoards };
    }

    try {
      const boards = await BoardsModel.find(query).sort({
        created_at: -1,
      });

      if (filters.near_viewed) {
        return userBoards.map((id) => {
          return boards.find((board) => board._id.equals(id));
        });
      }
      return boards;
    } catch (error) {
      throw new Error(
        error.message || 'getAllBoardsByFilters met: Internal Server Error!!!'
      );
    }
  }

  /**
   * findOneUsersBoards: Find a UsersBoards to check role user on board,
   * or, accept invite, or, validate to remove user out of board
   * @param {*} filters.accepted Boolean
   * @param {*} filters.role BoardRoles
   * @param {*} filters.user_id String
   * @param {*} filters.board_id String
   * @returns usersBoards
   */
  async findOneUsersBoards(filters) {
    const query = {};

    if (filters.accepted || filters.accepted === false) {
      query.accepted = filters.accepted;
    }
    if (filters.role) {
      query.role = filters.role;
    }
    if (filters.user_id) {
      query.user = filters.user_id;
    }
    if (filters.board_id) {
      query.board = filters.board_id;
    }

    try {
      const result = await UsersBoardsModel.findOne(query);
      return result;
    } catch (error) {
      throw new Error(
        error.message || 'findOneUsersBoards met: Internal Server Error!!!'
      );
    }
  }

  /**
   * findOneBoard: Find a board to action something
   * @param {*} filters._id String | Array[]
   * @param {*} filters.name String
   * @param {*} filters.is_star Boolean
   * @param {*} filters.is_followed Boolean
   * @returns board
   */
  async findOneBoard(filters) {
    const query = { is_deleted: false };
    if (filters._id) {
      query._id = filters._id;
    }
    if (filters.name) {
      query.name = { $regex: filters.name, $option: 'i' };
    }
    if (filters.is_star || filters.is_star === false) {
      query.is_star = filters.is_star;
    }
    if (filters.is_followed || filters.is_followed === false) {
      query.is_followed = filters.is_followed;
    }
    try {
      const result = await BoardsModel.findOne(query);
      return result;
    } catch (error) {
      throw new Error(
        error.message || 'findOneBoard met: Internal Server Error!!!'
      );
    }
  }

  /**
   * updateOneBoardInfo: Update a board by _id
   * @param {*} _id String
   * @param {*} data Object
   * @returns board
   */
  async updateOneBoardInfo(_id, data) {
    const dataUpdate = {};
    if (data.name) {
      dataUpdate.name = data.name;
    }
    if (data.description) {
      dataUpdate.description = data.description;
    }
    if (data.background) {
      dataUpdate.background = data.background;
    }
    if (data.is_star || data.is_star === false) {
      dataUpdate.is_star = data.is_star;
    }
    if (data.is_followed || data.is_followed === false) {
      dataUpdate.is_followed = data.is_followed;
    }

    try {
      const updated = await BoardsModel.findByIdAndUpdate(
        _id,
        {
          ...dataUpdate,
        },
        { new: true }
      );

      return updated;
    } catch (error) {
      throw new Error(
        error.message || 'updateOneBoardInfo met: Internal Server Error!!!'
      );
    }
  }
}

module.exports = { BoardsService: new BoardsService() };
