import express from "express";
import cors from "cors";
import authRoutes from "./Routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "https://indgeos.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
