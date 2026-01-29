const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * VERIFY TOKEN
 */
exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(500).json({ message: "Authentication failed" });
  }
};


/**
 * ROLE GUARD
 */
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });

    if (req.user.role !== role)
      return res.status(403).json({
        message: `Access denied — ${role} only`
      });

    next();
  };
};
