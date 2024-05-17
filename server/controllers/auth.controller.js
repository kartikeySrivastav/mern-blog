import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signupUser = async (req, res, next) => {
    const { username, email, password } = req.body;

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

        return res.status(201).json({ message: "Signup successfuly" });
    } catch (error) {
        console.error("Error in signupUser:", error);
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            next(errorHandler(404, "User not found"));
        }

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }

        const { password: pass, ...rest } = validUser._doc;

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );

        res.status(200)
            .cookie("access-token", token, { httpOnly: true })
            .json({ message: "Signin Successful", user: rest });
    } catch (error) {
        next(error);
    }
};

export const googleAuth = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = user._doc;
            res.status(200)
                .cookie("access-token", token, {
                    httpOnly: true,
                })
                .json({ message: "Signin Successful", user: rest });
        } else {
            const generatedpassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);

            const hashedPassword = bcrypt.hashSync(generatedpassword, 10);

            const newUser = new User({
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();

            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...rest } = newUser._doc;
            res.status(200)
                .cookie("access-token", token, { httpOnly: true })
                .json({ message: "Signin Successful", user: rest });
        }
    } catch (error) {
        next(error);
    }
};
