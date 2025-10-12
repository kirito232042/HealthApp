const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const sequelize = require("./config/db");
const supabase = require("./config/db");
// require("./models/User"); 
// require("./models/Measurement");
// require("./models/association");

const authRoutes = require("./routes/auth.routes");
const measurementRoutes = require("./routes/measurement.routes");
const userInfoRoutes = require("./routes/userinfor.routes");
const aiRoutes = require("./routes/ai.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/measurements", measurementRoutes);
app.use("/userinfor", userInfoRoutes);
app.use("/ai", aiRoutes);

// Sync DB (tự tạo bảng nếu chưa có)
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("✅ Database synced");
//   })
//   .catch((err) => {
//     console.error("❌ Error syncing DB:", err);
//   });

// Start server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});