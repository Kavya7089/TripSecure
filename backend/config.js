// src/config.js
import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 5000;
export const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tripsecure';
export const jwtSecret = process.env.JWT_SECRET