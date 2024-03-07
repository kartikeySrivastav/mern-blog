import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";

export const signupUser = async (req, res, next) => {
	const { username, email, password } = req.body;
	console.log("Password:", password); // Log the value of password
	if (
		!username ||
		!email ||
		!password ||
		username === "" ||
		email === "" ||
		password === ""
	) {
		next(errorHandler(400, "All fields are required"));
	}

	try {
		const existedUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existedUser) {
			next(
				errorHandler(400, "User with email or username already exists")
			);
		}

		const hashPassword = bcrypt.hashSync(password, 10);

		const user = await User.create({
			username,
			email,
			password: hashPassword,
		});

		const responseUser = {
			_id: user._id,
			username: user.username,
			email: user.email,
		};

		return res
			.status(201)
			.json({ message: "Signup successful", user: responseUser });
	} catch (error) {
		console.error("Error in signupUser:", error);
		next(error);
	}
};
