import { Card, Checkbox, Col, List, Row, Tag, Typography } from "antd";
import { useMemo, useState } from "react";
import type { MajorShipownersModel } from "../../../data/majorShipownersTypes";
import type { MajorShipownerName } from "../../../data/majorShipownersMock";
import styles from "../majorShipowners.module.css";

type ModelsByOwner = Record<MajorShipownerName, MajorShipownersModel>;

export function StrategyPanel({ models }: { models: ModelsByOwner }) {
  const owners = Object.keys(models) as MajorShipownerName[];
  const [visibleOwners, setVisibleOwners] = useState<MajorShipownerName[]>(owners);

  const listData = useMemo(() => {
    return visibleOwners.flatMap((owner) =>
      models[owner].strategy.news.map((n) => ({ owner, ...n }))
    );
  }, [models, visibleOwners]);

  const summary = useMemo(() => {
    return visibleOwners
      .map((owner) => models[owner].strategy.summary)
      .join("\n\n");
  }, [models, visibleOwners]);

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarTeal}`}
            title="财报公开的经营策略"
            size="small"
          >
            <div style={{ marginBottom: 12 }}>
              <Checkbox.Group
                value={visibleOwners}
                onChange={(v) => setVisibleOwners(v as MajorShipownerName[])}
                options={owners.map((o) => ({ label: o, value: o }))}
              />
            </div>
            <Typography.Paragraph style={{ marginBottom: 0 }}>
              {summary}
            </Typography.Paragraph>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className={`${styles.panelCard} ${styles.toneBarTeal}`}
            title="公开网站关键字搜索与相关新闻（占位）"
            size="small"
          >
            <List
              size="small"
              dataSource={listData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span>{item.title}</span>
                        <Tag color="blue">{item.owner}</Tag>
                        <Tag color="default">{item.source}</Tag>
                        <Tag color="geekblue">{item.date}</Tag>
                      </div>
                    }
                    description={
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {item.keywords.map((k) => (
                          <Tag key={k} color="blue">
                            {k}
                          </Tag>
                        ))}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

