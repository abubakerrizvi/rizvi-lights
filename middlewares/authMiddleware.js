import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// Protected Routes Token base
export const requireSingIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Admin Access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.roll !== 1) {
      res.status(401).send({
        success: false,
        message: "Un-authorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "error is admin middleware",
    });
  }
};
