const PROD_API_BASE_URL = "https://kaiserwebsite-backend.onrender.com/api";
const DEV_API_BASE_URL = "http://localhost:4001/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "production" ? PROD_API_BASE_URL : DEV_API_BASE_URL);
