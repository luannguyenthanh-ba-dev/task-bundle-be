const mongoose = require('mongoose');
const { BoardRoles } = require('./boards.const');

const UsersBoardsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'boards',
    },
    invited_at: {
      type: Number,
      default: Math.floor(Date.now() / 1000),
    },
    role: {
      type: String,
      enum: [BoardRoles.ADMIN, BoardRoles.MEMBER, BoardRoles.VIEWER],
      required: true,
      default: BoardRoles.MEMBER,
    },
    accepted: {
      type: String,
      required: true,
      default: false,
    },
    last_view_at: {
      type: Number, // Not have default value
      // default: Math.floor(Date.now() / 1000),
    },
  },
  { versionKey: false }
);

const UsersBoardsModel = mongoose.model('users-boards', UsersBoardsSchema);

module.exports = {
  UsersBoardsModel,
};
