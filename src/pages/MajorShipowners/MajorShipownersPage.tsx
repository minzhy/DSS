import { Card, DatePicker } from "antd";
import styles from "./majorShipowners.module.css";
import { MajorShipownersTable } from "./MajorShipownersTable";

export function MajorShipownersPage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>主要船东</h2>
        <div className={styles.filters}>
          <DatePicker.RangePicker disabled />
        </div>
      </div>

      <Card bodyStyle={{ padding: 0 }} bordered>
        <MajorShipownersTable />
      </Card>
    </div>
  );
}

