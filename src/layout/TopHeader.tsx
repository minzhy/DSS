import type { ReactNode } from "react";
import { Button, Input } from "antd";
import {
  AppstoreOutlined,
  ContactsOutlined,
  MailOutlined,
  MenuOutlined,
  MessageOutlined,
  ProfileOutlined,
  RobotOutlined,
  SearchOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./AppLayout.module.css";

const utilities: { key: string; icon: ReactNode; label: string }[] = [
  { key: "mail", icon: <MailOutlined />, label: "邮箱" },
  { key: "bms", icon: <AppstoreOutlined />, label: "BMS" },
  { key: "oa", icon: <MessageOutlined />, label: "OA" },
  { key: "beacon", icon: <SendOutlined />, label: "航标" },
  { key: "ticket", icon: <ProfileOutlined />, label: "票控" },
  { key: "contacts", icon: <ContactsOutlined />, label: "通讯录" },
];

export function TopHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.logoMark}>
          <span className={styles.logoGlobe} aria-hidden>
            ○
          </span>
          <span>COSCO SHIPPING</span>
        </div>
        <span className={styles.title}>Agentic DSS</span>
        <Button
          type="text"
          className={styles.menuBtn}
          icon={<MenuOutlined />}
          aria-label="菜单"
        />
      </div>

      <div className={styles.headerSearch}>
        <Input
          className={styles.searchInput}
          size="large"
          placeholder="输入文字检索案件、入口、文件..."
          suffix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
          prefix={
            <span className={styles.searchPrefix}>
              <RobotOutlined />
              AI-BULK
            </span>
          }
          allowClear
        />
      </div>

      <div className={styles.headerRight}>
        {utilities.map((u) => (
          <div key={u.key} className={styles.utility} role="button" tabIndex={0}>
            <span className={styles.utilityIcon}>{u.icon}</span>
            <span className={styles.utilityLabel}>{u.label}</span>
          </div>
        ))}
        <div className={`${styles.utility} ${styles.utilityUser}`}>
          <UserOutlined className={styles.utilityIcon} />
          <span className={styles.userName}>闵钟宇</span>
        </div>
      </div>
    </header>
  );
}
