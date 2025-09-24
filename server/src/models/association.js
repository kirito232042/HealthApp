const User = require("./User");
const Profile = require("./Profile");
const Measurement = require("./Measurement");

// Thiết lập quan hệ 1-nhiều giữa User và Measurement
User.hasMany(Measurement, { foreignKey: "userId" });
Measurement.belongsTo(User, { foreignKey: "userId" });

// Một user có nhiều profile
User.hasMany(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

// Một profile có thể có nhiều measurement
Profile.hasMany(Measurement, { foreignKey: "profileId" });
Measurement.belongsTo(Profile, { foreignKey: "profileId" });

module.exports = { User, Measurement, Profile };