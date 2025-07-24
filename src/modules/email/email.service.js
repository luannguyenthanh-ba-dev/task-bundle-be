const { Resend } = require('resend');

const { resendAPIKey } = require('./email.const');
const {
  getOTPMailTemplate,
  getVerificationMailTemplate,
  inviteUserToBoardTemplate,
} = require('./email.templates');
const { logger } = require('../../utils');

const resend = new Resend(resendAPIKey);
/**
 You can only send testing emails to your own email address
 [The email registered to resend (ex: louis.nguyen@gmail.com)].
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
    return null;
  }

  logger.info(`Send Verification Email data: ${JSON.stringify(data)}`);

  return data;
};

const sendOTPEmail = async (user, otp) => {
  const template = getOTPMailTemplate(user.name, otp);
  const { data, error } = await resend.emails.send({
    from: '"TaskBundle" <onboarding@resend.dev>',
    to: [user.email],
    subject: '[TaskBundle] OTP',
    html: template,
  });

  if (error) {
    logger.error(`Send OTP Email met error: ${JSON.stringify(error)}`);
    return null;
  }

  logger.info(`Send OTP Email data: ${JSON.stringify(data)}`);

  return data;
};

/**
 * sendInviteToBoardEmail: Send an email to invite a user to a board!!!
 * @param {*} user Object - Invited User
 * @param {*} sender Object - Sender
 * @param {*} board Object - Board
 * @param {*} acceptUrl String - Url for user to accept
 * @returns data
 */
const sendInviteToBoardEmail = async (user, sender, board, acceptUrl) => {
  const template = inviteUserToBoardTemplate(
    user.name,
    sender.name,
    board.name,
    acceptUrl
  );
  const { data, error } = await resend.emails.send({
    from: '"TaskBundle" <onboarding@resend.dev>',
    to: [user.email],
    subject: '[TaskBundle] Invite User To Board',
    html: template,
  });

  if (error) {
    logger.error(
      `Invite User To Board Email met error: ${JSON.stringify(error)}`
    );
    return null;
  }

  logger.info(`Invite User To Board Email data: ${JSON.stringify(data)}`);

  return data;
};

module.exports = {
  sendVerificationEmail,
  sendOTPEmail,
  sendInviteToBoardEmail,
};
