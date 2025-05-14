import { clsx } from "clsx";
import { Cloud, CloudRain, CloudSun, Snowflake, Sun, Wind } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateBalances(trip) {
  const balances = {};

  trip?.members.forEach((member) => {
    balances[member.id] = 0;
  });

  trip?.expenses?.forEach((expense) => {
    const payerId = expense.paidById;

    const splitWithIds = expense.expenseMembers?.map((em) => em.memberId) || [];

    const repaidIds =
      expense.expenseMembers
        ?.filter((em) => em.hasRepaid)
        .map((em) => em.memberId) || [];

    if (!splitWithIds.length) return;

    const share = expense.amount / splitWithIds.length;

    splitWithIds.forEach((memberId) => {
      if (memberId === payerId) return;

      if (repaidIds.includes(memberId)) return;
      balances[memberId] -= share;
      balances[payerId] += share;
    });
  });

  return balances;
}

export function calculateDebts(trip) {
  const balances = calculateBalances(trip);
  const debts = [];

  const remainingBalances = { ...balances };

  const debtors = Object.entries(remainingBalances)
    .filter(([_, balance]) => balance < 0)
    .sort(([_, a], [__, b]) => a - b);

  const creditors = Object.entries(remainingBalances)
    .filter(([_, balance]) => balance > 0)
    .sort(([_, a], [__, b]) => b - a);

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const [debtorId, debtorBalance] = debtors[debtorIndex];
    const [creditorId, creditorBalance] = creditors[creditorIndex];

    const transferAmount = Math.min(Math.abs(debtorBalance), creditorBalance);

    if (transferAmount > 0.01) {
      debts.push({
        from: debtorId,
        to: creditorId,
        amount: Number.parseFloat(transferAmount.toFixed(2)),
      });
    }

    remainingBalances[debtorId] += transferAmount;
    remainingBalances[creditorId] -= transferAmount;

    if (Math.abs(remainingBalances[debtorId]) < 0.01) {
      debtorIndex++;
    }

    if (remainingBalances[creditorId] < 0.01) {
      creditorIndex++;
    }
  }

  return debts;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatWeatherName(name) {
  return name
    ?.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const getWeatherIcon = (condition, size = 24) => {
  switch (condition) {
    case "SUNNY":
      return <Sun size={size} className="text-yellow-500" />;
    case "PARTLY CLOUDY":
      return <CloudSun size={size} className="text-blue-400" />;
    case "CLOUDY":
      return <Cloud size={size} className="text-gray-400" />;
    case "RAINY":
      return <CloudRain size={size} className="text-blue-600" />;
    case "SNOWY":
      return <Snowflake size={size} className="text-blue-200" />;
    case "WINDY":
      return <Wind size={size} className="" />;
    default:
      return <Sun size={size} className="text-yellow-500" />;
  }
};
