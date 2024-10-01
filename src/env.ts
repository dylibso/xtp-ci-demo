import 'dotenv/config'
export const APP_ID = process.env.XTP_APP_ID;
export const TOKEN = process.env.XTP_TOKEN;
export const GUEST_KEY = process.env.XTP_GUEST_KEY || "me";
export const WORKING_DIR = process.env.WORKING_DIR || ".";
