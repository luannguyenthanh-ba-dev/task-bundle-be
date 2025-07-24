const getVerificationMailTemplate = (name, code) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello ${name},</p>
      <p>Thank you for signing up for <strong>TaskBundle</strong> – the place where your projects come together beautifully.</p>
      <p>To complete your registration, please verify your email address using the code below:</p>
      <h2 style="color: #2D9CDB;">${code}</h2>
      <p>This code is valid for 15 minutes. If you didn’t request this, please ignore this email.</p>
      <p>Need help? Contact our support team at <a href="mailto:support@taskbundle.com">support@taskbundle.com</a>.</p>
      <p>Cheers,<br><strong>The TaskBundle Team</strong></p>
    </body>
  </html>
  `;
};

const getOTPMailTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello ${name},</p>
      <p>For your security, please use the following One-Time Password (OTP) to continue your action in <strong>TaskBundle</strong>:</p>
      <h2 style="color: #2D9CDB;">${otp}</h2>
      <p>This OTP is valid for 15 minutes and can be used only once. If you did not request it, please secure your account immediately.</p>
      <p>For any assistance, reach out to <a href="mailto:support@taskbundle.com">support@taskbundle.com</a>.</p>
      <p>Best regards,<br><strong>The TaskBundle Security Team</strong></p>
    </body>
  </html>
  `;
};

const inviteUserToBoardTemplate = (
  INVITED_NAME,
  SENDER_NAME,
  BOARD_NAME,
  ACCEPT_URL
) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
        <tr>
          <td style="text-align: center;">
            <h1 style="color: #2D9CDB;">TaskBundle</h1>
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; line-height: 24px; color: #333;">
            <p>Hello ${INVITED_NAME},</p>
            <p><strong>${SENDER_NAME}</strong> has invited you to collaborate on the board:</p>
            <p style="font-size: 18px; font-weight: bold; color: #2D9CDB;">${BOARD_NAME}</p>
            <p>TaskBundle helps you organize and manage your work efficiently with your team.</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${ACCEPT_URL}" style="background-color: #2D9CDB; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                Accept Invitation
              </a>
            </p>
            <p>If you didn’t expect this invitation, you can ignore this email safely.</p>
            <p>Thanks,<br><strong>The TaskBundle Team</strong></p>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};

module.exports = {
  getVerificationMailTemplate,
  getOTPMailTemplate,
  inviteUserToBoardTemplate,
};
