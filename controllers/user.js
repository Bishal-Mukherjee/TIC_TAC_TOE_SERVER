const Users = require("../models/User");

exports.userRegister = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email }).select("-password");
    if (user) {
      res.status(200).json({ message: "USER ALREADY REGISTERED" });
    } else {
      const newUser = Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save();
      res.status(200).json({ message: "USER REGISTERED SUCCESSFULLY" });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ message: "USER REGISTERATION ERROR" });
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      if (user.password === password) {
        res.status(200).json({ user });
      } else {
        res.status(200).json({ message: "Invalid credentials" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({ message: "USER REGISTERATION ERROR" });
  }
};
