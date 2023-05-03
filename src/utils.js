import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `${__dirname}/public/images`);
	},
	filename: function (req, file, cb) {
		cb(null, `${file.originalname}`); //${Date.now().getFullYear}-
	},
});

export const createHash = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

export const uploader = multer({ storage });
export default __dirname;
