import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import type { ChartConfiguration } from "chart.js";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { writeFile } from "node:fs/promises";

export async function renderChartToPngFile(
  config: ChartConfiguration,
  outputPath: string,
  opts?: { width?: number; height?: number }
) {
  const width = opts?.width ?? 1200;
  const height = opts?.height ?? 700;

  const canvas = new ChartJSNodeCanvas({
    width,
    height,
    backgroundColour: "white"
  });

  const pngBuffer = await canvas.renderToBuffer(config, "image/png");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pngBuffer);
}

