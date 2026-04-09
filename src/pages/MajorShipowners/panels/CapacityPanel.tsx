import { Card, Col, Row, Statistic } from "antd";
import { Line } from "@ant-design/plots";
import { useMemo } from "react";
import type { MajorShipownersModel } from "../../../data/majorShipownersTypes";
import type { MajorShipownerName } from "../../../data/majorShipownersMock";
import styles from "../majorShipowners.module.css";

type ModelsByOwner = Record<MajorShipownerName, MajorShipownersModel>;

export function CapacityPanel({ models }: { models: ModelsByOwner }) {
  const owners = useMemo(
    () => Object.keys(models) as MajorShipownerName[],
    [models]
  );

  const chartDataByMetric = useMemo(() => {
    const entries = Object.entries(models) as [
      MajorShipownerName,
      MajorShipownersModel,
    ][];

    const make = (metric: "own" | "controlled" | "orders") =>
      entries.flatMap(([owner, model]) =>
        model.capacity[metric].points.map((p) => ({
          time: p.time,
          value: p.value,
          owner,
        }))
      );

    return {
      own: make("own"),
      controlled: make("controlled"),
      orders: make("orders"),
    };
  }, [models]);

  const latestByMetric = useMemo(() => {
    const lastOf = (owner: MajorShipownerName, metric: "own" | "controlled" | "orders") =>
      models[owner].capacity[metric].points.slice(-1)[0]?.value ?? 0;

    return {
      own: owners.map((owner) => ({ owner, value: lastOf(owner, "own") })),
      controlled: owners.map((owner) => ({ owner, value: lastOf(owner, "controlled") })),
      orders: owners.map((owner) => ({ owner, value: lastOf(owner, "orders") })),
    };
  }, [models, owners]);

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarPink}`}
            title="运力变化情况"
            size="small"
          >
            <Row gutter={[12, 12]}>
              {owners.map((owner) => {
                const own = latestByMetric.own.find((x) => x.owner === owner)?.value ?? 0;
                const controlled =
                  latestByMetric.controlled.find((x) => x.owner === owner)?.value ?? 0;
                const orders =
                  latestByMetric.orders.find((x) => x.owner === owner)?.value ?? 0;

                return (
                  <Col xs={24} lg={8} key={owner}>
                    <Card size="small" type="inner" title={owner}>
                      <Row gutter={[12, 12]}>
                        <Col span={8}>
                          <Statistic title="自有" value={own} suffix="艘" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="控制" value={controlled} suffix="艘" />
                        </Col>
                        <Col span={8}>
                          <Statistic title="在建" value={orders} suffix="艘" />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarPink}`}
            title="自有运力（图例可隐藏/显示船东）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Line
                data={chartDataByMetric.own}
                xField="time"
                yField="value"
                seriesField="owner"
                smooth
                height={240}
                legend={{ position: "top" }}
                tooltip={{ showMarkers: true }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarPink}`}
            title="控制运力（图例可隐藏/显示船东）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Line
                data={chartDataByMetric.controlled}
                xField="time"
                yField="value"
                seriesField="owner"
                smooth
                height={240}
                legend={{ position: "top" }}
                tooltip={{ showMarkers: true }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarPink}`}
            title="在建运力（图例可隐藏/显示船东）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Line
                data={chartDataByMetric.orders}
                xField="time"
                yField="value"
                seriesField="owner"
                smooth
                height={240}
                legend={{ position: "top" }}
                tooltip={{ showMarkers: true }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

