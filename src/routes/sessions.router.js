import { Router } from "express";
import userModel from "../models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post(
	"/register",
	passport.authenticate("register", { failureRedirect: "/failRegister" }),
	async (req, res) => {
		return res.send({ status: "Success", message: "User registered" });
	}
);

router.post(
	"/login",
	passport.authenticate("login", { failureRedirect: "/failLogin" }),
	async (req, res) => {
		if (!req.user)
			return res.status(401).send({ status: "Error", error: "Unauthorized" });
		req.session.user = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			age: req.user.age,
			email: req.user.email,
			role: req.user.role,
			cart: req.user.cart,
		};
		return res
			.status(200)
			.send({ status: "Success", payload: req.session.user });
	}
);

router.get("/failRegister", (req, res) => {
	console.log("Failed Register");
	return res.send({ status: "Error", error: "Authentication error" });
});

router.get("/failLogin", (req, res) => {
	res.send({ status: "Error", error: "Failed login" });
});

router.put("/restore", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userModel.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.send({ status: "Error", error: "User does not exist" });
		}

		const hashedPassword = createHash(password);

		await userModel.updateOne({ email }, { password: hashedPassword });

		return res.send({
			status: "Success",
			message: "Password updated successfully",
		});
	} catch (error) {
		console.log(error);
	}
});

// logout route
router.post("/logout", async (req, res) => {
	try {
		if (req.session) {
			// delete session object
			req.session.destroy((err) => {
				if (err) {
					return res
						.status(400)
						.send({ status: "Error", error: "Unable to log out" });
				}
				res.clearCookie("connect.sid");
				return res
					.status(200)
					.send({ status: "Success", message: "Logged out!" });
			});
		}
	} catch (error) {
		console.error(error);
	}
});

router.get(
	"/github",
	passport.authenticate("githublogin", { scope: ["user:email"] }),
	async (req, res) => {}
);

router.get(
	"/githubcallback",
	passport.authenticate("githublogin", { failureRedirect: "/login" }),
	async (req, res) => {
		req.session.user = req.user;
		res.redirect("/");
	}
);

export default router;
