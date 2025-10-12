const supabase = require("../config/db");

// Bạn không cần User model, passwordUtil, hay jwtUtil nữa
// vì Supabase đã xử lý tất cả những việc này.

class AuthService {
  /**
   * Đăng ký người dùng mới bằng Supabase Auth.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Đối tượng user từ Supabase.
   */
  async register(email, password) {
    // 1. Gọi phương thức signUp của Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // 2. Xử lý lỗi nếu có (ví dụ: email đã tồn tại, mật khẩu yếu)
    if (error) {
      const serviceError = new Error(error.message);
      serviceError.statusCode = error.status || 400;
      throw serviceError;
    }

    // 3. Trả về thông tin người dùng
    // Lưu ý: Nếu bạn bật xác thực email trong Supabase,
    // data.user sẽ tồn tại nhưng data.session sẽ là null cho đến khi email được xác thực.
    return data.user;
  }

  /**
   * Đăng nhập người dùng bằng Supabase Auth.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Chứa token và thông tin người dùng.
   */
  async login(email, password) {
    // 1. Gọi phương thức signInWithPassword của Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. Xử lý lỗi (sai email hoặc mật khẩu)
    if (error) {
      const serviceError = new Error("Invalid credentials");
      serviceError.statusCode = error.status || 401; // 401 Unauthorized là phù hợp hơn
      throw serviceError;
    }

    // 3. Trả về token và thông tin người dùng
    return {
      token: data.session.access_token,
      user: data.user,
    };
  }
}

module.exports = new AuthService();