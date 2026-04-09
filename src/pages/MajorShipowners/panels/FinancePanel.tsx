import { Card, Col, Row, Statistic } from "antd";
import { Column } from "@ant-design/plots";
import { useMemo } from "react";
import type { MajorShipownersModel } from "../../../data/majorShipownersTypes";
import type { MajorShipownerName } from "../../../data/majorShipownersMock";
import styles from "../majorShipowners.module.css";

type ModelsByOwner = Record<MajorShipownerName, MajorShipownersModel>;

export function FinancePanel({ models }: { models: ModelsByOwner }) {
  const latest = useMemo(() => {
    const owners = Object.keys(models) as MajorShipownerName[];
    return owners.map((owner) => ({ owner, ...models[owner].finance }));
  }, [models]);

  const chartData = useMemo(() => {
    return latest.flatMap((x) => [
      { owner: x.owner, metric: "营业收入", value: x.revenue },
      { owner: x.owner, metric: "净利润", value: x.netProfit },
      { owner: x.owner, metric: "资产负债率", value: x.debtRatio },
    ]);
  }, [latest]);

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarGold}`}
            title="财务数据情况"
            size="small"
          >
            <Row gutter={[12, 12]}>
              {latest.map((x) => (
                <Col span={24} key={x.owner}>
                  <Statistic
                    title={x.owner}
                    value={x.revenue}
                    suffix="营收(亿元)"
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarGold}`}
            title="指标对比（图例可隐藏/显示指标）"
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
                yAxis={{ title: undefined }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

