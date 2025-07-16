const { env } = require('../../utils');

const resendAPIKey = env.EMAIL_RESEND_API_KEY || 're_xxxxxxxxx';

module.exports = { resendAPIKey };
