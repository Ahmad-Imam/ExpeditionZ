import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

import AddExpenseForm from "./AddExpenseForm";
import BalanceTab from "./BalanceTab";
import ExpenseTab from "./ExpenseTab";
import SettlementTab from "./SettlementTab";

export default function Expense({ trip }) {
  const getTotalExpenses = () => {
    return trip?.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold ">Expenses</h3>
              <p className="mt-4 text-lg font-semibold">
                Total: {formatCurrency(getTotalExpenses())}
              </p>
            </div>
            <AddExpenseForm trip={trip} />
          </div>

          <ExpenseTab trip={trip} />
        </TabsContent>

        <TabsContent value="balances">
          <h3 className="text-2xl font-bold  mb-6">Current Balances</h3>

          <BalanceTab trip={trip} />
        </TabsContent>

        <TabsContent value="settlements">
          <h3 className="text-2xl font-bold  mb-6">Settlements</h3>

          <SettlementTab trip={trip} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
