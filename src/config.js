import dotenv from "dotenv";
dotenv.config();

const config = {
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASS: process.env.DB_PASS,
	DB_URL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@codercluster.tgft5r9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
	SESSION_SECRET: process.env.SESSION_SECRET,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
	CLIENT_ID: process.env.CLIENT_ID,
	CALLBACK_URL: process.env.CALLBACK_URL,
};

export default config;
