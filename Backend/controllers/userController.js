import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // added expiration
};

// Route for login user
const LoginUser = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Does not Exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id)

      res.json({ success: true, token })
    }
    else {
      res.json({ success: false, message: "Invalid Password" })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
};

// Route for user registration
const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    // Validating email and password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) { // typo fixed: 'lenght' → 'length'
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Create JWT token
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error); // better logging
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required"
      });
    }

    if (
      email === process.env.ADMIN_MAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET
      );

      return res.json({
        success: true,
        token
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export { LoginUser, RegisterUser, AdminLogin };
