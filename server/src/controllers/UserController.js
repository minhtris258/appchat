import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({ message: "Đăng nhập thành công", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tìm thấy" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateUserProfile = async (req, res) => {
    try {
        const { name, avatar, status } = req.body;  
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tìm thấy" });
        }
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        if (status) user.status = status;
        await user.save();
        res.status(200).json({ message: "Cập nhật hồ sơ thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};