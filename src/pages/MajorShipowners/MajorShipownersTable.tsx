import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import type { MajorShipownersTableRow, ShipTypeKey } from "../../data/majorShipownersTableMock";

const shipTypeKeys: ShipTypeKey[] = [
  "capesize",
  "panamax",
  "supramax",
  "handysize",
];

const shipTypeLabel: Record<ShipTypeKey, string> = {
  capesize: "好望角型船",
  panamax: "巴拿马型船",
  supramax: "大灵便型船",
  handysize: "小灵便型船",
};

const numberCell = (n: number) => (n === 0 ? "-" : n.toLocaleString("en-US"));

const dwtCell = (n: number) => (n === 0 ? "-" : n.toLocaleString("en-US"));

const visibleShipowners = [
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
] as const;

const visibleShipownersSet = new Set<string>(visibleShipowners);

type FleetMetricsFile = {
  file: string;
  data: Array<{
    "Group Company": string;
    "Fleet No": number | string | null;
    "OB No": number | string | null;
    "Avg Size": number | string | null;
  }>;
};

type FleetMetricsJson = { files: FleetMetricsFile[] };

const toNumber = (v: unknown) => {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v).trim();
  if (!s) return 0;
  const n = Number(s.replaceAll(",", ""));
  return Number.isFinite(n) ? n : 0;
};

const shipTypeFromFile = (filename: string): ShipTypeKey | null => {
  const f = filename.toLowerCase();
  if (f.includes("capesize")) return "capesize";
  if (f.includes("panamax")) return "panamax";
  if (f.includes("handysize")) return "handysize";
  if (f.includes("handymax")) return "supramax"; // handymax -> 大灵便型
  return null;
};

export function MajorShipownersTable() {
  const [rows, setRows] = useState<MajorShipownersTableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch("/fleet-metrics.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`fetch fleet-metrics.json failed: ${res.status}`);
        const json = (await res.json()) as FleetMetricsJson;

        const byCompany = new Map<string, MajorShipownersTableRow>();
        const ensure = (shipowner: string) => {
          const existing = byCompany.get(shipowner);
          if (existing) return existing;
          const empty = () =>
            Object.fromEntries(
              shipTypeKeys.map((k) => [k, { count: 0, dwt: 0 }])
            ) as MajorShipownersTableRow["own"];

          const row: MajorShipownersTableRow = {
            rank: 0,
            shipowner,
            own: empty(),
            building: empty(),
            totalCount: 0,
            totalDwt: 0,
          };
          byCompany.set(shipowner, row);
          return row;
        };

        for (const f of json.files ?? []) {
          const shipType = shipTypeFromFile(f.file);
          if (!shipType) continue;
          for (const r of f.data ?? []) {
            const company = String(r["Group Company"] ?? "").trim();
            if (!company) continue;
            if (!visibleShipownersSet.has(company)) continue;
            const fleetNo = toNumber(r["Fleet No"]);
            const obNo = toNumber(r["OB No"]);
            const avgSize = toNumber(r["Avg Size"]);

            const row = ensure(company);
            row.own[shipType] = {
              count: fleetNo,
              dwt: Math.round(fleetNo * avgSize),
            };
            row.building[shipType] = {
              count: obNo,
              dwt: Math.round(obNo * avgSize),
            };
          }
        }

        const computed = Array.from(byCompany.values()).map((r) => {
          const totalCount =
            shipTypeKeys.reduce((s, k) => s + r.own[k].count, 0) +
            shipTypeKeys.reduce((s, k) => s + r.building[k].count, 0);
          const totalDwt =
            shipTypeKeys.reduce((s, k) => s + r.own[k].dwt, 0) +
            shipTypeKeys.reduce((s, k) => s + r.building[k].dwt, 0);
          return { ...r, totalCount, totalDwt };
        });

        // Keep only the specified shipowners and preserve the requested order
        const orderIndex = new Map<string, number>(
          visibleShipowners.map((name, idx) => [name, idx])
        );
        computed.sort(
          (a, b) => (orderIndex.get(a.shipowner) ?? 9999) - (orderIndex.get(b.shipowner) ?? 9999)
        );
        computed.forEach((r, idx) => (r.rank = idx + 1));

        if (!alive) return;
        setRows(computed);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setRows([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };
    void run();
    return () => {
      alive = false;
    };
  }, []);

  const columns: ColumnsType<MajorShipownersTableRow> = [
    {
      title: "排序",
      dataIndex: "rank",
      width: 72,
      fixed: "left",
      align: "center",
    },
    {
      title: "船东",
      dataIndex: "shipowner",
      width: 220,
      fixed: "left",
    },
    {
      title: "自有运力",
      children: shipTypeKeys.map((k) => ({
        title: shipTypeLabel[k],
        children: [
          {
            title: "艘数",
            dataIndex: ["own", k, "count"],
            width: 90,
            align: "right" as const,
            render: (v: number) => numberCell(v),
            sorter: (a, b) => a.own[k].count - b.own[k].count,
          },
          {
            title: "载重吨",
            dataIndex: ["own", k, "dwt"],
            width: 120,
            align: "right" as const,
            render: (v: number) => dwtCell(v),
            sorter: (a, b) => a.own[k].dwt - b.own[k].dwt,
          },
        ],
      })),
    },
    {
      title: "在建运力",
      children: shipTypeKeys.map((k) => ({
        title: shipTypeLabel[k],
        children: [
          {
            title: "艘数",
            dataIndex: ["building", k, "count"],
            width: 90,
            align: "right" as const,
            render: (v: number) => numberCell(v),
            sorter: (a, b) => a.building[k].count - b.building[k].count,
          },
          {
            title: "载重吨",
            dataIndex: ["building", k, "dwt"],
            width: 120,
            align: "right" as const,
            render: (v: number) => dwtCell(v),
            sorter: (a, b) => a.building[k].dwt - b.building[k].dwt,
          },
        ],
      })),
    },
    {
      title: "总艘数",
      dataIndex: "totalCount",
      width: 110,
      align: "right",
      fixed: "right",
      render: (v: number) => numberCell(v),
      sorter: (a, b) => a.totalCount - b.totalCount,
    },
    {
      title: "总载重吨",
      dataIndex: "totalDwt",
      width: 140,
      align: "right",
      fixed: "right",
      render: (v: number) => dwtCell(v),
      sorter: (a, b) => a.totalDwt - b.totalDwt,
    },
  ];

  return (
    <Table<MajorShipownersTableRow>
      size="small"
      rowKey={(r) => r.shipowner}
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{
        x:
          72 +
          220 +
          4 * (90 + 120) +
          4 * (90 + 120) +
          110 +
          140,
        y: 520,
      }}
      sticky
      bordered
      loading={loading}
    />
  );
}

