import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import registerRoute from './Routes/Register.js';
import authRoute from './Routes/googleauth.js';
import forgotPasswordRoute from './Routes/forgetPassword.js';
import resetPasswordRoute from './Routes/resetPassword.js';
import { ConnectDB } from './Database/connection.js';
import spotifyDataRoute from './Streamers/Spotify/data.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/api/register', registerRoute);
app.use('/api/auth', authRoute);
app.use('/api/forgot-password', forgotPasswordRoute);
app.use('/api/reset-password', resetPasswordRoute);
app.use('/api/spotify', spotifyDataRoute);

app.get('/api', (req, res) => {
  res.send('Car DJ Api');
});

// Serve the frontend application
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace to the console
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).send({ status: 400, message: 'Invalid JSON' });
  }
  res.status(500).send({ status: 500, message: 'Internal Server Error', error: err.message }); // Return detailed error message
});

app.listen(port, () => {
  console.log(`Server Started on Port: ${port}`);
  ConnectDB((err, res) => {
    if (err) {
      console.log(`MongoDB Connection Error: ${err}`);
    } else if (res) {
      console.log('MongoDB Successfully Connected');
    }
  });
});
