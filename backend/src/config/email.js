import nodemailer from "nodemailer";

// Create a variable to hold our transporter
let transporter = null;

// Initialize transporter automatically
async function initTransporter() {
  // If the user hasn't updated their .env with real credentials, setup Ethereal!
  if (process.env.EMAIL_USER === 'your-email@gmail.com' || !process.env.EMAIL_PASSWORD) {
    console.log("⚠️ No real email credentials found in .env. Creating an Ethereal test account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log("✅ Ethereal completely set up! Use this to test emails without a real password.");
  } else {
    // Regular Gmail setup for when they eventually add an app password
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
}

// Initialize immediately
initTransporter().catch(console.error);

// Send OTP to email
export async function sendOTP(email, otp) {
  try {
    // Wait for the transporter to initialize if it hasn't yet
    if (!transporter) {
      await initTransporter();
    }

    const mailOptions = {
      from: '"AI Expense Tracker" <noreply@expense-tracker.com>', // sender address
      to: email,
      subject: "Your Email Verification Code",
      text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #6a1b9a; text-align: center;">ExpenseAI Verification</h2>
          <p>Hello,</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3e5f5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #4a148c; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #e53935; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // If using Ethereal, generate a PREVIEW URL so the user can literally SEE the email!
    if (transporter.options.host === "smtp.ethereal.email") {
      console.log("-----------------------------------------");
      console.log("📧 Ethereal Email successfully sent!");
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      console.log(`[DEVELOPMENT] The OTP is also recorded here: ${otp}`);
      console.log("-----------------------------------------");
    } else {
      console.log(`✅ OTP sent successfully to ${email}`);
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP via email:", error.message);
    console.log("-----------------------------------------");
    console.log(`[DEVELOPMENT FALLBACK] OTP for ${email}: ${otp}`);
    console.log("-----------------------------------------");
    return { success: true, message: "OTP logged to console (Email failed)" };
  }
}
