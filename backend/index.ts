import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.routes';
import exercisesRoutes from './routes/exercises.routes';
import routinesRoutes from './routes/routines.routes';
import { PrismaClient } from "./generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const app = express();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/routines', routinesRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "lifto-api",
  });
});

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Lifto API running on http://localhost:${PORT}`);
});