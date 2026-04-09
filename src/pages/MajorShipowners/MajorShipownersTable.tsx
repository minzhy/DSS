import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  majorShipownersTableMock,
  shipTypeLabel,
  type MajorShipownersTableRow,
  type ShipTypeKey,
} from "../../data/majorShipownersTableMock";

const shipTypeKeys: ShipTypeKey[] = [
  "capesize",
  "panamax",
  "supramax",
  "handysize",
];

const numberCell = (n: number) => (n === 0 ? "-" : n.toLocaleString("en-US"));

const dwtCell = (n: number) => (n === 0 ? "-" : n.toLocaleString("en-US"));

export function MajorShipownersTable() {
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
      dataSource={majorShipownersTableMock}
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
    />
  );
}

