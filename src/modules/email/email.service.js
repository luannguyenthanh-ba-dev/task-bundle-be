const { Resend } = require('resend');

const { resendAPIKey } = require('./email.const');
const {
  getOTPMailTemplate,
  getVerificationMailTemplate,
} = require('./email.templates');
const { logger } = require('../../utils');

const resend = new Resend(resendAPIKey);
/**
 You can only send testing emails to your own email address [The email registered to resend (ex: louis.nguyen@gmail.com)].
 To send emails to other recipients, please verify a domain at resend.com/domains,
 and change the `from` address to an email using this domain.
 */

const sendVerificationEmail = async (user, code) => {
  const template = getVerificationMailTemplate(user.name, code);
  const { data, error } = await resend.emails.send({
    from: '"TaskBundle" <onboarding@resend.dev>',
    to: [user.email],
    subject: '[TaskBundle] Verification Code',
    html: template,
  });

  if (error) {
    logger.error(`Send Verification Email met error: ${JSON.stringify(error)}`);
    throw new Error('Send Verification Email met unexpected error!!!');
  }

  logger.info(`Send Verification Email met data: ${JSON.stringify(data)}`);

  return data;
};

const sendOTPEmail = async (user, otp) => {
  const template = getOTPMailTemplate(user.name, otp);
  const { data, error } = await resend.emails.send({
    from: '"TaskBundle" <no-reply@taskbundle.com>',
    to: [user.email],
    subject: '[TaskBundle] OTP',
    html: template,
  });

  if (error) {
    logger.error(`Send OTP Email met error: ${JSON.stringify(error)}`);
    throw new Error('Send OTP Email met unexpected error!!!');
  }

  logger.info(`Send OTP Email met data: ${JSON.stringify(data)}`);

  return data;
};

module.exports = { sendVerificationEmail, sendOTPEmail };
