import { Card, Col, Row, Statistic } from "antd";
import { Line } from "@ant-design/plots";
import { useMemo } from "react";
import type { MajorShipownersModel } from "../../../data/majorShipownersTypes";
import type { MajorShipownerName } from "../../../data/majorShipownersMock";
import styles from "../majorShipowners.module.css";

type ModelsByOwner = Record<MajorShipownerName, MajorShipownersModel>;

export function RentalPanel({ models }: { models: ModelsByOwner }) {
  const dataMajorOwners = useMemo(() => {
    const entries = Object.entries(models) as [MajorShipownerName, MajorShipownersModel][];
    return entries.flatMap(([owner, model]) =>
      model.rental.majorOwners.points.map((p) => ({
        time: p.time,
        value: p.value,
        owner,
      }))
    );
  }, [models]);

  const dataBulkCompany = useMemo(() => {
    const entries = Object.entries(models) as [MajorShipownerName, MajorShipownersModel][];
    return entries.flatMap(([owner, model]) =>
      model.rental.bulkCompany.points.map((p) => ({
        time: p.time,
        value: p.value,
        owner,
      }))
    );
  }, [models]);

  const lastOf = (owner: MajorShipownerName, which: "majorOwners" | "bulkCompany") =>
    models[owner].rental[which].points.slice(-1)[0]?.value ?? 0;

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarBlue}`}
            title="租金水平情况"
            size="small"
          >
            <Row gutter={[12, 12]}>
              {(Object.keys(models) as MajorShipownerName[]).map((owner) => (
                <Col span={24} key={owner}>
                  <Statistic
                    title={owner}
                    value={lastOf(owner, "majorOwners")}
                    suffix="指数"
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarBlue}`}
            title="主要船东租金水平（图例可隐藏/显示船东）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Line
                data={dataMajorOwners}
                xField="time"
                yField="value"
                seriesField="owner"
                smooth
                height={260}
                legend={{ position: "top" }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={24}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarBlue}`}
            title="散运公司租金水平（图例可隐藏/显示船东）"
            size="small"
          >
            <div className={styles.chartBox}>
              <Line
                data={dataBulkCompany}
                xField="time"
                yField="value"
                seriesField="owner"
                smooth
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

