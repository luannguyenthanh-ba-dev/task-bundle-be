const IdempotencyMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
const IdempotencyStatus = {
  INPROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

module.exports = { IdempotencyMethods, IdempotencyStatus };
