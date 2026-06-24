require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const habitRoutes = require("./routes/habits");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Habit Tracker API",
    frontend: "http://localhost:5173",
    endpoints: {
      health: "GET /api/health",
      habits: {
        list: "GET /api/habits",
        create: "POST /api/habits",
        delete: "DELETE /api/habits/:id",
        toggle: "PATCH /api/habits/:id/toggle",
      },
    },
  });
});

app.use("/api/habits", habitRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
