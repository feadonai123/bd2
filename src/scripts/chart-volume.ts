import dataSource from "../data-source.js";
import { Bd2SistemaESaudeRepository } from "../repositories/Bd2SistemaESaudeRepository.js";
import { renderChartToPngFile } from "../utils/chart.js";

async function main() {
  await dataSource.initialize();
  try {
    const repo = new Bd2SistemaESaudeRepository(dataSource);
    const rows = await repo.volumeMensal();

    const labels = rows.map((r) => r.bucket);
    const totals = rows.map((r) => r.total);

    await renderChartToPngFile(
      {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Atendimentos por mês",
              data: totals,
              borderColor: "#1f2937",
              backgroundColor: "rgba(31,41,55,0.12)",
              fill: true,
              tension: 0.2,
              pointRadius: 2
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Volume de atendimentos ao longo do tempo (mensal)"
            },
            legend: { display: false }
          },
          scales: {
            y: { title: { display: true, text: "Atendimentos" } },
            x: { title: { display: true, text: "Mês" } }
          }
        }
      },
      "output/volume-atendimentos-mensal.png"
    );

    console.log("Gerado:", "output/volume-atendimentos-mensal.png");
  } finally {
    await dataSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

