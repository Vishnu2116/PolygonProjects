import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./Routes/auth.route.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Allowed origins for CORS
const allowedOrigins = [
  "https://polygonprojects-1.onrender.com", // frontend on Render
  "http://localhost:5173", // local dev
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

// ✅ Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request from:", req.headers.origin);
  next();
});

// ✅ CORS setup
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

// ✅ Session setup
app.use(
  session({
    secret: "your-secret-key", // Use process.env.SESSION_SECRET in prod
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ Auth API routes
app.use("/", authRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
