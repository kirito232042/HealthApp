const supabase = require("../config/db"); // Đảm bảo đường dẫn này đúng

class ProfileService {

  /**
   * Tìm hồ sơ của một người dùng bằng User ID.
   * Vì mỗi user chỉ có 1 profile, hàm này sẽ trả về một đối tượng duy nhất.
   * @param {string} userId - UUID của người dùng.
   * @returns {Promise<object>} Đối tượng profile.
   */
  async findByUserId(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId) // Trong bảng profiles, cột 'id' chính là user_id
      .single(); // .single() để lấy về 1 đối tượng, nếu không tìm thấy sẽ báo lỗi

    // Xử lý lỗi nếu không tìm thấy profile
    if (error) {
      const serviceError = new Error("Profile not found for this user");
      serviceError.statusCode = 404;
      throw serviceError;
    }

    return data;
  }

  /**
   * Cập nhật hồ sơ cho một người dùng.
   * Profile được tạo tự động khi đăng ký, vì vậy đây là hàm chính để chỉnh sửa thông tin.
   * @param {string} userId - UUID của người dùng cần cập nhật.
   * @param {object} profileData - Dữ liệu cần cập nhật, vd: { first_name, last_name, dob }.
   * @returns {Promise<object>} Đối tượng profile sau khi đã được cập nhật.
   */
  async updateByUserId(userId, profileData) {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId)
      .select() // Yêu cầu trả về bản ghi đã được cập nhật
      .single(); // Lấy về dưới dạng 1 đối tượng

    if (error) {
      const serviceError = new Error("Profile not found or update failed");
      // Nếu lỗi là do không tìm thấy bản ghi, Supabase sẽ báo lỗi code 'PGRST116'
      serviceError.statusCode = error.code === 'PGRST116' ? 404 : 500;
      throw serviceError;
    }
    
    return data;
  }

  // // Hàm createForUser không còn thực sự cần thiết vì trigger đã xử lý việc này
  // // Tuy nhiên, nếu bạn vẫn muốn có nó để dự phòng, nó sẽ trông như thế này:
  // /**
  //  * (Dự phòng) Tạo một hồ sơ mới, chỉ dùng khi trigger không hoạt động.
  //  * @param {string} userId - UUID của người dùng.
  //  * @param {object} profileData - Dữ liệu ban đầu.
  //  */
  // async createProfile(userId, profileData = {}) {
  //    const { data, error } = await supabase
  //     .from("profiles")
  //     .insert([{ id: userId, ...profileData }])
  //     .select()
  //     .single();

  //   if (error) {
  //       // Lỗi có thể do profile đã tồn tại (vi phạm khóa chính)
  //       const serviceError = new Error(error.message);
  //       serviceError.statusCode = 409; // 409 Conflict - Xung đột tài nguyên
  //       throw serviceError;
  //   }
  //   return data;
  // }
}

module.exports = new ProfileService();