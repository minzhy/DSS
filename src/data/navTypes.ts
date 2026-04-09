export type NavItem = {
  id: string;
  label: string;
  badge?: number;
};

export type NavGroup = {
  id: string;
  groupLabel?: string;
  items: NavItem[];
};
