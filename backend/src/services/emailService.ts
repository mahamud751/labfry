import nodemailer from "nodemailer";
import { config } from "../config";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  async sendEmailVerification(
    email: string,
    token: string,
    firstName: string,
    verificationCode?: string
  ): Promise<void> {
    const verificationUrl = `${config.FRONTEND_URL}/verify?token=${token}&type=email`;

    // Use code-based verification if code is provided
    const isCodeBased = !!verificationCode;
    const verificationMethod = isCodeBased
      ? `<div style="text-align: center; margin: 30px 0;">
           <div style="background-color: #f8f9fa; border: 2px solid #EE3638; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
             <h3 style="color: #EE3638; margin: 0 0 10px 0; font-size: 24px;">Your Verification Code</h3>
             <div style="font-size: 32px; font-weight: bold; color: #111111; letter-spacing: 5px; font-family: 'Courier New', monospace;">${verificationCode}</div>
             <p style="color: #666666; font-size: 14px; margin: 10px 0 0 0;">This code expires in 15 minutes</p>
           </div>
         </div>`
      : `<div style="text-align: center; margin: 30px 0;">
           <a href="${verificationUrl}" 
              style="background-color: #EE3638; color: white; padding: 15px 30px; text-decoration: none; 
                     border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
             Verify Email Address
           </a>
         </div>`;

    const alternativeMethod = isCodeBased
      ? `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           Enter this 6-digit code on the verification page to complete your registration.
           If you didn't create an account with Labfry, please ignore this email.
         </p>`
      : `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           If the button doesn't work, you can also copy and paste this link into your browser:<br>
           <a href="${verificationUrl}" style="color: #EE3638; word-break: break-all;">${verificationUrl}</a>
         </p>`;

    const mailOptions = {
      from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
      to: email,
      subject: "Verify Your Email Address - Labfry",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #EE3638; font-size: 28px; margin-bottom: 10px;">Welcome to Labfry!</h1>
            <p style="color: #666666; font-size: 16px;">Please verify your email address to complete your registration</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-bottom: 15px;">Hi ${firstName},</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for signing up with Labfry! To complete your registration and access all features, 
              ${
                isCodeBased
                  ? "please use the verification code below."
                  : "please verify your email address by clicking the button below."
              }
            </p>
            
            ${verificationMethod}
            
            ${alternativeMethod}
          </div>
          
          <div style="text-align: center; color: #999999; font-size: 12px;">
            <p>${
              isCodeBased
                ? "This verification code will expire in 15 minutes."
                : "This verification link will expire in 24 hours."
            }</p>
            <p>If you didn't create an account with Labfry, please ignore this email.</p>
            <p>&copy; 2024 Labfry Technology. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email verification sent to: ${email}`);
      console.log(`📧 Email service: ${config.SMTP_HOST}:${config.SMTP_PORT}`);
      console.log(`📤 From: ${config.FROM_EMAIL}`);
    } catch (error) {
      console.error("❌ Failed to send email verification:", error);
      console.error(`📧 SMTP Configuration:`);
      console.error(`   Host: ${config.SMTP_HOST}`);
      console.error(`   Port: ${config.SMTP_PORT}`);
      console.error(`   User: ${config.SMTP_USER}`);
      console.error(`   From: ${config.FROM_EMAIL}`);
      throw new Error("Failed to send verification email");
    }
  }

  async sendPasswordReset(
    email: string,
    token: string,
    firstName: string,
    resetCode?: string
  ): Promise<void> {
    const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;

    // Use code-based reset if code is provided
    const isCodeBased = !!resetCode;
    const resetMethod = isCodeBased
      ? `<div style="text-align: center; margin: 30px 0;">
           <div style="background-color: #f8f9fa; border: 2px solid #EE3638; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
             <h3 style="color: #EE3638; margin: 0 0 10px 0; font-size: 24px;">Your Reset Code</h3>
             <div style="font-size: 32px; font-weight: bold; color: #111111; letter-spacing: 5px; font-family: 'Courier New', monospace;">${resetCode}</div>
             <p style="color: #666666; font-size: 14px; margin: 10px 0 0 0;">This code expires in 15 minutes</p>
           </div>
         </div>`
      : `<div style="text-align: center; margin: 30px 0;">
           <a href="${resetUrl}" 
              style="background-color: #EE3638; color: white; padding: 15px 30px; text-decoration: none; 
                     border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
             Reset Password
           </a>
         </div>`;

    const alternativeMethod = isCodeBased
      ? `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           Enter this 6-digit code on the password reset page to create a new password.
           If you didn't request a password reset, please ignore this email.
         </p>`
      : `<p style="color: #999999; font-size: 14px; line-height: 1.5;">
           If the button doesn't work, you can also copy and paste this link into your browser:<br>
           <a href="${resetUrl}" style="color: #EE3638; word-break: break-all;">${resetUrl}</a>
         </p>`;

    const mailOptions = {
      from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your Password - Labfry",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #EE3638; font-size: 28px; margin-bottom: 10px;">Password Reset Request</h1>
            <p style="color: #666666; font-size: 16px;">We received a request to reset your password</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-bottom: 15px;">Hi ${firstName},</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset the password for your Labfry account. 
              ${
                isCodeBased
                  ? "Please use the reset code below to create a new password."
                  : "If you made this request, please click the button below to reset your password."
              }
            </p>
            
            ${resetMethod}
            
            ${alternativeMethod}
          </div>
          
          <div style="text-align: center; color: #999999; font-size: 12px;">
            <p>${
              isCodeBased
                ? "This reset code will expire in 15 minutes."
                : "This password reset link will expire in 1 hour."
            }</p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            <p>&copy; 2024 Labfry Technology. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to: ${email}`);
      console.log(`📧 Email service: ${config.SMTP_HOST}:${config.SMTP_PORT}`);
      console.log(`📤 From: ${config.FROM_EMAIL}`);
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error);
      console.error(`📧 SMTP Configuration:`);
      console.error(`   Host: ${config.SMTP_HOST}`);
      console.error(`   Port: ${config.SMTP_PORT}`);
      console.error(`   User: ${config.SMTP_USER}`);
      console.error(`   From: ${config.FROM_EMAIL}`);
      throw new Error("Failed to send password reset email");
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
      to: email,
      subject: "Welcome to Labfry - Your Account is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #EE3638; font-size: 28px; margin-bottom: 10px;">Welcome to Labfry!</h1>
            <p style="color: #666666; font-size: 16px;">Your account has been successfully verified</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #111111; font-size: 20px; margin-bottom: 15px;">Hi ${firstName},</h2>
            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your email has been verified and your Labfry account is now active. 
              You can now access all features and start exploring what we have to offer.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${config.FRONTEND_URL}/login" 
                 style="background-color: #EE3638; color: white; padding: 15px 30px; text-decoration: none; 
                        border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                Login to Your Account
              </a>
            </div>
            
            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
          </div>
          
          <div style="text-align: center; color: #999999; font-size: 12px;">
            <p>Thank you for choosing Labfry Technology!</p>
            <p>&copy; 2024 Labfry Technology. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to: ${email}`);
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error);
      // Don't throw error for welcome email as it's not critical
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ Email service connection verified");
      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:", error);
      return false;
    }
  }
}

export default new EmailService();
