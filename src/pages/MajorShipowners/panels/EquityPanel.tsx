import { Card, Col, Row, Table, Tag } from "antd";
import { Column } from "@ant-design/plots";
import { useMemo } from "react";
import type { MajorShipownersModel } from "../../../data/majorShipownersTypes";
import type { MajorShipownerName } from "../../../data/majorShipownersMock";
import styles from "../majorShipowners.module.css";

type ModelsByOwner = Record<MajorShipownerName, MajorShipownersModel>;

export function EquityPanel({ models }: { models: ModelsByOwner }) {
  const owners = Object.keys(models) as MajorShipownerName[];
  const chartData = useMemo(() => {
    return owners.flatMap((owner) =>
      models[owner].equity.shares.map((s) => ({
        owner,
        shareholder: s.shareholder,
        percent: s.percent,
      }))
    );
  }, [models, owners]);

  const tableData = useMemo(() => {
    return owners.map((owner) => {
      const byName: Record<string, number> = Object.fromEntries(
        models[owner].equity.shares.map((s) => [s.shareholder, s.percent])
      );
      return { owner, ...byName } as Record<string, unknown>;
    });
  }, [models, owners]);

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarBrown}`}
            title="股权占比（默认同一图，图例可隐藏/显示股东类别）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Column
                data={chartData}
                xField="owner"
                yField="percent"
                seriesField="shareholder"
                isStack
                height={280}
                legend={{ position: "top" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarBrown}`}
            title="股东情况"
            size="small"
          >
            <Table
              size="small"
              rowKey={(r) => String((r as { owner: string }).owner)}
              dataSource={tableData}
              pagination={false}
              columns={[
                {
                  title: "船东",
                  dataIndex: "owner",
                },
                ...["控股股东", "战略投资者", "产业基金", "其他"].map((k) => ({
                  title: k,
                  dataIndex: k,
                  align: "right" as const,
                  render: (v: unknown) => <Tag color="blue">{Number(v ?? 0)}%</Tag>,
                })),
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

