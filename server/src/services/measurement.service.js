const supabase = require("../config/db"); // Đảm bảo đường dẫn này đúng

class MeasurementService {

  /**
   * Tạo một số đo mới.
   */
  async create(measurementData) {
    const { data, error } = await supabase
      .from("measurements")
      .insert([measurementData])
      .select()
      .single();

    if (error) {
      const serviceError = new Error(error.message);
      serviceError.statusCode = 400;
      throw serviceError;
    }
    return data;
  }

  /**
   * Lấy tất cả số đo của một người dùng, kèm theo thông tin profile.
   */
  async findAllByUser(userId) {
    const { data, error } = await supabase
      .from("measurements")
      .select(`*, profiles (id, first_name, last_name)`)
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      const serviceError = new Error(error.message);
      serviceError.statusCode = 500;
      throw serviceError;
    }
    return data;
  }
  
  /**
   * Cập nhật một số đo bằng ID.
   */
  async updateById(id, updateData) {
    const { data, error } = await supabase
      .from("measurements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      const serviceError = new Error(error.message);
      serviceError.statusCode = 400;
      throw serviceError;
    }
    if (!data) {
      const notFoundError = new Error("Measurement not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    return data;
  }

  /**
   * Xóa một số đo bằng ID.
   */
  async deleteById(id) {
    const { data, error } = await supabase
      .from("measurements")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      const serviceError = new Error(error.message);
      serviceError.statusCode = 500;
      throw serviceError;
    }
    if (!data) {
      const notFoundError = new Error("Measurement not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
  }

  /**
   * 1. Lấy chỉ số mới nhất trong mỗi ngày của TẤT CẢ người dùng.
   * Yêu cầu tạo một hàm RPC trong Supabase (xem hướng dẫn ở dưới).
   */
  async findLatestOfEachDayForAllUsers() {
    const { data, error } = await supabase.rpc('get_latest_daily_measurements');

    if (error) {
      const serviceError = new Error(error.message);
      serviceError.statusCode = 500;
      throw serviceError;
    }
    return data;
  }

  /**
   * 2. Lấy chỉ số mới nhất của một người dùng trong một ngày cụ thể.
   * @param {string} userId - UUID của người dùng.
   * @param {string} date - Ngày cần tìm, định dạng 'YYYY-MM-DD'.
   */
  async findLatestForUserByDate(userId, date) {
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
        // Lỗi 'PGRST116' xảy ra khi không tìm thấy bản ghi nào, ta coi đây là kết quả rỗng
        if (error.code === 'PGRST116') return null;
        const serviceError = new Error(error.message);
        serviceError.statusCode = 500;
        throw serviceError;
    }
    return data;
  }

  /**
   * 3. Lấy chỉ số mới nhất của người dùng trong một khoảng thời gian.
   * @param {string} userId - UUID của người dùng.
   * @param {string} startDate - Ngày bắt đầu, định dạng 'YYYY-MM-DD'.
   * @param {string} endDate - Ngày kết thúc, định dạng 'YYYY-MM-DD'.
   */
  async findLatestForUserInDateRange(userId, startDate, endDate) {
    const startTime = `${startDate}T00:00:00.000Z`;
    const endTime = `${endDate}T23:59:59.999Z`;

    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", userId)
      .gte("created_at", startTime)
      .lte("created_at", endTime)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
        if (error.code === 'PGRST116') return null;
        const serviceError = new Error(error.message);
        serviceError.statusCode = 500;
        throw serviceError;
    }
    return data;
  }
}

module.exports = new MeasurementService();