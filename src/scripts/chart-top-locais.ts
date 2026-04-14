import dataSource from "../data-source.js";
import { Bd2SistemaESaudeRepository } from "../repositories/Bd2SistemaESaudeRepository.js";
import { renderChartToPngFile } from "../utils/chart.js";

type Row = { label: string; total: number };

function barConfig(title: string, rows: Row[]) {
  return {
    type: "bar" as const,
    data: {
      labels: rows.map((r) => r.label),
      datasets: [
        {
          label: "Atendimentos",
          data: rows.map((r) => r.total),
          backgroundColor: "rgba(37,99,235,0.75)",
          borderColor: "rgba(37,99,235,1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      indexAxis: "y" as const,
      plugins: {
        title: { display: true, text: title },
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: "Atendimentos" } },
        y: { title: { display: true, text: "Local" } }
      }
    }
  };
}

async function main() {
  const topN = Number(process.env.TOP_N ?? "20");

  await dataSource.initialize();
  try {
    const repo = new Bd2SistemaESaudeRepository(dataSource);
    const topBairros: Row[] = await repo.topBairros(topN);
    const topMunicipios: Row[] = await repo.topMunicipios(topN);

    await renderChartToPngFile(
      barConfig(`Top ${topN} bairros por atendimentos`, topBairros),
      "output/top-bairros.png",
      { height: 900 }
    );
    console.log("Gerado:", "output/top-bairros.png");

    await renderChartToPngFile(
      barConfig(`Top ${topN} municípios por atendimentos`, topMunicipios),
      "output/top-municipios.png",
      { height: 900 }
    );
    console.log("Gerado:", "output/top-municipios.png");
  } finally {
    await dataSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

