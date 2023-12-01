const { model } = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { UserModel } = require("../model/userModel");

const userRegister = async (req, res) => {
  // console.log(req.body)
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(501)
        .json({ message: "Please Provide all the details" });
    }

    const hashpass = bcrypt.hashSync(password, 8);

    const userdata = new UserModel({
      email,

      password: hashpass,
    });

    await userdata.save();
    res.status(200).json({ message: "Account successfully created" });
  } catch (err) {
    res.status(401).json(err.message);
  }
};

const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isuser = await UserModel.findOne({ email });
    if (!isuser)
      return res
        .status(501)
        .json({ message: "Register First! Email not register" });

    const checkpass = bcrypt.compareSync(password, isuser.password);
    if (!checkpass)
      return res.status(501).json({ message: "Password is not correct" });

    const token = jwt.sign(
      { userId: isuser._id},
      process.env.secretcode,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({
      message: "Logged in successfully",
      data: {
        userDetails: {
          email: isuser.email,
        },
        token,
      },
    });
  } catch (err) {
    res.status(501).json({ message: err.message });
  }
};

module.exports = {
  userRegister,
  userlogin,
};
