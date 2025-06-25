import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errors.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  bcrypt.genSalt(10, async (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      return res.status(500).json({
        message: "Error generating salt",
        error: err.message,
      });
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({
          message: "Error hashing password",
          error: err.message,
        });
      }

      try {
        const newUser = new User({
          username,
          email,
          password: hash,
        });
        await newUser.save();
        res.status(201).json({
          message: "User created successfully",
        });
      } catch (error) {
        console.error(error); // Add this line
        next(error);
      }
    });
  });
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Remove password from user object
    const { password: pwd, ...rest } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "User signed in successfully",
        user: rest,
        token,
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // Remove password from user object
      const { password: pwd, ...rest } = user._doc;
      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "User signed in successfully",
          user: rest,
          token,
        });
    } else {
      const generatedpassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedpassword, 10);
      user = new User({
        username: req.body.name || name,
        email: req.body.email || email,
        password: hashedPassword,
        profilePicture: req.body.photo || photo,
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      // Remove password from user object
      const { password: pwd, ...rest } = user._doc;
      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(201)
        .json({
          message: "User created and signed in successfully",
          user: rest,
          token,
        });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
