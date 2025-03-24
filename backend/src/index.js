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

// ✅ Allowed origins
const allowedOrigins = [
  "https://polygonprojects-1.onrender.com",
  "http://localhost:5173",
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

// ✅ Log origin
app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// ✅ Session config
const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
      ...(isProduction && {
        domain: "polygonprojects-1.onrender.com", // ✅ Only in production
      }),
    },
  })
);

// ✅ Routes
app.use("/", authRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
