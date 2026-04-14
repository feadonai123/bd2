import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { Bd2SistemaESaude } from "./entities/Bd2SistemaESaude.js";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  ssl: false,
  synchronize: false,
  logging: false,
  entities: [Bd2SistemaESaude],
  migrations: ["src/migrations/*.{ts,js}"]
});

