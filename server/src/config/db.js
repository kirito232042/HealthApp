// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: "localhost",
//     dialect: "mysql",
//     logging: false,
//   }
// );

// module.exports = sequelize; 
// config/db.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.PROJECT_URL,
  process.env.ANON_PUBLIC_KEY
);

module.exports = supabase;
