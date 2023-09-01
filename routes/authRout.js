import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSingIn } from "../middlewares/authMiddleware.js";

// Router object
const router = express.Router();

//routing
// REGISTER - Method post
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// test routes
router.get("/test", requireSingIn, isAdmin, testController);

// Protected User Route Auth
router.get("/user-auth", requireSingIn, (req, res) =>
  res.status(200).send({ ok: true })
);

// Protected Admin Route Auth
router.get("/admin-auth", requireSingIn, isAdmin, (req, res) =>
  res.status(200).send({ ok: true })
);

// Update Profile
router.put("/profile", requireSingIn, updateProfileController);

// order
router.get("/orders", requireSingIn, getOrdersController);

//all order
router.get("/all-orders", requireSingIn, isAdmin, getAllOrdersController);

// Order Status Update
router.put(
  "/order-status/:orderId",
  requireSingIn,
  isAdmin,
  orderStatusController
);

export default router;
