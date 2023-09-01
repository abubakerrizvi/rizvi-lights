import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRout.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLTopath } from 'url' ;
// config env
dotenv.config();

// Connect Database
connectDB();

const __filename = fileURLTopath(import.meta.url);
const __dirname = path.dirname(__filename);

// rest object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoutes);

// rest api
app.get("/", (req, res) => {
  res.send("<h1>Babar Shazad E-Commerce App</h1>");
});

// PORT
const PORT = process.env.PORT || 8080;

// run / listen
app.listen(PORT, () => {
  console.log(
    `server running on ${process.env.DEV_MODE}  Mode on Port http://localhost:${PORT}`
      .bgGreen
  );
});
