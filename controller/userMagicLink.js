const Magic = require("../model/userMagic");
const MagicL = require("../model/link")
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const { v4: uuidv4 } = require("uuid");
const { sendMagicLink } = require("./emailMagicLink");

const register = async (email) => {
  try {
    const newUser = {
      email: email,
      magic_link: uuidv4(),
    };
    const user = await Magic.create(newUser);
    const sendEmail = sendMagicLink(email, user.magic_link, "signup");
    return { ok: true, message: "User created" };
  } catch (error) {
    return { ok: false, error };
  }
};
/*
exports.login = async (req, res) => {
  const { email, magicLink } = req.body;
  try {
    const user = await Magic.findOne({ email: email });
    if (!user) {
      const reg = await register(email);
      res.send({
        ok: true,
        message:
          "Your account has been created, click the link in email to sign in",
      });
    } else if (!magicLink) {
      try {
        const user = await Magic.findOneAndUpdate(
          { email: email },
          { magic_link: uuidv4(), magicLinkExpired: false },
        );
        sendMagicLink(email, user.magic_link);
        res.send({ ok: true, message: "Hit the link in email to sign in" });
      } catch (e) {
        console.log(e);
        res.json({ ok: false, e });
      }
    } else if (user.magic_link == magicLink && !user.magicLinkExpired) {
      const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: "1h" });
      await Magic.findOneAndUpdate(
        { email: email },
        { magicLinkExpired: true },
        // { expiresIn: "2m" }
      );
      res.json({ ok: true, message: "Welcome back", token, email });
    } else
      return res.json({
        ok: false,
        message: "Magic link expired or incorrect ",
      });
  } catch (error) {
    res.json({ ok: false, error });
  }
};
*/

exports.login = async (req, res) => {
  const { email, magicLink } = req.body;
  try {
    const user = await Magic.findOne({ email: email });
    const OtpDetail = new MagicL({
      email,
      magic_link: uuidv4(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800000,

    });
    OtpDetail.save()
    if (!user) {
      const reg = await register(email);
      res.send({
        ok: true,
        message:
          "Your account has been created, click the link in email to sign in",
      });
    } else if (!magicLink) {
      try {
        const user = await MagicL.findOneAndUpdate(
          { email: email },
          { magic_link: uuidv4(), magicLinkExpired: false },
        );
        sendMagicLink(email, user.magic_link);
        res.send({ ok: true, message: "Hit the link in email to sign in" });
      } catch (e) {
        console.log(e);
        res.json({ ok: false, e });
      }
    } else if (OtpDetail.magic_link == magicLink && !OtpDetail.magicLinkExpired) {
      const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: "1h" });
      await MagicL.findOneAndUpdate(
        { email: email },
        { magicLinkExpired: true },
        // { expiresIn: "2m" }
      );
      res.json({ ok: true, message: "Welcome back", token, email });
    } else
      return res.json({
        ok: false,
        message: "Magic link expired or incorrect ",
      });
  } catch (error) {
    console.log(error)
    res.json({ ok: false, error });
  }
};