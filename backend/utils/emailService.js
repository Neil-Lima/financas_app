const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Failed to send email');
  }
};

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.APP_URL}/verify-email/${token}`;
  
  await this.sendEmail({
    to: email,
    subject: 'Verify Your Email',
    text: `Please click on the following link to verify your email: ${verificationUrl}`,
    html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email.</p>`
  });
};

exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;
  
  await this.sendEmail({
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Please click <a href="${resetUrl}">here</a> to reset your password.</p>`
  });
};
