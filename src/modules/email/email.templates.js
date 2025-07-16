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

module.exports = { getVerificationMailTemplate, getOTPMailTemplate };
