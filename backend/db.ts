import mongoose from "mongoose";

const connection = (globalThis as typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}).mongoose ?? { conn: null, promise: null };

if (!(globalThis as typeof globalThis & { mongoose?: unknown }).mongoose) {
  (globalThis as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose =
    connection;
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  if (connection.conn) {
    return connection.conn;
  }

  if (!connection.promise) {
    connection.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  connection.conn = await connection.promise;
  return connection.conn;
}
