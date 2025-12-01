require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const { sequelize } = require("./database");

const userRoutes = require("./server/routes/user");
const friendRoutes = require("./server/routes/friend-request");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/friend-request", friendRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log("📦 Database connected successfully.");

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Unable to connect to database:", error);
    }
})();