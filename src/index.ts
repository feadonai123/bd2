import "reflect-metadata";
import { Bd2SistemaESaudeRepository } from "./repositories/Bd2SistemaESaudeRepository.js";
import dataSource from "./data-source.js";

async function main() {
  await dataSource.initialize();
  try {
    const result = await dataSource.query(
      "select current_database() as db, now() as now"
    );
    console.log("Conectado com sucesso:", result[0]);

    const repo = new Bd2SistemaESaudeRepository(dataSource);
    const rows = await repo.sample(5);
    console.log("Amostra via Entity Bd2SistemaESaude (take 5):", rows);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error("Erro ao conectar no PostgreSQL via TypeORM:", err);
  process.exitCode = 1;
});

