const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const bearerToken = token.slice(7);
  // console.log("🔍 Incoming token:", bearerToken);

  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(403).json({ error: "Invalid Token" });
    }

    // console.log("✅ Decoded token payload:", user);
    req.user = user;
    next();
  });
};

// const handleToken = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   // Check for the "Bearer " prefix in the token
//   if (!token.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   // Remove the "Bearer " prefix to get the actual token
//   const bearerToken = token.slice(7);

//   jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: "Invalid Token" });
//     }
//       console.log("✅ Decoded token payload:", user);

//     req.user = user; // adding user to decoded
//     next();
//   });
// };

// generate token
const generateToken = (user) => {
  try {
    const token = jwt.sign(
      {
        user: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1y" }
    );

    if (!token) {
      return "Token not found";
    }

    return token;
  } catch (error) {
    return "Error while generating token";
  }
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return res.status(401).json({ message: "Invalid or missing Authorization header" });
    // }

    const token = authHeader.split(" ")[1]; // extract token from header

    if (!token) {
      return res
        .status(401)
        .json({ message: "Token not provided, Access denied..." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Failed to authenticate token.", error });
  }
};

module.exports = { handleToken, generateToken, verifyToken };
