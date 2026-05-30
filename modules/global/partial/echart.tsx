import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { PieChart, BarChart, LineChart } from "echarts/charts";
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer, PieChart, BarChart, LineChart]);

/* -------------------------------------------------------------------------- */
/*                                Prop types                                  */
/* -------------------------------------------------------------------------- */

type ChartType = "pie" | "bar" | "pie_donut" | "pie_half_donut" | "line_area" | "bar_grouped";

interface Options {
  /* shared */
  name?: string;
  colors?: string[];
  color?: string[];
  data?: any; // tighten if you like
  tooltip?: { name?: string };
  showMarkPoint?: boolean;
  smoothLine?: boolean;
  showGradient?: boolean;
  gradientTopColor?: string;
  gradientBottomColor?: string;
}

interface EChartProps {
  /** rerender key – bump this value to force a full redraw */
  reload?: number | boolean;
  /** chart flavour – defaults to 'pie' */
  type?: ChartType;
  /** chart‑specific options */
  options: Options;
  /** tailwind height class, e.g. 'h-60' */
  height?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

const EChart = ({ reload, type = "pie", options, height = "h-60" }: EChartProps) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const toRGBA = (hex: string, alpha: number) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.getInstanceByDom(chartRef.current) ?? echarts.init(chartRef.current);

