const Measurement = require("../models/Measurement");
const Profile = require("../models/Profile");

class MeasurementService {

  async create(measurementData) {
    const measurement = await Measurement.create(measurementData);
    return measurement;
  }

  async findAllByUser(userId) {
    const measurements = await Measurement.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
      include: [{
        model: Profile,
        attributes: ["id", "firstName", "lastName", "profile"],
      }],
    });
    return measurements;
  }

  async deleteById(id) {
    const measurement = await Measurement.findByPk(id);
    if (!measurement) {
      const error = new Error("Measurement not found");
      error.statusCode = 404;
      throw error;
    }
    await measurement.destroy();
  }
  
  // Logic cho hàm update chưa có, đây là ví dụ
  async updateById(id, updateData) {
    const measurement = await Measurement.findByPk(id);
    if (!measurement) {
        const error = new Error("Measurement not found");
        error.statusCode = 404;
        throw error;
    }
    
    // Chỉ cập nhật các trường được cung cấp
    const updatedMeasurement = await measurement.update(updateData);
    return updatedMeasurement;
  }
}

module.exports = new MeasurementService();