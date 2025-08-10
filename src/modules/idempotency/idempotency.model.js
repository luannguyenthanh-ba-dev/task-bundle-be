const mongoose = require('mongoose');

const IdempotencySchema = new mongoose.Schema(
  {
    idempotency_key: {
      type: String,
      required: true,
      unique: true,
    },
    scope: {
      type: String,
      required: true,
    },
    hashed_req: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'failed'],
      default: 'in_progress',
      required: true,
    },
    response_status_code: { type: Number, required: false },
    response_message: { type: String, required: false },
    response_body: { type: mongoose.Schema.Types.Mixed, required: false },
    finished_at: Number,
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

const IdempotencyModel = mongoose.model('idempotency-s', IdempotencySchema);

module.exports = { IdempotencyModel };
