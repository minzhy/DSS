import { Card, Typography } from "antd";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: 20 }}>
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Paragraph style={{ marginBottom: 0, color: "#8c8c8c" }}>
          该模块页面正在建设中。
        </Typography.Paragraph>
      </Card>
    </div>
  );
}

