import type { NavGroup } from "./navTypes";

/** 二级导航分组与入口，便于后续接路由 */
export const navGroups: NavGroup[] = [
  {
    id: "g-todo",
    items: [{ id: "todo", label: "待办待阅", badge: 2 }],
  },
  {
    id: "g-voyage",
    groupLabel: "航次动态监控",
    items: [
      { id: "realtime", label: "实时监控" },
      { id: "analysis", label: "监控分析" },
    ],
  },
  {
    id: "g-map",
    groupLabel: "经营地图",
    items: [
      { id: "my-ships", label: "我的船舶" },
      { id: "capacity", label: "运力布局" },
    ],
  },
  {
    id: "g-market",
    groupLabel: "市场船行为分析",
    items: [
      { id: "major-owners", label: "主要船东" },
      { id: "route-heat", label: "航线热力..." },
      { id: "cargo-ship", label: "以货找船" },
    ],
  },
  {
    id: "g-customer",
    groupLabel: "客户画像",
    items: [
      { id: "ghgy", label: "GHGY" },
      { id: "receivable", label: "应收账款" },
      { id: "key-customer", label: "关键客户" },
    ],
  },
  {
    id: "g-fuel",
    groupLabel: "燃油管控",
    items: [
      { id: "fuel-forecast", label: "燃油预测" },
      { id: "speed-fuel", label: "航速油耗" },
    ],
  },
  {
    id: "g-barge",
    groupLabel: "效率驳运",
    items: [
      { id: "barge", label: "驳运动态" },
      { id: "company-news", label: "公司动态" },
    ],
  },
  {
    id: "g-mgmt",
    groupLabel: "综合管理",
    items: [{ id: "equity", label: "股权结构" }],
  },
  {
    id: "g-dispatch",
    groupLabel: "调度会口径",
    items: [
      { id: "daily-deal", label: "每日成交" },
      { id: "ship-dynamics", label: "船舶动态" },
    ],
  },
];

export const defaultActiveNavId = "major-owners";
