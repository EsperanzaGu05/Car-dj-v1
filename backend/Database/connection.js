import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

export const ConnectDB = async (callback) => {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'CarDJ');
    console.log('Connected to MongoDB');
    callback(null, db);
  } catch (error) {
    callback(error, null);
  }
};

export const getDB = () => db;
