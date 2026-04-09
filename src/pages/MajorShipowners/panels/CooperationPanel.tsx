import { Card, Col, Row, Statistic } from "antd";
import { Column } from "@ant-design/plots";
import { useMemo } from "react";
import type { MajorShipownersModel } from "../../../data/majorShipownersTypes";
import type { MajorShipownerName } from "../../../data/majorShipownersMock";
import styles from "../majorShipowners.module.css";

type ModelsByOwner = Record<MajorShipownerName, MajorShipownersModel>;

export function CooperationPanel({ models }: { models: ModelsByOwner }) {
  const latest = useMemo(() => {
    const owners = Object.keys(models) as MajorShipownerName[];
    return owners.map((owner) => ({ owner, ...models[owner].cooperation }));
  }, [models]);

  const chartData = useMemo(() => {
    return latest.flatMap((x) => [
      { owner: x.owner, metric: "合作规模", value: x.scale },
      { owner: x.owner, metric: "合作效益", value: x.efficiency },
    ]);
  }, [latest]);

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarCyan}`}
            title="公司合作情况"
            size="small"
          >
            <Row gutter={[12, 12]}>
              {latest.map((x) => (
                <Col span={24} key={x.owner}>
                  <Statistic title={x.owner} value={x.scale} suffix="合作(项)" />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarCyan}`}
            title="合作规模/效益对比（图例可隐藏/显示指标）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Column
                data={chartData}
                xField="owner"
                yField="value"
                seriesField="metric"
                isGroup
                height={260}
                legend={{ position: "top" }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

