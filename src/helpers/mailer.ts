import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

  await transporter.sendMail({
    from: '"Job Portal" <no-reply@jobportal.com>',
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
          <h2 style="color:#0f766e;">Verify your email</h2>

          <p style="color:#333;">
            Thank you for signing up with <strong>Job Portal</strong>.
          </p>

          <p style="color:#555;">
            Please confirm your email address by clicking the button below:
          </p>

          <a href="${verifyLink}"
             style="display:inline-block; margin-top:20px; padding:12px 24px;
             background:#0f766e; color:#ffffff; text-decoration:none;
             border-radius:6px; font-weight:bold;">
            Verify Email
          </a>

          <p style="margin-top:30px; font-size:12px; color:#777;">
            If you didn't create this account, you can safely ignore this email.
          </p>

          <hr style="margin:30px 0;" />

          <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
        </div>
      </div>
    `,
  })
}


export async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: '"Job Portal" <no-reply@jobportal.com>',
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
          <h2 style="color:#1d4ed8;">Reset your password</h2>

          <p style="color:#333;">
            We received a request to reset your password.
          </p>

          <p style="color:#555;">
            Click the button below to set a new password. This link will expire shortly.
          </p>

          <a href="${resetLink}"
             style="display:inline-block; margin-top:20px; padding:12px 24px;
             background:#1d4ed8; color:#ffffff; text-decoration:none;
             border-radius:6px; font-weight:bold;">
            Reset Password
          </a>

          <p style="margin-top:30px; font-size:12px; color:#777;">
            If you didn't request a password reset, please ignore this email.
          </p>

          <hr style="margin:30px 0;" />

          <p style="font-size:12px; color:#999;">
            © ${new Date().getFullYear()} Job Portal. All rights reserved.
          </p>
        </div>
      </div>
    `,
  })
}


export async function sendApplicationStatusEmail({
  email,
  name,
  jobTitle,
  company,
  status,
}: {
  email: string
  name: string
  jobTitle: string
  company: string
  status: "SHORTLISTED" | "REJECTED"
}) {
  const subject =
    status === "SHORTLISTED"
      ? "🎉 You've been shortlisted!"
      : "Application update"

  const html =
    status === "SHORTLISTED"
      ? `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
            <h2 style="color:#16a34a;">Congratulations, ${name}! 🎉</h2>

            <p style="color:#333;">
              We're happy to inform you that you have been
              <strong>shortlisted</strong> for the role of
              <strong>${jobTitle}</strong> at <strong>${company}</strong>.
            </p>

            <p style="color:#555;">
              Our hiring team will reach out to you soon with next steps.
            </p>

            <p style="margin-top:30px;">
              Best regards,<br/><br/>
              <strong>${company} Hiring Team</strong>
            </p>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:40px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px;">
            <h2 style="color:#dc2626;">Application Update</h2>

            <p style="color:#333;">
              Hi ${name},
            </p>

            <p style="color:#555;">
              Thank you for applying for <strong>${jobTitle}</strong> at
              <strong>${company}</strong>.
            </p>

            <p style="color:#555;">
              After careful consideration, we will not be moving forward with your application at this time.
            </p>

            <p style="color:#555;">
              We truly appreciate your interest and wish you success in your job search.
            </p>

            <p style="margin-top:30px;">
              Regards,<br/>
              <strong>${company} Hiring Team</strong>
            </p>
          </div>
        </div>
      `

  await transporter.sendMail({
    from: '"Job Portal" <no-reply@jobportal.com>',
    to: email,
    subject,
    html,
  })
}
