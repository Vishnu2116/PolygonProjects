import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./Routes/auth.route.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Detect environment
const isProduction = process.env.NODE_ENV === "production";

// ✅ Allowed origins
const allowedOrigins = [
  "https://polygonprojects-1.onrender.com", // Frontend on Render
  "http://localhost:5173", // Local dev
];

// ✅ CORS middleware
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

// ✅ JSON parsing
app.use(express.json());

// ✅ Log incoming origins
app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// ✅ Session setup
app.use(
  session({
    secret: "your-secret-key", // Replace with env variable in real deployment
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Required for HTTPS on Render
      sameSite: "none", // Required for cross-site cookies
      maxAge: 1000 * 60 * 60, // 1 hour
      ...(isProduction && {
        domain: "polygonprojects.onrender.com", // ✅ Backend domain ONLY
      }),
    },
  })
);

// ✅ API Routes
app.use("/", authRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
