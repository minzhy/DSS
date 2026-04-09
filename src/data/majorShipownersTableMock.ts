export type ShipTypeKey = "capesize" | "panamax" | "supramax" | "handysize";

export const shipTypeLabel: Record<ShipTypeKey, string> = {
  capesize: "好望角型船",
  panamax: "巴拿马型船",
  supramax: "大灵便型船",
  handysize: "小灵便型船",
};

export type CountDwt = { count: number; dwt: number };

export type MajorShipownersTableRow = {
  rank: number;
  shipowner: string;
  own: Record<ShipTypeKey, CountDwt>;
  building: Record<ShipTypeKey, CountDwt>;
  totalCount: number;
  totalDwt: number;
};

const splitByWeights = (total: number, weights: number[]) => {
  const raw = weights.map((w) => total * w);
  const ints = raw.map((x) => Math.floor(x));
  let remainder = total - ints.reduce((a, b) => a + b, 0);

  const fracOrder = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac)
    .map((x) => x.i);

  for (let k = 0; k < fracOrder.length && remainder > 0; k++) {
    ints[fracOrder[k]] += 1;
    remainder -= 1;
  }

  return ints;
};

/**
 * Top10 船东（按参考表格顺序）。\n+ * 数字为 Mock：先生成“自有/在建”的总艘数，再按船型权重拆分，保证行内自洽。\n+ */
const top10Shipowners = [
  "China COSCO Shipping",
  "CMB",
  "Winning Intl",
  "NYK Line",
  "Berge Bulk",
  "Angelicoussis Group",
  "Eastern Pacific Shpg",
  "China Merchants",
  "K-Line",
  "Pan Ocean",
];

const makeRow = (rank: number, shipowner: string): MajorShipownersTableRow => {
  // 简单的可复现规则：不同船东总艘数略有差异
  const ownTotal = 20 + ((rank * 7) % 19); // 20~38
  const buildingTotal = 2 + (rank % 6); // 2~7

  // 船型权重（可后续按真实口径替换）
  const ownWeights = [0.36, 0.28, 0.21, 0.15];
  const buildingWeights = [0.42, 0.26, 0.20, 0.12];

  const ownSplit = splitByWeights(ownTotal, ownWeights);
  const buildingSplit = splitByWeights(buildingTotal, buildingWeights);

  // 各船型平均载重吨（DWT）占位口径：可后续用真实数据替换
  const avgDwt: Record<ShipTypeKey, number> = {
    capesize: 180_000,
    panamax: 80_000,
    supramax: 58_000,
    handysize: 35_000,
  };

  const own: MajorShipownersTableRow["own"] = {
    capesize: { count: ownSplit[0], dwt: ownSplit[0] * avgDwt.capesize },
    panamax: { count: ownSplit[1], dwt: ownSplit[1] * avgDwt.panamax },
    supramax: { count: ownSplit[2], dwt: ownSplit[2] * avgDwt.supramax },
    handysize: { count: ownSplit[3], dwt: ownSplit[3] * avgDwt.handysize },
  };
  const building: MajorShipownersTableRow["building"] = {
    capesize: {
      count: buildingSplit[0],
      dwt: buildingSplit[0] * avgDwt.capesize,
    },
    panamax: { count: buildingSplit[1], dwt: buildingSplit[1] * avgDwt.panamax },
    supramax: {
      count: buildingSplit[2],
      dwt: buildingSplit[2] * avgDwt.supramax,
    },
    handysize: {
      count: buildingSplit[3],
      dwt: buildingSplit[3] * avgDwt.handysize,
    },
  };

  const totalCount =
    Object.values(own).reduce((a, b) => a + b.count, 0) +
    Object.values(building).reduce((a, b) => a + b.count, 0);

  const totalDwt =
    Object.values(own).reduce((a, b) => a + b.dwt, 0) +
    Object.values(building).reduce((a, b) => a + b.dwt, 0);

  return { rank, shipowner, own, building, totalCount, totalDwt };
};

export const majorShipownersTableMock: MajorShipownersTableRow[] = top10Shipowners.map(
  (name, idx) => makeRow(idx + 1, name)
);

