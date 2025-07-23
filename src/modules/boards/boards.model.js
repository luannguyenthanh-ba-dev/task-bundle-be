const mongoose = require('mongoose');

const BoardsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    background: {
      type: String,
      default:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpromo.cymru%2F2024%2F02%2F02%2Fusing-trello-for-project-management%2F&psig=AOvVaw3m1w5iVaSbaNyXRbhYHevv&ust=1752846911293000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNCn3t2FxI4DFQAAAAAdAAAAABAL',
    },
    is_star: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_followed: {
      type: Boolean,
      required: true,
      default: false,
    },
    deleted_at: {
      type: Number,
      default: null,
      description: 'Timestamp of deletion',
    },
    is_deleted: { type: Boolean, default: false },
    created_at: Number,
    updated_at: Number,
  },
  {
    timestamps: {
      currentTime: () => Math.floor(Date.now() / 1000),
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  }
);

const BoardsModel = mongoose.model('boards', BoardsSchema);

module.exports = { BoardsModel };
