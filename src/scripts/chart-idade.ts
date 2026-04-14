import dataSource from "../data-source.js";
import { Bd2SistemaESaudeRepository } from "../repositories/Bd2SistemaESaudeRepository.js";
import { renderChartToPngFile } from "../utils/chart.js";

async function main() {
  const binSize = Number(process.env.BIN_SIZE ?? "5");
  const maxAge = Number(process.env.MAX_AGE ?? "100");

  await dataSource.initialize();
  try {
    const repo = new Bd2SistemaESaudeRepository(dataSource);
    const rows = await repo.histogramaIdade(binSize, maxAge);

    await renderChartToPngFile(
      {
        type: "bar",
        data: {
          labels: rows.map((r) => r.faixa),
          datasets: [
            {
              label: "Atendimentos",
              data: rows.map((r) => r.total),
              backgroundColor: "rgba(2,132,199,0.75)",
              borderColor: "rgba(2,132,199,1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: `Histograma de idade no atendimento (bins de ${binSize} anos, 0-${maxAge})`
            },
            legend: { display: false }
          },
          scales: {
            x: { title: { display: true, text: "Faixa etária (anos)" } },
            y: { title: { display: true, text: "Atendimentos" } }
          }
        }
      },
      "output/idade-histograma.png",
      { height: 800 }
    );

    console.log("Gerado:", "output/idade-histograma.png");
  } finally {
    await dataSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

