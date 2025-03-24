import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./Routes/auth.route.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 5001;

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS origin from env (Render) or localhost fallback
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(express.json());

// ✅ Allow frontend to call backend with cookies
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Session config (MemoryStore - safe for MVPs)
app.use(
  session({
    secret: "your-secret-key", // replace with process.env.SESSION_SECRET in prod
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // required for HTTPS (Render)
      sameSite: "none", // allows cross-origin cookie sharing
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// ✅ Backend API routes
app.use("/", authRoutes);

// ✅ Serve frontend if in production

app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
