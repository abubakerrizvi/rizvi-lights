import express from "express";
import { isAdmin, requireSingIn } from "./../middlewares/authMiddleware.js";
import {
  braintreePaymentsController,
  braintreeTokenController,
  creatProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controller/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// Routes
// Create Product
router.post(
  "/create-product",
  requireSingIn,
  isAdmin,
  formidable(),
  creatProductController
);
// Update Product
router.put(
  "/update-product/:pid",
  requireSingIn,
  isAdmin,
  formidable(),
  updateProductController
);

// get Products
router.get("/get-product", getProductController);

// Get single Product
router.get("/get-product/:slug", getSingleProductController);

// Get Photo
router.get("/product-photo/:pid", productPhotoController);

//Delete Prodct
router.delete("/delete-product/:pid", deleteProductController);

// filter product
router.post("/product-filters", productFiltersController);

// product Count
router.get("/product-count", productCountController);

// Product Per Page
router.get("/product-list/:page", productListController);

// search Product
router.get("/search/:keyword", searchProductController);

// Similar Products
router.get("/related-product/:pid/:cid", realtedProductController);

// CAtegory Wise Products
router.get("/product-category/:slug", productCategoryController);

// Payments Routes

//token
router.get("/braintree/token", braintreeTokenController);

// payments
router.post("/braintree/payment", requireSingIn, braintreePaymentsController);

export default router;
