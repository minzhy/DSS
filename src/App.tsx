import { useState } from "react";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { defaultActiveNavId } from "./data/navConfig";
import { ModuleNavBar } from "./layout/ModuleNavBar";
import { TopHeader } from "./layout/TopHeader";
import styles from "./layout/AppLayout.module.css";

export default function App() {
  const [activeNavId, setActiveNavId] = useState(defaultActiveNavId);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          fontFamily:
            '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif',
        },
      }}
    >
      <div className={styles.shell}>
        <TopHeader />
        <ModuleNavBar activeId={activeNavId} onSelect={setActiveNavId} />
        <main className={styles.main} />
      </div>
    </ConfigProvider>
  );
}
