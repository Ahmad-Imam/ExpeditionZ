import { clsx } from "clsx";
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

  // Initialize balances for all members
  trip?.members.forEach((member) => {
    balances[member.id] = 0;
  });

  // Calculate net balance for each person
  trip?.expenses?.forEach((expense) => {
    // Get the payer's member ID
    const payerId = expense.paidById;

    // All participants in this expense
    const splitWithIds = expense.expenseMembers?.map((em) => em.memberId) || [];

    // Those who have repaid
    const repaidIds =
      expense.expenseMembers
        ?.filter((em) => em.hasRepaid)
        .map((em) => em.memberId) || [];

    if (!splitWithIds.length) return;

    const share = expense.amount / splitWithIds.length;

    splitWithIds.forEach((memberId) => {
      if (memberId === payerId) return;
      // Skip settled shares
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

  // Create a copy of balances for manipulation
  const remainingBalances = { ...balances };

  // Find people who owe money (negative balance)
  const debtors = Object.entries(remainingBalances)
    .filter(([_, balance]) => balance < 0)
    .sort(([_, a], [__, b]) => a - b); // Sort by amount (most negative first)

  // Find people who are owed money (positive balance)
  const creditors = Object.entries(remainingBalances)
    .filter(([_, balance]) => balance > 0)
    .sort(([_, a], [__, b]) => b - a); // Sort by amount (most positive first)

  let debtorIndex = 0;
  let creditorIndex = 0;

  // Match debtors with creditors until all debts are settled
  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const [debtorId, debtorBalance] = debtors[debtorIndex];
    const [creditorId, creditorBalance] = creditors[creditorIndex];

    // Calculate the amount to transfer
    const transferAmount = Math.min(Math.abs(debtorBalance), creditorBalance);

    if (transferAmount > 0.01) {
      // Ignore very small amounts
      debts.push({
        from: debtorId,
        to: creditorId,
        amount: Number.parseFloat(transferAmount.toFixed(2)),
      });
    }

    // Update remaining balances
    remainingBalances[debtorId] += transferAmount;
    remainingBalances[creditorId] -= transferAmount;

    // Move to next debtor if this one's debt is settled
    if (Math.abs(remainingBalances[debtorId]) < 0.01) {
      debtorIndex++;
    }

    // Move to next creditor if this one's credit is settled
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
