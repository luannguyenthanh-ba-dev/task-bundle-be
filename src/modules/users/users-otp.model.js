const mongoose = require('mongoose');

const UsersOTPSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    otp: {
      type: Number,
      required: true,
    },
    ttl: {
      type: Number,
      require: true,
    },
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

const UsersOTPModel = mongoose.model('users-otp', UsersOTPSchema);

module.exports = { UsersOTPModel };
