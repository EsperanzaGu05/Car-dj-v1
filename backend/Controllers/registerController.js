import { getDB } from "../Database/connection.js";
import collections from "../Database/collections.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

let isVerifying = {};

export const register_request = async (details) => {
  const db = getDB();
  console.log("Register request details:", details);

  try {
    console.log("Creating index for TEMP collection...");
    await db.collection(collections.TEMP).createIndex({ email: 1 }, { unique: true });
    console.log("Index created for email in TEMP collection");

    await db.collection(collections.TEMP).createIndex({ expireAt: 1 }, { expireAfterSeconds: 3600 });
    console.log("Index created for expireAt in TEMP collection");

    console.log("Checking if user already exists...");
    const userCheck = await db.collection(collections.USER).findOne({
      email: details.email.replace("_register", ""),
    });
    const tempCheck = await db.collection(collections.TEMP).findOne({
      email: details.email,
    });

    console.log("User check result:", userCheck);
    console.log("Temp user check result:", tempCheck);

    if (userCheck) {
      console.log("User already registered in USER collection");
      throw { status: 409, message: "User already registered" };
    } else if (tempCheck) {
      console.log("User already registered in TEMP collection");
      throw { status: 409, message: "User already registered and pending verification" };
    } else {
      console.log("User does not exist, hashing password...");
      details.password = await bcrypt.hash(details.password, 10);
      console.log("Password hashed");

      console.log("Inserting temporary user...");
      const response = await db.collection(collections.TEMP).insertOne({
        ...details,
        expireAt: new Date(Date.now() + 3600 * 1000),
      });
      console.log("Temporary user inserted:", response);

      return { _id: response.insertedId };
    }
  } catch (err) {
    console.error("Error in register_request:", err);
    throw err;
  }
};

export const register_complete = async (id, secret) => {
  const db = getDB();
  try {
    if (isVerifying[id]) {
      console.log(`Verification already in progress for ID: ${id}`);
      return { status: 400, message: 'Verification already in progress.' };
    }

    isVerifying[id] = true;

    console.log(`Finding temporary user with ID: ${id} and secret: ${secret}`);
    const tempUser = await db.collection(collections.TEMP).findOne({ _id: new ObjectId(id), secret });
    console.log("Temporary user found:", tempUser);

    if (!tempUser) {
      console.log("Invalid token or token has expired");
      isVerifying[id] = false;
      throw { status: 400, message: 'Invalid token or token has expired.' };
    }

    const { name, email, password } = tempUser;
    const existingUser = await db.collection(collections.USER).findOne({ email: email.replace('_register', '') });
    if (existingUser) {
      console.log("User already exists in USER collection");
      isVerifying[id] = false;
      return { status: 200, message: 'Email confirmed, you can now log in.' };
    }

    console.log("Inserting user into USER collection...");

    await db.collection(collections.USER).insertOne({
      name,
      email: email.replace('_register', ''),
      password,
      subscription: {
        startDate: null,
        endDate: null,
        type: 'none',
      }
    });

  

    console.log("User inserted into USER collection");

    console.log("Deleting temporary user...");
    await db.collection(collections.TEMP).deleteOne({ _id: new ObjectId(id) });
    console.log("Temporary user deleted");

    isVerifying[id] = false;

    return { status: 200, message: 'Email confirmed, you can now log in.' };
  } catch (err) {
    console.error("Error in register_complete:", err);
    isVerifying[id] = false;
    throw err;
  }
};
