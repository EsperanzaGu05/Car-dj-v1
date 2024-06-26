import express from 'express';
import path from 'path';
import fs from 'fs';
import { register_request, register_complete } from '../Controllers/registerController.js';
import { sendMail } from '../mail/mail.js';

const router = express.Router();

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;

router.post("/", async (req, res) => {
  console.log("Received registration request");

  const { name, email, password, rePassword } = req.body;

  if (!password.match(passwordRegex)) {
    console.log("Password validation failed");
    return res.status(422).json({
      status: 422,
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one special character, and one number."
    });
  }

  if (password !== rePassword) {
    console.log("Password mismatch");
    return res.status(422).json({
      status: 422,
      message: "Passwords do not match."
    });
  }

  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.match(validRegex)) {
    console.log("Invalid email format");
    return res.status(422).json({
      status: 422,
      message: "Enter a valid email."
    });
  }

  const loweredEmail = email.toLowerCase();
  const emailForDb = `${loweredEmail}_register`;
  const secret = Math.random().toString(16).replace("0.", "");

  try {
    console.log("Attempting to create temporary user");

    let response = await register_request({
      name,
      email: emailForDb,
      password,
      secret,
    });

    if (response?._id) {
      console.log(`Temporary user created with ID: ${response._id}`);

      const emailTemplatePath = path.resolve(`${path.dirname("")}/mail/static/index.html`);
      console.log(`Email template path: ${emailTemplatePath}`);

      if (!fs.existsSync(emailTemplatePath)) {
        console.error("Email template does not exist at path:", emailTemplatePath);
        return res.status(500).json({
          status: 500,
          message: "Email template not found.",
        });
      }

      fs.readFile(emailTemplatePath, "utf-8", (err, html) => {
        if (err) {
          console.error("Error reading email template:", err);
          return res.status(500).json({
            status: 500,
            message: "Failed to read email template.",
            error: err
          });
        }

        console.log("Email template read successfully");

        html = html.replace("[EMAIL]", loweredEmail);
        html = html.replace(
          "[LINK]",
          `${process.env.Front}/api/register/pending/${response._id}/${secret}`
        );

        console.log("Prepared email HTML");

        sendMail(
          {
            to: loweredEmail,
            subject: `Car DJ Register Verification`,
            html,
          },
          (err, done) => {
            if (err) {
              console.error("Error sending email:", err);
              return res.status(500).json({
                status: 500,
                message: "Failed to send verification email.",
                error: err
              });
            } else {
              console.log(`Verification email sent to: ${loweredEmail}`);
              return res.status(200).json({
                status: 200,
                message: "Register Request Sent. Verification email sent successfully."
              });
            }
          }
        );
      });
    } else {
      console.log("No response._id received");
      return res.status(500).json({
        status: 500,
        message: "Failed to create temporary user."
      });
    }
  } catch (err) {
    console.error("Error during registration request:", err);
    if (err.code === 11000) {
      return res.status(409).json({
        status: 409,
        message: "User already registered and pending verification."
      });
    }
    return res.status(err?.status || 500).json({
      status: err?.status || 500,
      message: err.message || "Internal server error",
    });
  }
});

router.post("/pending", async (req, res) => {
  const { id, secret } = req.body;

  console.log(`Received email verification request for ID: ${id} with secret: ${secret}`);

  if (id?.length === 24 && secret) {
    try {
      const response = await register_complete(id, secret);

      if (response.status === 200) {
        console.log(`User registration completed for ID: ${id}`);
        return res.status(200).json(response);
      } else {
        console.log(`Error completing registration: ${response.message}`);
        return res.status(response.status).json(response);
      }
    } catch (err) {
      console.error("Error completing registration:", err);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  } else {
    console.log("Invalid verification details");
    return res.status(422).json({
      status: 422,
      message: "Invalid verification details",
    });
  }
});

export default router;
