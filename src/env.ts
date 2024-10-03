import 'dotenv/config'
export const APP_ID = process.env.XTP_APP_ID;
export const TOKEN = process.env.XTP_TOKEN;
export const BINDING = process.env.XTP_BINDING_NAME || "";
export const GUEST_KEY = process.env.XTP_GUEST_KEY || "me";
export const WORKING_DIR = process.env.WORKING_DIR || ".";
