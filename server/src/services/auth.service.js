const User = require("../models/User");
const passwordUtil = require("../utils/password.util");
const jwtUtil = require("../utils/jwt.util");

class AuthService {
  async register(email, password) {
    // 1. Kiểm tra email tồn tại
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      // Ném lỗi để controller bắt được và xử lý
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    // 2. Băm mật khẩu
    const hashedPassword = await passwordUtil.hashPassword(password);

    // 3. Tạo user mới
    const user = await User.create({ email, password: hashedPassword });
    
    // Không trả về mật khẩu
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });
    
    return userWithoutPassword;
  }

  async login(email, password) {
    // 1. Tìm user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    // 2. So sánh mật khẩu
    const isMatch = await passwordUtil.comparePassword(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }
    // 3. Tạo JWT
    const token = jwtUtil.generateToken({ id: user.id });

    return { token };
  }
}

module.exports = new AuthService();