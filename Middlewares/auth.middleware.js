const jwt = require("jsonwebtoken");
const db = require("../Database/config");
const findUserByEmail = db.findUserByEmail;

exports.authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Unauthorized. User not registered with this email" });
    }

    req.user = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(400).json({ message: "Error Authenticating user." });
  }
};
