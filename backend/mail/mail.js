import nodemailer from "nodemailer";
import dotnev from "dotenv";

dotnev.config();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export const sendMail = (details, callback) => {
  transporter.sendMail(
    {
      from: `Car DJ <${process.env.SMTP_USER}>`,
      ...details,
    },
    (err, done) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, done);
      }
    }
  );
};