    /* ------------------------------- Pie ---------------------------------- */
    if (type === "pie") {
      const pieOpts: EChartsOption = {
        color: options.colors ?? ["#8A2BE2", "#ef4444", "#f97316"],
        tooltip: { trigger: "item" },
        legend: {
          show: true,
          orient: "vertical",
          left: "left",
          top: "middle",
          itemGap: 20,
        },
        series: [
          {
            name: options.name ?? "Result",
            type: "pie",
            radius: "90%",
            left: "20%",
            colorBy: "data",
            data: options.data ?? [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "gray",
              },
            },
            label: {
              show: true,
              fontWeight: "bold",
              fontSize: 17,
              position: "inside",
              formatter: "{d} %",
              overflow: "truncate",
            },
          },
        ],
      };
      chart.setOption(pieOpts as EChartsOption);
    }

    /* ------------------------------- Bar ---------------------------------- */
    if (type === "bar") {
      const barOpts: EChartsOption = {
        color: options.colors ?? ["#8A2BE2", "#ef4444"],
        tooltip: { trigger: "axis" },
        grid: { left: "3%", right: "4%", bottom: "3%", top: "3%", containLabel: true },
        xAxis: [
          {
            type: "category",
            data: options.data?.name ?? "Bar Name",
            axisTick: { alignWithLabel: true },
          },
        ],
        yAxis: [{ type: "value" }],
        series: [
          {
            name: options.tooltip?.name,
            type: "bar",
            barWidth: "60%",
            data: options?.data?.value ?? [10, 20, 50, 30, 40, 20, 80, 50],
            showBackground: true,
            label: { show: true, position: "inside" },
            itemStyle: {
              borderRadius: [50, 50, 0, 0], // 👈 curve top only
            },
          },
        ],
      };
      chart.setOption(barOpts as EChartsOption);
    }

    /* ---------------------------- Pie (donut) ----------------------------- */
    if (type === "pie_donut") {
      const donutOpts: EChartsOption = {
        color: options.colors ?? ["#8A2BE2", "#ef4444", "#8A2BE2", "#ef4444", "#8A2BE2", "#ef4444", "#8A2BE2"],
        tooltip: { trigger: "item" },
        legend: { top: "1%", left: "start" },
        series: [
          {
            name: options.name,
            type: "pie",
            radius: ["60%", "70%"],
            center: ["25%", "65%"],
            padAngle: 5,
            itemStyle: { borderRadius: 10 },
            label: { show: false, position: "center" },
            emphasis: { label: { show: true, fontSize: 20, fontWeight: "bold" } },
            labelLine: { show: false },
            data: options?.data ?? [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
            ],
          },
        ],
      };
      chart.setOption(donutOpts as EChartsOption);
    }

    /* -------------------------- Pie (half donut) -------------------------- */
    if (type === "pie_half_donut") {
      const halfDonutOpts: EChartsOption = {
        color: options.colors ?? ["#8A2BE2", "#ef4444", "#f97316", "#22c55e"],
        tooltip: { trigger: "item" },
        legend: {
          show: true,
          orient: "horizontal",
          bottom: "20%",
        },
        series: [
          {
            name: options.name ?? "Result",
            type: "pie",
            radius: ["20%", "80%"],
            center: ["50%", "50%"], // push chart down
            startAngle: 180, // start from left
            endAngle: 360, // end at right
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 8,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: true,
              position: "inside",
              formatter: "{d}%",
              fontWeight: "bold",
            },
            data: options.data ?? [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
            ],
          },
        ],
      };

      chart.setOption(halfDonutOpts as EChartsOption);
    }

    /* ---------------------------- Line (area) ----------------------------- */
    if (type === "line_area") {
      const lineColor = options.colors?.[0] ?? "#8b5cf6bd";
      const showGradient = options.showGradient ?? true;
      const baseColor = options.color?.[0] ?? "#3b82f6"; // fallback blue
      const gradientTopColor = options.gradientTopColor ?? "rgb(22, 36, 86,0.1)"; // default 40% opacity
      const gradientBottomColor = options.gradientBottomColor ?? "rgb(22, 36, 86,0)"; // fully transparent bottom
      const areaOpts: EChartsOption = {
        color: [lineColor],
        tooltip: {
          trigger: "axis",
          backgroundColor: "#1f2937",
          borderColor: "#6b7280",
          textStyle: { color: "#f9fafb", fontSize: 12 },
        },
        grid: { left: "3%", right: "4%", bottom: "3%", top: "8%", containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: options.data?.name,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { fontSize: 12, color: "#6b7280" },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { type: "dashed", color: "#e5e7eb" } },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { fontSize: 12, color: "#6b7280" },
        },
        series: [
          {
            name: options.name,
            type: "line",
            smooth: options.smoothLine ?? true,
            symbol: "circle",
            symbolSize: 4,
            emphasis: {
              focus: "series",
              lineStyle: { width: 3 },
            },
            data: options?.data?.value ?? [100, 400, 200, 300, 500, 100, 300, 400, 500],
            areaStyle: showGradient
              ? {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: gradientTopColor },
                      { offset: 1, color: gradientBottomColor },
                    ],
                  },
                  shadowColor: "rgba(0, 0, 0, 0.1)",
                  shadowBlur: 10,
                }
              : {},
            lineStyle: { width: 2 },
            markPoint: options.showMarkPoint
              ? {
                  data: [
                    { type: "max", name: "Max" },
                    { type: "min", name: "Min" },
                  ],
                }
              : undefined,
          },
        ],
      };
      chart.setOption(areaOpts as EChartsOption);
    }

    /* ------------------------- Grouped Bar Chart ------------------------- */
    if (type === "bar_grouped") {
      const groupedBarOpts: EChartsOption = {
        color: options.colors ?? ["#22c55e", "#b91c1c", "#fbbf24"], // default: green, dark red, amber
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: { top: "top" },
        grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
        xAxis: [
          {
            type: "category",
            data: options.data?.name ?? ["name1", "name2", "name3", "name4"], // ['Sat', 'Sun', 'Mon', ...]
            axisTick: { alignWithLabel: true },
          },
        ],
        yAxis: [{ type: "value" }],
        barCategoryGap: "50%", // space between groups
        series: (
          options.data?.value ?? [
            { name: "value1", data: [10, 20, 50] },
            { name: "value1", data: [50, 80, 30] },
            { name: "value1", data: [100, 20, 50] },
            { name: "value1", data: [80, 70, 50] },
          ]
        ).map((s: any) => ({
          name: s.name,
          type: "bar",
          barGap: "20%",
          barWidth: "15%",
          label: {
            show: true,
            position: "top",
            fontSize: 10,
          },
          itemStyle: {
            borderRadius: [20, 20, 20, 20], // [top-left, top-right, bottom-right, bottom-left]
          },
          data: s.data,
        })),
      };

      chart.setOption(groupedBarOpts as EChartsOption);
    }

    // automatically expand width or height when contain width or height change
    let lastWidth = chartRef.current.getBoundingClientRect().width;

    const observer = new ResizeObserver(() => {
      const newWidth = chartRef.current?.getBoundingClientRect().width;
      if (newWidth && newWidth !== lastWidth) {
        lastWidth = newWidth;
        chart.resize();
      }
    });

    observer.observe(chartRef.current);
    /* ------------------------------ Cleanup ------------------------------- */
    return () => {
      chart.dispose();
      observer.disconnect();
    };
  }, [reload, type, options]);

  return <div ref={chartRef} className={`w-full ${height} max-w-full max-h-full min-w-0`} />;
};

export default EChart;
