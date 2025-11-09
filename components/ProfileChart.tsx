"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type {
  Chart as ChartJS,
  ChartOptions,
} from "chart.js";
import { aellaData, getKinkDisplayName } from "@/lib/aella-data";
import type { Locale } from "@/i18n/config";

interface ProfileChartProps {
  personalData: Record<string, number>;
}

function lerpColor(t: number): string {
  const r1 = 255,
    g1 = 120,
    b1 = 120;
  const r2 = 120,
    g2 = 255,
    b2 = 120;

  const r = r1 + (r2 - r1) * t;
  const g = g1 + (g2 - g1) * t;
  const b = b1 + (b2 - b1) * t;

  return `rgb(${r},${g},${b})`;
}

function getColorForKink(kinkName: string, personalData: Record<string, number>): string {
  // If kink is not rated, return gray
  if (!(kinkName in personalData)) {
    return "rgb(128, 128, 128)";
  }
  // Otherwise return the color based on rating
  return lerpColor(personalData[kinkName] / 100);
}

export function ProfileChart({ personalData }: ProfileChartProps) {
  const t = useTranslations("chart");
  const locale = useLocale() as Locale;
  const chartRef = useRef<ChartJS<"scatter">>(null);
  const [ChartComponent, setChartComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const data = {
    datasets: [
      {
        label: "Kinks",
        data: Object.entries(aellaData).map(([name, data]) => ({
          x: data.tabooness,
          y: data.popularity,
          name: name,
          displayName: getKinkDisplayName(name, locale),
        })),
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<"scatter"> = {
    maintainAspectRatio: false,
    responsive: true,
    transitions: {
      zoom: {
        animation: {
          duration: 0,
        },
      },
    },
    plugins: {
      datalabels: {
        align: "bottom",
        anchor: "end",
        offset: 3,
        color: (context: any) => {
          const dataPoint = context.dataset.data[context.dataIndex];
          return getColorForKink(dataPoint.name, personalData);
        },
        formatter: (value: any) => value.displayName,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      zoom: {
        limits: {
          x: { min: 0, max: 100 },
          y: { min: 0.1, max: 100 },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
        pan: {
          enabled: true,
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 100,
        grid: {
          color: "#666",
        },
        title: {
          display: true,
          text: t("xAxisTitle"),
          color: "#fff",
        },
        ticks: {
          color: "#fff",
        },
      },
      y: {
        type: "logarithmic",
        min: 0.1,
        max: 100,
        grid: {
          color: "#666",
        },
        title: {
          display: true,
          text: t("yAxisTitle"),
          color: "#fff",
        },
        ticks: {
          color: "#fff",
          callback: (value: any) => {
            return `${value > 1 ? value.toFixed(0) : value.toFixed(1)}%`;
          },
        },
      },
    },
    elements: {
      point: {
        backgroundColor: (context: any) => {
          const dataPoint = context.dataset.data[context.dataIndex];
          return getColorForKink(dataPoint.name, personalData);
        },
        borderColor: (context: any) => {
          const dataPoint = context.dataset.data[context.dataIndex];
          return getColorForKink(dataPoint.name, personalData);
        },
      },
    },
  };

  useEffect(() => {
    // Dynamically import Chart.js and plugins only on client side
    const loadChart = async () => {
      try {
        const [
          { Chart, registerables },
          { Scatter },
          zoomPlugin,
          datalabelsPlugin,
        ] = await Promise.all([
          import("chart.js"),
          import("react-chartjs-2"),
          import("chartjs-plugin-zoom"),
          import("chartjs-plugin-datalabels"),
        ]);

        // Register Chart.js components
        Chart.register(...registerables, zoomPlugin.default, datalabelsPlugin.default);

        setChartComponent(() => Scatter);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load Chart.js:", error);
      }
    };

    loadChart();
  }, []);

  useEffect(() => {
    if (chartRef.current && !isLoading) {
      chartRef.current.resetZoom();
    }
  }, [isLoading]);

  if (isLoading || !ChartComponent) {
    return (
      <div className="w-full flex items-center justify-center" style={{ height: "calc(100vh - 200px)" }}>
        <div className="text-lg text-muted-foreground">{t("loading")}</div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: "calc(100vh - 200px)" }}>
      <ChartComponent ref={chartRef} data={data} options={options} />
    </div>
  );
}
