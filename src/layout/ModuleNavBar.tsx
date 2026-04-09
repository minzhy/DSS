import type { ReactNode } from "react";
import { Badge } from "antd";
import {
  ApartmentOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ClusterOutlined,
  ContainerOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RocketOutlined,
  SearchOutlined,
  SettingOutlined,
  StockOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { NavItem as NavItemType } from "../data/navTypes";
import { navGroups } from "../data/navConfig";
import styles from "./AppLayout.module.css";

const iconForItem = (id: string): ReactNode => {
  const map: Record<string, ReactNode> = {
    todo: <FileTextOutlined />,
    realtime: <ContainerOutlined />,
    analysis: <LineChartOutlined />,
    "my-ships": <RocketOutlined />,
    capacity: <PieChartOutlined />,
    "major-owners": <BarChartOutlined />,
    "route-heat": <GlobalOutlined />,
    "cargo-ship": <SearchOutlined />,
    ghgy: <StockOutlined />,
    receivable: <FileTextOutlined />,
    "key-customer": <UserOutlined />,
    "fuel-forecast": <LineChartOutlined />,
    "speed-fuel": <ThunderboltOutlined />,
    barge: <BarChartOutlined />,
    "company-news": <ApartmentOutlined />,
    equity: <ClusterOutlined />,
    "daily-deal": <CalendarOutlined />,
    "ship-dynamics": <DeploymentUnitOutlined />,
  };
  return map[id] ?? <FileTextOutlined />;
};

type Props = {
  activeId: string;
  onSelect: (id: string) => void;
};

function NavItemButton({
  item,
  active,
  onSelect,
}: {
  item: NavItemType;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = iconForItem(item.id);

  return (
    <button
      type="button"
      className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
      onClick={() => onSelect(item.id)}
    >
      {item.badge != null ? (
        <Badge count={item.badge} size="small" offset={[10, -2]} color="#ff4d4f">
          <span className={styles.navItemIcon}>{icon}</span>
        </Badge>
      ) : (
        <span className={styles.navItemIcon}>{icon}</span>
      )}
      <span className={styles.navItemLabel}>{item.label}</span>
    </button>
  );
}

export function ModuleNavBar({ activeId, onSelect }: Props) {
  return (
    <nav className={styles.navBar} aria-label="业务模块">
      {navGroups.map((group) => (
        <div key={group.id} className={styles.group}>
          <div className={styles.itemsRow}>
            {group.items.map((item) => (
              <NavItemButton
                key={item.id}
                item={item}
                active={activeId === item.id}
                onSelect={onSelect}
              />
            ))}
          </div>
          {group.groupLabel ? (
            <div className={styles.groupLabel}>{group.groupLabel}</div>
          ) : null}
        </div>
      ))}
      <div className={styles.navSpacer} />
      <div className={styles.settingsWrap}>
        <button type="button" className={styles.settingsBtn} aria-label="设置">
          <SettingOutlined />
        </button>
      </div>
    </nav>
  );
}
