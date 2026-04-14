import dataSource from "../data-source.js";
import { renderChartToPngFile } from "../utils/chart.js";

type Row = { mes: string; tipo_unidade: string; total: number };

const PALETTE = [
  "#2563eb",
  "#16a34a",
  "#f97316",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
  "#a16207",
  "#0f766e",
  "#db2777",
  "#4b5563"
];

function colorForIndex(i: number) {
  return PALETTE[i % PALETTE.length];
}

async function main() {
  const topTipos = Number(process.env.TOP_TIPOS ?? "6"); // limita a legenda

  await dataSource.initialize();
  try {
    const rows: Row[] = await dataSource.query(
      `
      with base as (
        select
          to_char(date_trunc('month', data_do_atendimento), 'YYYY-MM') as mes,
          coalesce(nullif(trim(tipo_unidade), ''), '(vazio)') as tipo_unidade,
          count(*)::int as total
        from public.bd2_sistema_e_saude
        group by 1, 2
      ),
      ranked as (
        select
          *,
          sum(total) over (partition by tipo_unidade) as total_tipo
        from base
      ),
      tipos as (
        select tipo_unidade
        from ranked
        group by tipo_unidade
        order by max(total_tipo) desc
        limit $1
      )
      select
        mes,
        case
          when tipo_unidade in (select tipo_unidade from tipos) then tipo_unidade
          else 'OUTROS'
        end as tipo_unidade,
        sum(total)::int as total
      from ranked
      group by 1, 2
      order by 1, 2
      `,
      [topTipos]
    );

    const meses = Array.from(new Set(rows.map((r) => r.mes))).sort();
    const tipos = Array.from(new Set(rows.map((r) => r.tipo_unidade)));

    // garante ordem estável: OUTROS por último
    tipos.sort((a, b) => {
      if (a === "OUTROS") return 1;
      if (b === "OUTROS") return -1;
      return a.localeCompare(b, "pt-BR");
    });

    const map = new Map<string, number>();
    for (const r of rows) map.set(`${r.mes}|||${r.tipo_unidade}`, r.total);

    const datasets = tipos.map((t, idx) => ({
      label: t,
      data: meses.map((m) => map.get(`${m}|||${t}`) ?? 0),
      backgroundColor: colorForIndex(idx),
      borderColor: colorForIndex(idx),
      borderWidth: 1
    }));

    await renderChartToPngFile(
      {
        type: "bar",
        data: { labels: meses, datasets },
        options: {
          responsive: false,
          plugins: {
            title: {
              display: true,
              text: "Atendimentos por mês e tipo de unidade (barras empilhadas)"
            }
          },
          scales: {
            x: { stacked: true, title: { display: true, text: "Mês" } },
            y: { stacked: true, title: { display: true, text: "Atendimentos" } }
          }
        }
      },
      "output/tipo-unidade-por-mes.png",
      { height: 800 }
    );

    console.log("Gerado:", "output/tipo-unidade-por-mes.png");
  } finally {
    await dataSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

