import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/Users.js";

export const register = async (req, res) => {
    const { username, password } = req.body; //remove username and password
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({ message: "user already exist" });

        const salt = bcrypt.genSaltSync(10); //how many time to encrypt
        const hash = bcrypt.hashSync(password, salt);

        const user = new User({ username, password: hash });
        await user.save(); // async save task
        //create jwt
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: "1h",
        });

        res.status(200).json({ message: "User registered successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", err: err.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isCorrect = await bcrypt.compare(password, user.password);
        if (!isCorrect) return res.status(400).json({ message: "Wrong Password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong while logging",
            error: error.message,
        });
    }
};
