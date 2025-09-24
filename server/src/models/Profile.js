const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Profile = sequelize.define("Profile", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  dob: { type: DataTypes.DATEONLY, allowNull: true },
  profile: { type: DataTypes.BOOLEAN, defaultValue: false },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Users", key: "id" },
  },
});

module.exports = Profile;