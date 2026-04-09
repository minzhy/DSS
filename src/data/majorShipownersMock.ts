import type { MajorShipownersModel } from "./majorShipownersTypes";

const monthSeries = (start: string, values: number[]) => {
  const [y, m] = start.split("-").map((v) => Number(v));
  return values.map((value, idx) => {
    const monthIndex = m - 1 + idx;
    const yy = y + Math.floor(monthIndex / 12);
    const mm = (monthIndex % 12) + 1;
    return { time: `${yy}-${String(mm).padStart(2, "0")}`, value };
  });
};

export const majorShipowners = [
  "招商轮船",
  "oldendorff",
  "Pacific Ocean",
  "Star Bulk",
  "中远海运散运",
] as const;

export type MajorShipownerName = (typeof majorShipowners)[number];

const baseModel = (): MajorShipownersModel => ({
  capacity: {
    own: {
      name: "自有运力",
      points: monthSeries("2025-10", [12, 12.2, 12.5, 12.6, 12.4, 12.7]),
    },
    controlled: {
      name: "控制运力",
      points: monthSeries("2025-10", [18, 18.3, 18.8, 19.1, 18.9, 19.3]),
    },
    orders: {
      name: "在建运力",
      points: monthSeries("2025-10", [3.2, 3.1, 3.0, 2.9, 2.8, 2.7]),
    },
  },
  rental: {
    majorOwners: {
      name: "主要船东租金水平",
      points: monthSeries("2025-10", [112, 118, 121, 125, 123, 129]),
    },
    bulkCompany: {
      name: "散运公司租金水平",
      points: monthSeries("2025-10", [105, 109, 114, 116, 115, 120]),
    },
  },
  finance: {
    revenue: 58.6,
    netProfit: 6.2,
    debtRatio: 54.8,
  },
  cooperation: {
    scale: 23,
    efficiency: 86,
  },
  equity: {
    shares: [
      { shareholder: "控股股东", percent: 35 },
      { shareholder: "战略投资者", percent: 22 },
      { shareholder: "产业基金", percent: 18 },
      { shareholder: "其他", percent: 25 },
    ],
  },
  strategy: {
    summary:
      "聚焦运力结构优化与成本管控，强化关键客户合作，提升数字化调度与风险管理能力。该段为占位文本，后续由财报/公告抽取替换。",
    news: [
      {
        title: "关键字搜索：主要船东 运力布局",
        source: "公开网站",
        date: "2026-03-20",
        keywords: ["运力", "布局", "合作"],
      },
      {
        title: "关键字搜索：主要船东 租金水平",
        source: "公开网站",
        date: "2026-03-08",
        keywords: ["租金", "市场", "散运"],
      },
      {
        title: "关键字搜索：主要船东 财务数据",
        source: "公开网站",
        date: "2026-02-17",
        keywords: ["收入", "利润", "资产负债率"],
      },
    ],
  },
});

const tweakByOwner = (owner: MajorShipownerName): MajorShipownersModel => {
  const model = baseModel();

  const factorMap: Record<MajorShipownerName, number> = {
    招商轮船: 1.05,
    oldendorff: 0.98,
    "Pacific Ocean": 0.92,
    "Star Bulk": 1.01,
    中远海运散运: 1.08,
  };
  const f = factorMap[owner];

  model.capacity.own.points = model.capacity.own.points.map((p) => ({
    ...p,
    value: Number((p.value * f).toFixed(2)),
  }));
  model.capacity.controlled.points = model.capacity.controlled.points.map((p) => ({
    ...p,
    value: Number((p.value * f).toFixed(2)),
  }));
  model.capacity.orders.points = model.capacity.orders.points.map((p) => ({
    ...p,
    value: Number((p.value * (2 - f)).toFixed(2)),
  }));

  model.rental.majorOwners.points = model.rental.majorOwners.points.map((p) => ({
    ...p,
    value: Math.round(p.value * f),
  }));
  model.rental.bulkCompany.points = model.rental.bulkCompany.points.map((p) => ({
    ...p,
    value: Math.round(p.value * (0.96 + (f - 1) * 0.6)),
  }));

  model.finance.revenue = Number((model.finance.revenue * f).toFixed(1));
  model.finance.netProfit = Number((model.finance.netProfit * (0.9 + (f - 1) * 0.8)).toFixed(1));
  model.finance.debtRatio = Number(
    Math.max(20, Math.min(85, model.finance.debtRatio + (f - 1) * 10)).toFixed(1)
  );

  model.cooperation.scale = Math.max(5, Math.round(model.cooperation.scale * f));
  model.cooperation.efficiency = Math.max(
    0,
    Math.min(100, Math.round(model.cooperation.efficiency + (f - 1) * 15))
  );

  model.strategy.summary = `【${owner}】` + model.strategy.summary;
  model.strategy.news = model.strategy.news.map((n) => ({
    ...n,
    title: n.title.replace("主要船东", owner),
  }));

  return model;
};

export const majorShipownersMockByName: Record<MajorShipownerName, MajorShipownersModel> =
  Object.fromEntries(majorShipowners.map((o) => [o, tweakByOwner(o)])) as Record<
    MajorShipownerName,
    MajorShipownersModel
  >;


