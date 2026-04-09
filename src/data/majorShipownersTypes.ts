export type TimePoint = {
  /** YYYY-MM 或 YYYY-MM-DD */
  time: string;
  value: number;
};

export type CapacitySeries = {
  name: string;
  points: TimePoint[];
};

export type RentalSeries = {
  name: string;
  points: TimePoint[];
};

export type FinanceSnapshot = {
  revenue: number;
  netProfit: number;
  debtRatio: number;
};

export type CooperationSnapshot = {
  scale: number;
  efficiency: number;
};

export type EquityShare = {
  shareholder: string;
  percent: number;
};

export type StrategyNewsItem = {
  title: string;
  source: string;
  date: string;
  keywords: string[];
};

export type MajorShipownersModel = {
  capacity: {
    own: CapacitySeries;
    controlled: CapacitySeries;
    /** 在建运力（原“手持订单”） */
    orders: CapacitySeries;
  };
  rental: {
    majorOwners: RentalSeries;
    bulkCompany: RentalSeries;
  };
  finance: FinanceSnapshot;
  cooperation: CooperationSnapshot;
  equity: {
    shares: EquityShare[];
  };
  strategy: {
    summary: string;
    news: StrategyNewsItem[];
  };
};

