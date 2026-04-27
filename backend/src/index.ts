import dotenv from "dotenv";
import { cloudinaryConnect } from "./config/cloudinary.js";
import prisma from "./prisma.js";
import { app } from "./app.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3002;

// ✅ Start server after Prisma connects
async function startServer() {
  try {
    await prisma.$connect(); // <-- Connect once
    cloudinaryConnect(); // <-- Connect to Cloudinary
    console.log("✅ Prisma connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit if Prisma cannot connect
  }
}

startServer();
