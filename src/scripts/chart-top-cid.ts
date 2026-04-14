import dataSource from "../data-source.js";
import { Bd2SistemaESaudeRepository } from "../repositories/Bd2SistemaESaudeRepository.js";
import { renderChartToPngFile } from "../utils/chart.js";

async function main() {
  const topN = Number(process.env.TOP_N ?? "25");

  await dataSource.initialize();
  try {
    const repo = new Bd2SistemaESaudeRepository(dataSource);
    const rows = await repo.topCid(topN);

    const labels = rows.map((r) =>
      r.descricao_cid ? `${r.codigo_cid} — ${r.descricao_cid}` : r.codigo_cid
    );

    await renderChartToPngFile(
      {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Atendimentos",
              data: rows.map((r) => r.total),
              backgroundColor: "rgba(16,185,129,0.75)",
              borderColor: "rgba(16,185,129,1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          indexAxis: "y",
          plugins: {
            title: { display: true, text: `Top ${topN} CIDs por atendimentos` },
            legend: { display: false }
          },
          scales: {
            x: { title: { display: true, text: "Atendimentos" } },
            y: { title: { display: true, text: "CID" } }
          }
        }
      },
      "output/top-cid.png",
      { height: 1000 }
    );

    console.log("Gerado:", "output/top-cid.png");
  } finally {
    await dataSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

