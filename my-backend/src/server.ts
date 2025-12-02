import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User";
import { connectDB } from "./db";
import examRoutes from "./routes/examRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/users", async (_, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Start server
const PORT = process.env.PORT || 4000;
app.use(examRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
});
