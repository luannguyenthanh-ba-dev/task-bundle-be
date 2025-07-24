const mongoose = require('mongoose');
const moment = require('moment-timezone');

const UsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      description: 'SHA256 hash password!',
    },
    name: {
      type: String,
      require: true,
    },
    phone: String,
    job: String,
    position: String,
    // TODO
    // avatar: String,
    address: String,
    university: String,
    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    verification: {
      code: {
        type: Number,
        required: true,
        default: Math.floor(100000 + Math.random() * 900000),
      },
      ttl: {
        type: Number,
        require: true,
        default: moment().add(15, 'minutes').unix(),
      },
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

const UsersModel = mongoose.model('users', UsersSchema);

module.exports = { UsersModel };
