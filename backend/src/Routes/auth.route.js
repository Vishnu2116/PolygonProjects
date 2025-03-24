import express from "express";

const router = express.Router();
const USERS = [{ username: "admin", password: "AdminDemo@1234" }];

router.get("/api/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

router.post("/api/login", (req, res) => {
  const { username, password } = req.body; // ✅ Extract from body

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = { username };
    res.json({ success: true });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

export default router;
