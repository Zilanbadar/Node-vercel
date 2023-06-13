import crypto from "crypto";
import Joi from "joi";
import User from "../models/User.model.js";
import Token from "../models/Token.js";
import sendEmail from "../utils/sendEmail.js";
import bcryptjs from "bcryptjs";

export const requestResetLink = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `http://localhost:8080/resetPassword/${user._id}/${token.token}`;
    await sendEmail(
      user.email,
      "Password reset",
      `${user.username},\n You had request a password reset link.\n Click the link below to reset you password.\n ${link}`
    );

    res.status(200).send({
      success: true,
      Message: "password reset link sent to your email account",
    });
    return;
  } catch (error) {
    res.status(500).send({
      success: false,
      Message: "An error occured",
      err: error.message,
    });
    console.log(error);
  }
};

export const getResetForm = async (req, res) => {
  res.render("reset"), { id: req.params.id, token: req.params.token };
};
export const resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");
    let salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(req.body.password, salt);
    await user.save();
    await token.delete();
    res
      .status(200)
      .send({ success: true, Message: "password reset sucessfully" });
    return;
  } catch (error) {
    res
      .status(200)
      .send({ success: false, Message: "An error occured", err: err.message });
    return;
  }
};
