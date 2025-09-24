const Profile = require("../models/Profile");
const sequelize = require("../config/db"); // Import sequelize instance

class ProfileService {

  async findAllByUserId(userId) {
    const profiles = await Profile.findAll({ where: { userId } });
    
    if (!profiles || profiles.length === 0) {
      const error = new Error("No profiles found for this user");
      error.statusCode = 404;
      throw error;
    }

    return profiles;
  }

  async createForUser(userId, profileData) {
    const newProfile = await Profile.create({
      ...profileData,
      userId,
    });
    return newProfile;
  }

  async setActiveAndUpdate(userId, profileId, updateData) {
    const { firstName, lastName, dob } = updateData;

    // Sử dụng transaction để đảm bảo tất cả các thao tác thành công hoặc không gì cả
    const result = await sequelize.transaction(async (t) => {
      // 1. Set tất cả profile của user về false
      await Profile.update({ profile: false }, { where: { userId }, transaction: t });

      // 2. Tìm profile cần cập nhật
      const profileToUpdate = await Profile.findOne({ where: { id: profileId, userId }, transaction: t });
      
      if (!profileToUpdate) {
        // Ném lỗi này sẽ tự động rollback transaction
        throw new Error("Profile not found or does not belong to the user");
      }

      // 3. Cập nhật thông tin và set profile = true
      profileToUpdate.profile = true;
      if (firstName !== undefined) profileToUpdate.firstName = firstName;
      if (lastName !== undefined) profileToUpdate.lastName = lastName;
      if (dob !== undefined) profileToUpdate.dob = dob;

      await profileToUpdate.save({ transaction: t });

      return profileToUpdate;
    });

    return result;
  }
}

module.exports = new ProfileService();