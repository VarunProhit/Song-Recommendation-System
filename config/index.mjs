import { config } from "dotenv";

config();

export const clientId = process.env.REACT_APP_CLIENT_ID;
export const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
export const redirectUri = process.env.REACT_APP_REDIRECT_URI;
