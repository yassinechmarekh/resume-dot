import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODE_MAILER_HOST as string,
  port: parseInt(process.env.NODE_MAILER_PORT as string),
  secure: false,
  auth: {
    user: process.env.NODE_MAILER_USER as string,
    pass: process.env.NODE_MAILER_PASS as string,
  },
});

const sendEmail = async (to: string, subject: string, template: string) => {
  try {
    await transporter.sendMail({
      from: `"AI Resume Builder" <${process.env.APP_MAIL}>`,
      to,
      subject,
      html: template,
    });
  } catch (error) {
    console.log("Send Email Config Error :");
    console.log(error);
    throw new Error("Internal server error occurred while sending email.");
  }
};

export default sendEmail;
