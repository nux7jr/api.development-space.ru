import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import "dotenv/config";
import path from 'path';
import multer from 'multer';


export default class UserController {
  static storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
  });

  static upload = multer({ storage: UserController.storage });
  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  }
  static async refreshToken(req, res) {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const newAccessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }
  static async logout(req, res) {}
  static async create(req, res) {
    try {
      const { email, password, name } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        name,
        password: hashedPassword,
      });

      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async profile(req, res) {
    try {
      const user = await User.findAll({
          where: { id: req.userId },
          attributes: ['id', 'email', 'name', 'description', 'image'],
      });
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
  }
  static async profileId(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ where: { id: id } });
      if (user) {
        res.status(201).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
  }
  static async edit(req, res) {
    try {
      const { name, description } = req.body;
      const imagePath = req.file.path;
      const user = await User.findOne({ where: { id: req.userId } });

      user.name = name;
      user.description = description;
      user.image = imagePath;
      await user.save();

      res.status(201).json({ message: 'User edit successfully', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }

  }
  static async delete(req, res) {}
}
