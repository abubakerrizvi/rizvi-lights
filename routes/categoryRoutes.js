import express from "express";
import { isAdmin, requireSingIn } from "./../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();

// router
// Create Category
router.post(
  "/create-category",
  requireSingIn,
  isAdmin,
  createCategoryController
);

// Upadate Category
router.put(
  "/update-category/:id",
  requireSingIn,
  isAdmin,
  updateCategoryController
);

// getAll category
router.get("/get-category", categoryController);

// Single Category
router.get("/single-category/:slug", singleCategoryController);

// Delete category
router.delete(
  "/delete-category/:id",
  requireSingIn,
  isAdmin,
  deleteCategoryController
);

export default router;
