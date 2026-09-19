export type InvestmentPlan = {
  id: string;
  name: string;
  amount: number;
  dailyProfit: number;
  duration: number;
  totalProfit: number;
  referralBonus: number;
};

export const investmentPlans: InvestmentPlan[] = [
  {
    id: "AQUA-01",
    name: "AQUA-01",
    amount: 310,
    dailyProfit: 77,
    duration: 85,
    totalProfit: 6545,
    referralBonus: 14,
  },
  {
    id: "AQUA-02",
    name: "AQUA-02",
    amount: 810,
    dailyProfit: 202,
    duration: 85,
    totalProfit: 17170,
    referralBonus: 14,
  },
  {
    id: "AQUA-03",
    name: "AQUA-03",
    amount: 1310,
    dailyProfit: 327,
    duration: 85,
    totalProfit: 27795,
    referralBonus: 14,
  },
  {
    id: "AQUA-04",
    name: "AQUA-04",
    amount: 2210,
    dailyProfit: 552,
    duration: 85,
    totalProfit: 46920,
    referralBonus: 14,
  },
  {
    id: "AQUA-05",
    name: "AQUA-05",
    amount: 3310,
    dailyProfit: 827,
    duration: 85,
    totalProfit: 70295,
    referralBonus: 14,
  },
  {
    id: "AQUA-06",
    name: "AQUA-06",
    amount: 4610,
    dailyProfit: 1152,
    duration: 85,
    totalProfit: 97920,
    referralBonus: 14,
  },
];