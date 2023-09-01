import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "./../helpers/suthHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // validation
    if (!name) {
      return res.send({
        message: "Name is Required",
      });
    }
    if (!email) {
      return res.send({
        message: "Emaile is Required",
      });
    }
    if (!password) {
      return res.send({
        message: "Password is Required",
      });
    }
    if (!phone) {
      return res.send({
        message: "Phone Number is Required",
      });
    }
    if (!address) {
      return res.send({
        message: "Address is Required",
      });
    }
    if (!answer) {
      return res.send({
        message: "Answer is Required",
      });
    }

    // checking User
    const exisitindUser = await userModel.findOne({ email });

    // Exisiting User
    if (exisitindUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Register Please Login",
      });
    }

    // Register User
    const hashedPassword = await hashPassword(password);

    // Save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Success Fully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// POST LOGIN

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      return res.status(404).send({
        message: "Invalid email or Password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "Email is Not Registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login success fully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        roll: user.roll,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Login",
      error,
    });
  }
};

// forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is require" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is require" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is require" });
    }

    // Check
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Emial or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Somthing is worng in forgotPasswordController",
      error,
    });
  }
};

// testController

export const testController = async (req, res) => {
  try {
    res.send("protected Route");
  } catch (error) {
    console.log(error);
  }
};

// update Profile Controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // Password
    if (password && password.length < 6) {
      return res.json({
        error: "Password is Required !!! And must be more than 6 charecters",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.hashedPassword,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Update Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while updating profile",
      error,
    });
  }
};

// get Orders Controller
export const getOrdersController = async (req, res) => {
  try {
    // console.log("Fetching orders...");

    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    console.log("Orders retrieved:", orders);

    res.json(orders);
  } catch (error) {
    console.error("Error while getting orders:", error);

    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//  get All Orders Controller
export const getAllOrdersController = async (req, res) => {
  try {
    // console.log("Fetching orders...");

    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    console.log("Orders retrieved:", orders);

    res.json(orders);
  } catch (error) {
    console.error("Error while getting orders:", error);

    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// orderStatusController
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while updating order status",
      error,
    });
  }
};
