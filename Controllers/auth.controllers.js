const findUserByEmail = require("../Database/config").findUserByEmail;
const jsonwebtoken = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const secret = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // match the role
    if (user.role !== role.toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken.sign(
      { id: user.id, email, role: role }, // payload
      secret, // secret key
      { expiresIn: "2d" } // options
    );
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
